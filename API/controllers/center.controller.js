const APIError = require('../helpers/APIError');
const resPattern = require('../helpers/resPattern');
const httpStatus = require('http-status');
const db = require('../server')
const userColl = db.collection('user');
const centerColl = db.collection('center');
const appointmentColl = db.collection('appointment');
const serviceColl = db.collection('service');
const workerColl = db.collection('worker');
const scheduleColl = db.collection('schedule');
const PlanColl = db.collection('plan');
const query = require('../query/query')
const moment = require('moment');
const { generatePassword, generateOTP, sendEmail, mailTemp } = require('../helpers/commonfile');
const { ObjectID } = require('mongodb').ObjectID;
const jwt = require('jsonwebtoken');
const { json } = require('body-parser');
const momentTimeZone = require('moment-timezone');
const i18n = require('i18n');

const getCenterDetail = async (req, res) => {
    const { centerId, serviceId } = req.body
    try {
        let services = [];
        if (serviceId) {

            serviceId.forEach(id => {
                services.push(ObjectID(id))
            });


            let finalQuery = [{
                $match: { _id: ObjectID(centerId) },
            }, {
                $lookup: {
                    from: "category",
                    let: { details: "$categoryId.id" },
                    pipeline: [
                        {
                            $match:
                            {
                                $expr:
                                {
                                    $in:
                                        [
                                            "$uniqueId", "$$details"
                                        ]
                                }
                            }
                        }
                    ],
                    as: "categoryList"
                }
            },
            {
                $lookup:
                {
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
                                            {
                                                $in:
                                                    [
                                                        "$_id", services
                                                    ]
                                            },
                                            { $eq: ["$isDeleted", false] }
                                        ]
                                },
                            },
                        },
                        {
                            $lookup:
                            {
                                from: "worker",
                                let: { worker: "$workerId.id" },
                                pipeline: [
                                    {
                                        $match:
                                        {
                                            $expr:
                                            {
                                                $and:
                                                    [
                                                        {
                                                            $in:
                                                                [
                                                                    "$_id", "$$worker"
                                                                ]
                                                        },
                                                        { $eq: ["$isDeleted", false] }
                                                    ]
                                            },
                                        },
                                    },
                                    { $project: { pinCode: 0, password: 0 } },
                                ],
                                as: "workerList"
                            }
                        },
                        { $project: { workerId: 0 } },
                    ],
                    as: "serviceList"
                }
            },
            {
                $project: { emailAddress: 1, location: 1, name: 1, phonenumber: 1, categoryId: 1, image: 1, address: 1, categoryList: 1, serviceList: 1, workerList: 1, workerCount: { "$size": "$workerList" } }
            }
            ]

            let categoryData = await query.aggregate(userColl, finalQuery);
            let docs = []
            await categoryData.forEach((doc) =>
                docs.push(doc))
            for (let i = 0; i < docs.length; i++) {
                docs[i].categoryId = undefined
            }
            const obj = resPattern.successPattern(httpStatus.OK, docs, `success`);
            return res.status(obj.code).json({
                ...obj
            });

        } else {

            let finalQuery = [{
                $match: { _id: ObjectID(centerId) },
            }, {
                $lookup: {
                    from: "category",
                    let: { details: "$categoryId.id" },
                    pipeline: [
                        {
                            $match:
                            {
                                $expr:
                                {
                                    $in:
                                        [
                                            "$uniqueId", "$$details"
                                        ]
                                }
                            }
                        }
                    ],
                    as: "categoryList"
                }
            },
            {
                $lookup:
                {
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
                                            { $eq: ["$centerIds", "$$id"] },
                                            { $eq: ["$isDeleted", false] }
                                        ]
                                },
                            },
                        },
                    ],
                    as: "serviceList"
                }
            },
            {
                $lookup:
                {
                    from: "worker",
                    let: { id: "$_id" },
                    pipeline: [
                        {
                            $match:
                            {
                                $expr:
                                {
                                    $and:
                                        [
                                            { $eq: ["$centerIds", "$$id"] },
                                            { $eq: ["$isDeleted", false] }
                                        ]
                                },
                            },
                        },
                        { $project: { pinCode: 0 } },
                    ],
                    as: "workerList"
                }
            },
            {
                $project: { emailAddress: 1, location: 1, name: 1, phonenumber: 1, city: 1, country: 1, postalCode: 1, direction: 1, categoryId: 1, image: 1, address: 1, categoryList: 1, serviceList: 1, workerList: 1, workerCount: { "$size": "$workerList" } }
            }]
            let categoryData = await query.aggregate(userColl, finalQuery);
            let docs = []
            await categoryData.forEach((doc) =>
                docs.push(doc))
            for (let i = 0; i < docs.length; i++) {
                docs[i].categoryId = undefined
            }
            const obj = resPattern.successPattern(httpStatus.OK, docs, `success`);
            return res.status(obj.code).json({
                ...obj
            });
        }
    } catch (e) {
        return res.json({
            success: false,
            message: e && e.message ? e.message : "Somethning Went Wrong.",
        });
    }
};

