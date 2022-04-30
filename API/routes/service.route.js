const router = require('express').Router();
const serviceCtrl = require('../controllers/service.controller');
const { protect, authorize } = require('../middleware/auth');
const validate = require('express-joi-validate');
const { serviceParamsValidation } = require('../helpers/joi.validation');


/** POST /api/schedule/createServicePersonal - create a personal service for center */
router.route('/createServicePersonal').post(validate(serviceParamsValidation.createServicePersonal), protect, serviceCtrl.createServicePersonal);

/** POST /api/schedule/createServicecollective - create a collective service for center */
router.route('/createServiceCollective').post(validate(serviceParamsValidation.createServiceCollective), protect, serviceCtrl.createServiceCollective);

/** DELETE /api/schedule/deleteService - delete service for center */
router.route('/deleteService/:serviceId').put(protect, serviceCtrl.deleteService);

/** DELETE /api/schedule/deleteServiceWorker - delete specific services worker */
router.route('/deleteServiceWorker').put(protect, serviceCtrl.removeWorker);

/** GET /api/schedule/findService - fetch service */
router.route('/getServiceDetails/:serviceId').get(validate(serviceParamsValidation.findService), serviceCtrl.getServiceDetails);

/** GET /api/schedule/findService - fetch service for center */
router.route('/findCenterService/:centerId').get(validate(serviceParamsValidation.findCenterService), serviceCtrl.findCenterService);

/** POST /api/service/findMultipleService - fetch service for worker soonest available time */
router.route('/findMultipleService').post(validate(serviceParamsValidation.findMultipleService), serviceCtrl.getMultipleService);

/** POST /api/service/workerByService - fetch worker available time from service */
router.route('/workerByService').post(serviceCtrl.getWorkerByService);

/** POST /api/service/workerServices - fetch worker worker service */
router.route('/workerServices').post(serviceCtrl.findWorkerService);

/** POST /api/service/workerServices - fetch worker worker services */
router.route('/filterService').post(protect, serviceCtrl.serviceFilter);

/** POST /api/service/overlappedService - fetch overlapped services (if service pass in body than that selectes service not give in response) */
router.route('/overlappedService').post(validate(serviceParamsValidation.findoverLappedService), protect, serviceCtrl.findoverLappingService);

/** UPDATE /api/schedule/updateServicePersonal - Update personal service for center */
router.route('/updateService/:serviceId').put(validate(serviceParamsValidation.updateServicePersonal), protect, serviceCtrl.updateServicePersonal);

/** UPDATE /api/schedule/updateServiceCollective - Update collective service for center */
router.route('/updateServiceCollective').put(validate(serviceParamsValidation.updateServiceCollective), protect, serviceCtrl.updateServiceCollective);

module.exports = router;