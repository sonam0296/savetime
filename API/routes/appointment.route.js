const router = require('express').Router();
const appointmentCtrl = require('../controllers/Appointment.controller');
const { appointmentParamsValidation } = require('../helpers/joi.validation');
const validate = require('express-joi-validate');
const { protect } = require('../middleware/auth');

// user route
//appointment booking
router.route('/add-appointment').post(validate(appointmentParamsValidation.createAppointment), protect, appointmentCtrl.checkSlotAvailability);

//cancle-appointment
router.route('/cancel-appointment').put(protect, appointmentCtrl.cancelAppointment);

//Delete appointment
router.route('/delete-appointment/:appointmentId').put(validate(appointmentParamsValidation.deleteAppointment), protect, appointmentCtrl.deleteAppointment);

//appointment history of user
router.route('/my-appointment').get(protect, appointmentCtrl.appointmentHistory);

// admin and worker route
//update existing appointment
router.route('/update-appointment/:appointmentId').put(validate(appointmentParamsValidation.updateAppointment), protect, appointmentCtrl.updateAppointment);

//get appointment list
router.route('/appointment-list').get(protect, appointmentCtrl.findallAppointment);

//get appointment detail
router.route('/appointment-detail/:appointmentId').get(protect, appointmentCtrl.getSingleAppointment);

//get appointment by status
router.route('/appointment-by-status').post(validate(appointmentParamsValidation.statusAppointment), protect, appointmentCtrl.getAppointmentStatus);

//appointment list filter
router.route('/appointment-filter').post(protect, appointmentCtrl.filterAppointment);

// emergency Cancel by worker
router.route('/emergency-cancel').post(validate(appointmentParamsValidation.emergencyCancel), protect, appointmentCtrl.emergencyCancel);

//repeat existing appointment
// router.route('/repeat-appointment').post(protect, appointmentCtrl.repeatAppointment);

router.route('/client-appointment/:centerId').get(protect, appointmentCtrl.appointmentOfClient);

router.route('/appointmentId/:centerId').get(protect, appointmentCtrl.getSingleAppointmentId);

router.route('/appointmentHistory').post(protect, appointmentCtrl.appointmentHistoryforcenter);

module.exports = router;