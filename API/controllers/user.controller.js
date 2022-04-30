const APIError = require('../helpers/APIError');
const resPattern = require('../helpers/resPattern');
const httpStatus = require('http-status');
const db = require('../server')
const userColl = db.collection('user');
const scheduleColl = db.collection('schedule')
const categoryColl = db.collection('category');
const PlanColl = db.collection('plan');
const query = require('../query/query')
const stripeHelper = require("../helpers/stripe.payment");
const moment = require('moment');
const bcrypt = require('bcrypt');
const { generatePassword, generateOTP, sendEmail, mailTemp, generateRandomPassword, generateRandomToken } = require('../helpers/commonfile');
const { ObjectID } = require('mongodb').ObjectID;
const jwt = require('jsonwebtoken');
const currentDate = moment().format("YYYY-MM-DDThh:mm:ss")
const ejs = require("ejs");
const { cryptoDecrypt, cryptoEncrypt } = require('../helpers/commonfile');
const cron = require('node-cron');
const dotenv = require('dotenv');
dotenv.config();
const i18n = require('i18n');
const momentTimeZone = require('moment-timezone');
const { urlencoded } = require('body-parser');


const createuser = async (req, res, next) => {
  try {
    const requestdata = { emailAddress: req.body.emailAddress.toLowerCase() };

    const userEmail = await query.findOne(userColl, requestdata)
    if (userEmail) {
      const message = i18n.__({ phrase: ("alreadyRegisterUser"), locale: `${req.query.lang}` })
      let obj = resPattern.errorPattern(httpStatus.ALREADY_REPORTED, message);
      return res.status(obj.code).json(obj);
    } else {
      if (req.body.type === 'center') {

        const center = req.body
        center.isExternalUrl = center.isExternalUrl ? center.isExternalUrl : false
        center.expireTime = ""
        center.categoryId = []
        center.status = 0
        center.active = true
        center.isDeleted = false
        center.isCreatedByCenterAdmin = center.isCreatedByCenterAdmin ? center.isCreatedByCenterAdmin : false
        center.fcm_registration_token = [];
        // center.uniqueId = Math.floor(100000 + Math.random() * 900000);
        center.password = generatePassword(req.body.password)
        center.image = center.image ? center.image : process.env.CENTER_IMAGE
        center.subscriptionExpired = false
        center.isSubscription = true
        center.language = 'en'
        if (req.body.timezone) {
          const timeZone = req.body.timezone.split(" ")
          const centerTimeZone = momentTimeZone.tz(moment(), timeZone[0])
          center.subscriptionStartDate = moment(centerTimeZone).format("YYYY-MM-DDThh:mm:ss")
          center.subscriptionExpireDate = moment(centerTimeZone).add(28, 'days').format("YYYY-MM-DDThh:mm:ss")
        }
        center.permissions = {
          fiscalData: false,
          centerImages: false,
          centeData: false,
          registryOfInternalActions: false,
          dayManagement: false,
          permissionToWorkers: false,
          services: false,
          emergencyCancellation: false,
          clientFile: false,
          actualSubscription: false,
          moreCenters: false,
          accessTOAdmin: false
        }
        if (center.name) {
          const centerName = await query.find(userColl, { name: center.name })

          if (centerName.length == 0) {
            let url = `http://savetime-web.s3-website.eu-west-3.amazonaws.com/#/centers/${center.name}`;
            center.centerUrl = url
          }
          else {
            let url = `http://savetime-web.s3-website.eu-west-3.amazonaws.com/#/centers/${center.name}_${centerName.length + 1}`;
            center.centerUrl = url
          }
        }

        if (center.isCreatedByCenterAdmin === true && center.centerId !== undefined) {
          const centerData = await query.findOne(userColl, { _id: ObjectID(center.centerId) })

          center.adminPanelPassword = centerData.adminPanelPassword
          delete center.centerId
        }
        // stripe_customer = await stripeHelper.create_customer(center);
        // center.stripe_customer = stripe_customer;
        const allCenter = await query.findWithLimit(userColl, { type: "center" }, {}, { _id: -1 }, {}, 1, 1)
        center.uniqueId = `0/${parseInt(allCenter[0].uniqueId) + 1}`

        const insertdata = await query.insert(userColl, center)
        // console.log("insertdata", insertdata.ops);
        if (insertdata.ops.length > 0) {
          insertdata.ops[0].password = undefined;
          insertdata.ops[0].categoryId = undefined;
          insertdata.ops[0].expireTime = undefined;
          const jwttoken = jwt.sign({ _id: insertdata.ops[0]._id, firstName: insertdata.ops[0].firstName, type: insertdata.ops[0].type }, process.env.JWT_SECRET)
          const centertoken = cryptoEncrypt(jwttoken)
          insertdata.ops[0].token = centertoken;
          const obj = resPattern.successPattern(httpStatus.OK, insertdata.ops[0], `success`);

          const verifyToken = jwt.sign({ _id: insertdata.ops[0]._id, emailAddress: insertdata.ops[0].emailAddress }, process.env.JWT_SECRET)
          // var token = cryptoEncrypt(jwttoken)
          // const toEmail = req.body.emailAddress;
          // const emailBody = `<div><a href="http://savetime-web.s3-website.eu-west-3.amazonaws.com/#/activate/${token}">Click me to Activate your Account</a></div>`;
          // const title = `Account Verification !`;

          // const toEmail = req.body.emailAddress;
          // // const emailBody = `<div>OTP: ${otp}</div>`;
          // const title = `SaveTime`;
          // let tempTitle = `Account Activation Link !`
          // let info = `<a href="http://savetime-web.s3-website.eu-west-3.amazonaws.com/#/activate/${token}">Click me to Activate your Account</a>`
          // const emailBody = mailTemp(tempTitle, info)
          if (insertdata.ops[0].isExternalUrl == false) {
            const toEmail = req.body.emailAddress;
            // const emailBody = `<div>OTP: ${otp}</div>`;
            const title = `⏰Check your email`;
            // let tempTitle = `Account Activation Link !`
            // let info = `<a href="http://savetime-web.s3-website.eu-west-3.amazonaws.com/#/activate/${token}">Click me to Activate your Account</a>`
            let language = 'es'
            if (req.query.lang) {
              language = req.query.lang
            }
            const emailBody = await ejs.renderFile(process.cwd() + `/public/views/${language}/test.ejs`, {
              name: center.name,
              token: verifyToken
            })

            await sendEmail(toEmail, title, emailBody);
          }

          await query.findOneAndUpdate(userColl, requestdata, { "$set": { expireTime: moment().add(10080, 'Minutes').format("YYYY-MM-DDThh:mm:ss") } })

          // const toemail = "avisos@savetime.es";
          // const Title = `SaveTime`;
          // let adminTitle = `Center Registration Mail !`
          // let Info = `${center.emailAddress} center is registered.`
          // const emailbody = mailTemp(adminTitle, Info)
          // const toemail = "avisos@savetime.es";
          // const Title = `SaveTime`;
          // const emailbody = await ejs.renderFile(process.cwd() + `/public/views/en/centerRegister.ejs`, {
          //   emailAddress: center.emailAddress
          // })

          // await sendEmail(toemail, Title, emailbody);

          return res.status(obj.code).json({
            ...obj
          });
        } else {
          const message = i18n.__({ phrase: ("commonRegisterUser"), locale: `${req.query.lang}` })
          let obj = resPattern.errorPattern(httpStatus.BAD_REQUEST, message);
          return res.status(obj.code).json(obj);
        }
      } else {
        const user = req.body
        user.status = 0
        user.otp = ""
        user.expireTime = ""
        user.calendarType = user.calendarType === undefined ? "google" : user.calendarType === "" ? "google" : user.calendarType
        user.notification = user.notification === undefined ? "true" : user.notification
        user.isDeleted = false
        user.active = true
        user.favoriteCenter = []
        user.socialCredentials = []
        user.deviceToken = [];
        user.language = 'en'
        // user.uniqueId = Math.floor(100000 + Math.random() * 900000);
        user.password = generatePassword(req.body.password)
        user.image = user.image ? user.image : process.env.USER_IMAGE
        const allUser = await query.findWithLimit(userColl, { type: "client" }, {}, { _id: -1 }, {}, 1, 1)
        user.uniqueId = `${parseInt(allUser[0].uniqueId) + 1}`
        const insertdata = await query.insert(userColl, user)
        if (insertdata.ops.length > 0) {
          insertdata.ops[0].favoriteCenter = undefined;
          insertdata.ops[0].password = undefined;
          insertdata.ops[0].socialCredentials = undefined;
          insertdata.ops[0].expireTime = undefined;
          insertdata.ops[0].otp = undefined;
          const jwttoken = jwt.sign({ _id: insertdata.ops[0]._id, firstName: insertdata.ops[0].firstName, type: insertdata.ops[0].type }, process.env.JWT_SECRET)
          var token = cryptoEncrypt(jwttoken)
          insertdata.ops[0].token = token;
          const obj = resPattern.successPattern(httpStatus.OK, insertdata.ops[0], `success`);

          const otp = generateOTP();
          const toEmail = req.body.emailAddress;
          const title = `⏰Check your email`;
          let language = 'es'
          if (req.query.lang) {
            language = req.query.lang
          }
          const emailBody = await ejs.renderFile(process.cwd() + `/public/views/${language}/userVerify.ejs`, {
            name: user.name,
            OTP: otp
          })

          await sendEmail(toEmail, title, emailBody);
          // const toEmail = req.body.emailAddress;
          // const title = `SaveTime`;
          // let tempTitle = `Otp For Account Verification`
          // let info = `Otp : ${otp} `
          // const emailBody = mailTemp(tempTitle, info)

          // await sendEmail(toEmail, title, emailBody);

          await query.findOneAndUpdate(userColl, requestdata, { "$set": { otp: otp, expireTime: moment().add(10, 'Minutes').format("YYYY-MM-DDThh:mm:ss") } })

          // const toemail = "avisos@savetime.es";
          // const Title = `SaveTime`;
          // let adminTitle = `User Registration Mail !`
          // let Info = `${user.emailAddress} user is registered.`
          // const emailbody = mailTemp(adminTitle, Info)

          // await sendEmail(toemail, Title, emailbody);
          // const toemail = "avisos@savetime.es";
          // const Title = `SaveTime`;
          // const emailbody = await ejs.renderFile(process.cwd() + `/public/views/en/userRegister.ejs`, {
          //   emailAddress: user.emailAddress
          // })
          // await sendEmail(toemail, Title, emailbody);

          return res.status(obj.code).json({
            ...obj
          });
        } else {
          const message = i18n.__({ phrase: ("common"), locale: `${req.query.lang}` })
          let obj = resPattern.errorPattern(httpStatus.BAD_REQUEST, message);
          return res.status(obj.code).json(obj);
        }
      }
    }
  } catch (e) {
    return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
  }
}

