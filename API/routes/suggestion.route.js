const router = require('express').Router();
const suggestionctrl = require('../controllers/suggestion.controller');
const { protect } = require('../middleware/auth');
const { suggestionParamsValidation } = require('../helpers/joi.validation');
const validate = require('express-joi-validate');

/** Create /api/suggestion/create-suggestions - send suggestion to center */
router.route('/create-suggestion').post(protect, validate(suggestionParamsValidation.sendSuggestion), suggestionctrl.sendSuggestion);

module.exports = router;