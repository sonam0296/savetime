const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const resPattern = require('../helpers/resPattern');
const path = require('path')
const i18n= require('i18n');

// upload single image
const singleUpload = async (req, res, next) => {
    try {
        // get image and verify image upload
        const file = req.file;
        if (!file) {
            const message = i18n.__({ phrase: ("fileNotFound"), locale: `${req.query.lang}` })
            let objs = resPattern.errorPattern(httpStatus.NOT_FOUND, message);
            return res.status(objs.code).json(objs);
        }

        // // send response
        const resData = {
            file: file.location
        }
        let obj = resPattern.successPattern(httpStatus.OK, resData, 'success');
        return res.status(obj.code).json(obj);
    } catch (e) {
        return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
    }
}

const multipleUpload = async (req, res, next) => {
    try {
        // get files and verify files upload
        const files = req.files;
        if (!files || files.length === 0) {
            const message = i18n.__({ phrase: ("fileNotFound"), locale: `${req.query.lang}` })
            let objs = resPattern.errorPattern(httpStatus.NOT_FOUND, message);
            return res.status(objs.code).json(objs);
        }

        // filter files data
        let filesData = [];
        files.forEach(file => {
            const extname = path.extname(file.originalname);
            filesData.push({
                url: file.location,
                type: extname
            });
        });

        // send response
        let obj = resPattern.successPattern(httpStatus.OK, filesData, 'success');
        return res.status(obj.code).json(obj);
    } catch (e) {
        return next(new APIError(e.message, httpStatus.BAD_REQUEST, true));
    }
}


module.exports = {
    singleUpload,
    multipleUpload
};