// userLogin
const login = async (req, res, next) => {
  try {
    const { password, deviceToken, fcm_registration_token, emailAddress } = req.body;
    const reqData = { emailAddress: emailAddress.toLowerCase() }
    // find user
    let user = await query.findOne(userColl, reqData)

    if (!user || user.password == null) {
      const message = i18n.__({ phrase: ("loginUserIncorrectEmail"), locale: `${req.query.lang}` })
      let obj = resPattern.errorPattern(httpStatus.NOT_FOUND, message);
      return res.status(obj.code).json(obj);
    }

    const isMatch = await bcrypt.compare(password, user.password)

    const loginData = async () => {
      if (user.isDeleted == false) {
        // const currentDate = moment().format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]") //YYYY-MM-DD[T]HH:mm:ss.SSS[Z]''  YYYY-MM-DDThh:mm:ssn

        // const token = jwt.sign({ _id: user._id, firstName: user.firstName, type: user.type }, process.env.JWT_SECRET)

        // delete user['password'];
        // const planField = ObjectID(user.planId)
        // const plan = await query.findOne(PlanColl, { _id: planField })
        // const validity = (plan.duration)
        // if (user.isFree == true || user.isSubscriptionCancle == true || user.isPlanedCancle == true) {
        // console.log(currentDate, '=====', user.subscriptionExpiryDate )
        // if (currentDate > user.subscriptionExpiryDate) {
        //   // console.log('....')
        //   let TokenId = { TokenId: fcm_registration_token }
        //   let d = await query.findOneAndUpdate(userColl, reqData, {
        //     $set: { subscriptionExpired: true },
        //     $addToSet: { fcm_registration_token: TokenId }
        //   }, { returnOriginal: false })
        //   //  console.log("UPDATE--",d)
        //   const message = `Your Plan Is Expired.`
        //   let obj = resPattern.successPattern(httpStatus.BAD_REQUEST, { user, token }, message);
        //   return res.status(obj.code).json(obj);
        // } else {
        let TokenId = { TokenId: fcm_registration_token }
        const userUpdate = await query.findOneAndUpdate(userColl, { _id: user._id }, { $addToSet: { fcm_registration_token: TokenId } }, { returnOriginal: false })

        let userData = userUpdate.value;
        const jwttoken = jwt.sign({ _id: user._id, firstName: user.firstName, type: user.type }, process.env.JWT_SECRET)
        var token = cryptoEncrypt(jwttoken)

        if (userData.adminPanelPassword !== undefined) {
          delete userData['adminPanelPassword'];
        }
        delete userData['password'];
        delete userData['otp'];
        delete userData['expireTime'];
        let obj = resPattern.successPattern(httpStatus.OK, { userData, token }, 'success');
        return res.status(obj.code).json(obj);

        // let d = await query.findOneAndUpdate(userColl, reqData, { "$set": { subscriptionExpired: true } }, { returnOriginal: false })
        //  console.log("UPDATE--",d)
        // const message = `Your Plan Is expired.`
        // let obj = resPattern.successPattern(httpStatus.BAD_REQUEST, { user, token }, 'success');
        // return res.status(obj.code).json(obj);
        // user.favoriteCenter = undefined;
        // user.socialCredentials = undefined;
        // user.expireTime = undefined;
        // let obj = resPattern.successPattern(httpStatus.OK, { user, token }, 'success');
        // return res.status(obj.code).json(obj);
        // }
        // } else {
        //   let obj = resPattern.successPattern(httpStatus.OK, { user, token }, 'success');
        //   return res.status(obj.code).json(obj);
        // }
      }
      else {
        // if (moment().format("YYYY-MM-DDThh:mm:ss") > user.expireTime) {
        //   const otp = generateOTP();
        //   const toEmail = user.emailAddress;
        //   const title = `SaveTime`;
        //   let tempTitle = `Otp For Account Verification`
        //   let info = `Otp : ${otp} `
        //   const emailBody = mailTemp(tempTitle, info)

        //   await sendEmail(toEmail, title, emailBody);

        //   await query.findOneAndUpdate(userColl, { _id: user._id }, { "$set": { otp: otp, expireTime: moment().add(10, 'Minutes').format("YYYY-MM-DDThh:mm:ss") } })

        //   let obj = resPattern.successPattern(httpStatus.OK, `New Otp sent to this Address ${user.emailAddress}.Please Verified it`, 'success');
        //   return res.status(obj.code).json(obj);

        // } else {
        const message = i18n.__({ phrase: ("userNotAvailable"), locale: `${req.query.lang}` })
        let obj = resPattern.errorPattern(httpStatus.NOT_FOUND, message);
        return res.status(obj.code).json(obj);
        // }
      }
    }

    if (isMatch) {
      if (user.type == 'client') {

        if (user.isDeleted == false) {
          let TokenId = { TokenId: deviceToken }
          const userUpdate = await query.findOneAndUpdate(userColl, { _id: user._id }, { $addToSet: { deviceToken: TokenId } }, { returnOriginal: false })

          let userData = userUpdate.value;
          const jwttoken = jwt.sign({ _id: user._id, firstName: user.firstName, type: user.type }, process.env.JWT_SECRET)
          var token = cryptoEncrypt(jwttoken)
          delete userData['password'];
          delete userData['otp'];
          delete userData['expireTime'];
          let obj = resPattern.successPattern(httpStatus.OK, { userData, token }, 'success');
          return res.status(obj.code).json(obj);
        } else {
          // if (moment().format("YYYY-MM-DDThh:mm:ss") > user.expireTime) {
          //   const otp = generateOTP();
          //   const toEmail = user.emailAddress;
          //   const title = `SaveTime`;
          //   let tempTitle = `Otp For Account Verification`
          //   let info = `Otp : ${otp} `
          //   const emailBody = mailTemp(tempTitle, info)

          //   await sendEmail(toEmail, title, emailBody);

          //   await query.findOneAndUpdate(userColl, { _id: user._id }, { "$set": { otp: otp, expireTime: moment().add(10, 'Minutes').format("YYYY-MM-DDThh:mm:ss") } })

          //   let obj = resPattern.successPattern(httpStatus.OK, `New Otp sent to this Address ${user.emailAddress}.Please Verified it`, 'success');
          //   return res.status(obj.code).json(obj);

          // } else {
          const message = i18n.__({ phrase: ("userNotAvailable"), locale: `${req.query.lang}` })
          let obj = resPattern.errorPattern(httpStatus.NOT_FOUND, message);
          return res.status(obj.code).json(obj);
          // }
        }
      } else {
        loginData()
      }
    } else {
      const message = i18n.__({ phrase: ("loginUserIncorrectPassword"), locale: `${req.query.lang}` })
      let obj = resPattern.errorPattern(httpStatus.NOT_FOUND, message);
      return res.status(obj.code).json(obj);
    }

  } catch (e) {
    return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
  }
}


