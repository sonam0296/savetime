const APIError = require('../helpers/APIError');
const resPattern = require('../helpers/resPattern');
const httpStatus = require('http-status');
const db = require('../server')
const userColl = db.collection('user');
const scheduleColl = db.collection('schedule')
const workerColl = db.collection('worker')
const serviceColl = db.collection('service');
const appointmentColl = db.collection('appointment')
const centerColl = db.collection('center')
const query = require('../query/query')
const { ObjectID } = require('mongodb').ObjectID;
const moment = require('moment');
const currentDate = moment().utc().format("YYYY-MM-DDThh:mm:ss[Z]");
const { sendEmail, mailTemp, sendSMSNotification } = require('../helpers/commonfile');
const momentTimeZone = require('moment-timezone');
const ejs = require("ejs");
const i18n = require('i18n');
const workerHistoryColl = db.collection('workerHistory');


const checkSlotAvailability = async (req, res, next) => {
    try {
        let insertedData = []
        // req.body.map(async (user, key) => {
        for (let key = 0; key < req.body.length; key++) {

            const result = await query.findOne(userColl, { _id: ObjectID(req.body[key].centerId) });
            // console.log("result", result)
            if (result === null) {
                const message = i18n.__({ phrase: ("centerNotFound"), locale: `${req.query.lang}` })
                let obj = resPattern.errorPattern(httpStatus.NOT_FOUND, message);
                return res.status(obj.code).json(obj);
            }
            if (result.type === "center") {
                const serviceDetails = await query.findOne(serviceColl, { _id: ObjectID(req.body[key].serviceId) });
                const startFullDate = moment(`${req.body[key].Date} ${req.body[key].startTime}`, 'DD-MM-YYYY HH:mm').format('DD-MM-YYYY HH:mm');
                const endTimeDate = moment(startFullDate, 'DD-MM-YYYY HH:mm').add(serviceDetails.duration, 'minutes').format('DD-MM-YYYY HH:mm');
                let endTime = moment(endTimeDate, 'DD-MM-YYYY HH:mm').format('HH:mm');
                let endDate = moment(endTimeDate, 'DD-MM-YYYY HH:mm').format("DD-MM-YYYY");
                // const addAppointment = async() => {

                const scheduleData = await query.findOne(scheduleColl, { centerId: ObjectID(req.body[key].centerId) });
                if (scheduleData) {

                    // if customSchedule is available
                    let checkDefault = false;
                    if (scheduleData.customSchedule.length > 0) {
                        let length = scheduleData.customSchedule.length;
                        for (let d = 0; d < length; d++) {
                            if (scheduleData.customSchedule[d].Date === req.body[key].Date) {
                                checkDefault = true

                                if (scheduleData.customSchedule[d].time.length > 0) {
                                    let time = scheduleData.customSchedule[d].time.length
                                    let found = false
                                    for (let t = 0; t < time; t++) {
                                        const customScheduleStartTime = moment(`${scheduleData.customSchedule[d].Date} ${scheduleData.customSchedule[d].time[t].startTime}`, 'DD-MM-YYYY HH:mm').format('YYYY-MM-DD HH:mm');
                                        const customScheduleReqStartTime = moment(`${req.body[key].Date} ${req.body[key].startTime}`, 'DD-MM-YYYY HH:mm').format('YYYY-MM-DD HH:mm');
                                        const customScheduleEndTime = moment(`${scheduleData.customSchedule[d].Date} ${scheduleData.customSchedule[d].time[t].endTime}`, 'DD-MM-YYYY HH:mm').format('YYYY-MM-DD HH:mm');
                                        const customScheduleReqEndTime = moment(`${endDate} ${endTime}`, 'DD-MM-YYYY HH:mm').format('YYYY-MM-DD HH:mm');
                                        if (customScheduleStartTime <= customScheduleReqStartTime && customScheduleEndTime >= customScheduleReqEndTime) {
                                            found = true;
                                            // addAppointment()
                                            const checkAppointment = await query.find(appointmentColl, { Date: req.body[key].Date, centerId: ObjectID(req.body[key].centerId), worker: ObjectID(req.body[key].workerId) });
                                            let flag = false;

                                            // if Appointment collection not empty
                                            if (checkAppointment.length > 0) {
                                                for (let a = 0; a < checkAppointment.length; a++) {
                                                    const appointmentStartTime = moment(`${checkAppointment[a].Date} ${checkAppointment[a].startTime}`, 'DD-MM-YYYY HH:mm').format('YYYY-MM-DD HH:mm');
                                                    const appointmentReqStartTime = moment(`${req.body[key].Date} ${req.body[key].startTime}`, 'DD-MM-YYYY HH:mm').format('YYYY-MM-DD HH:mm');
                                                    const appointmentEndTime = moment(`${checkAppointment[a].Date} ${checkAppointment[a].endTime}`, 'DD-MM-YYYY HH:mm').format('YYYY-MM-DD HH:mm');
                                                    const appointmentReqEndTime = moment(`${endDate} ${endTime}`, 'DD-MM-YYYY HH:mm').format('YYYY-MM-DD HH:mm');
                                                    // check time with Appointment Time
                                                    if (appointmentStartTime === appointmentReqStartTime && appointmentEndTime === appointmentReqEndTime && checkAppointment[a].status !== "cancel") {
                                                        flag = true;
                                                        if (flag) {
                                                            const message = i18n.__({ phrase: ("slotAlreadyBook"), locale: `${req.query.lang}` }, req.body[key].Date, req.body[key].startTime)
                                                            let obj = resPattern.errorPattern(httpStatus.ALREADY_REPORTED, message);
                                                            return res.status(obj.code).json(obj);
                                                        }
                                                    }
                                                }
                                                if (!flag) {
                                                    const centerDetails = await query.findOne(userColl, { _id: ObjectID(req.body[key].centerId) });
                                                    if (centerDetails) {
                                                        let data = req.body[key]
                                                        data.serviceId = ObjectID(data.serviceId)
                                                        data.centerId = ObjectID(data.centerId)
                                                        data.compneyId = result.compneyId ? ObjectID(result.compneyId) : ""
                                                        data.userId = data.userId !== undefined ? ObjectID(data.userId) : req.user._id
                                                        data.appointmentBy = data.appointmentBy !== undefined ? data.appointmentBy : "app"
                                                        data.price = serviceDetails.price
                                                        data.worker = data.workerId !== undefined ? ObjectID(data.workerId) : serviceDetails.workerId
                                                        data.status = "accepted"
                                                        data.isDeleted = false
                                                        data.endTime = endTime
                                                        data.createdAt = currentDate
                                                        const allAppointment = await query.findWithLimit(appointmentColl, {}, {}, { _id: -1 }, {}, 1, 1)
                                                        data.uniqueId = `${parseInt(allAppointment[0].uniqueId) + 1}`
                                                        const workerHistory = {}
                                                        const timeZone = result.timezone.split(" ")
                                                        const centerTimeZone = momentTimeZone.tz(moment(), timeZone[0])
                                                        let current = moment(centerTimeZone).format("DD-MM-YYYY HH:mm")
                                                        workerHistory.workerId = ObjectID(data.workerId)
                                                        workerHistory.actionDate = current
                                                        workerHistory.action = "Appointment booking"
                                                        await query.insert(workerHistoryColl, workerHistory);
                                                        delete data.workerId

                                                        insertedData.push(data)
                                                        const toEmail = req.body[key].emailAddress;
                                                        const title = `New appointment`;
                                                        let language = 'es'
                                                        if (req.query.lang) {
                                                            language = req.query.lang
                                                        }
                                                        const emailBody = await ejs.renderFile(process.cwd() + `/public/views/${language}/bookAppointment.ejs`, {
                                                            name: req.body[key].name,
                                                            Date: req.body[key].Date,
                                                            Hours: req.body[key].startTime,
                                                        })

                                                        await sendEmail(toEmail, title, emailBody);
                                                        if (req.body.length == key + 1) {
                                                            const createAppointment = await query.insertMany(appointmentColl, insertedData);
                                                            let status = 'Appointment Successfully Booked !';
                                                            const obj = resPattern.successPattern(httpStatus.OK, createAppointment.ops, status);
                                                            return res.status(obj.code).json(obj)
                                                        }
                                                    }
                                                    else {
                                                        const message = i18n.__({ phrase: ("centerNotFound"), locale: `${req.query.lang}` })
                                                        let obj = resPattern.errorPattern(httpStatus.NOT_FOUND, message);
                                                        return res.status(obj.code).json(obj);
                                                    }
                                                }
                                            } else {
                                                // if Appointment collection empty
                                                const centerDetails = await query.findOne(userColl, { _id: ObjectID(req.body[key].centerId) });
                                                // console.log("serviceDetails", serviceDetails);
                                                if (centerDetails) {
                                                    let data = req.body[key]
                                                    data.serviceId = ObjectID(data.serviceId)
                                                    data.centerId = ObjectID(data.centerId)
                                                    data.compneyId = result.compneyId ? ObjectID(result.compneyId) : ""
                                                    data.userId = data.userId !== undefined ? ObjectID(data.userId) : req.user._id
                                                    data.appointmentBy = data.appointmentBy !== undefined ? data.appointmentBy : "app"
                                                    data.price = serviceDetails.price
                                                    data.worker = data.workerId !== undefined ? ObjectID(data.workerId) : serviceDetails.workerId
                                                    data.endTime = endTime
                                                    data.isDeleted = false
                                                    data.status = "accepted"
                                                    data.createdAt = currentDate
                                                    const allAppointment = await query.findWithLimit(appointmentColl, {}, {}, { _id: -1 }, {}, 1, 1)
                                                    data.uniqueId = `${parseInt(allAppointment[0].uniqueId) + 1}`
                                                    const workerHistory = {}
                                                    const timeZone = result.timezone.split(" ")
                                                    const centerTimeZone = momentTimeZone.tz(moment(), timeZone[0])
                                                    let current = moment(centerTimeZone).format("DD-MM-YYYY HH:mm")
                                                    workerHistory.workerId = ObjectID(data.workerId)
                                                    workerHistory.actionDate = current
                                                    workerHistory.action = "Appointment booking"
                                                    await query.insert(workerHistoryColl, workerHistory);
                                                    delete data.workerId

                                                    insertedData.push(data)
                                                    const toEmail = req.body[key].emailAddress;
                                                    const title = `New appointment`;
                                                    let language = 'es'
                                                    if (req.query.lang) {
                                                        language = req.query.lang
                                                    }
                                                    const emailBody = await ejs.renderFile(process.cwd() + `/public/views/${language}/bookAppointment.ejs`, {
                                                        name: req.body[key].name,
                                                        Date: req.body[key].Date,
                                                        Hours: req.body[key].startTime,
                                                    })

                                                    await sendEmail(toEmail, title, emailBody);
                                                    if (req.body.length == key + 1) {
                                                        const createAppointment = await query.insertMany(appointmentColl, insertedData);
                                                        let status = 'Appointment Successfully Booked !';

                                                        const obj = resPattern.successPattern(httpStatus.OK, createAppointment.ops, status);
                                                        return res.status(obj.code).json(obj)
                                                    }
                                                }
                                                else {
                                                    const message = i18n.__({ phrase: ("centerNotFound"), locale: `${req.query.lang}` })
                                                    let obj = resPattern.errorPattern(httpStatus.NOT_FOUND, message);
                                                    return res.status(obj.code).json(obj);
                                                }
                                            }
                                        }
                                    }
                                    if (!found) {
                                        const message = i18n.__({ phrase: ("slotNoFound"), locale: `${req.query.lang}` }, req.body[key].Date, req.body[key].startTime)
                                        let obj = resPattern.errorPattern(httpStatus.NOT_FOUND, message);
                                        return res.status(obj.code).json(obj);
                                    }
                                }
                            }
                        }
                    }

                    // checking inside DefaultSchedule
                    if (!checkDefault) {
                        const date = moment(moment(req.body[key].Date, 'DD-MM-YYYY')).format('dddd') // Thursday Feb 2015
                        // console.log(date);
                        if (scheduleData.defaultSchedule.length > 0) {
                            for (let i = 0; i < scheduleData.defaultSchedule.length; i++) {
                                // console.log("scheduleData.defaultSchedule[i].Days", scheduleData.defaultSchedule[i].Days);
                                if (scheduleData.defaultSchedule[i].Days === date) {
                                    let checkTimeSlot = scheduleData.defaultSchedule[i].time
                                    if (checkTimeSlot.length === 0) {
                                        const message = i18n.__({ phrase: ("slotNoAvailable"), locale: `${req.query.lang}` }, req.body[key].Date, req.body[key].startTime)
                                        let obj = resPattern.errorPattern(httpStatus.NOT_FOUND, message);
                                        return res.status(obj.code).json(obj);
                                    } else {
                                        let found = false
                                        for (let t = 0; t < checkTimeSlot.length; t++) {
                                            const defaultScheduleStartTime = moment(`${req.body[key].Date} ${checkTimeSlot[t].startTime}`, 'DD-MM-YYYY HH:mm').format('YYYY-MM-DD HH:mm');
                                            const defaultScheduleReqStartTime = moment(`${req.body[key].Date} ${req.body[key].startTime}`, 'DD-MM-YYYY HH:mm').format('YYYY-MM-DD HH:mm');
                                            const defaultScheduleEndTime = moment(`${req.body[key].Date} ${checkTimeSlot[t].endTime}`, 'DD-MM-YYYY HH:mm').format('YYYY-MM-DD HH:mm');
                                            const defaultScheduleReqEndTime = moment(`${endDate} ${endTime}`, 'DD-MM-YYYY HH:mm').format('YYYY-MM-DD HH:mm');
                                            if (defaultScheduleStartTime <= defaultScheduleReqStartTime && defaultScheduleEndTime >= defaultScheduleReqEndTime) {
                                                found = true;
                                                // addAppointment()
                                                const checkAppointment = await query.find(appointmentColl, { Date: req.body[key].Date, centerId: ObjectID(req.body[key].centerId), worker: ObjectID(req.body[key].workerId) });
                                                let flag = false;

                                                // if Appointment collection not empty
                                                if (checkAppointment.length > 0) {
                                                    for (let a = 0; a < checkAppointment.length; a++) {
                                                        const appointmentStartTime = moment(`${checkAppointment[a].Date} ${checkAppointment[a].startTime}`, 'DD-MM-YYYY HH:mm').format('YYYY-MM-DD HH:mm');
                                                        const appointmentReqStartTime = moment(`${req.body[key].Date} ${req.body[key].startTime}`, 'DD-MM-YYYY HH:mm').format('YYYY-MM-DD HH:mm');
                                                        const appointmentEndTime = moment(`${checkAppointment[a].Date} ${checkAppointment[a].endTime}`, 'DD-MM-YYYY HH:mm').format('YYYY-MM-DD HH:mm');
                                                        const appointmentReqEndTime = moment(`${endDate} ${endTime}`, 'DD-MM-YYYY HH:mm').format('YYYY-MM-DD HH:mm');
                                                        // check time with Appointment Time
                                                        if (appointmentStartTime === appointmentReqStartTime && appointmentEndTime === appointmentReqEndTime && checkAppointment[a].status !== "cancel") {
                                                            flag = true;
                                                            if (flag) {
                                                                const message = i18n.__({ phrase: ("slotAlreadyBook"), locale: `${req.query.lang}` }, req.body[key].Date, req.body[key].startTime)
                                                                let obj = resPattern.errorPattern(httpStatus.ALREADY_REPORTED, message);
                                                                return res.status(obj.code).json(obj);
                                                            }
                                                        }
                                                    }
                                                    if (!flag) {
                                                        const centerDetails = await query.findOne(userColl, { _id: ObjectID(req.body[key].centerId) });
                                                        if (centerDetails) {
                                                            let data = req.body[key]
                                                            data.serviceId = ObjectID(data.serviceId)
                                                            data.centerId = ObjectID(data.centerId)
                                                            data.compneyId = result.compneyId ? ObjectID(result.compneyId) : ""
                                                            data.userId = data.userId !== undefined ? ObjectID(data.userId) : req.user._id
                                                            data.appointmentBy = data.appointmentBy !== undefined ? data.appointmentBy : "app"
                                                            data.price = serviceDetails.price
                                                            data.worker = data.workerId !== undefined ? ObjectID(data.workerId) : serviceDetails.workerId
                                                            data.status = "accepted"
                                                            data.isDeleted = false
                                                            data.endTime = endTime
                                                            data.createdAt = currentDate
                                                            const allAppointment = await query.findWithLimit(appointmentColl, {}, {}, { _id: -1 }, {}, 1, 1)
                                                            data.uniqueId = `${parseInt(allAppointment[0].uniqueId) + 1}`
                                                            const workerHistory = {}
                                                            const timeZone = result.timezone.split(" ")
                                                            const centerTimeZone = momentTimeZone.tz(moment(), timeZone[0])
                                                            let current = moment(centerTimeZone).format("DD-MM-YYYY HH:mm")
                                                            workerHistory.workerId = ObjectID(data.workerId)
                                                            workerHistory.actionDate = current
                                                            workerHistory.action = "Appointment booking"
                                                            await query.insert(workerHistoryColl, workerHistory);
                                                            delete data.workerId

                                                            insertedData.push(data)
                                                            const toEmail = req.body[key].emailAddress;
                                                            const title = `New appointment`;
                                                            let language = 'es'
                                                            if (req.query.lang) {
                                                                language = req.query.lang
                                                            }
                                                            const emailBody = await ejs.renderFile(process.cwd() + `/public/views/${language}/bookAppointment.ejs`, {
                                                                name: req.body[key].name,
                                                                Date: req.body[key].Date,
                                                                Hours: req.body[key].startTime,
                                                            })

                                                            await sendEmail(toEmail, title, emailBody);
                                                            if (req.body.length == key + 1) {
                                                                const createAppointment = await query.insertMany(appointmentColl, insertedData);
                                                                let status = 'Appointment Successfully Booked !';
                                                                const obj = resPattern.successPattern(httpStatus.OK, createAppointment.ops, status);
                                                                return res.status(obj.code).json(obj)
                                                            }
                                                        }
                                                        else {
                                                            const message = i18n.__({ phrase: ("centerNotFound"), locale: `${req.query.lang}` })
                                                            let obj = resPattern.errorPattern(httpStatus.NOT_FOUND, message);
                                                            return res.status(obj.code).json(obj);
                                                        }
                                                    }
                                                } else {
                                                    // if Appointment collection empty
                                                    const centerDetails = await query.findOne(userColl, { _id: ObjectID(req.body[key].centerId) });
                                                    // console.log("serviceDetails", serviceDetails);
                                                    if (centerDetails) {
                                                        let data = req.body[key]
                                                        data.serviceId = ObjectID(data.serviceId)
                                                        data.centerId = ObjectID(data.centerId)
                                                        data.compneyId = result.compneyId ? ObjectID(result.compneyId) : ""
                                                        data.userId = data.userId !== undefined ? ObjectID(data.userId) : req.user._id
                                                        data.appointmentBy = data.appointmentBy !== undefined ? data.appointmentBy : "app"
                                                        data.price = serviceDetails.price
                                                        data.worker = data.workerId !== undefined ? ObjectID(data.workerId) : serviceDetails.workerId
                                                        data.endTime = endTime
                                                        data.status = "accepted"
                                                        data.isDeleted = false
                                                        data.createdAt = currentDate
                                                        const allAppointment = await query.findWithLimit(appointmentColl, {}, {}, { _id: -1 }, {}, 1, 1)
                                                        data.uniqueId = `${parseInt(allAppointment[0].uniqueId) + 1}`
                                                        const workerHistory = {}
                                                        const timeZone = result.timezone.split(" ")
                                                        const centerTimeZone = momentTimeZone.tz(moment(), timeZone[0])
                                                        let current = moment(centerTimeZone).format("DD-MM-YYYY HH:mm")
                                                        workerHistory.workerId = ObjectID(data.workerId)
                                                        workerHistory.actionDate = current
                                                        workerHistory.action = "Appointment booking"
                                                        await query.insert(workerHistoryColl, workerHistory);
                                                        delete data.workerId

                                                        insertedData.push(data)
                                                        const toEmail = req.body[key].emailAddress;
                                                        const title = `New appointment`;
                                                        let language = 'es'
                                                        if (req.query.lang) {
                                                            language = req.query.lang
                                                        }
                                                        const emailBody = await ejs.renderFile(process.cwd() + `/public/views/${language}/bookAppointment.ejs`, {
                                                            name: req.body[key].name,
                                                            Date: req.body[key].Date,
                                                            Hours: req.body[key].startTime,
                                                        })

                                                        await sendEmail(toEmail, title, emailBody);
                                                        if (req.body.length == key + 1) {
                                                            const createAppointment = await query.insertMany(appointmentColl, insertedData);
                                                            let status = 'Appointment Successfully Booked !';

                                                            const obj = resPattern.successPattern(httpStatus.OK, createAppointment.ops, status);
                                                            return res.status(obj.code).json(obj)
                                                        }
                                                    }
                                                    else {
                                                        const message = i18n.__({ phrase: ("centerNotFound"), locale: `${req.query.lang}` })
                                                        let obj = resPattern.errorPattern(httpStatus.NOT_FOUND, message);
                                                        return res.status(obj.code).json(obj);
                                                    }
                                                }
                                            }

                                        }
                                        if (!found) {
                                            const message = i18n.__({ phrase: ("slotNoFound"), locale: `${req.query.lang}` }, req.body[key].Date, req.body[key].startTime)
                                            let obj = resPattern.errorPattern(httpStatus.NOT_FOUND, message);
                                            return res.status(obj.code).json(obj);
                                        }

                                    }
                                }
                            }
                        }
                    }
                }
                if (scheduleData === null) {
                    const message = i18n.__({ phrase: ("centerNotFound"), locale: `${req.query.lang}` })
                    let obj = resPattern.errorPattern(httpStatus.NOT_FOUND, message);
                    return res.status(obj.code).json(obj);
                }
            }
        }
    } catch (e) {
        return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
    }
}

