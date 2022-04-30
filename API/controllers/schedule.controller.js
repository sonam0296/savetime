const APIError = require('../helpers/APIError');
const resPattern = require('../helpers/resPattern');
const { daysBetweenDates } = require('../helpers/commonfile');
const httpStatus = require('http-status');
const db = require('../server')
const userColl = db.collection('user');
const scheduleColl = db.collection('schedule')
const appointmentColl = db.collection('appointment')
const centerColl = db.collection('center')
const query = require('../query/query')
const { ObjectID } = require('mongodb').ObjectID;
const moment = require('moment');
const currentDate = moment().format("YYYY-MM-DDThh:mm:ss")
const i18n = require('i18n');


const createTimeTable = async (req, res, next) => {
    try {
        const { _id, type } = req.user
        if (type === "center") {
            const centerData = await query.findOne(userColl, { _id: _id });
            if (centerData) {
                const timeTableData = await query.findOne(scheduleColl, {
                    $and: [
                        { centerId: _id },
                    ]
                });
                if (timeTableData) {
                    const message = i18n.__({ phrase: ("timetableAlreadyCreated"), locale: `${req.query.lang}` })
                    let obj = resPattern.errorPattern(httpStatus.ALREADY_REPORTED, message);
                    return res.status(obj.code).json(obj);
                } else {
                    let customArr = []
                    req.body.centerId = _id;
                    req.body.isDeleted = false;
                    req.body.createdDate_Time = currentDate;
                    if (req.body.customDate) {
                        if (req.body.customDate.length > 0) {

                            for (let a = 0; a < req.body.customDate.length; a++) {
                                let dateArr = daysBetweenDates(req.body.customDate[a].startDate, req.body.customDate[a].endDate);
                                for (let b = 0; b < dateArr.length; b++) {
                                    let objs = {}
                                    objs.Date = dateArr[b]
                                    objs.time = req.body.customDate[a].time
                                    customArr.push(objs)
                                }
                                req.body.customSchedule = customArr
                            }
                        }
                    }
                    if (req.body.customDate == undefined) {
                        req.body.customSchedule = [];
                        req.body.customDate = []
                    }
                    if (req.body.defaultSchedule == undefined) {
                        req.body.defaultSchedule = []
                    }
                    const timeTableCreate = await query.insert(scheduleColl, req.body)
                    let obj = resPattern.successPattern(httpStatus.OK, timeTableCreate.ops, 'success');
                    return res.status(obj.code).json(obj);
                }
            } else {
                const message = i18n.__({ phrase: ("centerNotFound"), locale: `${req.query.lang}` })
                let obj = resPattern.errorPattern(httpStatus.NOT_FOUND, message);
                return res.status(obj.code).json(obj);
            }
        } else {
            const message = i18n.__({ phrase: ("accessProtect"), locale: `${req.query.lang}` })
            let obj = resPattern.errorPattern(httpStatus.UNAUTHORIZED, message);
            return res.status(obj.code).json(obj);
        }
    } catch (e) {
        return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
    }
}