const logout = async (req, res, next) => {
  const { _id } = req.user
  try {
    const user = await query.findOne(userColl, { _id: _id })
    if (user.type === "client") {
      if (user.deviceToken.length > 0) {
        let flag = false;
        const deviceID = user.deviceToken;
        const length = deviceID.length;
        for (let i = 0; i < length; i++) {
          if (deviceID[i].TokenId === req.body.deviceToken) {
            flag = true;
            const removeToken = {
              TokenId: req.body.deviceToken
            }
            await query.findOneAndUpdate(userColl, { _id: _id }, {
              $pull: { deviceToken: removeToken }
            })
            let obj = resPattern.successPattern(httpStatus.OK, 'User Logout Successfully');
            return res.status(obj.code).json(obj);
          }
        }
        if (!flag) {
          const message = i18n.__({ phrase: ("missMatchToken"), locale: `${req.query.lang}` })
          let obj = resPattern.errorPattern(httpStatus.NOT_FOUND, message);
          return res.status(obj.code).json(obj);
        }
      } else {
        const message = i18n.__({ phrase: ("tokenNotFound"), locale: `${req.query.lang}` })
        let obj = resPattern.errorPattern(httpStatus.NOT_FOUND, message);
        return res.status(obj.code).json(obj);
      }
    } else {
      if (user.fcm_registration_token.length > 0) {
        let flag = false;
        const deviceID = user.fcm_registration_token;
        const length = deviceID.length;
        for (let i = 0; i < length; i++) {
          if (deviceID[i].TokenId === req.body.fcm_registration_token) {
            flag = true;
            const removeToken = {
              TokenId: req.body.fcm_registration_token
            }
            await query.findOneAndUpdate(userColl, { _id: _id }, {
              $pull: { fcm_registration_token: removeToken },
              $set: { accessAdminPanel: false }
            })
            let obj = resPattern.successPattern(httpStatus.OK, 'User Logout Successfully');
            return res.status(obj.code).json(obj);
          }
        }
        if (!flag) {
          const message = i18n.__({ phrase: ("missMatchToken"), locale: `${req.query.lang}` })
          let obj = resPattern.errorPattern(httpStatus.NOT_FOUND, message);
          return res.status(obj.code).json(obj);
        }
      }
    }
  } catch (e) {
    return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
  }
}