const updateAppointment = async (req, res, next) => {
    try {
        console.log(req.body)
        const { appointmentId } = req.params
        const appointmentdata = { _id: ObjectID(appointmentId) };
        const setData = req.body;
        const checkAppointments = await query.findOne(appointmentColl, appointmentdata)
        if (checkAppointments) {
            setData.serviceId = ObjectID(checkAppointments.serviceId)
            if (req.body.serviceId) {
                setData.serviceId = ObjectID(req.body.serviceId)
            }
            setData.worker = ObjectID(checkAppointments.worker)
            if (req.body.workerId) {
                setData.worker = ObjectID(req.body.workerId)
            }
            if (req.body.Date && req.body.startTime) {
                const serviceDetails = await query.findOne(serviceColl, { _id: ObjectID(setData.serviceId) });
                const startFullDate = moment(`${req.body.Date} ${req.body.startTime}`, 'DD-MM-YYYY HH:mm').format('DD-MM-YYYY HH:mm');
                const endTimeDate = moment(startFullDate, 'DD-MM-YYYY HH:mm').add(serviceDetails.duration, 'minutes').format('DD-MM-YYYY HH:mm');
                let endTime = moment(endTimeDate, 'DD-MM-YYYY HH:mm').format('HH:mm');
                let endDate = moment(endTimeDate, 'DD-MM-YYYY HH:mm').format("DD-MM-YYYY");
                const scheduleData = await query.findOne(scheduleColl, { centerId: ObjectID(checkAppointments.centerId) });
                if (scheduleData) {

                    // if customSchedule is available
                    let checkDefault = false;
                    if (scheduleData.customSchedule.length > 0) {
                        let length = scheduleData.customSchedule.length;
                        for (let d = 0; d < length; d++) {
                            if (scheduleData.customSchedule[d].Date === req.body.Date) {
                                checkDefault = true
                                if (scheduleData.customSchedule[d].time.length > 0) {
                                    let time = scheduleData.customSchedule[d].time.length
                                    let found = false
                                    for (let t = 0; t < time; t++) {
                                        const customScheduleStartTime = moment(`${scheduleData.customSchedule[d].Date} ${scheduleData.customSchedule[d].time[t].startTime}`, 'DD-MM-YYYY HH:mm').format('YYYY-MM-DD HH:mm');
                                        const customScheduleReqStartTime = moment(`${req.body.Date} ${req.body.startTime}`, 'DD-MM-YYYY HH:mm').format('YYYY-MM-DD HH:mm');
                                        const customScheduleEndTime = moment(`${scheduleData.customSchedule[d].Date} ${scheduleData.customSchedule[d].time[t].endTime}`, 'DD-MM-YYYY HH:mm').format('YYYY-MM-DD HH:mm');
                                        const customScheduleReqEndTime = moment(`${endDate} ${endTime}`, 'DD-MM-YYYY HH:mm').format('YYYY-MM-DD HH:mm');
                                        if (customScheduleStartTime <= customScheduleReqStartTime && customScheduleEndTime >= customScheduleReqEndTime) {
                                            found = true;

                                            const checkAppointment = await query.find(appointmentColl, { Date: req.body.Date, centerId: ObjectID(checkAppointments.centerId), worker: ObjectID(setData.worker) });
                                            let flag = false;
                                            // if Appointment collection not empty
                                            if (checkAppointment.length > 0) {
                                                for (let a = 0; a < checkAppointment.length; a++) {
                                                    // check time with Appointment Time

                                                    const appointmentStartTime = moment(`${checkAppointment[a].Date} ${checkAppointment[a].startTime}`, 'DD-MM-YYYY HH:mm').format('YYYY-MM-DD HH:mm');
                                                    const appointmentReqStartTime = moment(`${req.body.Date} ${req.body.startTime}`, 'DD-MM-YYYY HH:mm').format('YYYY-MM-DD HH:mm');
                                                    const appointmentEndTime = moment(`${checkAppointment[a].Date} ${checkAppointment[a].endTime}`, 'DD-MM-YYYY HH:mm').format('YYYY-MM-DD HH:mm');
                                                    const appointmentReqEndTime = moment(`${endDate} ${endTime}`, 'DD-MM-YYYY HH:mm').format('YYYY-MM-DD HH:mm');

                                                    if (appointmentStartTime === appointmentReqStartTime && appointmentEndTime === appointmentReqEndTime) {
                                                        flag = true;
                                                        if (flag) {
                                                            const message = i18n.__({ phrase: ("slotAlreadyBooked"), locale: `${req.query.lang}` })
                                                            const objs = resPattern.errorPattern(httpStatus.NOT_FOUND, message);
                                                            return res.status(objs.code).json(objs)
                                                        }
                                                    }
                                                }
                                                if (!flag) {
                                                    setData.Date = req.body.Date
                                                    setData.startTime = req.body.startTime
                                                    setData.endTime = endTime
                                                }
                                            } else {
                                                setData.Date = req.body.Date
                                                setData.startTime = req.body.startTime
                                                setData.endTime = endTime
                                            }

                                        }
                                    }
                                    if (!found) {
                                        const message = i18n.__({ phrase: ("slotNotFound"), locale: `${req.query.lang}` })
                                        let objs = resPattern.errorPattern(httpStatus.NOT_FOUND, message);
                                        return res.status(objs.code).json(objs);
                                    }
                                }
                            }
                        }
                    }

                    // checking inside DefaultSchedule
                    if (!checkDefault) {
                        const date = moment(moment(req.body.Date, 'DD-MM-YYYY')).format('dddd') // Thursday Feb 2015
                        // console.log(date);
                        if (scheduleData.defaultSchedule.length > 0) {
                            for (let i = 0; i < scheduleData.defaultSchedule.length; i++) {
                                // console.log("scheduleData.defaultSchedule[i].Days", scheduleData.defaultSchedule[i].Days);
                                if (scheduleData.defaultSchedule[i].Days === date) {
                                    let checkTimeSlot = scheduleData.defaultSchedule[i].time
                                    if (checkTimeSlot.length === 0) {
                                        const message = i18n.__({ phrase: ("slotNotAvailable"), locale: `${req.query.lang}` })
                                        let objs = resPattern.errorPattern(httpStatus.NOT_FOUND, message);
                                        return res.status(objs.code).json(objs);
                                    } else {
                                        let found = false
                                        for (let t = 0; t < checkTimeSlot.length; t++) {
                                            const defaultScheduleStartTime = moment(`${req.body.Date} ${checkTimeSlot[t].startTime}`, 'DD-MM-YYYY HH:mm').format('YYYY-MM-DD HH:mm');
                                            const defaultScheduleReqStartTime = moment(`${req.body.Date} ${req.body.startTime}`, 'DD-MM-YYYY HH:mm').format('YYYY-MM-DD HH:mm');
                                            const defaultScheduleEndTime = moment(`${req.body.Date} ${checkTimeSlot[t].endTime}`, 'DD-MM-YYYY HH:mm').format('YYYY-MM-DD HH:mm');
                                            const defaultScheduleReqEndTime = moment(`${endDate} ${endTime}`, 'DD-MM-YYYY HH:mm').format('YYYY-MM-DD HH:mm');
                                            if (defaultScheduleStartTime <= defaultScheduleReqStartTime && defaultScheduleEndTime >= defaultScheduleReqEndTime) {
                                                found = true;

                                                const checkAppointment = await query.find(appointmentColl, { Date: req.body.Date, centerId: ObjectID(checkAppointments.centerId), worker: ObjectID(setData.worker) });
                                                let flag = false;
                                                // if Appointment collection not empty
                                                if (checkAppointment.length > 0) {
                                                    for (let a = 0; a < checkAppointment.length; a++) {
                                                        // check time with Appointment Time
                                                        const appointmentStartTime = moment(`${checkAppointment[a].Date} ${checkAppointment[a].startTime}`, 'DD-MM-YYYY HH:mm').format('YYYY-MM-DD HH:mm');
                                                        const appointmentReqStartTime = moment(`${req.body.Date} ${req.body.startTime}`, 'DD-MM-YYYY HH:mm').format('YYYY-MM-DD HH:mm');
                                                        const appointmentEndTime = moment(`${checkAppointment[a].Date} ${checkAppointment[a].endTime}`, 'DD-MM-YYYY HH:mm').format('YYYY-MM-DD HH:mm');
                                                        const appointmentReqEndTime = moment(`${endDate} ${endTime}`, 'DD-MM-YYYY HH:mm').format('YYYY-MM-DD HH:mm');
                                                        if (appointmentStartTime === appointmentReqStartTime && appointmentEndTime === appointmentReqEndTime) {
                                                            flag = true;
                                                            if (flag) {
                                                                const message = i18n.__({ phrase: ("slotAlreadyBooked"), locale: `${req.query.lang}` })
                                                                const objs = resPattern.errorPattern(httpStatus.NOT_FOUND, message);
                                                                return res.status(objs.code).json(objs)
                                                            }
                                                        }
                                                    }
                                                    if (!flag) {
                                                        setData.Date = req.body.Date
                                                        setData.startTime = req.body.startTime
                                                        setData.endTime = endTime
                                                    }
                                                } else {
                                                    setData.Date = req.body.Date
                                                    setData.startTime = req.body.startTime
                                                    setData.endTime = endTime
                                                }
                                            }

                                        }
                                        if (!found) {
                                            const message = i18n.__({ phrase: ("slotNotFound"), locale: `${req.query.lang}` })
                                            let objs = resPattern.errorPattern(httpStatus.NOT_FOUND, message);
                                            return res.status(objs.code).json(objs);
                                        }
                                    }
                                }
                            }
                        }
                    }
                    const checkCenter = await query.findOne(userColl, { _id: ObjectID(checkAppointments.centerId) })
                    const toEmail = checkAppointments.emailAddress;
                    const title = `They have rescheduled your appointment`;
                    let language = 'es'
                    if (req.query.lang) {
                        language = req.query.lang
                    }
                    const emailBody = await ejs.renderFile(process.cwd() + `/public/views/${language}/reScheduleAppointment.ejs`, {
                        clientName: checkAppointments.name,
                        centerName: checkCenter.name,
                        previousDate: checkAppointments.Date,
                        previoustime: checkAppointments.startTime,
                        nowDate: req.body.Date,
                        nowtime: req.body.startTime,
                        Reason: 'Time Issue'
                    })

                    await sendEmail(toEmail, title, emailBody);
                }
                if (scheduleData === null) {
                    const message = i18n.__({ phrase: ("centerNotFound"), locale: `${req.query.lang}` })
                    let objs = resPattern.errorPattern(httpStatus.NOT_FOUND, message);
                    return res.status(objs.code).json(objs);
                }
            }
            delete setData.workerId
            const appointment = await query.findOneAndUpdate(appointmentColl,
                { _id: ObjectID(appointmentId) },
                { $set: setData },
                { returnOriginal: false }
            )
            let obj = resPattern.successPattern(httpStatus.OK, appointment.value, 'success');
            return res.status(obj.code).json(obj);
        } else {
            const message = i18n.__({ phrase: ("appointmentNotAvailable"), locale: `${req.query.lang}` })
            let obj = resPattern.errorPattern(httpStatus.NOT_FOUND, message);
            return res.status(obj.code).json(obj);
        }
    } catch (e) {
        return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
    }
}