const updateTimeTable = async (req, res, next) => {
    try {
        const { _id, type } = req.user
        if (type === "center") {
            const centerData = await query.findOne(userColl, { _id: _id });
            if (centerData) {
                const timeTableData = await query.findOne(scheduleColl, { centerId: _id });
                if (timeTableData) {

                    let customArr = []

                    if (req.body.customDate) {
                        if (req.body.customDate.length > 0) {
                            for (let a = 0; a < req.body.customDate.length; a++) {
                                let dateArr = daysBetweenDates(req.body.customDate[a].startDate, req.body.customDate[a].endDate);

                                // if (timeTableData.customSchedule.length > 0) {
                                //     for (let b = 0; b < dateArr.length; b++) {
                                //         let obj = {}
                                //         obj.Date = dateArr[b]
                                //         obj.time = req.body.customDate[a].time
                                //         timeTableData.customSchedule.push(obj)
                                //     }
                                // }

                                // else {
                                for (let b = 0; b < dateArr.length; b++) {
                                    let objs = {}
                                    objs.Date = dateArr[b]
                                    objs.time = req.body.customDate[a].time
                                    customArr.push(objs)
                                }
                                req.body.customSchedule = customArr
                            }
                            // timeTableData.customDate.push(req.body.customDate[a])
                        }
                    }
                    // }
                    // }
                    // if (req.body.defaultSchedule) {
                    //     req.body.defaultSchedule = req.body.defaultSchedule
                    // }
                    const updatedData = await query.findOneAndUpdate(scheduleColl, { centerId: _id }, { $set: req.body }, { returnOriginal: false }, { centerId: -1 })
                    let obj = resPattern.successPattern(httpStatus.OK, updatedData.value, 'success');
                    return res.status(obj.code).json(obj);
                }
                else {
                    const message = i18n.__({ phrase: ("centerNotFound"), locale: `${req.query.lang}` })
                    let obj = resPattern.errorPattern(httpStatus.NOT_FOUND, message);
                    return res.status(obj.code).json(obj);
                }
            }
        } else {
            const message = i18n.__({ phrase: ("accessProtect"), locale: `${req.query.lang}` })
            let obj = resPattern.errorPattern(httpStatus.UNAUTHORIZED, message);
            return res.status(obj.code).json(obj);
        }
    }
    catch (e) {
        return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
    }
}

const deleteTimeTable = async (req, res, next) => {
    try {
        const { _id, type } = req.user
        if (type === "center") {
            let types = req.body.type
            const centerData = await query.findOne(userColl, { _id: _id });
            if (centerData) {
                const timeTableData = await query.findOne(scheduleColl, { centerId: _id });
                if (timeTableData) {
                    if (timeTableData.customSchedule !== undefined && types === "customSchedule") {
                        const updatedData = await query.findOneAndUpdate(scheduleColl, { centerId: _id }, { $unset: { customSchedule: 1 } }, { returnOriginal: false })
                        let obj = resPattern.successPattern(httpStatus.OK, updatedData.value, 'success');
                        return res.status(obj.code).json(obj);
                    }
                    if (types === undefined) {
                        await query.deleteOne(scheduleColl,
                            { centerId: _id },
                            { returnOriginal: false })
                        let obj = resPattern.successPattern(httpStatus.OK, "TimeTable Deleted !", 'success');
                        return res.status(obj.code).json(obj);
                    }
                } else {
                    const message = i18n.__({ phrase: ("timetableNotFound"), locale: `${req.query.lang}` })
                    let obj = resPattern.errorPattern(httpStatus.NOT_FOUND, message);
                    return res.status(obj.code).json(obj);
                }
            } else {
                const message = i18n.__({ phrase: ("centerNotFound"), locale: `${req.query.lang}` })
                let obj = resPattern.errorPattern(httpStatus.NOT_FOUND, message);
                return res.status(obj.code).json(obj);
            }
        } else {
            const message = i18n.__({ phrase: ("accessProtect"), locale: `${req.query.lang}` })
            let obj = resPattern.errorPattern(httpStatus.UNAUTHORIZED, message);
            return res.status(obj.code).json(obj);
        }
    }
    catch (e) {
        return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
    }
}

const getTimeTable = async (req, res, next) => {
    try {
        const centerData = await query.findOne(userColl, { _id: ObjectID(req.params.centerId) });
        if (centerData) {
            const timeTableData = await query.findOne(scheduleColl, {
                $and: [
                    { centerId: ObjectID(req.params.centerId) },
                ]
            });
            if (timeTableData) {
                timeTableData.createdDate_Time = undefined
                timeTableData.createdAt = undefined
                timeTableData._id = undefined
                let obj = resPattern.successPattern(httpStatus.OK, timeTableData, 'success');
                return res.status(obj.code).json(obj);
            } else {
                const message = i18n.__({ phrase: ("timetableNotFound"), locale: `${req.query.lang}` })
                let obj = resPattern.errorPattern(httpStatus.NOT_FOUND, message);
                return res.status(obj.code).json(obj);
            }
        } else {
            const message = i18n.__({ phrase: ("centerNotFound"), locale: `${req.query.lang}` })
            let obj = resPattern.errorPattern(httpStatus.NOT_FOUND, message);
            return res.status(obj.code).json(obj);
        }
    } catch (e) {
        return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
    }
}