//userProfile
const findUser = async (req, res, next) => {
  try {
    //find user
    let favoriteCenterList = []
    const user = await query.findOne(userColl, { _id: req.user._id })
    delete user['expireTime'];
    delete user['status'];
    // delete user['verified'];
    delete user['otp'];
    delete user['password'];
    delete user['adminPanelPassword'];
    delete user['accessAdminPanel'];
    if (user) {
      if (user.type === "client") {
        if (user.favoriteCenter.length > 0) {
          for (let index = 0; index < user.favoriteCenter.length; index++) {
            const element = user.favoriteCenter[index];
            const centerDetail = await query.findOne(userColl, { _id: element.centerId })
            centerDetail.password = undefined
            centerDetail.adminPanelPassword = undefined
            centerDetail.accessAdminPanel = undefined
            centerDetail.expireTime = undefined
            centerDetail.status = undefined
            // centerDetail.verified = undefined
            centerDetail.otp = undefined
            centerDetail.fcm_registration_token = undefined
            favoriteCenterList.push(centerDetail)
          }
          user.favoriteCenterList = favoriteCenterList
          user.favoriteCenter = undefined
          const objs = resPattern.successPattern(httpStatus.OK, { user }, `success`);
          return res.status(objs.code).json({ ...objs });
        }
      }
      let obj = resPattern.successPattern(httpStatus.OK, { user }, 'success');
      return res.status(obj.code).json(obj)
    } else {
      const message = i18n.__({ phrase: ('userNotFound'), locale: `${req.query.lang}` }, user.name)
      let obj = resPattern.errorPattern(httpStatus.NOT_FOUND, message);
      return res.status(obj.code).json(obj);
    }

  } catch (e) {
    return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
  }
}

