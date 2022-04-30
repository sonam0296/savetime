const APIError = require('../helpers/APIError');
const resPattern = require('../helpers/resPattern');
const httpStatus = require('http-status');
const db = require('../server')
const eventColl = db.collection('event');
const query = require('../query/query')
const { ObjectID } = require('mongodb');
const moment = require('moment');
const i18n= require('i18n');


const createEvent = async (req, res, next) => {
    try {
        // const eventdata = { centerId: ObjectID(req.user._id) };
        if (req.user.type == "center") {
            // const checkEvent = await query.findOne(eventColl, eventdata)
            // if (checkEvent) {
            //     const message = `Please Enter different Name of Event`;
            //     let obj = resPattern.errorPattern(httpStatus.ALREADY_REPORTED, message);
            //     return res.status(obj.code).json(obj);
            // } else {
            const event = req.body
            event.workerId = ObjectID(req.body.workerId)
            event.centerId = ObjectID(req.user._id)
            const insertdata = await query.insert(eventColl, event)
            let data = insertdata.ops
            let obj = resPattern.successPattern(httpStatus.OK, data, 'success');
            return res.status(obj.code).json(obj);
            // }
        }
        else {
            const message = i18n.__({ phrase: ("userProtect"), locale: `${req.query.lang}` })
            let obj = resPattern.errorPattern(httpStatus.UNAUTHORIZED, message);
            return res.status(obj.code).json(obj);
        }
    } catch (e) {
        return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
    }
}

const updateEvent = async (req, res, next) => {
    try {
        const { eventId } = req.body
        const eventdata = { _id: ObjectID(eventId) };
        const setData = req.body;
        delete setData['eventId'];
        const checkEvent = await query.findOne(eventColl, eventdata)
        if (checkEvent) {
            const eventData = await query.findOneAndUpdate(eventColl,
                { _id: ObjectID(eventId) },
                { $set: setData },
                { returnOriginal: false }
            )
            let obj = resPattern.successPattern(httpStatus.OK, eventData.value, 'success');
            return res.status(obj.code).json(obj);
        } else {
            const message = i18n.__({ phrase: ("eventNotFound"), locale: `${req.query.lang}` })
            let obj = resPattern.errorPattern(httpStatus.NOT_FOUND, message);
            return res.status(obj.code).json(obj);
        }
    } catch (e) {
        return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
    }
}

const deleteEvent = async (req, res, next) => {
    try {
        const eventdata = { eventType: req.body.eventType };

        const checkEvent = await query.findOne(eventColl, eventdata)
        if (checkEvent) {
            await query.deleteOne(eventColl, eventdata)
            let obj = resPattern.successPattern(httpStatus.OK, "Event Deleted !", 'success');
            return res.status(obj.code).json(obj);
        } else {
            const message = i18n.__({ phrase: ("eventNotFound"), locale: `${req.query.lang}` })
            let obj = resPattern.errorPattern(httpStatus.NOT_FOUND, message);
            return res.status(obj.code).json(obj);
        }
    } catch (e) {
        return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
    }
}

const findallEvent = async (req, res, next) => {
    try {
        const findallEvents = await query.find(eventColl, { centerId: ObjectID(req.user._id) }, { createdAt: -1 })
        const obj = resPattern.successPattern(httpStatus.OK, findallEvents, `success`);
        return res.status(obj.code).json(obj);
    } catch (e) {
        return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
    }
}

const getEventDetail = async (req, res, next) => {
    try {
        const getEventDetails = await query.findOne(eventColl, { centerId: ObjectID(req.user._id), _id: ObjectID(req.body.eventId) }, { createdAt: -1 })
        const obj = resPattern.successPattern(httpStatus.OK, getEventDetails, `success`);
        return res.status(obj.code).json({
            ...obj
        });
    } catch (e) {
        return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
    }
}

const eventFilter = async (req, res, next) => {

    try {
        let pageNo = parseInt(req.query.pageNo);
        let limit = parseInt(req.query.limit)
        let condition = {};

        if (req.body.startTime) {
            condition.startTime = {
                $eq: req.body.startTime
            }
        }
        if (req.body.centerId) {
            condition['centerId'] = ObjectID(req.body.centerId)
        }
        else {
            condition.centerId = ObjectID(req.user._id)
        }
        if (req.body.workerId) {
            condition['workerId'] = ObjectID(req.body.workerId)
        }
        if (req.body.eventType) {
            condition.eventType = req.body.eventType
        }
        let eventData = await query.findWithLimit(eventColl, condition, {}, { _id: -1 }, {}, pageNo, limit);
        if (req.body.startDate && req.body.endDate) {
            let arr = []
            if (eventData.length > 0) {
                for (let i = 0; i < eventData.length; i++) {

                    let stDate = moment(eventData[i].startDate, "DD-MM-YYYY").format("YYYY-MM-DD")
                    let reqStDate = moment(req.body.startDate, "DD-MM-YYYY").format("YYYY-MM-DD")
                    // let enDate = moment(eventData[i].endDate, "DD-MM-YYYY").format("YYYY-MM-DD")
                    let reqEnDate = moment(req.body.endDate, "DD-MM-YYYY").format("YYYY-MM-DD")

                    if (reqStDate <= stDate && reqEnDate >= stDate) {
                        arr.push(eventData[i])
                    }
                }
            }
            eventData = arr;
        }
        const obj = resPattern.successPattern(httpStatus.OK, eventData, `success`);
        return res.status(obj.code).json({
            ...obj
        });
    } catch (e) {
        return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
    }
}


module.exports = {
    createEvent,
    updateEvent,
    deleteEvent,
    getEventDetail,
    findallEvent,
    eventFilter
}