const APIError = require('../helpers/APIError');
const resPattern = require('../helpers/resPattern');
const httpStatus = require('http-status');
const db = require('../server')
const userColl = db.collection('user')
const planColl = db.collection('plan')
const query = require('../query/query')
const moment = require('moment')
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const i18n = require('i18n');


dotenv.config();
const { generateOTP, sendEmail, mailTemp, generatePassword } = require('../helpers/commonfile');
const { ObjectID } = require('mongodb').ObjectID;

const verifyotp = async (req, res, next) => {
    try {
        const requestdata = { emailAddress: req.body.emailAddress };
        const userData = await query.findOne(userColl, requestdata)
        // console.log(userData)
        if (!userData) {
            const message = i18n.__({ phrase: ("userInvalidEmail"), locale: `${req.query.lang}` })
            let obj = resPattern.errorPattern(httpStatus.NOT_FOUND, message);
            return res.status(obj.code).json(obj);
        }
        if (userData) {
            if (userData.status === 0) {
                if (moment().format("YYYY-MM-DDThh:mm:ss") < userData.expireTime) {
                    if (userData.otp == req.body.otp) {
                        await query.findOneAndUpdate(userColl, requestdata, { "$set": { status: 1 } })
                        let message = "Your Account Verified Successfully."
                        let obj = resPattern.successPattern(httpStatus.OK, message, 'success');
                        return res.status(obj.code).json(obj);
                    } else {
                        const message = i18n.__({ phrase: ("codeNotMatch"), locale: `${req.query.lang}` })
                        let obj = resPattern.errorPattern(httpStatus.NOT_FOUND, message);
                        return res.status(obj.code).json(obj);
                    }
                } else {
                    const message = i18n.__({ phrase: ("codeExpired"), locale: `${req.query.lang}` })
                    let obj = resPattern.errorPattern(httpStatus.NOT_FOUND, message);
                    return res.status(obj.code).json(obj);
                }
            } else {
                const message = i18n.__({ phrase: ("accountVerified"), locale: `${req.query.lang}` })
                let obj = resPattern.errorPattern(httpStatus.ALREADY_REPORTED, message);
                return res.status(obj.code).json(obj);
            }
        }
    } catch (e) {
        return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
    }
}

//forgotPassword to send otp on email
const forgotPassword = async (req, res, next) => {
    try {
        const requestdata = { emailAddress: req.body.emailAddress }
        //find user
        const userData = await query.findOne(userColl, requestdata);
        if (!userData) {
            const message = i18n.__({ phrase: ("invalidEmail"), locale: `${req.query.lang}` })
            let obj = resPattern.errorPattern(httpStatus.NOT_FOUND, message);
            return res.status(obj.code).json(obj);
        }

        if (userData) {

            const otp = generateOTP();

            await query.findOneAndUpdate(userColl, requestdata, { "$set": { otp: otp, expireTime: moment().add(10, 'Minutes').format("YYYY-MM-DDThh:mm:ss"), status: 0 } })

            const toEmail = userData.emailAddress;
            const title = `SaveTime`;
            let tempTitle = `Otp For Reset-Password`
            let info = `Otp : ${otp} `
            const emailBody = mailTemp(tempTitle, info)

            await sendEmail(toEmail, title, emailBody);

            let message = "Reset-Password Otp Sent To Registered Email."
            let obj = resPattern.successPattern(httpStatus.OK, message, 'success');
            return res.status(obj.code).json(obj);

        }
    } catch (e) {
        return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
    }
}

const resetPassword = async (req, res, next) => {
    try {
        const requestdata = { emailAddress: req.body.emailAddress };

        const userData = await query.findOne(userColl, requestdata)

        if (!userData) {
            const message = i18n.__({ phrase: ("invalidEmail"), locale: `${req.query.lang}` })
            let obj = resPattern.errorPattern(httpStatus.NOT_FOUND, message);
            return res.status(obj.code).json(obj);
        } else {
            if (moment().format("YYYY-MM-DDThh:mm:ss") < userData.expireTime) {
                if (req.body.otp === userData.otp) {
                    const newPass = generatePassword(req.body.resetPassword)
                    await query.findOneAndUpdate(userColl, requestdata, { $set: { password: newPass, status: 1 } })

                    const message = `Password Reset Successfully.`
                    const obj = resPattern.successPattern(httpStatus.OK, message, 'success');
                    return res.json({
                        ...obj
                    });
                } else {
                    const message = i18n.__({ phrase: ("codeNotMatch"), locale: `${req.query.lang}` })
                    let obj = resPattern.errorPattern(httpStatus.NOT_FOUND, message);
                    return res.status(obj.code).json(obj);
                }
            } else {
                const message = i18n.__({ phrase: ("codeExpired"), locale: `${req.query.lang}` })
                let obj = resPattern.errorPattern(httpStatus.NOT_FOUND, message);
                return res.status(obj.code).json(obj);
            }
        }
    } catch (e) {
        return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
    }
}

