const router = require('express').Router();
const centerCtrl = require('../controllers/center.controller');
const { protect } = require('../middleware/auth');
const { centerParamsValidation } = require('../helpers/joi.validation');
const validate = require('express-joi-validate');

// POST /api/center/create-center - create a center
// router.route('/create-center').post(centerCtrl.createcenter);

// GET /api/center/account activation - account activation for center
router.route('/account-activation/:id').get(protect, centerCtrl.ActivateAccount);

// GET /api/center/center-list - get center list
router.route('/center-list').get(centerCtrl.centerlist);

// POST /api/center/getCenterDetails - get center Detail
router.route('/getCenterDetail').post(centerCtrl.getCenterDetail);

// POST /api/center/searchCenter - search center
router.route('/searchCenter').post(centerCtrl.searchCenter);

// POST /api/center/favorite-center - get favorite center list
router.route('/favorite-center').get(protect, centerCtrl.favoriteCenterList);

// POST /api/center/add-favorite-center - add favorite center
router.route('/add-favorite-center').post(validate(centerParamsValidation.Favorite), protect, centerCtrl.addFavoriteCenter);

// POST /api/center/getCenterDetail - remove favorite center
router.route('/remove-favorite-center').post(validate(centerParamsValidation.Favorite), protect, centerCtrl.removeFavoriteCenter);

// POST /api/center/get_near_by_centers - get_near_by_centers
router.route('/get_near_by_centers').post(centerCtrl.getCenters);

// PUT /api/center/delete-center/:centerId - Delete the centers
router.route('/delete-center/:centerId').put(protect, centerCtrl.deletecenter);

// PUT /api/center/centerStatus - block and unblock center
router.route('/userStatus').put(protect, centerCtrl.centerStatus);

// POST /api/center/centerWorker - gget center detail with worker by date
router.route('/centerWorker').post(validate(centerParamsValidation.centerWorker), centerCtrl.WorkerInCenter);

module.exports = router;