const updateUserProfile = async (req, res, next) => {
  try {
    let userId = ObjectID(req.params.id)
    let checkUserType = await query.findOne(userColl, { _id: userId })

    let userData = req.body

    if (checkUserType.type === "center") {
      if (req.body.adminPanelPassword !== undefined) {
        userData.adminPanelPassword = generatePassword(req.body.adminPanelPassword)
      }
    }

    if (req.body.password !== undefined) {
      userData.password = generatePassword(req.body.password)
    }

    const userUpdate = await query.findOneAndUpdate(userColl, { _id: userId }, { $set: userData }, { returnOriginal: false })

    let user = userUpdate.value;

    delete user['password'];
    delete user['adminPanelPassword'];

    const obj = resPattern.successPattern(httpStatus.OK, { user }, `success`);
    return res.status(obj.code).json(obj);
  } catch (e) {
    return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
  }
}

const deleteProfileByUser = async (req, res, next) => {
  try {
    const user = req.user;
    // const userId = { _id: user._id }
    const reqData = req.body;

    // let reason = reqData.reason !== "" ? reqData.reason : "No Reason !"

    if (user.name === reqData.name && user.emailAddress === reqData.emailAddress) {

      let check = await query.deleteOne(userColl, { _id: user._id });
      if (check.deletedCount === 1) {

        // const toemail = "avisos@savetime.es";
        // const Title = `SaveTime User Deactivation !`;
        // let bodyTitle = `Closed Account !`
        // let info = `Email : ${reqData.emailAddress}<br>
        // Reason : ${reason}.`
        // const emailbody = mailTemp(bodyTitle, info)
        // await sendEmail(toemail, Title, emailbody);

        let message = "User deleted !"
        let obj = resPattern.successPattern(httpStatus.OK, message, `success`);
        return res.status(obj.code).json(obj);

      }
    } else {
      const message = i18n.__({ phrase: ("userEmailNotFound"), locale: `${req.query.lang}` })
      let obj = resPattern.errorPattern(httpStatus.NOT_FOUND, message);
      return res.status(obj.code).json(obj);
    }
  } catch (e) {
    return next(new APIError(e.message, httpStatus.BAD_REQUEST, true));
  }
}