const passwordCheck = async (req, res, next) => {
    try {
        let userId = ObjectID(req.body.id)
        let oldpass = req.body.password
        let newpass = req.body.newpass

        let user = await query.findOne(userColl, { _id: userId });

        if (user.status === 0) {
            const message = i18n.__({ phrase: ("verifyEmail"), locale: `${req.query.lang}` })
            let obj = resPattern.errorPattern(httpStatus.NOT_FOUND, message);
            return res.status(obj.code).json(obj);
        } else {
            const isMatch = await bcrypt.compare(oldpass, user.password)
            if (isMatch == true) {
                var encyNewPass = generatePassword(newpass)

                const userdata = await query.findOneAndUpdate(userColl, { _id: userId }, { $set: { password: encyNewPass } }, { returnOriginal: false })
                userdata.value.password = undefined
                let obj = resPattern.successPattern(httpStatus.OK, userdata.value, 'success');
                return res.status(obj.code).json(obj)

            } else {
                const message = i18n.__({ phrase: ("oldPasswordNotMatch"), locale: `${req.query.lang}` })
                let obj = resPattern.errorPattern(httpStatus.NOT_FOUND, message);
                return res.status(obj.code).json(obj);
            }
        }
    } catch (e) {
        return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
    }
}

const socialAuth = async (req, res, next) => {
    try {
        const requestData = req.body;
        // get user by email/phone
        const reqData = { emailAddress: req.body.emailAddress }
        // find user
        let user = await query.findOne(userColl, reqData)
        let TokenId = { TokenId: req.body.deviceToken }

        if (user) {
            // ------ user found --------
            if (user.socialCredentials.length > 0) {
                const socialCredentials = user.socialCredentials;
                const length = socialCredentials.length;
                let flag = false;
                for (let i = 0; i < length; i++) {
                    if (socialCredentials[i].socialProvider === requestData.socialProvider) {
                        flag = true;
                        if (flag) {
                            if (socialCredentials[i].socialId === requestData.socialId) {
                                // ------ log in with existing social id success-------
                                if (requestData.deviceToken) {
                                    await userColl.findOneAndUpdate({ _id: ObjectID(user._id) }, {
                                        $addToSet: { 'deviceToken': TokenId }
                                    }, { new: true });
                                    user = await query.findOne(userColl, { _id: ObjectID(user._id) });
                                }
                                socialAuthResponse(user, res);
                            }
                            else {
                                // ------ log in with existing social id success-------
                                const message = i18n.__({ phrase: ("socialError"), locale: `${req.query.lang}` }, requestData.socialProvider)
                                let obj = resPattern.errorPattern(httpStatus.NOT_FOUND, message);
                                return res.status(obj.code).json(obj);
                            }
                        }

                    }
                }
                if (!flag) {
                    // merge new social auth to existing social user
                    if (requestData.deviceToken) {
                        await userColl.findOneAndUpdate({ _id: ObjectID(user._id) }, {
                            $addToSet: { 'deviceToken': TokenId }
                        }, { new: true });
                        user = await query.findOne(userColl, { _id: ObjectID(user._id) });
                    }
                    user.socialCredentials.push({
                        socialId: requestData.socialId,
                        socialProvider: requestData.socialProvider
                    });
                    const userData = await query.findOneAndUpdate(userColl, { _id: ObjectID(user._id) }, { $set: user }, { returnOriginal: false })
                    socialAuthResponse(userData.value, res);
                }

            } else {
                // merge social auth to existing manual user
                if (requestData.deviceToken) {
                    await userColl.findOneAndUpdate({ _id: ObjectID(user._id) }, {
                        $addToSet: { 'deviceToken': TokenId }
                    }, { new: true });
                    user = await query.findOne(userColl, { _id: ObjectID(user._id) });
                }
                user.socialCredentials.push({
                    socialId: requestData.socialId,
                    socialProvider: requestData.socialProvider
                });
                const userData = await query.findOneAndUpdate(userColl, { _id: ObjectID(user._id) }, { $set: user }, { returnOriginal: false })
                socialAuthResponse(userData.value, res);
            }
        } else {
            const users = {
                image: requestData.image !== undefined ? requestData.image : process.env.USER_IMAGE,
                name: requestData.name,
                emailAddress: requestData.emailAddress,
                password: "",
                phonenumber: "",
                type: "client",
                calendarType: "google",
                notification: "true",
                status: 1,
                otp: "",
                idCard: "",
                expireTime: "",
                subscriptionExpired: false,
                isSubscriptionCancle: false,
                isPlanedCancle: false,
                deviceToken: [TokenId],
                favoriteCenter: [],
                socialCredentials: [{
                    socialId: requestData.socialId,
                    socialProvider: requestData.socialProvider
                }],
                // uniqueId: Math.floor(100000 + Math.random() * 900000),
                active: true,
                isDeleted: false
            }
            const allUser = await query.findWithLimit(userColl, { type: "client" }, {}, { _id: -1 }, {}, 1, 1)
            users.uniqueId = `${parseInt(allUser[0].uniqueId) + 1}`
            const newUser = await query.insert(userColl, users)
            socialAuthResponse(newUser.ops[0], res);
        }
    } catch (e) {
        return next(new APIError(e.message, httpStatus.BAD_REQUEST, true));
    }
}


// generate response data and send
function socialAuthResponse(user, res) {
    // response data
    const resData = user.ops ? user.ops : user;
    resData.password = undefined;

    const token = jwt.sign({ _id: user._id, firstName: user.firstName, type: user.type }, process.env.JWT_SECRET)

    // // send response.
    let obj = resPattern.successPattern(httpStatus.OK, { userData: resData, token }, 'success');
    return res.status(obj.code).json(obj);
}

module.exports = {
    verifyotp,
    forgotPassword,
    resetPassword,
    passwordCheck,
    socialAuth,
}