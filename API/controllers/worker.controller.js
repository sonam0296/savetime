const APIError = require('../helpers/APIError');
const resPattern = require('../helpers/resPattern');
const httpStatus = require('http-status');
const db = require('../server')
const userColl = db.collection('user');
const compneyColl = db.collection('compney');
const appointmentColl = db.collection('appointment');
const workerColl = db.collection('worker');
const workerHistoryColl = db.collection('workerHistory');
const query = require('../query/query')
const bcrypt = require('bcrypt');
const { generatePassword, daysBetweenDates, generateOTP, sendEmail, mailTemp, generatePIN } = require('../helpers/commonfile');
const { ObjectID } = require('mongodb').ObjectID;
const momentTimeZone = require('moment-timezone');
const moment = require('moment');
const dotenv = require('dotenv');
dotenv.config();
const ejs = require("ejs");
const i18n = require('i18n');

const createWorker = async (req, res, next) => {
    try {
        let data = req.body
        let found = false
        let requestdata = { name: data.name };
        const workerData = await query.find(workerColl, requestdata)
        if (workerData.length > 0) {

            for (let index = 0; index < workerData.length; index++) {
                const element = workerData[index];

                if (element.name === data.name &&
                    element.lastname === data.lastname &&
                    String(element.centerIds) === data.centerIds && element.isDeleted == false) {
                    found = true
                    const message = i18n.__({ phrase: ("workerAlreadyFound"), locale: `${req.query.lang}` })
                    let obj = resPattern.errorPattern(httpStatus.ALREADY_REPORTED, message);
                    return res.status(obj.code).json(obj);
                }
            }
            if (!found) {
                let customArr = []
                const worker = req.body
                worker.centerIds = ObjectID(worker.centerIds)
                if (worker.customDate) {
                    if (worker.customDate.length > 0) {

                        for (let a = 0; a < worker.customDate.length; a++) {
                            let dateArr = daysBetweenDates(worker.customDate[a].startDate, worker.customDate[a].endDate);
                            for (let b = 0; b < dateArr.length; b++) {
                                let objs = {}
                                objs.Date = dateArr[b]
                                objs.time = worker.customDate[a].time
                                customArr.push(objs)
                            }
                            worker.customSchedule = customArr
                        }
                    }
                }

                if (worker.customDate == undefined) {
                    worker.customSchedule = [];
                    worker.customDate = []
                }
                if (worker.customDate.length == 0) {
                    worker.customSchedule = [];
                }
                if (worker.defaultSchedule == undefined) {
                    worker.defaultSchedule = []
                }
                const centerData = await query.findOne(userColl, { _id: worker.centerIds })

                if (centerData.compneyId !== undefined) {
                    worker.compneyId = ObjectID(centerData.compneyId)
                    const Compney = await query.find(compneyColl, {})
                    let compneyIndex = Compney.map((e) => { return String(e._id); }).indexOf(String(centerData.compneyId));
                    const center = await query.find(userColl, { type: "center" })

                    let centerIndex = center.map((e) => { return String(e._id); }).indexOf(String(req.body.centerIds));

                    const workers = await query.findWithLimit(workerColl, {}, {}, { _id: -1 }, {}, 1, 1)
                    let id = `${compneyIndex + 1}/${centerIndex + 1}/${parseInt(workers[0].uniqueId) + 1}`
                    worker.uniqueId = id
                }
                else {
                    const center = await query.find(userColl, { type: "center" })

                    let centerIndex = center.map((e) => { return String(e._id); }).indexOf(req.body.centerIds);
                    const workers = await query.findWithLimit(workerColl, {}, {}, { _id: -1 }, {}, 1, 1)
                    worker.uniqueId = `0/${centerIndex + 1}/${parseInt(workers[0].uniqueId) + 1}`
                }

                worker.isDeleted = false
                // worker.pinCode = worker.pinCode
                if (worker.pinCode) {
                    if (worker.pinCode.length !== 4) {
                        const message = i18n.__({ phrase: ("pinCodeLength"), locale: `${req.query.lang}` })
                        let obj = resPattern.errorPattern(httpStatus.NOT_FOUND, message);
                        return res.status(obj.code).json(obj);
                    }

                }
                worker.image = worker.image ? worker.image : process.env.USER_IMAGE
                const insertdata = await query.insert(workerColl, worker)
                let arrToObj = { ...insertdata.ops };
                arrToObj[0].pinCode = undefined
                const obj = resPattern.successPattern(httpStatus.OK, arrToObj[0], `success`);
                return res.status(obj.code).json({
                    ...obj
                })
            }
        }
        if (workerData.length === 0) {
            let customArr = []
            const worker = req.body
            worker.centerIds = ObjectID(worker.centerIds)
            if (worker.customDate) {
                if (worker.customDate.length > 0) {

                    for (let a = 0; a < worker.customDate.length; a++) {
                        let dateArr = daysBetweenDates(worker.customDate[a].startDate, worker.customDate[a].endDate);
                        for (let b = 0; b < dateArr.length; b++) {
                            let objs = {}
                            objs.Date = dateArr[b]
                            objs.time = worker.customDate[a].time
                            customArr.push(objs)
                        }
                        worker.customSchedule = customArr
                    }
                }
            }

            if (worker.customDate == undefined) {
                worker.customSchedule = [];
                worker.customDate = []
            }
            if (worker.customDate.length == 0) {
                worker.customSchedule = [];
            }
            if (worker.defaultSchedule == undefined) {
                worker.defaultSchedule = []
            }

            const centerData = await query.findOne(userColl, { _id: worker.centerIds })

            if (centerData.compneyId !== undefined) {
                worker.compneyId = ObjectID(centerData.compneyId)
                const Compney = await query.find(compneyColl, {})
                let compneyIndex = Compney.map((e) => { return String(e._id); }).indexOf(String(centerData.compneyId));
                const center = await query.find(userColl, { type: "center" })

                let centerIndex = center.map((e) => { return String(e._id); }).indexOf(String(req.body.centerIds));

                const workers = await query.findWithLimit(workerColl, {}, {}, { _id: -1 }, {}, 1, 1)

                let id = `${compneyIndex + 1}/${centerIndex + 1}/${parseInt(workers[0].uniqueId) + 1}`
                worker.uniqueId = id
            }
            else {
                const center = await query.find(userColl, { type: "center" })

                let centerIndex = center.map((e) => { return String(e._id); }).indexOf(req.body.centerIds);
                const workers = await query.findWithLimit(workerColl, {}, {}, { _id: -1 }, {}, 1, 1)
                worker.uniqueId = `0/${centerIndex + 1}/${parseInt(workers[0].uniqueId) + 1}`
            }
            // worker.uniqueId = Math.floor(100000 + Math.random() * 900000);
            worker.isDeleted = false
            // worker.pinCode = worker.pinCode
            if (worker.pinCode) {
                if (worker.pinCode.length !== 4) {
                    const message = i18n.__({ phrase: ("pinCodeLength"), locale: `${req.query.lang}` })
                    let obj = resPattern.errorPattern(httpStatus.NOT_FOUND, message);
                    return res.status(obj.code).json(obj);
                }

            }
            worker.image = worker.image ? worker.image : process.env.USER_IMAGE
            const insertdata = await query.insert(workerColl, worker)
            let arrToObj = { ...insertdata.ops };
            arrToObj[0].pinCode = undefined
            const obj = resPattern.successPattern(httpStatus.OK, arrToObj[0], `success`);
            return res.status(obj.code).json({
                ...obj
            })
        }
    } catch (e) {
        return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
    }
}