const ActivateAccount = async (req, res) => {
    const { _id, expireTime } = req.user
    try {
        if (moment().format("YYYY-MM-DDThh:mm:ss") < expireTime) {
            const userData = await query.findOneAndUpdate(userColl,
                { _id: _id },
                { $set: { status: 1 } },
                { returnOriginal: false }
            )
            userData.value.expireTime = undefined
            userData.value.password = undefined
            let obj = resPattern.successPattern(httpStatus.OK, { user: userData.value }, 'success');
            return res.status(obj.code).json(obj);
        } else {
            const message = i18n.__({ phrase: ("verificationExpired"), locale: `${req.query.lang}` })
            let obj = resPattern.errorPattern(httpStatus.NOT_FOUND, message);
            return res.status(obj.code).json(obj);
        }
    } catch (e) {
        return res.json({
            success: false,
            message: e && e.message ? e.message : "Somethning Went Wrong.",
        });
    }
};

const centerStatus = async (req, res) => {
    try {
        const validCenter = await query.findOne(userColl, { _id: ObjectID(req.body.id) })
        if (validCenter) {
            const userData = await query.findOneAndUpdate(userColl,
                { _id: ObjectID(req.body.id) },
                { $set: { active: req.body.active } },
                { returnOriginal: false }
            )
            userData.value.expireTime = undefined
            userData.value.password = undefined
            let obj = resPattern.successPattern(httpStatus.OK, { user: userData.value }, 'success');
            return res.status(obj.code).json(obj);
        }
        else {
            const message = i18n.__({ phrase: ("centerNotFound"), locale: `${req.query.lang}` })
            let obj = resPattern.errorPattern(httpStatus.NOT_FOUND, message);
            return res.status(obj.code).json(obj);
        }
    } catch (e) {
        return res.json({
            success: false,
            message: e && e.message ? e.message : "Somethning Went Wrong.",
        });
    }
};

const addFavoriteCenter = async (req, res, next) => {
    const { _id, favoriteCenter } = req.user
    try {
        const validCenter = await query.findOne(userColl, { _id: ObjectID(req.body.centerId) })
        if (validCenter !== null) {
            if (validCenter.type === "center") {
                if (favoriteCenter.length > 0) {
                    let flag = false;
                    const CenterID = favoriteCenter;
                    const length = CenterID.length;
                    for (let i = 0; i < length; i++) {
                        if (String(CenterID[i].centerId) === String(ObjectID(req.body.centerId))) {
                            flag = true;
                            const message = i18n.__({ phrase: ("alreadyFavList"), locale: `${req.query.lang}` })
                            let obj = resPattern.errorPattern(httpStatus.ALREADY_REPORTED, message);
                            return res.status(obj.code).json(obj);
                        }
                    }
                    if (!flag) {
                        req.user.favoriteCenter.push({
                            centerId: ObjectID(req.body.centerId)
                        })
                        const userData = await query.findOneAndUpdate(userColl, { _id: _id }, { $set: req.user }, { returnOriginal: false })
                        userData.value.expireTime = undefined
                        userData.value.socialCredentials = undefined
                        userData.value.password = undefined
                        let obj = resPattern.successPattern(httpStatus.OK, { user: userData.value }, 'success');
                        return res.status(obj.code).json(obj);
                    }
                } else {
                    req.user.favoriteCenter.push({
                        centerId: ObjectID(req.body.centerId)
                    })
                    const userData = await query.findOneAndUpdate(userColl, { _id: _id }, { $set: req.user }, { returnOriginal: false })
                    userData.value.expireTime = undefined
                    userData.value.socialCredentials = undefined
                    userData.value.password = undefined
                    let obj = resPattern.successPattern(httpStatus.OK, { user: userData.value }, 'success');
                    return res.status(obj.code).json(obj);
                }
            } else {
                const message = i18n.__({ phrase: ("centerNotFound"), locale: `${req.query.lang}` })
                let obj = resPattern.errorPattern(httpStatus.NOT_FOUND, message);
                return res.status(obj.code).json(obj);
            }
        } else {
            const message = i18n.__({ phrase: ("centerNotFound"), locale: `${req.query.lang}` })
            let obj = resPattern.errorPattern(httpStatus.NOT_FOUND, message);
            return res.status(obj.code).json(obj);
        }
    }
    catch (e) {
        return res.json({
            success: false,
            message: e && e.message ? e.message : "Somethning Went Wrong.",
        });
    }
};

