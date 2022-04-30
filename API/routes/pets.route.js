const router = require('express').Router();
const petsCtrl = require('../controllers/pets.controller');
const { protect } = require('../middleware/auth');


/** POST /api/pets/create-pets - create a pets */
router.route('/create-pets').post(protect,petsCtrl.createPets);

/** PATCH /api/pets/update-pets - update a pets */
router.route('/update-pets/:id').put(protect, petsCtrl.updatePets);

/** DELETE /api/pets/delete-pets - delete a pet */
router.route('/delete-pets').delete(protect, petsCtrl.deletePets);

/** GET /api/pets/pets-detail - get a pets detail */
router.route('/pets-detail/:id').get(protect,petsCtrl.getPetsDetail);

/** GET /api/pets/allPets - all pets lists */
router.route('/allPets').get(petsCtrl.findallPets);

module.exports = router;