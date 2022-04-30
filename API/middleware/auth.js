const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const db = require('../server')
const query = require('../query/query');
const userColl = db.collection('user')
const centerColl = db.collection('center')
const { ObjectID } = require('mongodb');
const { cryptoDecrypt, cryptoEncrypt } = require('../helpers/commonfile')

dotenv.config();

// verify JWT token and protect routes.
const protect = async (req, res, next) => {
    let token, decToken;
    let message = 'Not Authorized To Access This Route.';
    let msg = 'The User Belonging To This Token Does Not Exist.';
    // check header for authorization
    if (req.headers.authorization) {
        if (req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
            decToken = cryptoDecrypt(token)
        }
        else {
            token = req.headers.authorization;
            decToken = cryptoDecrypt(token)
        }
    } else {
        decToken = req.params.id
    }
    // var decToken = cryptoDecrypt(token)
    // check token
    if (!decToken) {
        return next(new APIError(message, httpStatus.UNAUTHORIZED, true));
    }

    try {
        // Verify token
        const decoded = jwt.verify(decToken, process.env.JWT_SECRET);

        const decodeId = { _id: ObjectID(decoded._id) }
        const user = await query.findOne(userColl, decodeId);


        if (user) {
            req.user = user;
            next();
        } else {
            return next(new APIError(msg, httpStatus.UNAUTHORIZED, true));
        }
    } catch (e) {
        return next(new APIError(message, httpStatus.UNAUTHORIZED, true));
    }
}

// authorize only Admin
const authorize = async (req, res, next) => {
    const user = req.user;

    if (user.accessAdminPanel !== true) {
        const message = 'Only Admin Can Access This Route.';
        return next(new APIError(message, httpStatus.UNAUTHORIZED, true));
    }
    next();
}

// authorize only Admin
const owned = async (req, res, next) => {
    const user = req.user;

    if (user.userType !== 'Therapist') {
        const message = 'Only owner can access this route.';
        return next(new APIError(message, httpStatus.UNAUTHORIZED, true));
    }
    next();
}

module.exports = {
    protect,
    authorize,
    owned
}