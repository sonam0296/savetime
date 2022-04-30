const router = require('express').Router();
const categoryCtrl = require('../controllers/category.controller');
const { protect } = require('../middleware/auth');


// router.route('/create-category').post(protect, categoryCtrl.createCategory);

/** POST /api/category/create-category - create a category for center */
router.route('/create-category').post(categoryCtrl.createCategory);

/** PATCH /api/category/update-category - update a category for centers */
router.route('/update-category').patch(protect, categoryCtrl.updateCategory);

/** DELETE /api/category/delete-category - delete a category for center */
router.route('/delete-category').delete(protect, categoryCtrl.deleteCategory);

/** GET /api/category/category-detail - get a category detail */
router.route('/category-detail/:uniqueId').get(categoryCtrl.getCategoryDetail);

/** GET /api/category/allCategory - all category list for center */
router.route('/allCategory').get(categoryCtrl.findallCategory);

/** POST /api/category/filter-category - category wise list of center's */
router.route('/filter-category').post(categoryCtrl.categoryFilter);

/** POST /api/category/filter-category-app - category wise list of center's for App */
router.route('/filter-category-app').post(categoryCtrl.categoryFilterForApp);

module.exports = router;