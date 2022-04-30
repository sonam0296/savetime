const router = require('express').Router();
const { uploadS3 } = require('../helpers/commonfile');
const imageUploadCtrl = require('../controllers/imageUpload.controller')

/** POST /api/image/imageUpload - upload single image file */
router.route('/imageUpload').post(uploadS3.single('image'), imageUploadCtrl.singleUpload)

/** POST /api/image/multiple-upload - upload multiple image files */
router.route('/multiple-upload',).post(uploadS3.array('images', 10), imageUploadCtrl.multipleUpload);

module.exports = router;