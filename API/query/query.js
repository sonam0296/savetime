var moment = require('moment');
exports.findOne = (collection, query, additionalParameter) => {
    return new Promise((resolve, reject) => {
        additionalParameter == undefined ?
            collection.findOne(query, (err, queryResult) => {
                if (err) {
                    return reject({ message: "DB query Failed" });
                } else {
                    resolve(queryResult);
                }
            }) : collection.findOne(query, additionalParameter, (err, queryResult) => {
                if (err) {
                    return reject({ message: "DB query Failed" });
                } else {
                    resolve(queryResult);
                }
            })
    })
}
exports.findByPagination = (collection, query1, searchText, project, pageNo, limit) => {
    return new Promise(async (resolve, reject) => {
        let query = await collection.find(query1,
            searchText,
        ).project(project).skip((pageNo - 1) * limit).limit(limit),
            list = await query.toArray(),
            countTotal = await query.count();
        resolve({ totalPage: countTotal, list: list })
    })
}
exports.insert = (collection, query) => {
    query.createdAt = moment().utc().format();
    return new Promise((resolve, reject) => {
        collection.insert(query, (err, recordSaved) => {
            if (recordSaved) {
                resolve(recordSaved)
            } else {
                console.log("err", err)
                reject(err)
            }
        })
    })
}
exports.insertMany = (collection, query) => {
    // query.createdAt= moment().utc().format();
    return new Promise((resolve, reject) => {
        collection.insertMany(query, (err, recordSaved) => {
            if (recordSaved) {
                resolve(recordSaved)
            } else {
                console.log("err", err)
                reject(err)
            }
        })
    })
}
exports.updateMany = (collection, query, setParameters, getResponseBack) => {
    return new Promise((resolve, reject) => {
        collection.updateMany(query, setParameters, getResponseBack, (err, recordSaved) => {
            err ? reject(err) : resolve(recordSaved)
        })
    })
}
exports.findOneAndUpdate = (collection, query, setParameters, getResponseBack) => {
    return new Promise((resolve, reject) => {
        collection.findOneAndUpdate(query, setParameters, getResponseBack, (err, recordSaved) => {
            err ? reject(err) : resolve(recordSaved)
        })
    })
}
exports.deleteMany = (collection, query) => {
    return new Promise((resolve, reject) => {
        collection.deleteMany(query, (err, deletedRecords) => {
            err ? reject(err) : resolve(deletedRecords)
        })
    })
}

exports.deleteOne = (collection, query) => {
    return new Promise((resolve, reject) => {
        collection.deleteOne(query, (err, deletedRecords) => {
            if (err) {
                reject({ message: "DB query Failed" });
            } else {
                resolve(deletedRecords)
            }
        })
    })
}
exports.find = (collection, query1, additionalParameter, sorting, project) => {

    return new Promise((resolve, reject) => {
        additionalParameter == undefined ?
            collection.find(query1).project(project).sort(sorting).toArray((err, queryResult) => {
                if (err) {
                    return reject({ message: "DB query Failed" });
                } else {
                    resolve(queryResult);
                }
            }) : collection.find(query1, additionalParameter).project(project).sort(sorting).toArray((err, queryResult) => {
                if (err) {
                    return reject({ message: "DB query Failed" });
                } else {
                    resolve(queryResult);
                }
            })
    })
}
exports.findWithLimit = (collection, query1, additionalParameter, sorting, project, pageNo, limit) => {
    return new Promise((resolve, reject) => {
        additionalParameter == undefined ?
            collection.find(query1).project(project).sort(sorting).skip((pageNo - 1) * limit).limit(limit).toArray((err, queryResult) => {
                if (err) {
                    return reject({ message: "DB query Failed" });
                } else {
                    resolve(queryResult);
                }
            }) : collection.find(query1, additionalParameter).project(project).sort(sorting).skip((pageNo - 1) * limit).limit(limit).toArray((err, queryResult) => {
                if (err) {
                    return reject({ message: "DB query Failed" });
                } else {
                    resolve(queryResult);
                }
            })
    })
}

exports.aggregate = (collection, query) => {
    return new Promise((resolve, reject) => {
        collection.aggregate(query, { cursor: { batchSize: 1 } }, (err, queryResult) => {
            err ? reject(err) : resolve(queryResult)
        })
    })
}

exports.findDistinct = (collection, field, query, additionalParameter) => {
    return new Promise((resolve, reject) => {

        collection.distinct(field, query ? query : {}, additionalParameter ? additionalParameter : {}, (err, queryResult) => {
            if (err) {
                return reject({ message: "DB query Failed" });
            } else {
                resolve(queryResult);
            }
        })
    })
}
exports.count = (collection, query) => {
    return new Promise((resolve, reject) => {
        collection.count(query, (err, queryResult) => {
            if (err) {
                return reject({ message: "DB query Failed" });
            } else {
                resolve(queryResult);
            }
        })
    })
}