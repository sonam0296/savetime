const APIError = require('../helpers/APIError');
const resPattern = require('../helpers/resPattern');
const httpStatus = require('http-status');
const db = require('../server')
const userColl = db.collection('user');
const categoryColl = db.collection('category');
const query = require('../query/query')
const uniqueString = require('unique-string');
const i18n= require('i18n');

const createCategory = async (req, res, next) => {
    try {
        const categorydata = { categoryName: req.body.categoryName };

        const checkCategory = await query.findOne(categoryColl, categorydata)
        if (checkCategory) {
            const message = i18n.__({ phrase: ("categoryAlreadyAvailable"), locale: `${req.query.lang}` })
            let obj = resPattern.errorPattern(httpStatus.ALREADY_REPORTED, message);
            return res.status(obj.code).json(obj);
        } else {
            const category = req.body
            category.uniqueId = uniqueString();
            const insertdata = await query.insert(categoryColl, category)
            let data = insertdata.ops
            let obj = resPattern.successPattern(httpStatus.OK, { data }, 'success');
            return res.status(obj.code).json(obj);
        }
    } catch (e) {
        return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
    }
}

const updateCategory = async (req, res, next) => {
    try {
        const { uniqueId, categoryName, image } = req.body
        const categorydata = { uniqueId: uniqueId, };
        let setData = {
            categoryName, image
        }
        const checkCategory = await query.findOne(categoryColl, categorydata)
        if (checkCategory) {
            const timeTableData = await query.findOneAndUpdate(categoryColl,
                { uniqueId: uniqueId },
                { $set: setData },
                { returnOriginal: false }
            )
            let obj = resPattern.successPattern(httpStatus.OK, timeTableData.value, 'success');
            return res.status(obj.code).json(obj);
        } else {
            const message = i18n.__({ phrase: ("categoryNotFound"), locale: `${req.query.lang}` })
            let obj = resPattern.errorPattern(httpStatus.NOT_FOUND, message);
            return res.status(obj.code).json(obj);
        }
    } catch (e) {
        return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
    }
}

const deleteCategory = async (req, res, next) => {
    try {
        const categorydata = { uniqueId: req.body.uniqueId };

        const checkCategory = await query.findOne(categoryColl, categorydata)
        if (checkCategory) {
            await query.deleteOne(categoryColl, categorydata)
            let obj = resPattern.successPattern(httpStatus.OK, "Category Deleted !", 'success');
            return res.status(obj.code).json(obj);
        } else {
            const message = i18n.__({ phrase: ("categoryNotFound"), locale: `${req.query.lang}` })
            let obj = resPattern.errorPattern(httpStatus.NOT_FOUND, message);
            return res.status(obj.code).json(obj);
        }
    } catch (e) {
        return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
    }
}

const findallCategory = async (req, res, next) => {
    try {
        const findallCategorys = await query.find(categoryColl, {}, { createdAt: -1 })
        const obj = resPattern.successPattern(httpStatus.OK, findallCategorys, `success`);
        return res.status(obj.code).json({
            ...obj
        });
    } catch (e) {
        return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
    }
}

const getCategoryDetail = async (req, res, next) => {
    try {
        const getCategoryDetails = await query.findOne(categoryColl, { uniqueId: req.params.uniqueId }, { createdAt: -1 })
        const obj = resPattern.successPattern(httpStatus.OK, getCategoryDetails, `success`);
        return res.status(obj.code).json({
            ...obj
        });
    } catch (e) {
        return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
    }
}

const categoryFilter = async (req, res, next) => {
    const categoryId = req.body.categoryId;
    const pageNo = req.query.pageNo;
    let limit = parseInt(req.query.limit)

    try {
        let finalQuery = [{
            $match: { uniqueId: categoryId },
        }, {
            $lookup:
            {
                from: "user",
                let: { id: "$uniqueId" },
                pipeline: [
                    {
                        $match:
                        {
                            $expr:
                            {
                                $and:
                                    [
                                        { $in: ["$$id", "$categoryId.id"] }
                                    ]
                            },
                            type: "center",
                        },
                    },
                    // { $project: { _id: 0 } },
                    { $project: { emailAddress: 1, name: 1, phonenumber: 1, image: 1 } },
                    { $skip: ((pageNo - 1) * limit) },
                    { $limit: limit }
                ],
                as: "centerList"
            },
        },
        ]

        let categoryData = await query.aggregate(categoryColl, finalQuery);
        let docs = []
        await categoryData.forEach((doc) => docs.push(doc))
        const obj = resPattern.successPattern(httpStatus.OK, docs, `success`);
        return res.status(obj.code).json({
            ...obj
        });
    } catch (e) {
        return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
    }
}

const categoryFilterForApp = async (req, res, next) => {
    try {
        const categoryId = req.body.categoryId;
        if (categoryId !== undefined) {
            let finalQuery = [{
                $match: { uniqueId: categoryId },
            }, {
                $lookup:
                {
                    from: "user",
                    let: { id: "$uniqueId" },
                    pipeline: [
                        {
                            $match:
                            {
                                $expr:
                                {
                                    $and:
                                        [
                                            { $in: ["$$id", "$categoryId.id"] }
                                        ]
                                },
                                type: "center",
                            },
                        },
                        {
                            $project: {
                                emailAddress: 1, name: 1, phonenumber: 1, image: 1, address: 1, NIE_NIF_NRT: 1, location: 1, idCard: 1
                            }
                        },
                    ],
                    as: "centerList"
                },
            },
            ]
            let categoryData = await query.aggregate(categoryColl, finalQuery);
            let docs = []
            await categoryData.forEach((doc) => docs.push(doc))
            const obj = resPattern.successPattern(httpStatus.OK, docs, `success`);
            return res.status(obj.code).json({
                ...obj
            });
        } else {
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
        }
    } catch (e) {
        return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
    }
}


module.exports = {
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryDetail,
    findallCategory,
    categoryFilter,
    categoryFilterForApp,
}