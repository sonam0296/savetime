const router = require('express').Router();
const { scheduleParamsValidation } = require('../helpers/joi.validation');
const scheduleCtrl = require('../controllers/schedule.controller');
const validate = require('express-joi-validate');
const { protect } = require('../middleware/auth');

/** GET /api/schedule/getTimeTable - delete a schedule for center */
router.route('/getTimeTable/:centerId').get(protect, scheduleCtrl.getTimeTable);

/** POST /api/schedule/createTimeTable - create a schedule for center */
router.route('/create-timetable').post(validate(scheduleParamsValidation.createTimeTable), protect, scheduleCtrl.createTimeTable);

/** UPDATE /api/schedule/updateTimeTable - Update a schedule for center */
router.route('/update-timetable').put(validate(scheduleParamsValidation.updateTimeTable), protect, scheduleCtrl.updateTimeTable);

/** DELETE /api/schedule/deleteTimeTable - delete a schedule for center */
router.route('/delete-timetable').delete(validate(scheduleParamsValidation.deleteTimeTable), protect, scheduleCtrl.deleteTimeTable);

/** GET /api/schedule/getCenterByDate - get center by date for center */
router.route('/getCenterByDate').post(validate(scheduleParamsValidation.getCenterByDate), scheduleCtrl.getCenterFromDate);

module.exports = router;