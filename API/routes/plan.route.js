const router = require('express').Router();
const plansCtrl = require('../controllers/plan.controller');
const { protect } = require('../middleware/auth');


/** POST /api/pets/create-pets - create a pets */
router.route('/create-plan').post(protect,plansCtrl.createPlans);

/** PATCH /api/pets/update-pets - update a petsr */
router.route('/update-plan/:id').put(protect, plansCtrl.updateplans);

/** DELETE /api/pets/delete-pets - delete a pets */
router.route('/delete-plan').delete(protect, plansCtrl.disablePlans);

/** GET /api/pets/pets-detail - get a pets detail */
router.route('/plan-detail/:id').get(protect,plansCtrl.getPlanDetail);

/** GET /api/pets/allPets - all Plans list */
router.route('/allPlans').get(plansCtrl.findallPlans);

module.exports = router;