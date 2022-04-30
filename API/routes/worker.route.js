const router = require('express').Router();
const wrkCtrl = require('../controllers/worker.controller');
const { workerParamsValidation } = require('../helpers/joi.validation');
const validate = require('express-joi-validate');
const { protect } = require('../middleware/auth');

/** POST /api/worker/create-worker - Create worker */
router.route('/create-worker').post(validate(workerParamsValidation.createWorker), protect, wrkCtrl.createWorker);

/** DELETE /api/worker/delete-worker - forgot admin password */
router.route('/delete-worker/:workerId').put(protect, wrkCtrl.deleteWorker);

/** PUT /api/worker/update-worker - forgot admin password */
router.route('/update-worker').put(protect, wrkCtrl.updateWorker);

/** POST /api/worker/worker-login - forgot admin password */
router.route('/worker-login').post(protect, wrkCtrl.workerLogin);

/** GET /api/worker//workerDetails/:workerId - forgot admin password */
router.route('/workerDetails/:workerId').get(validate(workerParamsValidation.getWorker), protect, wrkCtrl.getWorker);

/** GET /api/worker/centerWorker/:centerId - forgot admin password */
router.route('/centerWorker/:centerId').get(wrkCtrl.WorkerfromCenter);

/** GET /api/worker/centerWorker/:centerId - forgot admin password */
router.route('/workerList').get(wrkCtrl.WorkerList);

router.route('/workerStatus').put(protect,wrkCtrl.deActivateWorker);

router.route('/workerHistory').post(protect,wrkCtrl.getWorkerHistory);

module.exports = router;