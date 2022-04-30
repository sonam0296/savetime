const APIError = require('../helpers/APIError');
const resPattern = require('../helpers/resPattern');
const httpStatus = require('http-status');
const db = require('../server')
const compneyColl = db.collection('compney');
const userColl = db.collection('user');
const workerColl = db.collection('worker');
const query = require('../query/query')
const { ObjectID } = require('mongodb');
const i18n = require('i18n');
const moment = require('moment');
const { uniqueId } = require('lodash');


const createCompney = async (req, res, next) => {
    try {
        const compneydata = { compneyName: req.body.compneyName };
        const checkCompney = await query.findOne(compneyColl, compneydata)
        if (checkCompney) {

            const Compney = await query.find(compneyColl, {})
            let compneyIndex = Compney.map((e) => { return e.compneyName; }).indexOf(checkCompney.compneyName);

            checkCompney.center.push({ id: ObjectID(req.body.centerId) })
            const center = await query.find(userColl, { type: "center" })

            let centerIndex = center.map((e) => { return String(e._id); }).indexOf(req.body.centerId);
            let id = `${compneyIndex + 1}/${centerIndex + 1}`
            // let compneyIndex = ;
            await query.findOneAndUpdate(userColl,
                { _id: ObjectID(req.body.centerId) },
                { $set: { compneyId: ObjectID(checkCompney._id), uniqueId: id } },
                { returnOriginal: false })
            const centerWorker = await query.find(workerColl, { centerIds: ObjectID(req.body.centerId) })
            if (centerWorker.length > 0) {
                for (let i = 0; i < centerWorker.length; i++) {
                    const workerIndex = await query.find(workerColl, {})
                    let workersIndex = workerIndex.map((e) => { return String(e._id); }).indexOf(String(centerWorker[i]._id));
                    await query.findOneAndUpdate(workerColl,
                        { _id: ObjectID(centerWorker[i]._id) },
                        { $set: { compneyId: ObjectID(checkCompney._id), uniqueId: `${compneyIndex + 1}/${centerIndex + 1}/${workersIndex + 1}` } },
                        { returnOriginal: false })
                }
            }
            await query.findOneAndUpdate(compneyColl,
                { _id: ObjectID(checkCompney._id) },
                { $set: checkCompney },
                { returnOriginal: false })

            let obj = resPattern.successPattern(httpStatus.OK, checkCompney, 'success');
            return res.status(obj.code).json(obj);
        } else {
            const centerrequestId = req.body.centerId
            const compney = req.body
            let array = []
            array.push({ id: ObjectID(centerrequestId) })
            compney.center = array
            compney.active = true

            const checkCompneys = await query.findWithLimit(compneyColl, {}, {}, { _id: -1 }, {}, 1, 1)
            const center = await query.find(userColl, { type: "center" })
            let centerIndex = center.map((e) => { return String(e._id); }).indexOf(req.body.centerId);

            compney.uniqueId = `${parseInt(checkCompneys[0].uniqueId) + 1}`
            delete compney.centerId
            const insertdata = await query.insert(compneyColl, compney)
            let data = insertdata.ops
            await query.findOneAndUpdate(userColl,
                { _id: ObjectID(centerrequestId) },
                { $set: { compneyId: ObjectID(data[0]._id), uniqueId: `${parseInt(checkCompneys[0].uniqueId) + 1}/${centerIndex + 1}` } },
                { returnOriginal: false })
            //worker uniqueId update
            const centerWorker = await query.find(workerColl, { centerIds: ObjectID(centerrequestId) })
            if (centerWorker.length > 0) {
                for (let i = 0; i < centerWorker.length; i++) {
                    const workerIndex = await query.find(workerColl, {})
                    let workersIndex = workerIndex.map((e) => { return String(e._id); }).indexOf(String(centerWorker[i]._id));
                    await query.findOneAndUpdate(workerColl,
                        { _id: ObjectID(centerWorker[i]._id) },
                        { $set: { compneyId: ObjectID(data[0]._id), uniqueId: `${parseInt(checkCompneys[0].uniqueId) + 1}/${centerIndex + 1}/${workersIndex + 1}` } },
                        { returnOriginal: false })
                }
            }
            let obj = resPattern.successPattern(httpStatus.OK, data, 'success');
            return res.status(obj.code).json(obj);
        }
    } catch (e) {
        return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
    }
}