const getCenterFromDate = async (req, res, next) => {
    try {
        let array = []
        let days = moment(req.body.Date, "DD-MM-YYYY").isoWeekday();
        let finalQuery = [
            {
                $lookup: {
                    from: "user",
                    let: { center: "$centerId" },
                    pipeline: [
                        {
                            $match:
                            {
                                $expr:
                                {
                                    $and:
                                        [
                                            { $eq: ["$_id", "$$center"] }
                                        ]
                                }
                            }
                        },
                        {
                            $project: { name: 1, emailAddress: 1, phonenumber: 1, image: 1 }
                        },
                    ],
                    as: "centerData"
                },
            }
        ]
        let data = await query.aggregate(scheduleColl, finalQuery)
        let timeTableData = []
        await data.forEach((doc) => timeTableData.push(doc))
        if (timeTableData.length > 0) {
            for (let a = 0; a < timeTableData.length; a++) {
                if (timeTableData[a].customSchedule) {
                    if (timeTableData[a].customSchedule.length > 0) {
                        let length = timeTableData[a].customSchedule.length;
                        for (let d = 0; d < length; d++) {
                            if (timeTableData[a].customSchedule[d].Date == req.body.Date) {
                                if (req.body.Time) {
                                    if (timeTableData[a].customSchedule[d].time.length > 0) {
                                        let time = timeTableData[a].customSchedule[d].time.length

                                        for (let t = 0; t < time; t++) {
                                            if (timeTableData[a].customSchedule[d].time[t].startTime <= req.body.Time && timeTableData[a].customSchedule[d].time[t].endTime >= req.body.Time) {
                                                array.push(timeTableData[a])
                                            }
                                        }
                                    }
                                }
                                else {
                                    array.push(timeTableData[a])
                                }
                            }
                        }
                    }
                }
                if (timeTableData[a].defaultSchedule) {
                    if (timeTableData[a].defaultSchedule.length > 0) {
                        let length = timeTableData[a].defaultSchedule.length;
                        for (let d = 0; d < length; d++) {
                            let defaultScheduleDay

                            if (timeTableData[a].defaultSchedule[d].Days == 'Monday') {
                                defaultScheduleDay = 1
                            }
                            if (timeTableData[a].defaultSchedule[d].Days == 'Tuesday') {
                                defaultScheduleDay = 2
                            }
                            if (timeTableData[a].defaultSchedule[d].Days == 'Wednesday') {
                                defaultScheduleDay = 3
                            }
                            if (timeTableData[a].defaultSchedule[d].Days == 'Thursday') {
                                defaultScheduleDay = 4
                            }
                            if (timeTableData[a].defaultSchedule[d].Days == 'Friday') {
                                defaultScheduleDay = 5
                            }
                            if (timeTableData[a].defaultSchedule[d].Days == 'Saturday') {
                                defaultScheduleDay = 6
                            }
                            if (timeTableData[a].defaultSchedule[d].Days == 'Sunday') {
                                defaultScheduleDay = 7
                            }
                            if (defaultScheduleDay == days) {
                                if (req.body.Time) {
                                    if (timeTableData[a].defaultSchedule[d].time.length > 0) {
                                        let time = timeTableData[a].defaultSchedule[d].time.length

                                        for (let t = 0; t < time; t++) {
                                            if (timeTableData[a].defaultSchedule[d].time[t].startTime <= req.body.Time && timeTableData[a].defaultSchedule[d].time[t].endTime >= req.body.Time) {
                                                array.push(timeTableData[a])
                                            }
                                        }
                                    }
                                }
                                else {
                                    array.push(timeTableData[a])
                                }
                            }
                        }
                    }
                }
            }
        }
        let ids = array.map(o => o.centerId)
        let filtered = array.filter(({ centerId }, index) => !ids.includes(centerId, index + 1))
        let obj = resPattern.successPattern(httpStatus.OK, filtered, 'success');
        return res.status(obj.code).json(obj);
    } catch (e) {
        return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
    }
}

module.exports = {
    getTimeTable,
    createTimeTable,
    updateTimeTable,
    deleteTimeTable,
    getCenterFromDate
}