const deleteAppointment = async (req, res, next) => {
    try {
        const checkAppointment = await query.findOne(appointmentColl, { _id: ObjectID(req.params.appointmentId) })
        if (checkAppointment) {
            await query.findOneAndUpdate(appointmentColl,
                { _id: ObjectID(req.params.appointmentId) },
                { $set: { isDeleted: true } },
                { returnOriginal: false })
            const obj = resPattern.successPattern(httpStatus.OK, `Appointment Deleted !`, `success`);
            return res.status(obj.code).json({
                ...obj
            });
        } else {
            const message = i18n.__({ phrase: ("appointmentNotFound"), locale: `${req.query.lang}` })
            let obj = resPattern.errorPattern(httpStatus.NOT_FOUND, message);
            return res.status(obj.code).json(obj);
        }
    } catch (e) {
        return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
    }
}

// cancel By User or center
const cancelAppointment = async (req, res, next) => {
    try {
        const { _id } = req.user
        const checkAppointment = await query.findOne(appointmentColl, { _id: ObjectID(req.body.appointmentId) })
        if (checkAppointment) {
            if (String(checkAppointment.userId) === String(_id) && req.user.type == "client") {
                if (checkAppointment.status === "cancel") {
                    const message = i18n.__({ phrase: ("appointmentAlreadyCanceled"), locale: `${req.query.lang}` })
                    let obj = resPattern.errorPattern(httpStatus.ALREADY_REPORTED, message);
                    return res.status(obj.code).json(obj);
                } else {
                    const checkCenter = await query.findOne(userColl, { _id: ObjectID(checkAppointment.centerId) })

                    const toEmail = checkAppointment.emailAddress;
                    const title = `Appointment cancellation`;
                    let language = 'es'
                    if (req.query.lang) {
                        language = req.query.lang
                    }
                    const emailBody = await ejs.renderFile(process.cwd() + `/public/views/${language}/cancleAppointment.ejs`, {
                        clientName: checkAppointment.name,
                        centerName: checkCenter.name,
                        Date: checkAppointment.Date,
                        time: checkAppointment.startTime,
                        Reason: 'Time Issue'
                    })

                    await sendEmail(toEmail, title, emailBody);
                    const appointmentList = await query.findOneAndUpdate(appointmentColl,
                        { _id: ObjectID(req.body.appointmentId) },
                        { $set: { status: "cancel", cancel_at: currentDate, cancleBy: "Client" }, $unset: { statusUpdated_at: 1 } },
                        { returnOriginal: false })
                    const obj = resPattern.successPattern(httpStatus.OK, appointmentList.value, `success`);
                    return res.status(obj.code).json({
                        ...obj
                    });
                }
            } else {
                if (checkAppointment.status === "cancel") {
                    const message = i18n.__({ phrase: ("appointmentAlreadyCanceled"), locale: `${req.query.lang}` })
                    let obj = resPattern.errorPattern(httpStatus.ALREADY_REPORTED, message);
                    return res.status(obj.code).json(obj);
                } else {
                    if (req.body.isMailSend == true) {
                        const checkCenter = await query.findOne(userColl, { _id: ObjectID(checkAppointment.centerId) })

                        const toEmail = checkAppointment.emailAddress;
                        const title = `Appointment cancellation`;
                        let language = 'es'
                        if (req.query.lang) {
                            language = req.query.lang
                        }
                        const emailBody = await ejs.renderFile(process.cwd() + `/public/views/${language}/cancleAppointment.ejs`, {
                            clientName: checkAppointment.name,
                            centerName: checkCenter.name,
                            Date: checkAppointment.Date,
                            time: checkAppointment.startTime,
                            Reason: 'Time Issue'
                        })

                        await sendEmail(toEmail, title, emailBody);
                    }
                    const appointmentList = await query.findOneAndUpdate(appointmentColl,
                        { _id: ObjectID(req.body.appointmentId) },
                        { $set: { status: "cancel", cancel_at: currentDate, cancleBy: "worker" }, $unset: { statusUpdated_at: 1 } },
                        { returnOriginal: false })
                    const obj = resPattern.successPattern(httpStatus.OK, appointmentList.value, `success`);
                    return res.status(obj.code).json({
                        ...obj
                    });
                }
            }
        } else {
            const message = i18n.__({ phrase: ("appointmentNotFound"), locale: `${req.query.lang}` })
            let obj = resPattern.errorPattern(httpStatus.NOT_FOUND, message);
            return res.status(obj.code).json(obj);
        }
    } catch (e) {
        return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
    }
}