const updateCompney = async (req, res, next) => {
    try {
        const setData = req.body
        const compneydata = { _id: ObjectID(req.params.id) };
        const checkCompney = await query.findOne(compneyColl, compneydata)
        if (checkCompney) {
            // if (req.user.type == 'admin') {
            //     const compneyData = await query.findOneAndUpdate(compneyColl,
            //         { _id: ObjectID(req.params.id) },
            //         { $set: setData },
            //         { returnOriginal: false })
            //     let obj = resPattern.successPattern(httpStatus.OK, compneyData.value, 'success');
            //     return res.status(obj.code).json(obj);
            // }
            // else {
            if (req.body.compneyName) {
                const compneydatas = { compneyName: req.body.compneyName };
                const checkCompneys = await query.findOne(compneyColl, compneydatas)
                if (checkCompneys) {
                    const compney = await query.find(compneyColl, {})

                    let compneyIndex = compney.map((e) => { return e.compneyName; }).indexOf(req.body.compneyName);
                    const center = await query.find(userColl, { type: "center" })

                    let centerIndex = center.map((e) => { return String(e._id); }).indexOf(req.body.centerId);
                    await query.findOneAndUpdate(userColl,
                        { _id: ObjectID(req.body.centerId) },
                        { $set: { compneyId: ObjectID(checkCompneys._id), uniqueId: `${compneyIndex + 1}/${centerIndex + 1}` } },
                        { returnOriginal: false })
                    const centerWorker = await query.find(workerColl, { centerIds: ObjectID(req.body.centerId) })
                    if (centerWorker.length > 0) {
                        for (let i = 0; i < centerWorker.length; i++) {
                            const workerIndex = await query.find(workerColl, {})
                            let workersIndex = workerIndex.map((e) => { return String(e._id); }).indexOf(String(centerWorker[i]._id));
                            await query.findOneAndUpdate(workerColl,
                                { _id: ObjectID(centerWorker[i]._id) },
                                { $set: { compneyId: ObjectID(checkCompneys._id), uniqueId: `${compneyIndex + 1}/${centerIndex + 1}/${workersIndex + 1}` } },
                                { returnOriginal: false })
                        }
                    }
                    delete setData.centerId
                    const compneyData = await query.findOneAndUpdate(compneyColl,
                        { _id: ObjectID(req.params.id) },
                        { $set: setData },
                        { returnOriginal: false }
                    )
                    let obj = resPattern.successPattern(httpStatus.OK, compneyData.value, 'success');
                    return res.status(obj.code).json(obj);
                } else {
                    const centerrequestId = req.body.centerId

                    const compney = req.body
                    let array = []
                    array.push({ id: ObjectID(req.body.centerId) })
                    setData.center = array
                    const checkAllCompney = await query.find(compneyColl, {}, {}, { _id: -1 }, {}, 1, 1)
                    const center = await query.find(userColl, { type: "center" })

                    let centerIndex = center.map((e) => { return String(e._id); }).indexOf(req.body.centerId);
                    compney.uniqueId = `${parseInt(checkAllCompney[0].uniqueId) + 1}`
                    compney.active = true
                    delete compney.centerId
                    const insertdata = await query.insert(compneyColl, compney)
                    let data = insertdata.ops
                    await query.findOneAndUpdate(userColl,
                        { _id: ObjectID(centerrequestId) },
                        { $set: { compneyId: ObjectID(data[0]._id), uniqueId: `${parseInt(checkAllCompney[0].uniqueId) + 1}/${centerIndex + 1}` } },
                        { returnOriginal: false })
                    //worker uniqueId update
                    const centerWorker = await query.find(workerColl, { centerIds: ObjectID(centerrequestId) })
                    if (centerWorker.length > 0) {
                        for (let i = 0; i < centerWorker.length; i++) {
                            const workerIndex = await query.find(workerColl, {})
                            let workersIndex = workerIndex.map((e) => { return String(e._id); }).indexOf(String(centerWorker[i]._id));
                            await query.findOneAndUpdate(workerColl,
                                { _id: ObjectID(centerWorker[i]._id) },
                                { $set: { compneyId: ObjectID(data[0]._id), uniqueId: `${parseInt(checkAllCompney[0].uniqueId) + 1}/${centerIndex + 1}/${workersIndex + 1}` } },
                                { returnOriginal: false })
                        }
                    }
                    let obj = resPattern.successPattern(httpStatus.OK, data, 'success');
                    return res.status(obj.code).json(obj);
                }

            } else {
                delete setData.centerId
                const compneyData = await query.findOneAndUpdate(compneyColl,
                    { _id: ObjectID(req.params.id) },
                    { $set: setData },
                    { returnOriginal: false }
                )
                let obj = resPattern.successPattern(httpStatus.OK, compneyData.value, 'success');
                return res.status(obj.code).json(obj);
            }
            // }
        } else {
            const message = i18n.__({ phrase: ("companeyNotFound"), locale: `${req.query.lang}` })
            let obj = resPattern.errorPattern(httpStatus.NOT_FOUND, message);
            return res.status(obj.code).json(obj);
        }
    } catch (e) {
        return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
    }
}