const setAdminPanelPassword = async (req, res, next) => {
  try {
    let userId = ObjectID(req.user._id)
    let checkUserType = await query.findOne(userColl, { _id: userId, adminToken: req.query.token })
    let userData = req.body
    if (!checkUserType) {
      const message = i18n.__({ phrase: ("invalidToken"), locale: `${req.query.lang}` })
      let objs = resPattern.errorPattern(httpStatus.NOT_FOUND, message);
      return res.status(objs.code).json(objs);
    }

    if (checkUserType.type === "center") {
      if (req.body.adminPanelPassword !== undefined) {
        userData.adminPanelPassword = generatePassword(req.body.adminPanelPassword)
      }
    }

    const userUpdate = await query.findOneAndUpdate(userColl, { _id: userId }, { $set: userData, $unset: { adminToken: "" } }, { returnOriginal: false })

    let user = userUpdate.value;

    delete user['password'];
    delete user['adminPanelPassword'];

    const obj = resPattern.successPattern(httpStatus.OK, { user }, `success`);
    return res.status(obj.code).json(obj);
  } catch (e) {
    return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
  }
}

// checking the admin panel password matching or not
const checkAdminPassword = async (req, res, next) => {
  try {
    if (req.user.type !== "client") {
      let user = await query.findOne(userColl, { "emailAddress": req.user.emailAddress })
      if (user.adminPanelPassword === undefined) {
        const emailToken = generateRandomToken();

        const toEmail = req.user.emailAddress;
        const title = `⏰Reset passwords Administration Panel`;
        let language = 'es'
        if (req.query.lang) {
          language = req.query.lang
        }
        const emailBody = await ejs.renderFile(process.cwd() + `/public/views/${language}/resetAdminPassword.ejs`, {
          name: user.name,
          token: emailToken
        })
        await sendEmail(toEmail, title, emailBody);
        await query.findOneAndUpdate(userColl, { _id: req.user._id }, { $set: { adminToken: emailToken } }, { returnOriginal: false })

        const message = `Mail Sent !`;
        let obj = resPattern.successPattern(httpStatus.OK, message, "success!");
        return res.status(obj.code).json(obj);
      }
      else {
        const message = i18n.__({ phrase: ("alreadyCreatedAdminPassword"), locale: `${req.query.lang}` })
        let obj = resPattern.errorPattern(httpStatus.ALREADY_REPORTED, message);
        return res.status(obj.code).json(obj);
      }
    } else {
      const message = i18n.__({ phrase: ("userProtect"), locale: `${req.query.lang}` })
      let obj = resPattern.errorPattern(httpStatus.UNAUTHORIZED, message);
      return res.status(obj.code).json(obj);
    }
  } catch (e) {
    return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
  }
}