// emergency Cancel By Worker
const emergencyCancel = async (req, res, next) => {
    try {
        const { startTime, endTime, startDate, endDate } = req.body;
        let workerId = ObjectID(req.body.workerId)
        let serviceId = ObjectID(req.body.serviceId)

        const appointmentdata = {

            Date: {
                $gte: startDate,
                $lte: endDate
            }
        };
        if (req.body.workerId) {
            appointmentdata.worker = workerId
        }
        if (req.body.serviceId) {
            appointmentdata.serviceId = serviceId;
        }
        const checkAppointment = await query.find(appointmentColl, appointmentdata);
        // if Appointment collection not empty
        if (checkAppointment.length > 0) {

            for (let a = 0; a < checkAppointment.length; a++) {
                // if appointment status not cancle
                if (checkAppointment[a].status !== "cancel") {
                    if (req.body.customDateForCancleAppointment == true) {
                        // checking Date
                        const startFullDate = moment(`${checkAppointment[a].Date} ${checkAppointment[a].startTime}`, 'DD-MM-YYYY HH:mm').format('YYYY-MM-DD HH:mm');
                        const reqStartFullDate = moment(`${startDate} ${startTime}`, 'DD-MM-YYYY HH:mm').format('YYYY-MM-DD HH:mm');
                        const endFullDate = moment(`${checkAppointment[a].Date} ${checkAppointment[a].endTime}`, 'DD-MM-YYYY HH:mm').format('YYYY-MM-DD HH:mm');
                        const reqEndFullDate = moment(`${endDate} ${endTime}`, 'DD-MM-YYYY HH:mm').format('YYYY-MM-DD HH:mm');

                        // checking Time
                        const reqStartTime = moment(`${startTime}`, 'HH:mm').format('HH:mm');
                        const checkStartTime = moment(`${checkAppointment[a].startTime}`, 'HH:mm').format('HH:mm');
                        const reqendTime = moment(`${endTime}`, 'HH:mm').format('HH:mm');
                        const checkendTime = moment(`${checkAppointment[a].endTime}`, 'HH:mm').format('HH:mm');

                        if (startFullDate >= reqStartFullDate &&
                            endFullDate <= reqEndFullDate &&
                            checkStartTime >= reqStartTime &&
                            reqendTime >= checkendTime) {

                            const workerData = await query.findOne(workerColl, { _id: workerId })
                            if (workerData) {
                                let data = {}
                                data.status = "cancel";
                                data.cancel_at = currentDate;
                                data.cancleBy = "worker"
                                await query.findOneAndUpdate(appointmentColl,
                                    { _id: checkAppointment[a]._id },
                                    { $set: data },
                                    { returnOriginal: false })

                                //     const toEmail = checkAppointment[a].emailAddress;
                                //     let tempTitle = `Appointment cancel by Worker !`
                                //     let info = `Your Appointment cancel by Worker ${workerData.name}.<br>
                                // Date = ${checkAppointment[a].Date}<br>
                                // Time = ${checkAppointment[a].startTime} To ${checkAppointment[a].endTime}
                                // `
                                //     const emailBody = mailTemp(tempTitle, info)
                                //     const title = `savetime`;
                                //     await sendEmail(toEmail, title, emailBody);
                            }
                            else {
                                const message = i18n.__({ phrase: ("workerNotFound"), locale: `${req.query.lang}` })
                                let objs = resPattern.errorPattern(httpStatus.NOT_FOUND, message);
                                return res.status(objs.code).json(objs);
                            }
                        }
                    }
                    else {
                        const result = await query.findOne(userColl, { _id: ObjectID(checkAppointment[a].centerId) });
                        const timeZone = result.timezone.split(" ")
                        const centerTimeZone = momentTimeZone.tz(moment(), timeZone[0])
                        let startingTime = moment(startDate, 'DD-MM-YYYY').startOf('day').format('DD-MM-YYYY HH:mm');
                        let endingTime = moment(endDate, 'DD-MM-YYYY').endOf('day').format('DD-MM-YYYY HH:mm');

                        if (startDate == moment(centerTimeZone).format('DD-MM-YYYY')) {
                            startingTime = moment(centerTimeZone).format('DD-MM-YYYY HH:mm')
                        }

                        const startFullDate = moment(`${checkAppointment[a].Date} ${checkAppointment[a].startTime}`, 'DD-MM-YYYY HH:mm').format('YYYY-MM-DD HH:mm');
                        const reqStartFullDate = moment(`${startingTime}`, 'DD-MM-YYYY HH:mm').format('YYYY-MM-DD HH:mm');
                        const endFullDate = moment(`${checkAppointment[a].Date} ${checkAppointment[a].endTime}`, 'DD-MM-YYYY HH:mm').format('YYYY-MM-DD HH:mm');
                        const reqEndFullDate = moment(`${endingTime}`, 'DD-MM-YYYY HH:mm').format('YYYY-MM-DD HH:mm');

                        if (startFullDate >= reqStartFullDate &&
                            endFullDate <= reqEndFullDate) {

                            const workerData = await query.findOne(workerColl, { _id: workerId })
                            if (workerData) {
                                let data = {}
                                data.status = "cancel";
                                data.cancel_at = currentDate;
                                data.cancleBy = "worker"
                                await query.findOneAndUpdate(appointmentColl,
                                    { _id: checkAppointment[a]._id },
                                    { $set: data },
                                    { returnOriginal: false })
                            }
                            else {
                                const message = i18n.__({ phrase: ("workerNotFound"), locale: `${req.query.lang}` })
                                let objs = resPattern.errorPattern(httpStatus.NOT_FOUND, message);
                                return res.status(objs.code).json(objs);
                            }
                        }
                    }
                }
            }
            let status = 'Appointment Successfully Cancelled !';
            const obj = resPattern.successPattern(httpStatus.OK, status);
            return res.status(obj.code).json(obj)

        } else {
            // if Appointment collection empty
            const message = i18n.__({ phrase: ("appointmentNotAvailable"), locale: `${req.query.lang}` })
            let obj = resPattern.errorPattern(httpStatus.NOT_FOUND, message);
            return res.status(obj.code).json(obj);
        }
    } catch (e) {
        return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
    }
}