const deleteCompney = async (req, res, next) => {
    try {
        const compneydata = { _id: ObjectID(req.body.id) };

        const checkCompney = await query.findOne(compneyColl, compneydata)
        if (checkCompney) {
            await query.deleteOne(compneyColl, compneydata)
            let obj = resPattern.successPattern(httpStatus.OK, "Compney Deleted !", 'success');
            return res.status(obj.code).json(obj);
        } else {
            const message = i18n.__({ phrase: ("companeyNotFound"), locale: `${req.query.lang}` })
            let obj = resPattern.errorPattern(httpStatus.NOT_FOUND, message);
            return res.status(obj.code).json(obj);
        }
    } catch (e) {
        return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
    }
}

const findallCompney = async (req, res, next) => {
    try {
        let finalQuery = []
        if (req.query.pageNo && req.query.limit) {
            finalQuery = [{
                $match: {},
            },
            {
                $skip: ((req.query.pageNo - 1) * req.query.limit)
            },
            {
                $limit: parseInt(req.query.limit)
            },
            {
                $lookup: {
                    from: "user",
                    let: { id: "$_id" },
                    pipeline: [
                        {
                            $match:
                            {
                                $expr:
                                {
                                    $and:
                                        [
                                            { $eq: ["$compneyId", "$$id"] }
                                        ]
                                }
                            }
                        },
                        { $project: { password: 0, adminPanelPassword: 0, otp: 0 } },
                    ],
                    as: "centerData"
                },
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
                                            { $eq: ["$compneyId", "$$id"] }
                                        ]
                                }
                            }
                        }
                    ],
                    as: "appointmentData"
                },
            },
            {
                $project: { _id: 1, createdAt: 1, centerData: 1, postalCode: 1, uniqueId: 1, "NIE/NIF/NRT": 1, compneyName: 1, country: 1, city: 1, telephone: 1, direction: 1, CP: 1, active: 1, bookingCount: { "$size": "$appointmentData" }, centerCount: { "$size": "$centerData" } }
            },]
        }
        else {
            finalQuery = [{
                $match: {},
            },
            {
                $lookup: {
                    from: "user",
                    let: { id: "$_id" },
                    pipeline: [
                        {
                            $match:
                            {
                                $expr:
                                {
                                    $and:
                                        [
                                            { $eq: ["$compneyId", "$$id"] }
                                        ]
                                }
                            }
                        },
                        { $project: { password: 0, adminPanelPassword: 0, otp: 0 } },

                    ],
                    as: "centerData"
                },
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
                                            { $eq: ["$compneyId", "$$id"] }
                                        ]
                                }
                            }
                        }
                    ],
                    as: "appointmentData"
                },
            },
            {
                $project: { _id: 1, createdAt: 1, centerData: 1, postalCode: 1, uniqueId: 1, "NIE/NIF/NRT": 1, compneyName: 1, country: 1, city: 1, telephone: 1, direction: 1, CP: 1, active: 1, bookingCount: { "$size": "$appointmentData" }, centerCount: { "$size": "$centerData" } }
            },]
        }
        let name = req.query.search
        if (name) {
            finalQuery[0]['$match'].compneyName = { '$regex': name, '$options': 'i' }
        }
        if (req.body.compneyName) {
            finalQuery[0]['$match'].compneyName = req.body.compneyName
        }
        if (req.body["NIE/NIF/NRT"]) {
            finalQuery[0]['$match']["NIE/NIF/NRT"] = req.body["NIE/NIF/NRT"]
        }
        if (req.body.uniqueId) {
            finalQuery[0]['$match'].uniqueId = req.body.uniqueId
        }
        if (req.body.country) {
            finalQuery[0]['$match'].country = req.body.country
        }
        let compneyData = await query.aggregate(compneyColl, finalQuery);
        let docs = []
        await compneyData.forEach((doc) =>
            docs.push(doc))
        for (let i = 0; i < docs.length; i++) {
            let total = 0;
            if (docs[i].centerData.length > 0) {

                for (let j = 0; j < docs[i].centerData.length; j++) {

                    if (docs[i].centerData[j].subscription) {
                        total = total + parseInt(docs[i].centerData[j].subscription.totalAmount)
                    }
                }
            }
            docs[i].totalAmount = `${total}`

        }
        if (req.body.Date && req.body.time) {
            let data = []
            if (docs.length > 0) {
                for (let i = 0; i < docs.length; i++) {
                    if (moment(docs[i].createdAt, "YYYY-MM-DDThh:mm:ss[Z]").format("DD-MM-YYYY") == req.body.Date && moment(docs[i].createdAt, "YYYY-MM-DDThh:mm:ss[Z]").format("HH:mm") == req.body.time && moment(docs[i].createdAt, "YYYY-MM-DDThh:mm:ss[Z]").format("HH:mm") == req.body.time) {
                        data.push(docs[i])
                    }
                }
                docs = data;
            }
        }
        else if (req.body.Date) {
            let data = []
            if (docs.length > 0) {
                for (let i = 0; i < docs.length; i++) {
                    console.log(moment(docs[i].createdAt, "YYYY-MM-DDThh:mm:ss[Z]").format("DD-MM-YYYY"))
                    if (moment(docs[i].createdAt, "YYYY-MM-DDThh:mm:ss[Z]").format("DD-MM-YYYY") == req.body.Date) {
                        data.push(docs[i])
                    }
                }
                docs = data;
            }
        }
        else if (req.body.time) {
            let data = []
            if (docs.length > 0) {
                for (let i = 0; i < docs.length; i++) {
                    if (moment(docs[i].createdAt, "YYYY-MM-DDThh:mm:ss[Z]").format("HH:mm") == `${req.body.time}`) {
                        data.push(docs[i])
                    }
                }
                docs = data;
            }
        }
        else {
            docs = docs
        }
        if (req.body.centerCount) {
            let data = []
            if (docs.length > 0) {
                for (let i = 0; i < docs.length; i++) {
                    if (moment(docs[i].centerCount) == req.body.centerCount) {
                        data.push(docs[i])
                    }
                }
                docs = data;
            }
        }
        if (req.body.price) {
            const splitPrice = req.body.price.split("-")
            if (splitPrice.length == 2) {
                let startPrice = splitPrice[0]
                let endPrice = splitPrice[1]
                let data = []
                if (docs.length > 0) {
                    for (let i = 0; i < docs.length; i++) {
                        if (parseInt(docs[i].totalAmount) >= parseInt(startPrice) && parseInt(docs[i].totalAmount) <= parseInt(endPrice)) {
                            data.push(docs[i])
                        }

                    }
                    docs = data
                }
            }
            else {
                let data = []
                if (docs.length > 0) {
                    for (let i = 0; i < docs.length; i++) {
                        if (parseInt(docs[i].totalAmount) == parseInt(req.body.price)) {
                            data.push(docs[i])
                        }
                    }
                    docs = data
                }
            }
        }
        let obj = resPattern.successPattern(httpStatus.OK, docs, 'success');
        return res.status(obj.code).json(obj)
    } catch (e) {
        return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
    }
}

