const router = require('express').Router();
const userCtrl = require('../controllers/user.controller');
// const { validate, ValidationError, Joi } = require('express-validation');
const { userParamsValidation } = require('../helpers/joi.validation');
const validate = require('express-joi-validate');

const { protect } = require('../middleware/auth');
const {
    createCustomer,
    createSubscription,
    cancelSubscription,
    updateScbscription, updateSubscriptionWebHook,
    testWebhook,
    customersubscription,
    listAllProduct
} = require('../helpers/stripe.payment')
const { createSignature, createPayment } = require('../helpers/redsys.payment')
/** Create /api/user/create-user - Create center, user */
router.route('/create-user').post(validate(userParamsValidation.createUser), userCtrl.createuser);

/** Login /api/user/login - Login center, user */
router.route('/login').post(validate(userParamsValidation.login), userCtrl.login);

// router.post('/login', validate(userParamsValidation.login), userCtrl.login);

/** logout /api/user/logout - logout center, user */
router.route('/logout').post(protect, userCtrl.logout);

/** GET /api/user/find-user - get user */
router.route('/find-user').get(protect, userCtrl.findUser);

/** UPDATE /api/user/updateUser - Update user */
router.route('/updateUser/:id').post(validate(userParamsValidation.updateUser), protect, userCtrl.updateUserProfile);

/** DELETE /api/user/deleteUser - Delete user */
router.route('/deleteUser').delete(protect, userCtrl.deleteProfileByUser);

/** POST /api/user/set-admin-password - set admin password */
router.route('/set-admin-password').post(protect, userCtrl.setAdminPanelPassword);

/** POST /api/user/checkAdmin - Check admin available or not */
router.route('/checkAdmin').post(protect, userCtrl.checkAdminPassword);

router.route('/centerAdminLogin').post(protect, userCtrl.adminLogin);

router.route('/manageAnotherCenter').post(userCtrl.manageAnotherCenter);

/** POST /api/user/forgot-admin-password - forgot admin password */
router.route('/forgot-admin-password').put(protect, userCtrl.forgotAdminPassword);
router.route('/update').put(userCtrl.updatepermission);


// Redsys payment API

router.route('/createRedsysSignature').post(createSignature);
router.route('/createRedsysPayment/:centerId').put(protect, createPayment);


// stripe payment API

router.route('/stripe-customer').post(createCustomer);

router.route('/subscription').post(createSubscription);

router.route('/cancel-subscription').post(cancelSubscription);

router.route('/updateSubscription').post(updateScbscription);

router.route('/book-subscription').post(customersubscription);

router.route('/testWebHook').post(testWebhook);

router.route('/plan').get(userCtrl.findPlan);

router.route('/all-plan').get(listAllProduct);

module.exports = router;