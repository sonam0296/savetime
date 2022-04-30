const router = require('express').Router();
const eventCtrl = require('../controllers/event.controller');
const { protect, authorize } = require('../middleware/auth');

// POST /api/event/create-event - create a event for worker
router.route('/create-event').post(protect, eventCtrl.createEvent);

// PUT /api/event/update-event - update a event for center 
router.route('/update-event').put(protect, eventCtrl.updateEvent);

// DELETE /api/category/delete-event - delete a event for center 
router.route('/delete-event').delete(protect, eventCtrl.deleteEvent);

// GET /api/event/event-detail - get detail of event
router.route('/event-detail').post(protect, eventCtrl.getEventDetail);

// GET /api/event/allEvent - all event list 
router.route('/allEvent').get(protect, eventCtrl.findallEvent);

// GET filter event 
router.route('/filter-event').post(protect, eventCtrl.eventFilter);

module.exports = router;