const removeFavoriteCenter = async (req, res, next) => {
    const { _id, favoriteCenter } = req.user
    try {
        const validCenter = await query.findOne(userColl, { _id: ObjectID(req.body.centerId) })
        if (validCenter.type === "center") {
            if (favoriteCenter.length > 0) {
                let flag = false;
                const CenterID = favoriteCenter;
                const length = CenterID.length;
                for (let i = 0; i < length; i++) {
                    if (String(CenterID[i].centerId) === String(ObjectID(req.body.centerId))) {
                        flag = true;
                        const deleteCenter = {
                            centerId: ObjectID(req.body.centerId)
                        }
                        const userData = await query.findOneAndUpdate(userColl, { _id: _id }, { $pull: { favoriteCenter: deleteCenter } }, { returnOriginal: false })
                        userData.value.expireTime = undefined
                        userData.value.socialCredentials = undefined
                        userData.value.password = undefined
                        let obj = resPattern.successPattern(httpStatus.OK, { user: userData.value }, 'success');
                        return res.status(obj.code).json(obj);
                    }
                }
                if (!flag) {
                    const message = i18n.__({ phrase: ("notFavList"), locale: `${req.query.lang}` })
                    let obj = resPattern.errorPattern(httpStatus.NOT_FOUND, message);
                    return res.status(obj.code).json(obj);
                }
            } else {
                const message = i18n.__({ phrase: ("emptyFavList"), locale: `${req.query.lang}` })
                let obj = resPattern.errorPattern(httpStatus.NOT_FOUND, message);
                return res.status(obj.code).json(obj);
            }
        }
        if (validCenter === null) {
            const message = i18n.__({ phrase: ("centerNotFound"), locale: `${req.query.lang}` })
            let obj = resPattern.errorPattern(httpStatus.NOT_FOUND, message);
            return res.status(obj.code).json(obj);
        }
    }
    catch (e) {
        return res.json({
            success: false,
            message: e && e.message ? e.message : "Somethning Went Wrong.",
        });
    }
};

const favoriteCenterList = async (req, res, next) => {
    try {
        const user = req.user;
        let storeResult = []
        const validCenter = await query.findOne(userColl, { _id: ObjectID(user._id) })
        if (validCenter.type === "client") {
            if (validCenter.favoriteCenter.length > 0) {
                for (let index = 0; index < validCenter.favoriteCenter.length; index++) {
                    const element = validCenter.favoriteCenter[index];
                    const centerDetail = await query.findOne(userColl, { _id: element.centerId })
                    centerDetail.password = undefined
                    centerDetail.adminPanelPassword = undefined
                    centerDetail.accessAdminPanel = undefined
                    centerDetail.expireTime = undefined
                    centerDetail.status = undefined
                    // centerDetail.verified = undefined
                    centerDetail.fcm_registration_token = undefined
                    storeResult.push(centerDetail)
                }
                const obj = resPattern.successPattern(httpStatus.OK, storeResult, `success`);
                return res.status(obj.code).json({ ...obj });
            } else {
                const message = i18n.__({ phrase: ("emptyFavList"), locale: `${req.query.lang}` })
                let obj = resPattern.errorPattern(httpStatus.NOT_FOUND, message);
                return res.status(obj.code).json(obj);
            }
        } else {
            const message = i18n.__({ phrase: ("userAccess"), locale: `${req.query.lang}` })
            let obj = resPattern.errorPattern(httpStatus.UNAUTHORIZED, message);
            return res.status(obj.code).json(obj);
        }
    } catch (e) {
        return next(new APIError(e.message, httpStatus.BAD_REQUEST, true));
    }
}

