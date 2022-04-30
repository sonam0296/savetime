const router = require('express').Router();
const compneyCtrl = require('../controllers/compney.controller');
const { protect } = require('../middleware/auth');


/** POST /api/pets/create-compney - create a companey */
router.route('/create-compney').post(protect, compneyCtrl.createCompney);

/** PATCH /api/pets/update-compney/:id - update a compney */
router.route('/update-compney/:id').put(protect, compneyCtrl.updateCompney);

/** DELETE /api/pets/delete-compney - delete a compney */
router.route('/delete-compney').delete(protect, compneyCtrl.deleteCompney);

/** GET /api/pets/compney-detail/:id - get a compney detail */
router.route('/compney-detail/:id').get(protect, compneyCtrl.getCompneyDetail);

/** GET /api/pets/allCompney - get a compney details */
router.route('/allCompney').post(protect, compneyCtrl.findallCompney);

/** GET /api/pets/companey detail from center - get a compney details */
router.route('/center-compney/:centerId').get(protect, compneyCtrl.getCompneyDetailFromCenter);

module.exports = router;