const router = require('express').Router();
const { disableProduct, createProduct , update_plan } = require('../helpers/stripe.payment')

router.route('/disable-product')
    .post(disableProduct)

router.route('/create-product')
    .post(createProduct);

router.route('/update-product')
    .patch(update_plan);

module.exports = router;