const dotenv = require('dotenv');

dotenv.config();
// const stripe = require('stripe')(process.env.STRIPE_TEST)
// const stripe = require('stripe')('sk_test_51HucwXKAtKJyGZzfQQlQmtv8zGBdAkdG1EW7K4euboiSRu4xCnFr90vVOCoFTjB17QmPHPBQiidIkGichwoBgifY00gTcCmvnP');
const stripe = require('stripe')(process.env.STRIPE_TEST);
const resPattern = require('../helpers/resPattern');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const db = require('../server')
const PlanColl = db.collection('plan');
const userColl = db.collection('user')
const subColl = db.collection('subscription')
const clientProgramColl = db.collection('clientProgram')
const { ObjectID } = require('mongodb').ObjectID;
const newsubColl = db.collection('newSubscriptioon')
const query = require('../query/query')
const moment = require('moment')
const Redsys = require('node-redsys-api').Redsys;
const secret = "kxxklAIJd8BsOVJxiMQ2KaS7ez7Cuf71"
const testSecret = "7o7n2fTZ6kGM8eD4EMyp5crGPT+PvPNk"
const momentTimeZone = require('moment-timezone');
const i18n = require('i18n');


// create signature for payment
let createSignature = async (req, res, next) => {
  try {
    function createPayment(description, total, titular, orderId, paymentId) {
      const redsys = new Redsys();
      let order = Math.floor(1000000000 + Math.random() * 9000000000);
      const mParams = {
        "DS_MERCHANT_MERCHANTCODE": "992180562",
        "DS_MERCHANT_TRANSACTIONTYPE": "0",
        "DS_MERCHANT_COF_INI": "S",
        "DS_MERCHANT_COF_TYPE": "R",
        "DS_MERCHANT_ORDER": `${order}`,
        "DS_MERCHANT_TERMINAL": "1",
        "DS_MERCHANT_CURRENCY": "978",
        "DS_MERCHANT_IDENTIFIER": "REQUIRED",
        "DS_MERCHANT_AMOUNT": req.body.amount,
        "DS_MERCHANT_MERCHANTURL": "http://savetime-web.s3-website.eu-west-3.amazonaws.com/#/center/admin/plan",
        "DS_MERCHANT_URLOK": "http://savetime-web.s3-website.eu-west-3.amazonaws.com/#/center/admin/plan",
        "DS_MERCHANT_URLKO": "http://savetime-web.s3-website.eu-west-3.amazonaws.com/#/center/admin/plan"
      };

      return { signature: redsys.createMerchantSignature(testSecret, mParams), merchantParameters: redsys.createMerchantParameters(mParams), raw: mParams };
    }
    const response = createPayment()
    const obj = resPattern.successPattern(httpStatus.OK, response, `success`);
    return res.status(obj.code).json({
      ...obj
    });
  } catch (e) {
    return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
  }
}