const getCompneyDetail = async (req, res, next) => {
    try {
        let finalQuery = [{
            $match: {
                _id: ObjectID(req.params.id)
            },
        },
        {
            $lookup: {
                from: "user",
                let: { id: "$_id" },
                pipeline: [
                    {
                        $match:
                        {
                            $expr:
                            {
                                $and:
                                    [
                                        { $eq: ["$compneyId", "$$id"] }
                                    ]
                            }
                        }
                    }
                ],
                as: "centerData"
            },
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
                                        { $eq: ["$compneyId", "$$id"] }
                                    ]
                            }
                        }
                    }
                ],
                as: "appointmentData"
            },
        },
        {
            $project: { _id: 1, compneyName: 1, country: 1, beWare: 1, telephone: 1, direction: 1, CP: 1, active: 1, bookingCount: { "$size": "$appointmentData" }, centerCount: { "$size": "$centerData" } }
        }]
        let compneyData = await query.aggregate(compneyColl, finalQuery);
        let docs = []
        await compneyData.forEach((doc) =>
            docs.push(doc))
        let obj = resPattern.successPattern(httpStatus.OK, docs, 'success');
        return res.status(obj.code).json(obj)
    } catch (e) {
        return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
    }
}

const getCompneyDetailFromCenter = async (req, res, next) => {
    try {
        let finalQuery = [{
            $match: {
                _id: ObjectID(req.params.centerId)
            },
        },
        {
            $lookup: {
                from: "compney",
                let: { companey: "$compneyId" },
                pipeline: [
                    {
                        $match:
                        {
                            $expr:
                            {
                                $and:
                                    [
                                        { $eq: ["$_id", "$$companey"] }
                                    ]
                            }
                        }
                    }
                ],
                as: "companeyData"
            },
        },
        {
            $project: { _id: 1, name: 1, telephone: 1, direction: 1, emailAddress: 1, companeyData: 1 }
        }]
        let compneyData = await query.aggregate(userColl, finalQuery);
        let docs = []
        await compneyData.forEach((doc) =>
            docs.push(doc))
        let obj = resPattern.successPattern(httpStatus.OK, docs, 'success');
        return res.status(obj.code).json(obj)
    } catch (e) {
        return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
    }
}
module.exports = {
    createCompney,
    updateCompney,
    deleteCompney,
    getCompneyDetail,
    findallCompney,
    getCompneyDetailFromCenter
}