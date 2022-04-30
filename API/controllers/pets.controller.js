const APIError = require('../helpers/APIError');
const resPattern = require('../helpers/resPattern');
const httpStatus = require('http-status');
const db = require('../server')
const petsColl = db.collection('pet');
const query = require('../query/query')
const { ObjectID } = require('mongodb');
const i18n= require('i18n');

const createPets = async (req, res, next) => {
    try {
        const petsdata = { petsName: req.body.petsName, userId: req.user._id };

        const checkPets = await query.findOne(petsColl, petsdata)
        if (checkPets) {
            const message = i18n.__({ phrase: ("petsAlreadyAvailable"), locale: `${req.query.lang}` })
            let obj = resPattern.errorPattern(httpStatus.ALREADY_REPORTED, message);
            return res.status(obj.code).json(obj);
        } else {
            const pets = req.body
            pets.userId = req.user._id
            const insertdata = await query.insert(petsColl, pets)
            let data = insertdata.ops
            let obj = resPattern.successPattern(httpStatus.OK, { data }, 'success');
            return res.status(obj.code).json(obj);
        }
    } catch (e) {
        return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
    }
}

const updatePets = async (req, res, next) => {
    try {
        const setData = req.body
        const petdata = { _id: ObjectID(req.params.id) };
        const checkPets = await query.findOne(petsColl, petdata)
        if (checkPets) {
            const petsData = await query.findOneAndUpdate(petsColl,
                { _id: ObjectID(req.params.id) },
                { $set: setData },
                { returnOriginal: false }
            )
            let obj = resPattern.successPattern(httpStatus.OK, petsData.value, 'success');
            return res.status(obj.code).json(obj);
        } else {
            const message = i18n.__({ phrase: ("petsNotFound"), locale: `${req.query.lang}` })
            let obj = resPattern.errorPattern(httpStatus.NOT_FOUND, message);
            return res.status(obj.code).json(obj);
        }
    } catch (e) {
        return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
    }
}

const deletePets = async (req, res, next) => {
    try {
        const petsdata = { _id: ObjectID(req.body.id) };

        const checkPets = await query.findOne(petsColl, petsdata)
        if (checkPets) {
            await query.deleteOne(petsColl, petsdata)
            let obj = resPattern.successPattern(httpStatus.OK, "Pets Deleted !", 'success');
            return res.status(obj.code).json(obj);
        } else {
            const message = i18n.__({ phrase: ("petsNotFound"), locale: `${req.query.lang}` })
            let obj = resPattern.errorPattern(httpStatus.NOT_FOUND, message);
            return res.status(obj.code).json(obj);
        }
    } catch (e) {
        return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
    }
}

const findallPets = async (req, res, next) => {
    try {
        const findallPet = await query.find(petsColl, {}, { createdAt: -1 })
        const obj = resPattern.successPattern(httpStatus.OK, findallPet, `success`);
        return res.status(obj.code).json({
            ...obj
        });
    } catch (e) {
        return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
    }
}

const getPetsDetail = async (req, res, next) => {
    try {
        const getPetsDetailS = await query.findOne(petsColl, { _id: ObjectID(req.params.id) }, { createdAt: -1 })
        const obj = resPattern.successPattern(httpStatus.OK, getPetsDetailS, `success`);
        return res.status(obj.code).json({
            ...obj
        });
    } catch (e) {
        return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
    }
}
module.exports = {
    createPets,
    updatePets,
    deletePets,
    getPetsDetail,
    findallPets
}