const findallAppointment = async (req, res, next) => {
    try {
        const appointmentList = await query.find(appointmentColl, {}, { createdAt: -1 })
        const obj = resPattern.successPattern(httpStatus.OK, appointmentList, `success`);
        return res.status(obj.code).json({
            ...obj
        });
    } catch (e) {
        return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
    }
}

const getSingleAppointment = async (req, res, next) => {
    try {
        if (req.user.type == 'client') {
            const appointmentList = await query.findOne(appointmentColl, { _id: ObjectID(req.params.appointmentId) })
            const obj = resPattern.successPattern(httpStatus.OK, appointmentList, `success`);
            return res.status(obj.code).json({
                ...obj
            });
        }
        else {
            console.log(req.user.type)
            let finalQuery = [{ $match: { _id: ObjectID(req.params.appointmentId) } },
            {
                $lookup: {
                    from: "service",
                    let: { service: "$serviceId" },
                    pipeline: [
                        {
                            $match:
                            {
                                $expr:
                                {
                                    $and:
                                        [
                                            { $eq: ["$_id", "$$service"] }
                                        ]
                                }
                            }
                        },
                        {
                            $project: { serviceName: 1, duration: 1, price: 1, type: 1 }
                        },
                    ],
                    as: "serviceData"
                },
            },
            {
                $lookup: {
                    from: "user",
                    let: { client: "$emailAddress" },
                    pipeline: [
                        {
                            $match:
                            {
                                $expr:
                                {
                                    $and:
                                        [
                                            { $eq: ["$emailAddress", "$$client"] }, { $eq: ["$type", "client"] }
                                        ]
                                }
                            }
                        },
                        {
                            $project: { name: 1, emailAddress: 1, phonenumber: 1, image: 1 }
                        },
                    ],
                    as: "clientData"
                },
            },
            {
                $lookup: {
                    from: "worker",
                    let: { worker: "$worker" },
                    pipeline: [
                        {
                            $match:
                            {
                                $expr:
                                {
                                    $eq:
                                        [
                                            "$_id", "$$worker"
                                        ]
                                }
                            }
                        },
                        {
                            $project: { name: 1, lastname: 1, image: 1, active: 1 }
                        },
                    ],
                    as: "workerData"
                },
            }]

            let appointmentList = await query.aggregate(appointmentColl, finalQuery);
            let docs = []
            await appointmentList.forEach((doc) => docs.push(doc))
            const obj = resPattern.successPattern(httpStatus.OK, docs, `success`);
            return res.status(obj.code).json({
                ...obj
            });
        }
    } catch (e) {
        return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
    }
}