// search center by 
const searchCenter = async (req, res, next) => {
    try {
        const sortBy = {
            '_id': '_id',
            'name': 'name'
        }

        const sortByDate = {
            'lastAdded': 'createdAt'
        };
        let type = req.body.type !== undefined ? req.body.type : "center"
        let finalQuery = []
        if (type == "center") {
            if (req.query.pageNo && req.query.limit) {
                finalQuery = [{
                    $match: { type: type },
                },
                {
                    $skip: ((req.query.pageNo - 1) * req.query.limit)
                },
                {
                    $limit: parseInt(req.query.limit)
                },
                {
                    $lookup:
                    {
                        from: "worker",
                        let: { id: "$_id" },
                        pipeline: [
                            {
                                $match:
                                {
                                    $expr:
                                    {
                                        $and:
                                            [
                                                { $eq: ["$centerIds", "$$id"] },
                                                { $eq: ["$isDeleted", false] }
                                            ]
                                    },
                                },
                            },
                            { $project: { pinCode: 0 } },
                        ],
                        as: "workerList"
                    }
                },
                {
                    $lookup:
                    {
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
                                                { $eq: ["$centerIds", "$$id"] },
                                                { $eq: ["$isDeleted", false] }
                                            ]
                                    },
                                },
                            },
                        ],
                        as: "serviceList"
                    }
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
                                                { $eq: ["$centerId", "$$id"] }
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
                        from: "category",
                        let: { details: "$categoryId.id" },
                        pipeline: [
                            {
                                $match:
                                {
                                    $expr:
                                    {
                                        $in:
                                            [
                                                "$uniqueId", "$$details"
                                            ]
                                    }
                                }
                            }
                        ],
                        as: "categoryList"
                    }
                },
                {
                    $project: { _id: 1, uniqueId: 1, workerList: 1, isExternalUrl: 1, externalUrl: 1, centerUrl: 1, serviceList: 1, name: 1, country: 1, emailAddress: 1, phonenumber: 1, direction: 1, postalCode: 1, city: 1, location: 1, timezone: 1, type: 1, categoryList: 1, isDeleted: 1, createdAt: 1, address: 1, image: 1, status: 1, active: 1, workerCount: { "$size": "$workerList" }, bookingCount: { "$size": "$appointmentData" } }
                },]
            }
            else {
                finalQuery = [{
                    $match: { type: type },
                },
                {
                    $lookup:
                    {
                        from: "worker",
                        let: { id: "$_id" },
                        pipeline: [
                            {
                                $match:
                                {
                                    $expr:
                                    {
                                        $and:
                                            [
                                                { $eq: ["$centerIds", "$$id"] },
                                                { $eq: ["$isDeleted", false] }
                                            ]
                                    },
                                },
                            },
                            { $project: { pinCode: 0 } },
                        ],
                        as: "workerList"
                    }
                },
                {
                    $lookup:
                    {
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
                                                { $eq: ["$centerIds", "$$id"] },
                                                { $eq: ["$isDeleted", false] }
                                            ]
                                    },
                                },
                            },
                        ],
                        as: "serviceList"
                    }
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
                                                { $eq: ["$centerId", "$$id"] }
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
                        from: "category",
                        let: { details: "$categoryId.id" },
                        pipeline: [
                            {
                                $match:
                                {
                                    $expr:
                                    {
                                        $in:
                                            [
                                                "$uniqueId", "$$details"
                                            ]
                                    }
                                }
                            }
                        ],
                        as: "categoryList"
                    }
                },
                {
                    $project: { _id: 1, uniqueId: 1, isExternalUrl: 1, externalUrl: 1, centerUrl: 1, name: 1, country: 1, emailAddress: 1, phonenumber: 1, direction: 1, postalCode: 1, city: 1, location: 1, timezone: 1, type: 1, categoryList: 1, isDeleted: 1, createdAt: 1, address: 1, image: 1, status: 1, active: 1, workerList: 1, serviceList: 1, workerCount: { "$size": "$workerList" }, bookingCount: { "$size": "$appointmentData" } }
                },]
            }
        }
        else {
            if (req.query.pageNo && req.query.limit) {
                finalQuery = [{
                    $match: { type: type },
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
                                                { $eq: ["$centerId", "$$id"] }
                                            ]
                                    }
                                }
                            }
                        ],
                        as: "appointmentData"
                    },
                },
                {
                    $project: { _id: 1, uniqueId: 1, idCard: 1, name: 1, country: 1, emailAddress: 1, phonenumber: 1, direction: 1, postalCode: 1, city: 1, location: 1, timezone: 1, type: 1, categoryId: 1, isDeleted: 1, createdAt: 1, address: 1, image: 1, status: 1, active: 1, bookingCount: { "$size": "$appointmentData" } }
                },]
            }
            else {
                finalQuery = [{
                    $match: { type: type },
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
                                                { $eq: ["$centerId", "$$id"] }
                                            ]
                                    }
                                }
                            }
                        ],
                        as: "appointmentData"
                    },
                },
                {
                    $project: { _id: 1, idCard: 1, uniqueId: 1, name: 1, country: 1, emailAddress: 1, phonenumber: 1, direction: 1, postalCode: 1, city: 1, location: 1, timezone: 1, type: 1, categoryId: 1, isDeleted: 1, createdAt: 1, address: 1, image: 1, status: 1, active: 1, bookingCount: { "$size": "$appointmentData" } }
                },]
            }
        }

        let name = req.query.search
        let categoryId = req.body.categoryId !== undefined ? req.body.categoryId : undefined
        if (name) {
            finalQuery[0]['$match'].name = { '$regex': name, '$options': 'i' }
        }
        if (req.body.categoryId !== undefined) {
            finalQuery[0]['$match'].categoryId = {
                "$elemMatch":
                {
                    $eq: { id: categoryId }
                }
            }
        }
        if (req.body.location) {
            finalQuery[0]['$match'].location = {
                $geoWithin: {
                    $centerSphere: [
                        [parseFloat(req.body.location.longitude), parseFloat(req.body.location.latitude)], 20 / 3963.2
                    ]
                }
            };
        }
        if (req.body.isDeleted !== undefined) {
            finalQuery[0]['$match'].isDeleted = req.body.isDeleted
        }
        if (req.body.active !== undefined) {
            finalQuery[0]['$match'].active = req.body.active
        }
        if (req.body.sortBy && req.body.sortOrder) {
            finalQuery.splice(1, 0, {
                "$sort": {
                    [sortBy[req.body.sortBy]]: req.body.sortOrder
                }
            })
        }
        finalQuery.splice(1, 0, { "$sort": { [sortByDate['lastAdded']]: -1 } })
        let userData = await query.aggregate(userColl, finalQuery);
        let docs = []
        await userData.forEach((doc) =>
            docs.push(doc))
        let obj = resPattern.successPattern(httpStatus.OK, docs, 'success');
        return res.status(obj.code).json(obj)
    }
    catch (e) {
        return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
    }
};


