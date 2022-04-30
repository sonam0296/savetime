const router = require('express').Router();
const authCtrl = require('../controllers/auth.controller');
const { userParamsValidation,
    authParamsValidation } = require('../helpers/joi.validation');
const validate = require('express-joi-validate');
const { protect } = require('../middleware/auth');

//verify otp for all client, admin, center
router.route('/verifyotp')
    .post(validate(authParamsValidation.verifyOTP), authCtrl.verifyotp);

//forget password for all client, admin, center
router.route('/forgotPassword')
    .post(validate(authParamsValidation.forgotPassword), authCtrl.forgotPassword);

//reset password for all client, admin, centers.
router.route('/resetPassword')
    .post(validate(authParamsValidation.resetPassword), authCtrl.resetPassword)

//change password for all client, admin, center
router.route('/changePassword')
    .post(validate(authParamsValidation.changePassword), protect, authCtrl.passwordCheck);

//social signup or login for all client, center
router.route('/social').post(validate(userParamsValidation.socialAuth), authCtrl.socialAuth);

module.exports = router;