// worker details with serviceList
const getWorker = async (req, res, next) => {
    try {

        let finalQuery = [{
            $match: { _id: ObjectID(req.params.workerId) }
        },
        {
            $project: { password: 0 }
        },
        {
            $lookup: {
                from: "service",
                let: { worker: "$_id" },
                pipeline: [
                    {
                        $match:
                        {
                            $expr:
                            {
                                $and:
                                    [
                                        { $in: ["$$worker", "$workerId.id"] },
                                        { $eq: ["$isDeleted", false] }
                                    ]
                            }
                        }
                    },
                    {
                        $project: { serviceName: 1, duration: 1, type: 1 }
                    },
                ],
                as: "serviceData"
            },
        }]

        let categoryData = await query.aggregate(workerColl, finalQuery);
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

const workerLogin = async (req, res, next) => {
    try {
        let requestdata = { _id: ObjectID(req.body.workerId), isDeleted: false }

        const workerData = await query.findOne(workerColl, requestdata);
        if (workerData) {
            if (workerData.active == true) {
                if (workerData.isPincodeActive == true) {

                    // const isMatch = await bcrypt.compare(req.body.pinCode, workerData.pinCode)
                    if (req.body.pinCode == workerData.pinCode) {
                        const centerData = await query.findOne(userColl, { _id: ObjectID(req.user._id) });
                        const timeZone = centerData.timezone.split(" ")
                        const centerTimeZone = momentTimeZone.tz(moment(), timeZone[0])
                        let current = moment(centerTimeZone).format("DD-MM-YYYY HH:mm")

                        const workerHistory = req.body
                        delete workerHistory.pinCode
                        workerHistory.workerId = ObjectID(req.body.workerId)
                        workerHistory.actionDate = current
                        workerHistory.action = "login"

                        await query.insert(workerHistoryColl, workerHistory);
                        delete workerData.pinCode
                        let obj = resPattern.successPattern(httpStatus.OK, workerData, `success`);
                        return res.status(obj.code).json(obj);
                    }
                    else {
                        const message = i18n.__({ phrase: ("workerPincodeWrong"), locale: `${req.query.lang}` })
                        const obj = resPattern.errorPattern(httpStatus.NOT_FOUND, message);
                        return res.status(obj.code).json(obj)
                    }
                } else {
                    const message = i18n.__({ phrase: ("workerPincodeNotActive"), locale: `${req.query.lang}` })
                    const obj = resPattern.errorPattern(httpStatus.NOT_FOUND, message);
                    return res.status(obj.code).json(obj)
                }
            } else {
                const message = i18n.__({ phrase: ("workerNotActive"), locale: `${req.query.lang}` })
                const obj = resPattern.errorPattern(httpStatus.NOT_FOUND, message);
                return res.status(obj.code).json(obj)
            }
        } else {
            const message = i18n.__({ phrase: ("workerNotFound"), locale: `${req.query.lang}` })
            const obj = resPattern.errorPattern(httpStatus.NOT_FOUND, message);
            return res.status(obj.code).json(obj)
        }
    } catch (e) {
        return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
    }
}

const deActivateWorker = async (req, res, next) => {
    try {

        let requestdata = { _id: ObjectID(req.body.workerId) };
        const workerData = await query.findOne(workerColl, requestdata);
        if (workerData) {
            const updatedData = await query.findOneAndUpdate(workerColl,
                { _id: ObjectID(req.body.workerId) },
                { $set: { active: req.body.active } },
                { returnOriginal: false }
            )
            if (req.body.isSendMail) {
                const checkCenter = await query.findOne(userColl, { _id: ObjectID(workerData.centerIds) })

                const checkAppointments = await query.find(appointmentColl, { worker: ObjectID(workerData._id) })
                if (checkAppointments.length > 0) {
                    for (let i = 0; i < checkAppointments.length; i++) {
                        const toEmail = checkAppointments[i].emailAddress;
                        const title = `SaveTime`;
                        let language = 'es'
                        if (req.query.lang) {
                            language = req.query.lang
                        }
                        const emailBody = await ejs.renderFile(process.cwd() + `/public/views/${language}/cancleAppointment.ejs`, {
                            clientName: checkAppointments[i].name,
                            centerName: checkCenter.name,
                            Date: checkAppointments[i].Date,
                            time: checkAppointments[i].startTime,
                            Reason: 'Time Issue'
                        })

                        await sendEmail(toEmail, title, emailBody);
                    }
                }
            }
            let obj = resPattern.successPattern(httpStatus.OK, updatedData.value, 'success');
            return res.status(obj.code).json(obj);

        }
        else {
            let message = "Worker Not Found !"
            let obj = resPattern.successPattern(httpStatus.OK, message, 'success');
            return res.status(obj.code).json(obj);
        }
    } catch (e) {
        return next(new APIError(e.message, httpStatus.BAD_REQUEST, true));
    }
}

const updateWorker = async (req, res, next) => {
    try {
        let requestdata = { _id: ObjectID(req.body.workerId) };
        const workerData = await query.findOne(workerColl, requestdata);
        if (workerData) {
            const reqData = req.body;
            delete reqData['workerId'];
            // if (reqData.pinCode) {
            //     reqData.pinCode = reqData.pinCode
            // }
            let customArr = []

            if (req.body.customDate) {
                if (req.body.customDate.length > 0) {
                    for (let a = 0; a < req.body.customDate.length; a++) {
                        let dateArr = daysBetweenDates(req.body.customDate[a].startDate, req.body.customDate[a].endDate);

                        // if (timeTableData.customSchedule) {
                        // if (workerData.customSchedule.length > 0) {
                        //     for (let b = 0; b < dateArr.length; b++) {
                        //         let obj = {}
                        //         obj.Date = dateArr[b]
                        //         obj.time = req.body.customDate[a].time
                        //         workerData.customSchedule.push(obj)
                        //     }

                        // }
                        // }

                        // else {
                        for (let b = 0; b < dateArr.length; b++) {
                            let objs = {}
                            objs.Date = dateArr[b]
                            objs.time = req.body.customDate[a].time
                            customArr.push(objs)
                        }
                        reqData.customSchedule = customArr
                        // }
                        // workerData.customDate.push(req.body.customDate[a])
                    }
                }
            }
            // reqData.customSchedule = workerData.customSchedule
            // reqData.customDate = workerData.customDate
            if (reqData.pinCode) {
                if (reqData.pinCode.length !== 4) {
                    const message = i18n.__({ phrase: ("pinCodeLength"), locale: `${req.query.lang}` })
                    let obj = resPattern.errorPattern(httpStatus.NOT_FOUND, message);
                    return res.status(obj.code).json(obj);
                }

            }

            let updatedData = await query.findOneAndUpdate(workerColl, requestdata, { $set: reqData }, { returnOriginal: false });
            let obj = resPattern.successPattern(httpStatus.OK, updatedData.value, 'success');
            return res.status(obj.code).json(obj);
        } else {
            const message = i18n.__({ phrase: ("workerNotFound"), locale: `${req.query.lang}` })
            let obj = resPattern.errorPattern(httpStatus.NOT_FOUND, message);
            return res.status(obj.code).json(obj);
        }
    } catch (e) {
        return next(new APIError(e.message, httpStatus.BAD_REQUEST, true));
    }
}

const deleteWorker = async (req, res, next) => {
    try {
        const checkWorker = await query.findOne(workerColl, { _id: ObjectID(req.params.workerId) })
        if (checkWorker) {
            await query.findOneAndUpdate(workerColl,
                { _id: ObjectID(req.params.workerId) },
                { $set: { isDeleted: true } },
                { returnOriginal: false })
            if (req.body.isSendMail) {
                const checkCenter = await query.findOne(userColl, { _id: ObjectID(checkWorker.centerIds) })

                const checkAppointments = await query.find(appointmentColl, { worker: ObjectID(checkWorker._id) })
                if (checkAppointments.length > 0) {
                    for (let i = 0; i < checkAppointments.length; i++) {
                        const toEmail = checkAppointments[i].emailAddress;
                        const title = `SaveTime`;
                        let language = 'es'
                        if (req.query.lang) {
                            language = req.query.lang
                        }
                        const emailBody = await ejs.renderFile(process.cwd() + `/public/views/${language}/cancleAppointment.ejs`, {
                            clientName: checkAppointments[i].name,
                            centerName: checkCenter.name,
                            Date: checkAppointments[i].Date,
                            time: checkAppointments[i].startTime,
                            Reason: 'Time Issue'
                        })

                        await sendEmail(toEmail, title, emailBody);
                    }
                }
            }
            const obj = resPattern.successPattern(httpStatus.OK, `Worker Deleted !`, `success`);
            return res.status(obj.code).json({
                ...obj
            });
        } else {
            const message = i18n.__({ phrase: ("workerNotFound"), locale: `${req.query.lang}` })
            let obj = resPattern.errorPattern(httpStatus.NOT_FOUND, message);
            return res.status(obj.code).json(obj);
        }
    } catch (e) {
        return next(new APIError(e.message, httpStatus.BAD_REQUEST, true));
    }
}

const WorkerfromCenter = async (req, res, next) => {
    try {
        let requestdata = { centerIds: ObjectID(req.params.centerId), isDeleted: false }

        let workerData = await query.find(workerColl, requestdata);
        let docs = []
        await workerData.forEach((doc) =>
            docs.push(doc))
        for (let i = 0; i < docs.length; i++) {
            // docs[i].pinCode = undefined
        }
        const obj = resPattern.successPattern(httpStatus.OK, docs, `success`);
        return res.status(obj.code).json({
            ...obj
        });
    } catch (e) {
        return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
    }
}

const WorkerList = async (req, res, next) => {
    try {

        let finalQuery = [{
            $match: { isDeleted: false },
        },
        {
            $skip: ((req.query.pageNo - 1) * req.query.limit)
        },
        {
            $limit: parseInt(req.query.limit)
        },
        {
            $lookup: {
                from: "appointment",
                let: { id: "$_id" },
                pipeline: [
                    {
                        $match:
                        {
                            $expr:
                            {
                                $and:
                                    [
                                        { $eq: ["$worker", "$$id"] }
                                    ]
                            }
                        }
                    }
                ],
                as: "appointmentData"
            },
        },
        {
            $lookup: {
                from: "service",
                let: { id: "$_id" },
                pipeline: [
                    {
                        $match:
                        {
                            $expr:
                            {
                                $and:
                                    [
                                        { $in: ["$$id", "$workerId.id"] },
                                        { $eq: ["$isDeleted", false] }
                                    ]
                            }
                        }
                    },
                    {
                        $project: { serviceName: 1, duration: 1, active: 1, price: 1 }
                    },
                ],
                as: "serviceData"
            },
        },
        {
            $lookup: {
                from: "user",
                let: { id: "$centerIds" },
                pipeline: [
                    {
                        $match:
                        {
                            $expr:
                            {
                                $and:
                                    [
                                        { $eq: ["$_id", "$$id"] }
                                    ]
                            }
                        }
                    },
                    {
                        $project: { name: 1, lastname: 1, image: 1, active: 1 }
                    },
                ],
                as: "centerData"
            },
        },
        {
            $project: { _id: 1, description: 1, uniqueId: 1, centerData: 1, name: 1, lastName: 1, defaultSchedule: 1, customSchedule: 1, pinCode: 1, isPincodeActive: 1, isDeleted: 1, createdAt: 1, image: 1, active: 1, serviceData: 1, bookingCount: { "$size": "$appointmentData" } }
        },]

        if (req.query.search) {
            finalQuery[0]['$match'].name = { '$regex': req.query.search, '$options': 'i' }
        }
        let workerData = await query.aggregate(workerColl, finalQuery);
        let docs = []
        await workerData.forEach((doc) =>
            docs.push(doc))
        let obj = resPattern.successPattern(httpStatus.OK, docs, 'success');
        return res.status(obj.code).json(obj)
    } catch (e) {
        return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
    }
}

const getWorkerHistory = async (req, res, next) => {
    try {

        let finalQuery = [{
            $match: {}
        },
        {
            $lookup: {
                from: "worker",
                let: { id: "$workerId" },
                pipeline: [
                    {
                        $match:
                        {
                            $expr:
                            {
                                $and:
                                    [
                                        { $eq: ["$_id", "$$id"] },
                                        { $eq: ["$isDeleted", false] }
                                    ]
                            },
                        },
                    },
                    { $project: { pinCode: 0 } },
                ],
                as: "workerData"
            }
        },
        // $project: { _id: 1, uniqueId: 1, centerIds: 1, name: 1, lastName: 1, defaultSchedule: 1, customSchedule: 1, isDeleted: 1, createdAt: 1, image: 1, active: 1 }

        {
            $project: { _id: 1, workerId: 1, action: 1, actionDate: 1, createdAt: 1, workerData: 1 }
        },]

        if (req.body.workerId) {
            finalQuery[0]['$match'].workerId = ObjectID(req.body.workerId)
        }

        let workerData = await query.aggregate(workerHistoryColl, finalQuery);
        let docs = []
        await workerData.forEach((doc) =>
            docs.push(doc))

        if (req.body.Date && req.body.time) {
            let data = []
            if (docs.length > 0) {
                for (let i = 0; i < docs.length; i++) {
                    if (moment(docs[i].actionDate, "DD-MM-YYYY HH:mm").format("DD-MM-YYYY") == req.body.Date && moment(docs[i].actionDate, "DD-MM-YYYY HH:mm").format("HH:mm") == req.body.time) {
                        data.push(docs[i])
                    }
                }
                docs = data;
            }
        }
        if (req.body.Date) {
            let data = []
            if (docs.length > 0) {
                for (let i = 0; i < docs.length; i++) {
                    if (moment(docs[i].actionDate, "DD-MM-YYYY HH:mm").format("DD-MM-YYYY") == req.body.Date) {
                        data.push(docs[i])
                    }
                }
                docs = data;
            }
        }
        if (req.body.time) {
            let data = []
            if (docs.length > 0) {
                for (let i = 0; i < docs.length; i++) {
                    if (moment(docs[i].actionDate, "DD-MM-YYYY HH:mm").format("HH:mm") == `${req.body.time}`) {
                        data.push(docs[i])
                    }
                }
                docs = data;
            }
        }
        let obj = resPattern.successPattern(httpStatus.OK, docs, 'success');
        return res.status(obj.code).json(obj)
    } catch (e) {
        return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
    }
}

module.exports = {
    createWorker,
    updateWorker,
    deleteWorker,
    getWorker,
    workerLogin,
    WorkerfromCenter,
    WorkerList,
    deActivateWorker,
    getWorkerHistory
}