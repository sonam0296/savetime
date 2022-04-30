const APIError = require('../helpers/APIError');
const resPattern = require('../helpers/resPattern');
const httpStatus = require('http-status');
const db = require('../server')
const userColl = db.collection('user');
const PlanColl = db.collection('plan');
const petsColl = db.collection('pet');
const query = require('../query/query')
const uniqueString = require('unique-string');
const { ObjectID } = require('mongodb');
const i18n = require('i18n');

const createPlans = async (req, res, next) => {
    try {
        const { planName, price, isDisable, duration } = req.body;
        let addPlan = {
            planName: planName,
            price: price,
            currency: "Euro",
            duration: duration,
            interval: "days",
            intervalCount: duration === 'month' ? '28 days' : '11 Months',
            discription: duration === 'month' ? '1 Month Trail Pack !' : '11 Months Trail Pack !',
            isDisable: isDisable
        }

        const planTblProduct = await query.insert(PlanColl, addPlan)
        const obj = resPattern.successPattern(httpStatus.OK, planTblProduct.ops, `success`);
        return res.status(obj.code).json({
            ...obj
        });

    } catch (e) {
        return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
    }
}

const updateplans = async (req, res, next) => {
    try {
        const setData = req.body
        const plandata = { _id: ObjectID(req.params.id) };

        const checkPlans = await query.findOne(PlanColl, plandata)
        if (checkPlans) {
            const plansData = await query.findOneAndUpdate(PlanColl,
                { _id: ObjectID(req.params.id) },
                { $set: setData },
                { returnOriginal: false }
            )
            let obj = resPattern.successPattern(httpStatus.OK, plansData.value, 'success');
            return res.status(obj.code).json(obj);
        } else {
            const message = i18n.__({ phrase: ("planNotFound"), locale: `${req.query.lang}` })
            let obj = resPattern.errorPattern(httpStatus.NOT_FOUND, message);
            return res.status(obj.code).json(obj);
        }
    } catch (e) {
        return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
    }
}

const disablePlans = async (req, res, next) => {
    try {
        const Plansdata = { _id: ObjectID(req.body.id) };

        const checkPlans = await query.findOne(PlanColl, Plansdata)
        if (checkPlans) {
            const plansData = await query.findOneAndUpdate(PlanColl,
                { _id: ObjectID(req.params.id) },
                { $set: { isDisable: req.body.isDisable } },
                { returnOriginal: false }
            )
            let obj = resPattern.successPattern(httpStatus.OK, plansData.value, 'success');
            return res.status(obj.code).json(obj);
        } else {
            const message = i18n.__({ phrase: ("planNotFound"), locale: `${req.query.lang}` })
            let obj = resPattern.errorPattern(httpStatus.NOT_FOUND, message);
            return res.status(obj.code).json(obj);
        }
    } catch (e) {
        return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
    }
}

const findallPlans = async (req, res, next) => {
    try {
        const findallPlan = await query.find(PlanColl, { isDisable: false }, { createdAt: -1 })
        const obj = resPattern.successPattern(httpStatus.OK, findallPlan, `success`);
        return res.status(obj.code).json({
            ...obj
        });
    } catch (e) {
        return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
    }
}

const getPlanDetail = async (req, res, next) => {
    try {
        const getPlansDetail = await query.findOne(PlanColl, { _id: ObjectID(req.params.id) }, { createdAt: -1 })
        const obj = resPattern.successPattern(httpStatus.OK, getPlansDetail, `success`);
        return res.status(obj.code).json({
            ...obj
        });
    } catch (e) {
        return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
    }
}
module.exports = {
    createPlans,
    updateplans,
    disablePlans,
    findallPlans,
    getPlanDetail
}