// search center by geo-location
let getCenters = async (req, res, next) => {
    let param = req.body;
    var searchLocation = {
        $and: [{
            type: "center"
        }, {
            "location": {
                $geoWithin: {
                    $centerSphere: [
                        [parseFloat(param.longitude), parseFloat(param.latitude)], 20 / 3963.2
                    ]
                },
            }
        }],
    };
    let getQuery = [{
        "$match": searchLocation
    },
    {
        $lookup: {
            from: "category",
            let: { details: "$categoryId.id" },
            pipeline: [
                {
                    $match:
                    {
                        $expr:
                        {
                            $in:
                                [
                                    "$uniqueId", "$$details"
                                ]
                        }
                    }
                }
            ],
            as: "categoryList"
        }
    }]
    if (req.body.categoryId) {
        getQuery[0].$match['categoryId.id'] = req.body.categoryId;
    }

    let findQuery = getQuery;

    let centersData = await query.aggregate(userColl, findQuery);
    let docs = []
    await centersData.forEach((doc) => docs.push(doc))
    for (let i = 0; i < docs.length; i++) {
        docs[i].password = undefined
        docs[i].adminPanelPassword = undefined
        docs[i].accessAdminPanel = undefined
        docs[i].expireTime = undefined
        docs[i].status = undefined
        // docs[i].verified = undefined
        docs[i].fcm_registration_token = undefined
    }
    const obj = resPattern.successPattern(httpStatus.OK, { message: "done", docs }, `success`);
    return res.status(obj.code).json(
        obj
    );
}


const centerlist = async (req, res, next) => {
    try {
        let docs;
        docs = await query.find(userColl, { type: "center" });
        if (docs) {
            for (let i = 0; i < docs.length; i++) {
                docs[i].password = undefined
                docs[i].adminPanelPassword = undefined
                docs[i].accessAdminPanel = undefined
                docs[i].expireTime = undefined
                docs[i].status = undefined
                // docs[i].verified = undefined
                docs[i].fcm_registration_token = undefined
            }
            let obj = resPattern.successPattern(httpStatus.OK, docs, 'success');
            return res.status(obj.code).json(obj)
        } else {
            const message = i18n.__({ phrase: ("centerNotFound"), locale: `${req.query.lang}` })
            let obj = resPattern.errorPattern(httpStatus.NOT_FOUND, message);
            return res.status(obj.code).json(obj);
        }
    } catch (e) {
        return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
    }
}