const manageAnotherCenter = async (req, res, next) => {
  try {
    let userData = await query.findOne(userColl, { "emailAddress": req.body.emailAddress })
    if (!userData || userData.isDeleted == true || userData.type == "client") {
      const message = i18n.__({ phrase: ("centerNotAvailable"), locale: `${req.query.lang}` })
      let obj = resPattern.errorPattern(httpStatus.NOT_FOUND, message);
      return res.status(obj.code).json(obj);
    }
    if (userData.adminPanelPassword === undefined) {
      const message = i18n.__({ phrase: ("centerAdminPasswordNotAvailable"), locale: `${req.query.lang}` })
      let obj = resPattern.errorPattern(httpStatus.NOT_FOUND, message);
      return res.status(obj.code).json(obj);
    }
    else {
      const isMatch = await bcrypt.compare(req.body.adminPanelPassword, userData.adminPanelPassword)
      if (isMatch) {
        // if (currentDate > userData.subscriptionExpiryDate) {
        //   let TokenId = { TokenId: fcm_registration_token }
        //   let d = await query.findOneAndUpdate(userColl, reqData, {
        //     $set: { subscriptionExpired: true },
        //     $addToSet: { fcm_registration_token: TokenId }
        //   }, { returnOriginal: false })
        //   const message = `Your Plan Is Expired.`
        //   let obj = resPattern.successPattern(httpStatus.BAD_REQUEST, { userData, token }, message);
        //   return res.status(obj.code).json(obj);
        // } else {
        const jwttoken = jwt.sign({ _id: userData._id, firstName: userData.firstName, type: userData.type }, process.env.JWT_SECRET)
        var token = cryptoEncrypt(jwttoken)

        if (userData.adminPanelPassword !== undefined) {
          delete userData['adminPanelPassword'];
        }
        userData.token = token
        delete userData['password'];
        delete userData['adminPanelPassword'];
        delete userData['otp'];
        delete userData['expireTime'];
        let obj = resPattern.successPattern(httpStatus.OK, userData, 'success');
        return res.status(obj.code).json(obj);
        // }
      }
      else {
        const message = i18n.__({ phrase: ("loginUserIncorrectPassword"), locale: `${req.query.lang}` })
        let obj = resPattern.errorPattern(httpStatus.NOT_FOUND, message);
        return res.status(obj.code).json(obj);
      }
    }

  } catch (e) {
    return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
  }
}

const adminLogin = async (req, res, next) => {
  try {

    if (req.user.type !== "client") {
      let user = await query.findOne(userColl, { "emailAddress": req.user.emailAddress })
      if (user.adminPanelPassword !== undefined) {
        const isMatch = await bcrypt.compare(req.body.adminPanelPassword, req.user.adminPanelPassword)
        // if match the set admin = true
        if (isMatch) {
          let data = user;
          delete data['password'];
          delete data['adminPanelPassword'];
          delete data['otp'];
          delete data['expireTime'];
          const jwttoken = jwt.sign({ _id: data._id, firstName: data.firstName, type: data.type }, process.env.JWT_SECRET)
          var token = cryptoEncrypt(jwttoken)
          data.token = token

          let obj = resPattern.successPattern(httpStatus.OK, data, 'success');
          return res.status(obj.code).json(obj);
        } else {
          const message = i18n.__({ phrase: ("centerPasswordMissmatch"), locale: `${req.query.lang}` })
          let obj = resPattern.errorPattern(httpStatus.NOT_FOUND, message);
          return res.status(obj.code).json(obj);
        }
      }
    }
  } catch (e) {
    return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
  }
}
// when admin forgot password then send new password vai mail
const forgotAdminPassword = async (req, res, next) => {
  try {
    if (req.user.type !== "client") {

      let user = req.user

      const emailToken = generateRandomToken();

      const toEmail = user.emailAddress;
      const title = `⏰Reset passwords Administration Panel`;
      let language = 'es'
      if (req.query.lang) {
        language = req.query.lang
      }
      const emailBody = await ejs.renderFile(process.cwd() + `/public/views/${language}/resetAdminPassword.ejs`, {
        name: user.name,
        token: emailToken
      })
      await sendEmail(toEmail, title, emailBody);
      await query.findOneAndUpdate(userColl, { _id: user._id }, { "$set": { adminToken: emailToken } })

      let status = `Password Reset Link Sent To This EmailID ${user.emailAddress} !`
      const obj = resPattern.successPattern(httpStatus.OK, status, `success`)
      return res.status(obj.code).json(obj)

    } else {
      const message = i18n.__({ phrase: ("userProtect"), locale: `${req.query.lang}` })
      let obj = resPattern.errorPattern(httpStatus.UNAUTHORIZED, message);
      return res.status(obj.code).json(obj);
    }


  } catch (e) {
    return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
  }
}