const getSingleAppointmentId = async (req, res, next) => {
    try {
        const appointmentList = await query.find(appointmentColl, { centerId: ObjectID(req.params.centerId) })
        const obj = resPattern.successPattern(httpStatus.OK, appointmentList, `success`);
        return res.status(obj.code).json({
            ...obj
        });
    } catch (e) {
        return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
    }
}

const getAppointmentStatus = async (req, res, next) => {
    try {
        let pageNo = req.query.pageNo
        let limit = parseInt(req.query.limit)
        let status = req.body.status === undefined ? "pending" : req.body.status
        // console.log("status", status);
        const appointmentList = await query.findWithLimit(appointmentColl, { status: status }, {}, { _id: -1 }, {}, pageNo, limit)
        const obj = resPattern.successPattern(httpStatus.OK, appointmentList, `success`);
        return res.status(obj.code).json({
            ...obj
        });
    } catch (e) {
        return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
    }
}

const appointmentHistory = async (req, res, next) => {
    try {
        let user = undefined
        if (Object.keys(req.body).length === 0) {
            user = req.user
        } else {
            user = await query.findOne(userColl, { _id: ObjectID(req.body.userId) })
        }
        if (user !== null) {

            if (user.type === "client") {
                if (Object.keys(req.query).length === 0) {
                    let finalQuery = [{ $match: { userId: ObjectID(user._id) } },
                    {
                        $sort: { _id: -1 }
                    },
                    {
                        $lookup: {
                            from: "service",
                            let: { service: "$serviceId" },
                            pipeline: [
                                {
                                    $match:
                                    {
                                        $expr:
                                        {
                                            $and:
                                                [
                                                    { $eq: ["$_id", "$$service"] }
                                                ]
                                        }
                                    }
                                },
                                {
                                    $project: { serviceName: 1, duration: 1, price: 1, type: 1 }
                                },
                            ],
                            as: "serviceData"
                        },
                    },
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
                    },
                    {
                        $lookup: {
                            from: "worker",
                            let: { worker: "$worker" },
                            pipeline: [
                                {
                                    $match:
                                    {
                                        $expr:
                                        {
                                            $eq:
                                                [
                                                    "$_id", "$$worker"
                                                ]
                                        }
                                    }
                                },
                                {
                                    $project: { name: 1, lastname: 1, image: 1, active: 1 }
                                },
                            ],
                            as: "workerData"
                        },
                    }]

                    let categoryData = await query.aggregate(appointmentColl, finalQuery);
                    let docs = []
                    await categoryData.forEach((doc) =>
                        docs.push(doc))
                    for (let i = 0; i < docs.length; i++) {
                        docs[i].worker = undefined
                    }
                    const obj = resPattern.successPattern(httpStatus.OK, docs, `success`);
                    return res.status(obj.code).json({
                        ...obj
                    });
                } else {
                    let pageNo = req.query.pageNo
                    let limit = parseInt(req.query.limit)
                    let finalQuery = [{ $match: { userId: ObjectID(user._id) } },
                    {
                        $sort: { _id: -1 }
                    },
                    {
                        $skip: ((pageNo - 1) * limit)
                    },
                    {
                        $limit: limit
                    },
                    {
                        $lookup: {
                            from: "service",
                            let: { service: "$serviceId" },
                            pipeline: [
                                {
                                    $match:
                                    {
                                        $expr:
                                        {
                                            $and:
                                                [
                                                    { $eq: ["$_id", "$$service"] }
                                                ]
                                        }
                                    }
                                },
                                {
                                    $project: { serviceName: 1, duration: 1, price: 1, type: 1 }
                                },
                            ],
                            as: "serviceData"
                        },
                    },
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
                    },
                    {
                        $lookup: {
                            from: "worker",
                            let: { worker: "$worker" },
                            pipeline: [
                                {
                                    $match:
                                    {
                                        $expr:
                                        {
                                            $eq:
                                                [
                                                    "$_id", "$$worker"
                                                ]
                                        }
                                    }
                                },
                                {
                                    $project: { name: 1, lastname: 1, image: 1, active: 1 }
                                },
                            ],
                            as: "workerData"
                        },
                    }]

                    let categoryData = await query.aggregate(appointmentColl, finalQuery);
                    let docs = []
                    await categoryData.forEach((doc) =>
                        docs.push(doc))
                    for (let i = 0; i < docs.length; i++) {
                        docs[i].worker = undefined
                    }
                    const obj = resPattern.successPattern(httpStatus.OK, docs, `success`);
                    return res.status(obj.code).json({
                        ...obj
                    });
                }
            } else {
                const message = i18n.__({ phrase: ("userAccess"), locale: `${req.query.lang}` })
                let obj = resPattern.errorPattern(httpStatus.UNAUTHORIZED, message);
                return res.status(obj.code).json(obj);
            }
        } else {
            const message = i18n.__({ phrase: ("userNoFound"), locale: `${req.query.lang}` })
            let obj = resPattern.errorPattern(httpStatus.NOT_FOUND, message);
            return res.status(obj.code).json(obj);
        }
    } catch (e) {
        return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
    }
}