let createPayment = async (req, res, next) => {
  try {
    console.log(req.body)
    const redsys = new Redsys();
    // const Ds_SignatureVersion = req.body.Ds_SignatureVersion
    // const Ds_MerchantParameters = "eyJEc19EYXRlIjoiMjUlMkYwOCUyRjIwMjEiLCJEc19Ib3VyIjoiMTUlM0E1NyIsIkRzX1NlY3VyZVBheW1lbnQiOiIxIiwiRHNfQW1vdW50IjoiMzE5NyIsIkRzX0N1cnJlbmN5IjoiOTc4IiwiRHNfT3JkZXIiOiI4OTYxOTcxMTQ0IiwiRHNfTWVyY2hhbnRDb2RlIjoiOTkyMTgwNTYyIiwiRHNfVGVybWluYWwiOiIwMDEiLCJEc19SZXNwb25zZSI6IjAwMDAiLCJEc19UcmFuc2FjdGlvblR5cGUiOiIwIiwiRHNfTWVyY2hhbnREYXRhIjoiIiwiRHNfQXV0aG9yaXNhdGlvbkNvZGUiOiIyMTcxOTUiLCJEc19Db25zdW1lckxhbmd1YWdlIjoiMSIsIkRzX0NhcmRfQ291bnRyeSI6IjcyNCIsIkRzX0NhcmRfQnJhbmQiOiIxIiwiRHNfUHJvY2Vzc2VkUGF5TWV0aG9kIjoiMSJ9"
    // const Ds_Signature = "2aPRd8y0tGTb9oYw7Pn3VHCoR4ndUUBCP9WMwyNkZYg="
    const merchantParams = req.body.Ds_MerchantParameters
    const signature = req.body.Ds_Signature

    const merchantParamsDecoded = redsys.decodeMerchantParameters(merchantParams);
    const merchantSignatureNotif = redsys.createMerchantSignatureNotif(testSecret, merchantParams);
    const dsResponse = parseInt(merchantParamsDecoded.Ds_Response || merchantParamsDecoded.DS_RESPONSE);
    if (redsys.merchantSignatureIsValid(signature, merchantSignatureNotif) && dsResponse > -1 && dsResponse < 100) {
      console.log('TPV payment is OK');
      const setData = req.body

      if (setData.planId !== undefined) {

        const checkCenter = await query.findOne(userColl, { _id: ObjectID(req.params.centerId) })
        setData.planId = ObjectID(setData.planId)
        const checkPlans = await query.findOne(PlanColl, { _id: ObjectID(req.body.planId) })
        if (checkPlans) {
          setData.subscription = {
            planName: checkPlans.planName,
            planDuration: checkPlans.duration,
            totalAmount: merchantParamsDecoded.Ds_Amount,
            orderId: merchantParamsDecoded.Ds_Order,
            paymentId: merchantParamsDecoded.Ds_AuthorisationCode
          }
          setData.isSubscription = true
          const timeZone = checkCenter.timezone.split(" ")
          const centerTimeZone = momentTimeZone.tz(moment(), timeZone[0])
          setData.subscriptionStartDate = moment(centerTimeZone).format("YYYY-MM-DDThh:mm:ss")
          if (checkPlans.duration == 'month') {
            setData.subscriptionExpireDate = moment(centerTimeZone).add(28, 'days').format("YYYY-MM-DDThh:mm:ss")
          }
          if (checkPlans.duration == 'year') {
            setData.subscriptionExpireDate = moment(centerTimeZone).add(11, 'months').format("YYYY-MM-DDThh:mm:ss")
          }
          delete setData["Ds_SignatureVersion"]
          delete setData["Ds_MerchantParameters"]
          delete setData["Ds_Signature"]
          const userUpdate = await query.findOneAndUpdate(userColl, { _id: ObjectID(req.params.centerId) }, { $set: setData }, { returnOriginal: false })
          let user = userUpdate.value;
          delete user['password'];
          delete user['adminPanelPassword'];
          const obj = resPattern.successPattern(httpStatus.OK, user, `success`);
          return res.status(obj.code).json({
            ...obj
          });
        } else {
          console.log("a")
          const message = i18n.__({ phrase: ("planNotFound"), locale: `${req.query.lang}` })
          let obj = resPattern.errorPattern(httpStatus.ALREADY_REPORTED, message);
          return res.status(obj.code).json(obj);
        }
      }
      else {
        console.log("aa")

        const message = i18n.__({ phrase: ("planNotFound"), locale: `${req.query.lang}` })
        let obj = resPattern.errorPattern(httpStatus.ALREADY_REPORTED, message);
        return res.status(obj.code).json(obj);
      }
    } else {
      console.log("aaa")

      const message = i18n.__({ phrase: ("redsysPaymentError"), locale: `${req.query.lang}` })
      let obj = resPattern.errorPattern(httpStatus.NOT_FOUND, message);
      return res.status(obj.code).json(obj);
    }
  } catch (e) {
    return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
  }
}

module.exports = {
  createSignature,
  createPayment
}