const findPlan = async (req, res, next) => {
  try {
    let plan;
    plan = await query.find(PlanColl, { isDisable: false });
    if (plan) {
      let obj = resPattern.successPattern(httpStatus.OK, plan, 'success');
      return res.status(obj.code).json(obj)
    } else {
      const message = i18n.__({ phrase: ("userPlanNotFound"), locale: `${req.query.lang}` })
      let obj = resPattern.errorPattern(httpStatus.NOT_FOUND, message);
      return res.status(obj.code).json(obj);
    }
  } catch (e) {
    return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
  }
}

const updatepermission = async (req, res, next) => {
  try {
    let center = {}
    center.language = 'en'
    // {
    //   fiscalData: false,
    //   centerImages: false,
    //   centerData: false,
    //   registryOfInternalActions: false,
    //   dayManagement: false,
    //   permissionToWorkers: false,
    //   services: false,
    //   emergencyCancellation: false,
    //   clientFile: false,
    //   actualSubscription: false,
    //   moreCenters: false,
    //   accessTOAdmin: false
    // }
    // center.isExternalUrl = false
    // center.isSubscription = true
    // center.subscriptionStartDate = moment().format("YYYY-MM-DDThh:mm:ss")
    // center.subscriptionExpireDate = moment().add(28, 'days').format("YYYY-MM-DDThh:mm:ss")
    let plan;
    plan = await query.updateMany(userColl, {}, { "$set": center })
    let obj = resPattern.successPattern(httpStatus.OK, plan, 'success');
    return res.status(obj.code).json(obj)
  } catch (e) {
    return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
  }
}

function checkVerification() {
  console.log('* Checking for user verification...');
  cron.schedule(`0 */12 * * *`, () => {
    checkUser();
  });
}

const checkUser = async () => {
  const checkUserS = await query.find(userColl, { status: 0 });
  if (checkUserS.length > 0) {
    for (let i = 0; i < checkUserS.length; i++) {
      let afterDay = moment(checkUserS[i].createdAt, "YYYY-MM-DDThh:mm:ss[z]").add(7, 'days').format("YYYY-MM-DDThh:mm:ss")
      let currentDay = moment().format("YYYY-MM-DDThh:mm:ss")
      if (currentDay > afterDay) {
        await query.deleteOne(userColl, { _id: ObjectID(checkUserS[i]._id) });
        await query.deleteOne(scheduleColl, { centerId: ObjectID(checkUserS[i]._id) });

      }
    }
  }
}

function checkSubscription() {
  console.log('* Checking for center subscription...');
  cron.schedule(`*/1 * * * *`, () => {
    checkUserSubscription();
  });
}

const checkUserSubscription = async () => {
  const checkUserSubscriptionS = await query.find(userColl, { isSubscription: true, isDeleted: false, active: true, type: "center" });
  if (checkUserSubscriptionS.length > 0) {
    for (let i = 0; i < checkUserSubscriptionS.length; i++) {
      let expireDay = moment(checkUserSubscriptionS[i].subscriptionExpireDate, "YYYY-MM-DDThh:mm:ss").format("YYYY-MM-DDThh:mm:ss")
      let currentDay = moment().format("YYYY-MM-DDThh:mm:ss")
      if (currentDay > expireDay) {
        await query.findOneAndUpdate(userColl, { _id: ObjectID(checkUserSubscriptionS[i]._id) }, { $set: { subscriptionExpired: true, isSubscription: false } }, { returnOriginal: false });
      }
    }
  }
}

module.exports = {
  createuser,
  login,
  logout,
  findUser,
  updateUserProfile,
  deleteProfileByUser,
  setAdminPanelPassword,
  checkAdminPassword,
  forgotAdminPassword,
  findPlan,
  adminLogin,
  checkVerification,
  manageAnotherCenter,
  updatepermission,
  checkSubscription
}