const filterAppointment = async (req, res, next) => {
    // let pageNo = req.query.pageNo
    // let limit = parseInt(req.query.limit)
    // let Date = req.body.date
    // let serviceId = ObjectID(req.body.service)
    // let price = req.body.price
    // let workerId = ObjectID(req.body.workerId)
    // let name = req.body.name

    // let workerSearch = {}

    // let programFilter = {
    //     "$and": []
    // };

    // if (workerId) {
    //     workerSearch = {
    //         "$or": [
    //             {
    //                 worker: {
    //                     "$elemMatch":
    //                     {
    //                         $eq: { id: workerId }
    //                     }
    //                 }
    //             }
    //         ]
    //     }
    // }

    // let dateFilter = {}
    // Date ? (dateFilter.Date = Date, programFilter["$and"].push(dateFilter)) : "";
    // let clientIdFilter = {}
    // serviceId ? (clientIdFilter.serviceId = serviceId, programFilter["$and"].push(clientIdFilter)) : "";
    // let priceFilter = {}
    // price ? (priceFilter.price = price, programFilter["$and"].push(priceFilter)) : "";
    // let userFilter = {}
    // name ? (userFilter.name = { '$regex': name, '$options': 'i' }, programFilter["$and"].push(userFilter)) : "";

    // let finalQuery = {
    //     "$and": [
    //         programFilter,
    //         workerSearch
    //     ]
    // }


    //         let allProgram = await query.findWithLimit(appointmentColl, finalQuery, {}, { sort: 1 }, {}, pageNo, limit);
    //         const obj = resPattern.successPattern(httpStatus.OK, allProgram, `success`)
    //         return res.status(obj.code).json(obj)
    //     } catch (e) {
    //         return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
    try {
        if (Object.keys(req.query).length === 0) {
            let finalQuery = [{
                $match: {
                    centerId: ObjectID(req.body.centerId)
                }
            },
            {
                $sort: { _id: -1 }
            },
            {
                $lookup: {
                    from: "service",
                    let: { service: "$serviceId" },
                    pipeline: [
                        {
                            $match:
                            {
                                $expr:
                                {
                                    $and:
                                        [
                                            { $eq: ["$_id", "$$service"] }
                                        ]
                                }
                            }
                        },
                        {
                            $project: { serviceName: 1, duration: 1, price: 1, type: 1 }
                        },
                    ],
                    as: "serviceData"
                },
            },
            {
                $lookup: {
                    from: "user",
                    let: { user: "$userId" },
                    pipeline: [
                        {
                            $match:
                            {
                                $expr:
                                {
                                    $and:
                                        [
                                            { $eq: ["$_id", "$$user"] }
                                        ]
                                }
                            }
                        },
                        {
                            $project: { name: 1, emailAddress: 1, phonenumber: 1, image: 1 }
                        },
                    ],
                    as: "clientData"
                },
            },
            {
                $lookup: {
                    from: "worker",
                    let: { worker: "$worker" },
                    pipeline: [
                        {
                            $match:
                            {
                                $expr:
                                {
                                    $eq:
                                        [
                                            "$_id", "$$worker"
                                        ]
                                }
                            }
                        },
                        {
                            $project: { name: 1, lastname: 1, image: 1, active: 1 }
                        },
                    ],
                    as: "workerData"
                },
            }]
            if (req.body.Date) {
                finalQuery[0]['$match'].Date = req.body.Date
            }
            if (req.body.time) {
                const stTime = moment(`${req.body.Date} ${req.body.time}`, "DD-MM-YYYY HH:mm").subtract(1, 'h').format("HH:mm")
                const etTime = moment(`${req.body.Date} ${req.body.time}`, "DD-MM-YYYY HH:mm").add(1, 'h').format("HH:mm")
                finalQuery[0]['$match'].startTime = {
                    "$gte": stTime,
                    "$lte": etTime
                }
            }
            if (req.body.workerId) {
                finalQuery[0]['$match'].worker = ObjectID(req.body.workerId)
            }
            if (req.body.serviceId) {
                finalQuery[0]['$match'].serviceId = ObjectID(req.body.serviceId)
            }
            if (req.body.appointmentId) {
                finalQuery[0]['$match'].uniqueId = req.body.appointmentId
            }
            if (req.body.price) {
                const splitPrice = req.body.price.split("-")
                if (splitPrice.length == 2) {
                    let startPrice = splitPrice[0]
                    let endPrice = splitPrice[1]
                    finalQuery[0]['$match'].price = {
                        "$gte": startPrice,
                        "$lte": endPrice
                    }
                }
                else {
                    finalQuery[0]['$match'].price = req.body.price
                }
            }
            let categoryData = await query.aggregate(appointmentColl, finalQuery);
            let docs = []
            await categoryData.forEach((doc) =>
                docs.push(doc))
            for (let i = 0; i < docs.length; i++) {
                docs[i].worker = undefined
                docs[i].userId = undefined
                docs[i].centerId = undefined
                docs[i].serviceId = undefined

            }

            if (req.body.clientName) {
                let a = []
                if (docs.length > 0) {
                    for (let i = 0; i < docs.length; i++) {
                        if (docs[i].clientData.length > 0) {
                            for (let j = 0; j < docs[i].clientData.length; j++) {
                                if (docs[i].clientData[j].name == req.body.clientName) {
                                    a.push(docs[i])
                                }
                            }
                        }
                    }
                }
                docs = a;
            }
            const obj = resPattern.successPattern(httpStatus.OK, docs, `success`);
            return res.status(obj.code).json({
                ...obj
            });
        }
    } catch (e) {
        return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
    }
}