// center's worker List
const WorkerInCenter = async (req, res, next) => {
    try {
        const month = moment(req.body.Date, 'DD-MM-YYYY').format('MM');
        const year = moment(req.body.Date, 'DD-MM-YYYY').format('YYYY');

        // months start at index 0 in momentjs, so we subtract 1
        const startDate = moment([year, month - 1, 01]).format("YYYY-MM-DD");

        // get the number of days for this month
        const daysInMonth = moment(startDate).daysInMonth();

        // we are adding the days in this month to the start date (minus the first day)
        const endDate = moment(startDate).add(daysInMonth - 1, 'days').format("YYYY-MM-DD");

        let finalQuery = [{
            $match: { _id: ObjectID(req.body.centerId) }
        },
        {
            $project: { password: 0 }
        },
        {
            $lookup:
            {
                from: "schedule",
                let: { id: "$_id" },
                pipeline: [
                    {
                        $match:
                        {
                            $expr:
                            {
                                $and:
                                    [
                                        { $eq: ["$centerId", "$$id"] }
                                    ]
                            },
                        },
                    },
                    { $project: { defaultSchedule: 1, customSchedule: 1, centerId: 1, _id: 0 } },
                ],
                as: "centerScheduleData"
            }
        },
        {
            $lookup:
            {
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
                                        { $eq: ["$centerIds", "$$id"] },
                                        { $eq: ["$isDeleted", false] }
                                    ]
                            },
                        },
                    },
                ],
                as: "serviceList"
            }
        },
        {
            $lookup:
            {
                from: "worker",
                let: { id: "$_id" },
                pipeline: [
                    {
                        $match:
                        {
                            $expr:
                            {
                                $and:
                                    [
                                        { $eq: ["$centerIds", "$$id"] },
                                        { $eq: ["$isDeleted", false] }
                                    ]
                            },
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
                                                    {
                                                        $eq: ["$worker", "$$id"]
                                                    }, {
                                                        $eq: ["$Date", req.body.Date]
                                                    },
                                                    {
                                                        $eq: ["$status", "accepted"]
                                                    }
                                                ]
                                        }
                                    }
                                }
                            ],
                            as: "appointmentData"
                        },
                    },
                    { $project: { pin: 0 } },
                    {
                        $lookup:
                        {
                            from: "event",
                            let: { id: "$_id" },
                            pipeline: [
                                {
                                    $match:
                                    {
                                        $expr:
                                        {
                                            $and:
                                                [
                                                    {
                                                        $eq: ["$workerId", "$$id"]
                                                    },
                                                    {
                                                        $eq: ["$centerId", ObjectID(req.body.centerId)]
                                                    }
                                                ]
                                        }
                                    }
                                }
                            ],
                            as: "eventList"
                        }
                    },
                    { $project: { pinCode: 0, password: 0 } },
                    // { $project: { emailAddress: 1, name: 1, phonenumber: 1, image: 1 } },
                ],
                as: "workerData"
            }
        }]
        let centerData = await query.aggregate(userColl, finalQuery);
        let docs = []
        await centerData.forEach((doc) => docs.push(doc))
        if (docs.length > 0) {
            docs[0].password = undefined
            docs[0].adminPanelPassword = undefined
            docs[0].accessAdminPanel = undefined
            docs[0].expireTime = undefined
            docs[0].status = undefined
            // docs[0].verified = undefined
            docs[0].fcm_registration_token = undefined
            docs[0].createdAt = undefined
            docs[0].otp = undefined
            docs[0].categoryId = undefined

            const timeZone = docs[0].timezone.split(" ")
            const centerTimeZone = momentTimeZone.tz(moment(), timeZone[0])
            let currentDate = moment(centerTimeZone).format("YYYY-MM-DD")
            let currentDays = moment(req.body.Date, "DD-MM-YYYY").format('dddd')
            for (let i = 0; i < docs[0].workerData.length; i++) {
                let timeArray = []
                let eventArray = []
                let nextAppointment = false
                let previousAppointment = false
                let runningAppointment = false
                if (docs[0].workerData[i].customSchedule) {
                    if (docs[0].workerData[i].customSchedule.length > 0) {
                        let length = docs[0].workerData[i].customSchedule.length;
                        for (let d = 0; d < length; d++) {

                            let customDate = moment(docs[0].workerData[i].customSchedule[d].Date, "DD-MM-YYYY").format("YYYY-MM-DD")
                            if ((moment(req.body.Date, "DD-MM-YYYY").format("YYYY-MM-DD")) == currentDate) {
                                if (customDate == currentDate) {
                                    if (docs[0].workerData[i].customSchedule[d].time.length > 0) {
                                        let time = docs[0].workerData[i].customSchedule[d].time.length

                                        for (let t = 0; t < time; t++) {
                                            let currentTime = moment(centerTimeZone).format('YYYY-MM-DD HH:mm')
                                            const startFullDate = moment(`${docs[0].workerData[i].customSchedule[d].Date} ${docs[0].workerData[i].customSchedule[d].time[t].endTime}`, 'DD-MM-YYYY HH:mm').format('YYYY-MM-DD HH:mm');
                                            if (startFullDate >= currentTime) {
                                                timeArray.push(docs[0].workerData[i].customSchedule[d].time[t])
                                            }
                                        }
                                    }
                                }
                            }
                            if ((moment(req.body.Date, "DD-MM-YYYY").format("YYYY-MM-DD")) > currentDate) {
                                if ((moment(req.body.Date, "DD-MM-YYYY").format("YYYY-MM-DD")) == customDate) {
                                    if (docs[0].workerData[i].customSchedule[d].time.length > 0) {
                                        let time = docs[0].workerData[i].customSchedule[d].time.length

                                        for (let t = 0; t < time; t++) {
                                            timeArray.push(docs[0].workerData[i].customSchedule[d].time[t])
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                if (timeArray.length == 0) {
                    if (docs[0].workerData[i].defaultSchedule) {
                        if (docs[0].workerData[i].defaultSchedule.length > 0) {
                            let length = docs[0].workerData[i].defaultSchedule.length;
                            for (let d = 0; d < length; d++) {
                                if (docs[0].workerData[i].defaultSchedule[d].Days == currentDays) {
                                    if (docs[0].workerData[i].defaultSchedule[d].time.length > 0) {
                                        let time = docs[0].workerData[i].defaultSchedule[d].time.length

                                        for (let t = 0; t < time; t++) {
                                            let currentTime = moment(centerTimeZone).format('YYYY-MM-DD HH:mm')
                                            const startFullDate = moment(`${moment(req.body.Date, 'DD-MM-YYYY').format('DD-MM-YYYY')} ${docs[0].workerData[i].defaultSchedule[d].time[t].endTime}`, 'DD-MM-YYYY HH:mm').format('YYYY-MM-DD HH:mm');
                                            if (startFullDate >= currentTime) {
                                                timeArray.push(docs[0].workerData[i].defaultSchedule[d].time[t])
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                if (docs[0].workerData[i].appointmentData.length > 0) {
                    let length = docs[0].workerData[i].appointmentData.length;
                    for (let d = 0; d < length; d++) {
                        let currentTime = moment(centerTimeZone).format('YYYY-MM-DD HH:mm')
                        let appointmentEndTime = moment(`${moment(docs[0].workerData[i].appointmentData[d].Date, 'DD-MM-YYYY').format('DD-MM-YYYY')} ${docs[0].workerData[i].appointmentData[d].endTime}`, 'DD-MM-YYYY HH:mm').format('YYYY-MM-DD HH:mm');
                        let appointmentStartTime = moment(`${moment(docs[0].workerData[i].appointmentData[d].Date, 'DD-MM-YYYY').format('DD-MM-YYYY')} ${docs[0].workerData[i].appointmentData[d].startTime}`, 'DD-MM-YYYY HH:mm').format('YYYY-MM-DD HH:mm');
                        docs[0].workerData[i].appointmentData[d].previousAppointment = previousAppointment
                        docs[0].workerData[i].appointmentData[d].nextAppointment = nextAppointment
                        docs[0].workerData[i].appointmentData[d].runningAppointment = runningAppointment
                        if (currentTime > appointmentEndTime) {
                            docs[0].workerData[i].appointmentData[d].previousAppointment = true
                        }
                        else if (currentTime < appointmentStartTime) {
                            docs[0].workerData[i].appointmentData[d].nextAppointment = true
                        }
                        else {
                            docs[0].workerData[i].appointmentData[d].runningAppointment = true
                        }
                    }
                }
                docs[0].workerData[i].availableTime = timeArray

                let timesArray = []
                let timing = docs[0].workerData[i].availableTime
                for (let x = 0; x < timing.length; x++) {
                    let startTime = timing[x].startTime
                    let endTime = timing[x].endTime
                    let start = startTime.split(":")
                    let end = endTime.split(":")
                    for (let j = start[0]; j <= end[0] - 1; j++) {
                        if (j == start[0]) {
                            timesArray.push(startTime)
                        }
                        startTime = moment(startTime, 'HH:mm').add(1, 'hour').format("HH:mm")
                        timesArray.push(startTime)
                    }
                    timesArray.push(endTime)
                }
                let uniqueArray = [...new Set(timesArray)]
                docs[0].workerData[i].splitTime = uniqueArray
                //event in month
                if (docs[0].workerData[i].eventList.length > 0) {
                    for (let e = 0; e < docs[0].workerData[i].eventList.length; e++) {
                        if (moment(docs[0].workerData[i].eventList[e].startDate, "DD-MM-YYYY").format("YYYY-MM-DD") <= endDate && moment(docs[0].workerData[i].eventList[e].startDate, "DD-MM-YYYY").format("YYYY-MM-DD") >= startDate) {
                            eventArray.push(docs[0].workerData[i].eventList[e])
                        }
                    }
                }
                docs[0].workerData[i].eventList = eventArray
            }

            //center available time
            for (let i = 0; i < docs[0].centerScheduleData.length; i++) {
                let centertimeArray = []
                if (docs[0].centerScheduleData[i].customSchedule) {
                    if (docs[0].centerScheduleData[i].customSchedule.length > 0) {
                        let length = docs[0].centerScheduleData[i].customSchedule.length;
                        for (let d = 0; d < length; d++) {

                            let customDate = moment(docs[0].centerScheduleData[i].customSchedule[d].Date, "DD-MM-YYYY").format("YYYY-MM-DD")
                            if ((moment(req.body.Date, "DD-MM-YYYY").format("YYYY-MM-DD")) == currentDate) {
                                if (customDate == currentDate) {
                                    if (docs[0].centerScheduleData[i].customSchedule[d].time.length > 0) {
                                        let time = docs[0].centerScheduleData[i].customSchedule[d].time.length

                                        for (let t = 0; t < time; t++) {
                                            let currentTime = moment(centerTimeZone).format('YYYY-MM-DD HH:mm')
                                            const startFullDate = moment(`${docs[0].centerScheduleData[i].customSchedule[d].Date} ${docs[0].centerScheduleData[i].customSchedule[d].time[t].endTime}`, 'DD-MM-YYYY HH:mm').format('YYYY-MM-DD HH:mm');
                                            if (startFullDate >= currentTime) {
                                                centertimeArray.push(docs[0].centerScheduleData[i].customSchedule[d].time[t])
                                            }
                                        }
                                    }
                                }
                            }
                            if ((moment(req.body.Date, "DD-MM-YYYY").format("YYYY-MM-DD")) > currentDate) {
                                if ((moment(req.body.Date, "DD-MM-YYYY").format("YYYY-MM-DD")) == customDate) {
                                    if (docs[0].centerScheduleData[i].customSchedule[d].time.length > 0) {
                                        let time = docs[0].centerScheduleData[i].customSchedule[d].time.length

                                        for (let t = 0; t < time; t++) {
                                            centertimeArray.push(docs[0].centerScheduleData[i].customSchedule[d].time[t])
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                if (centertimeArray.length == 0) {
                    if (docs[0].centerScheduleData[i].defaultSchedule) {
                        if (docs[0].centerScheduleData[i].defaultSchedule.length > 0) {
                            let length = docs[0].centerScheduleData[i].defaultSchedule.length;
                            for (let d = 0; d < length; d++) {
                                if (docs[0].centerScheduleData[i].defaultSchedule[d].Days == currentDays) {
                                    if (docs[0].centerScheduleData[i].defaultSchedule[d].time.length > 0) {
                                        let time = docs[0].centerScheduleData[i].defaultSchedule[d].time.length

                                        for (let t = 0; t < time; t++) {
                                            let currentTime = moment(centerTimeZone).format('YYYY-MM-DD HH:mm')
                                            const startFullDate = moment(`${moment(req.body.Date, 'DD-MM-YYYY').format('DD-MM-YYYY')} ${docs[0].centerScheduleData[i].defaultSchedule[d].time[t].endTime}`, 'DD-MM-YYYY HH:mm').format('YYYY-MM-DD HH:mm');
                                            if (startFullDate >= currentTime) {
                                                centertimeArray.push(docs[0].centerScheduleData[i].defaultSchedule[d].time[t])
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                docs[0].centerScheduleData[i].availableTime = centertimeArray

                let timeArray = []
                let timing = docs[0].centerScheduleData[i].availableTime
                for (let x = 0; x < timing.length; x++) {
                    let startTime = timing[x].startTime
                    let endTime = timing[x].endTime
                    let start = startTime.split(":")
                    let end = endTime.split(":")
                    for (let j = start[0]; j <= end[0] - 1; j++) {
                        if (j == start[0]) {
                            timeArray.push(startTime)
                        }
                        startTime = moment(startTime, 'HH:mm').add(1, 'hour').format("HH:mm")
                        timeArray.push(startTime)
                    }
                    timeArray.push(endTime)
                }
                let uniqueArray = [...new Set(timeArray)]
                docs[0].centerScheduleData[i].splitTime = uniqueArray
            }
        }
        const obj = resPattern.successPattern(httpStatus.OK, docs, `success`);
        return res.status(obj.code).json({
            ...obj
        });
    }
    catch (e) {
        return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
    }
};

const deletecenter = async (req, res, next) => {
    try {
        const centerdata = { _id: ObjectID(req.params.centerId), type: "center" };
        const checkcenter = await query.findOne(userColl, centerdata)
        if (checkcenter) {

            const checkAppointment = await query.find(appointmentColl, { centerId: ObjectID(req.params.centerId) })
            if (checkAppointment.length > 0) {
                await query.updateMany(appointmentColl,
                    { centerId: ObjectID(req.params.centerId) },
                    { $set: { isDeleted: true } },
                    { returnOriginal: false })
            }
            const checkSchedule = await query.find(scheduleColl, { centerId: ObjectID(req.params.centerId) })
            if (checkSchedule.length > 0) {
                await query.findOneAndUpdate(scheduleColl,
                    { centerId: ObjectID(req.params.centerId) },
                    { $set: { isDeleted: true } },
                    { returnOriginal: false })
            }
            const checkService = await query.find(serviceColl, { centerIds: ObjectID(req.params.centerId) })
            if (checkService.length > 0) {
                await query.updateMany(serviceColl,
                    { centerIds: ObjectID(req.params.centerId) },
                    { $set: { isDeleted: true } },
                    { returnOriginal: false })
            }
            const checkWorker = await query.find(workerColl, { centerIds: ObjectID(req.params.centerId) })
            if (checkWorker.length > 0) {
                await query.updateMany(workerColl,
                    { centerIds: ObjectID(req.params.centerId) },
                    { $set: { isDeleted: true } },
                    { returnOriginal: false })
            }
            await query.findOneAndUpdate(userColl,
                { _id: ObjectID(req.params.centerId) },
                { $set: { isDeleted: true } },
                { returnOriginal: false })
            let obj = resPattern.successPattern(httpStatus.OK, "Center Deleted !", 'success');
            return res.status(obj.code).json(obj);
        } else {
            const message = i18n.__({ phrase: ("centerNotFound"), locale: `${req.query.lang}` })
            let obj = resPattern.errorPattern(httpStatus.NOT_FOUND, message);
            return res.status(obj.code).json(obj);
        }
    } catch (e) {
        return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
    }
}


module.exports = {
    getCenterDetail,
    ActivateAccount,
    favoriteCenterList,
    addFavoriteCenter,
    removeFavoriteCenter,
    searchCenter,
    getCenters,
    centerlist,
    WorkerInCenter,
    deletecenter,
    centerStatus
}