const appointmentOfClient = async (req, res, next) => {
    try {
        let finalQuery = [{
            $match: {
                centerId: ObjectID(req.params.centerId)
            }
        },
        {
            $lookup: {
                from: "user",
                let: { user: "$userId" },
                pipeline: [
                    {
                        $match:
                        {
                            $expr:
                            {
                                $and:
                                    [
                                        { $eq: ["$_id", "$$user"] }
                                    ]
                            }
                        }
                    },
                    {
                        $project: { name: 1, emailAddress: 1, phonenumber: 1, image: 1 }
                    },
                ],
                as: "clientData"
            }
        }, {
            $group: {
                _id: "$name"
            }
        },
        {
            $project: { _id: 0, name: '$_id' }
        }
        ]
        let categoryData = await query.aggregate(appointmentColl, finalQuery);
        let docs = []
        await categoryData.forEach((doc) =>
            docs.push(doc))
        const obj = resPattern.successPattern(httpStatus.OK, docs, `success`);
        return res.status(obj.code).json({
            ...obj
        });
    } catch (e) {
        return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
    }
}

const appointmentHistoryforcenter = async (req, res, next) => {
    try {
        let finalQuery = [{ $match: { userId: ObjectID(req.body.userId) } },
        {
            $sort: { _id: -1 }
        },
        {
            $lookup: {
                from: "service",
                let: { service: "$serviceId" },
                pipeline: [
                    {
                        $match:
                        {
                            $expr:
                            {
                                $and:
                                    [
                                        { $eq: ["$_id", "$$service"] }
                                    ]
                            }
                        }
                    },
                    {
                        $project: { serviceName: 1, duration: 1, price: 1, type: 1 }
                    },
                ],
                as: "serviceData"
            },
        },
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
        },
        {
            $lookup: {
                from: "worker",
                let: { worker: "$worker" },
                pipeline: [
                    {
                        $match:
                        {
                            $expr:
                            {
                                $eq:
                                    [
                                        "$_id", "$$worker"
                                    ]
                            }
                        }
                    },
                    {
                        $project: { name: 1, lastname: 1, image: 1, active: 1 }
                    },
                ],
                as: "workerData"
            },
        }]

        let categoryData = await query.aggregate(appointmentColl, finalQuery);
        let docs = []
        await categoryData.forEach((doc) =>
            docs.push(doc))
        for (let i = 0; i < docs.length; i++) {
            docs[i].worker = undefined
        }
        const obj = resPattern.successPattern(httpStatus.OK, docs, `success`);
        return res.status(obj.code).json({
            ...obj
        });
    } catch (e) {
        return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
    }
}

module.exports = {
    checkSlotAvailability,
    updateAppointment,
    deleteAppointment,
    cancelAppointment,
    emergencyCancel,
    findallAppointment,
    getSingleAppointment,
    getAppointmentStatus,
    appointmentHistory,
    filterAppointment,
    appointmentOfClient,
    getSingleAppointmentId,
    appointmentHistoryforcenter
}