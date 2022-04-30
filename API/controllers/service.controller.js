const APIError = require('../helpers/APIError');
const resPattern = require('../helpers/resPattern');
const httpStatus = require('http-status');
const db = require('../server')
const userColl = db.collection('user');
const workerColl = db.collection('worker');
const appointmentColl = db.collection('appointment');
const Service = db.collection('service');
const query = require('../query/query')
const moment = require('moment');
const currentDate = moment().format("YYYY-MM-DDThh:mm:ss[Z]");
const { ObjectID } = require('mongodb').ObjectID;
const momentTimeZone = require('moment-timezone');
const { daysBetweenDates } = require('../helpers/commonfile');
const ejs = require("ejs");
const { sendEmail } = require('../helpers/commonfile');
const i18n = require('i18n');

// Create Personal Service
const createServicePersonal = async (req, res, next) => {
  try {
    const userId = req.user._id
    let centerIds = ObjectID(req.body.centerIds);
    const { serviceName, duration, price, type, workerId, overLappedServices, isSelfSufficient } = req.body;

    // check available service by name
    const serviceInfo = await query.find(Service, { serviceName: serviceName })
    let length = serviceInfo.length
    let found = false
    for (let i = 0; i < length; i++) {
      const element = serviceInfo[i];
      // checking type of service and center of the service
      if (element.type === type && String(element.centerIds) === String(centerIds) && element.isDeleted == false) {
        // also check same worker of the service
        for (let x = 0; x < element.workerId.length; x++) {
          for (let k = 0; k < workerId.length; k++) {
            if (String(element.workerId[x].id) === workerId[k].id) {
              found = true
              const message = i18n.__({ phrase: ("serviceAlreadyCreated"), locale: `${req.query.lang}` }, type, serviceName)
              let obj = resPattern.errorPattern(httpStatus.ALREADY_REPORTED, message);
              return res.status(obj.code).json(obj);
            }
          }
        }
      }
    }
    // for convert String To ObjectId of worker
    let newWorkerArray = []
    for (let index = 0; index < workerId.length; index++) {
      const element = workerId[index];
      newWorkerArray.push({ id: ObjectID(element.id) })
    }
    let newServiceOverlapped = []
    if (overLappedServices) {
      for (let index = 0; index < overLappedServices.length; index++) {
        const element = overLappedServices[index];
        const overlappedserviceInfo = await query.findOne(Service, { _id: ObjectID(element.serviceId) })
        newServiceOverlapped.push({ serviceId: ObjectID(element.serviceId), startTime: element.startTime, endTime: element.endTime, overLappedServiceDuration: overlappedserviceInfo.duration, overLappedServiceName: overlappedserviceInfo.serviceName })
      }
    }

    if (!found) {
      let obj1 = {
        serviceName,
        duration,
        price,
        userId,
        type,
        workerId: workerId.length === 0 ? [] : newWorkerArray,
        centerIds,
        active: true,
        isDeleted: false,
        overLappedServices: overLappedServices ? newServiceOverlapped : [],
        isSelfSufficient
      }
      await query.insert(Service, obj1);
      // let message = "Service Created Successfully"
      let obj = resPattern.successPattern(httpStatus.OK, obj1, `success`);
      return res.status(obj.code).json(obj);
    }

    if (serviceInfo.length === 0) {
      let obj1 = {
        serviceName,
        duration,
        price,
        userId,
        type,
        workerId: workerId.length === 0 ? [] : newWorkerArray,
        centerIds,
        active: true,
        isDeleted: false,
        overLappedServices: overLappedServices.length === 0 ? [] : newServiceOverlapped,
        isSelfSufficient
      }
      await query.insert(Service, obj1);
      // message = "Service Created Successfully"
      let obj = resPattern.successPattern(httpStatus.OK, obj1, `success`);
      return res.status(obj.code).json(obj);
    }
  }

  catch (e) {
    return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
  }
}

// Update Personal Service Api
const updateServicePersonal = async (req, res, next) => {
  try {
    const setData = req.body;
    const serviceData = await query.findOne(Service, { _id: ObjectID(req.params.serviceId) })
    let customArr = []

    if (req.body.serviceName) {
      const serviceInfo = await query.findOne(Service, { serviceName: req.body.serviceName })
      let found = false
      // checking type of service and center of the service
      if (serviceInfo) {
        if (serviceInfo.type === serviceData.type && String(serviceInfo.centerIds) === String(serviceData.centerIds) && serviceInfo.isDeleted == false) {
          found = true
          const message = i18n.__({ phrase: ("serviceAlreadyCreated"), locale: `${req.query.lang}` }, serviceData.type, req.body.serviceName)
          let objs = resPattern.errorPattern(httpStatus.ALREADY_REPORTED, message);
          return res.status(objs.code).json(objs)
        }
      }
    }
    if (req.body.customDate) {
      if (req.body.customDate.length > 0) {
        for (let a = 0; a < req.body.customDate.length; a++) {
          let dateArr = daysBetweenDates(req.body.customDate[a].startDate, req.body.customDate[a].endDate);

          // if (serviceData.customSchedule.length > 0) {
          //   for (let b = 0; b < dateArr.length; b++) {
          //     let obj = {}
          //     obj.Date = dateArr[b]
          //     obj.time = req.body.customDate[a].time
          //     serviceData.customSchedule.push(obj)
          //   }

          // }

          // else {
          for (let b = 0; b < dateArr.length; b++) {
            let objs = {}
            objs.Date = dateArr[b]
            objs.time = req.body.customDate[a].time
            customArr.push(objs)
          }
          setData.customSchedule = customArr
          // }
          // serviceData.customDate.push(req.body.customDate[a])
        }
      }
    }
    // setData.customSchedule = serviceData.customSchedule
    // setData.customDate = serviceData.customDate

    if (req.body.workerId) {
      let newWorkerArray = []
      for (let index = 0; index < req.body.workerId.length; index++) {
        const element = req.body.workerId[index];
        newWorkerArray.push({ id: ObjectID(element.id) })
      }
      setData.workerId = newWorkerArray
    }
    if (req.body.overLappedServices) {
      let newServiceOverlapped = []
      for (let index = 0; index < req.body.overLappedServices.length; index++) {
        const element = req.body.overLappedServices[index];
        const overlappedserviceInfo = await query.findOne(Service, { _id: ObjectID(element.serviceId) })
        newServiceOverlapped.push({ serviceId: ObjectID(element.serviceId), startTime: element.startTime, endTime: element.endTime, overLappedServiceDuration: overlappedserviceInfo.duration, overLappedServiceName: overlappedserviceInfo.serviceName })
      }
      setData.overLappedServices = newServiceOverlapped
    }
    if (req.body.overLappedServiceId) {
      if (serviceData.overLappedServices.length > 0) {
        const findIndexes = serviceData.overLappedServices.findIndex(x => x.serviceId.toString() === req.body.overLappedServiceId);
        const overlappedserviceInfo = await query.findOne(Service, { _id: ObjectID(req.body.overLappedServiceId) })
        serviceData.overLappedServices[findIndexes] = { serviceId: ObjectID(req.body.overLappedServiceId), startTime: req.body.overLappedStartTime, endTime: req.body.overLappedEndtime, overLappedServiceDuration: overlappedserviceInfo.duration, overLappedServiceName: overlappedserviceInfo.serviceName }
        setData.overLappedServices = serviceData.overLappedServices
      }
    }
    if (req.body.active && req.body.isSendMail) {
      const checkCenter = await query.findOne(userColl, { _id: ObjectID(serviceData.centerIds) })

      const checkAppointments = await query.find(appointmentColl, { serviceId: ObjectID(serviceData._id) })
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
    setData.updatedAt = currentDate
    delete setData.overLappedServiceId
    delete setData.overLappedStartTime
    delete setData.overLappedEndtime
    let result = await query.findOneAndUpdate(Service, { _id: ObjectID(req.params.serviceId) }, { $set: setData }, { returnOriginal: false });
    // message = "Service Updated Successfully"
    let obj = resPattern.successPattern(httpStatus.OK, result.value, `success`);
    return res.status(obj.code).json(obj);
  }
  catch (e) {
    return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
  }
}

const findoverLappingService = async (req, res, next) => {
  try {
    const centerId = ObjectID(req.body.centerId);
    let serviceData = await query.find(Service, { centerIds: centerId });

    let docs = []
    await serviceData.forEach((doc) =>
      docs.push(doc))
    for (let i = 0; i < docs.length; i++) {
      if (docs[i]._id == req.body.serviceId) {
        docs[i] = {}
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

// Create Collective Service Api
const createServiceCollective = async (req, res, next) => {
  try {

    const userId = req.user._id
    let { serviceName, isSelfSufficient, duration, price, type, maxPerson, customSchedule, customDate, defaultSchedule, workerId, overLappedServices } = req.body;
    let centerIds = ObjectID(req.body.centerIds);

    const serviceInfo = await query.find(Service, { serviceName: serviceName })

    let length = serviceInfo.length
    let found = false
    for (let i = 0; i < length; i++) {
      const element = serviceInfo[i];

      if (element.type === type && String(element.centerIds) === String(centerIds) && element.isDeleted == false) {
        found = true
        const message = i18n.__({ phrase: ("serviceAlreadyCreated"), locale: `${req.query.lang}` }, type, serviceName)
        let obj = resPattern.errorPattern(httpStatus.ALREADY_REPORTED, message);
        return res.status(obj.code).json(obj);
      }
    }

    let newWorkerArray = []
    for (let index = 0; index < workerId.length; index++) {
      const element = workerId[index];
      newWorkerArray.push({ id: ObjectID(element.id) })
    }
    let newServiceOverlapped = []
    if (overLappedServices) {
      for (let index = 0; index < overLappedServices.length; index++) {
        const element = overLappedServices[index];
        newServiceOverlapped.push({ serviceId: ObjectID(element.serviceId), currentServiceDuration: element.currentServiceDuration, nextServiceDuration: element.nextServiceDuration })
      }
    }
    let customArr = []
    if (customDate) {
      if (customDate.length > 0) {

        for (let a = 0; a < customDate.length; a++) {
          let dateArr = daysBetweenDates(customDate[a].startDate, customDate[a].endDate);
          for (let b = 0; b < dateArr.length; b++) {
            let obj = {}
            obj.Date = dateArr[b]
            obj.time = customDate[a].time
            customArr.push(obj)
          }
          customSchedule = customArr
        }
      }
    }

    if (customDate == undefined) {
      customSchedule = [];
      customDate = []
    }
    if (customDate.length == 0) {
      customSchedule = []
    }
    if (defaultSchedule == undefined) {
      defaultSchedule = []
    }

    if (!found) {
      let obj1 = {
        serviceName,
        duration,
        price,
        type,
        workerId: workerId === null ? '' : newWorkerArray,
        centerIds,
        maxPerson,
        userId,
        customSchedule,
        customDate,
        defaultSchedule,
        active: true,
        isDeleted: false,
        overLappedServices: overLappedServices ? newServiceOverlapped : [],
        isSelfSufficient
      }

      await query.insert(Service, obj1);
      // message = "Service Created Successfully"
      let obj = resPattern.successPattern(httpStatus.OK, obj1, `success`);
      return res.status(obj.code).json(obj);
    }

    if (serviceInfo.length === 0) {
      let obj1 = {
        serviceName,
        duration,
        price,
        type,
        workerId: workerId === null ? '' : newWorkerArray,
        centerIds,
        maxPerson,
        userId,
        customSchedule,
        customDate,
        defaultSchedule,
        active: true,
        isDeleted: false,
        overLappedServices: overLappedServices ? newServiceOverlapped : [],
        isSelfSufficient
      }

      await query.insert(Service, obj1);
      // message = "Service Created Successfully"
      let obj = resPattern.successPattern(httpStatus.OK, obj1, `success`);
      return res.status(obj.code).json(obj);
    }
  }
  catch (e) {
    return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
  }
}

// Update Collective Service Api
const updateServiceCollective = async (req, res, next) => {
  try {
    const userId = req.user._id
    const {
      serviceName,
      duration,
      price,
      type,
      serviceId,
      maxPerson,
      customSchedule,
      workerId,
      active,
      overLappedServices
    } = req.body;

    let centerIds = ObjectID(req.body.centerIds);
    let newWorkerArray = []
    for (let index = 0; index < workerId.length; index++) {
      const element = workerId[index];
      newWorkerArray.push({ id: ObjectID(element.id) })
    }
    let newServiceOverlapped = []
    for (let index = 0; index < overLappedServices.length; index++) {
      const element = overLappedServices[index];
      newServiceOverlapped.push({ serviceId: ObjectID(element.serviceId), currentServiceDuration: element.currentServiceDuration, nextServiceDuration: element.nextServiceDuration })
    }

    let obj1 = {
      serviceName,
      duration,
      price,
      type,
      workerId: workerId === null ? '' : newWorkerArray,
      centerIds,
      maxPerson: maxPerson === null ? 1 : maxPerson,
      userId,
      customSchedule,
      updatedAt: currentDate,
      active,
      overLappedServices: overLappedServices.length === 0 ? [] : newServiceOverlapped
    }

    let result = await query.findOneAndUpdate(Service, { _id: ObjectID(serviceId) }, { $set: obj1 }, { returnOriginal: false });
    // message = "Service Updated Successfully"
    let obj = resPattern.successPattern(httpStatus.OK, result.value, `success`);
    return res.status(obj.code).json(obj);

  }

  catch (e) {
    return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
  }
}

// get service details
const getServiceDetails = async (req, res, next) => {
  try {
    const reqData = ObjectID(req.params.serviceId);
    let finalQuery = [{
      $match: { _id: reqData }
    },
    {
      $lookup: {
        from: "worker",
        let: { worker: "$workerId.id" },
        pipeline: [
          {
            $match:
            {
              $expr:
              {
                $and: [
                  { $in: ["$_id", "$$worker"] },
                  { $eq: ["$isDeleted", false] }
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

    let categoryData = await query.aggregate(Service, finalQuery);
    let docs = []
    await categoryData.forEach((doc) =>
      docs.push(doc))
    for (let i = 0; i < docs.length; i++) {
      docs[i].workerId = undefined
    }
    const obj = resPattern.successPattern(httpStatus.OK, docs, `success`);
    return res.status(obj.code).json({
      ...obj
    });

  } catch (e) {
    return next(new APIError(e.message, httpStatus.BAD_REQUEST, true));
  }
}

// delete Service
const deleteService = async (req, res, next) => {
  try {
    const checkService = await query.findOne(Service, { _id: ObjectID(req.params.serviceId) })
    if (checkService) {
      await query.findOneAndUpdate(Service,
        { _id: ObjectID(req.params.serviceId) },
        { $set: { isDeleted: true } },
        { returnOriginal: false })
      if (req.body.isSendMail) {
        const checkCenter = await query.findOne(userColl, { _id: ObjectID(checkService.centerIds) })

        const checkAppointments = await query.find(appointmentColl, { serviceId: ObjectID(checkService._id) })
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
      const obj = resPattern.successPattern(httpStatus.OK, `Service Deleted !`, `success`);
      return res.status(obj.code).json({
        ...obj
      });
    } else {
      const message = i18n.__({ phrase: ("serviceNotFound"), locale: `${req.query.lang}` })
      let obj = resPattern.errorPattern(httpStatus.NOT_FOUND, message);
      return res.status(obj.code).json(obj);
    }
  }
  catch (e) {
    return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
  }
};

const getWorkerByService = async (req, res, next) => {
  try {
    const getServiceDetail = await query.findOne(Service, { _id: ObjectID(req.body.serviceId) })
    if (getServiceDetail) {
      if (getServiceDetail.workerId.length > 0) {
        const result = await query.findOne(userColl, { _id: ObjectID(getServiceDetail.centerIds) });
        const timeZone = result.timezone.split(" ")
        const centerTimeZone = momentTimeZone.tz(moment(), timeZone[0])
        for (let a = 0; a < getServiceDetail.workerId.length; a++) {
          let currentDates = moment(centerTimeZone).format("YYYY-MM-DD")
          const workerData = await query.findOne(workerColl, { _id: ObjectID(req.body.workerId) })
          let timeArray = []
          let currentDays = moment(req.body.Date, "DD-MM-YYYY").format('dddd')
          if (workerData.customSchedule) {
            if (workerData.customSchedule.length > 0) {
              let length = workerData.customSchedule.length;
              for (let d = 0; d < length; d++) {

                let customDate = moment(workerData.customSchedule[d].Date, "DD-MM-YYYY").format("YYYY-MM-DD")
                if ((moment(req.body.Date, "DD-MM-YYYY").format("YYYY-MM-DD")) == currentDates) {
                  if (customDate == currentDates) {
                    if (workerData.customSchedule[d].time.length > 0) {
                      let time = workerData.customSchedule[d].time.length

                      for (let t = 0; t < time; t++) {
                        let currentTime = moment(centerTimeZone).format('YYYY-MM-DD HH:mm')
                        const startFullDate = moment(`${workerData.customSchedule[d].Date} ${workerData.customSchedule[d].time[t].endTime}`, 'DD-MM-YYYY HH:mm').format('YYYY-MM-DD HH:mm');
                        if (startFullDate >= currentTime) {
                          timeArray.push(workerData.customSchedule[d].time[t])
                        }
                      }
                    }
                  }
                }
                if ((moment(req.body.Date, "DD-MM-YYYY").format("YYYY-MM-DD")) > currentDates) {
                  if ((moment(req.body.Date, "DD-MM-YYYY").format("YYYY-MM-DD")) == customDate) {
                    if (workerData.customSchedule[d].time.length > 0) {
                      let time = workerData.customSchedule[d].time.length

                      for (let t = 0; t < time; t++) {
                        timeArray.push(workerData.customSchedule[d].time[t])
                      }
                    }
                  }
                }
              }
            }
          }
          if (timeArray.length == 0) {
            if (workerData.defaultSchedule) {
              if (workerData.defaultSchedule.length > 0) {
                let length = workerData.defaultSchedule.length;
                for (let d = 0; d < length; d++) {
                  if (workerData.defaultSchedule[d].Days == currentDays) {
                    if (workerData.defaultSchedule[d].time.length > 0) {
                      let time = workerData.defaultSchedule[d].time.length

                      for (let t = 0; t < time; t++) {
                        let currentTime = moment(centerTimeZone).format('YYYY-MM-DD HH:mm')
                        const startFullDate = moment(`${moment(req.body.Date, 'DD-MM-YYYY').format('DD-MM-YYYY')} ${workerData.defaultSchedule[d].time[t].endTime}`, 'DD-MM-YYYY HH:mm').format('YYYY-MM-DD HH:mm');
                        if (startFullDate >= currentTime) {
                          timeArray.push(workerData.defaultSchedule[d].time[t])
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          workerData.availableTime = timeArray
          const obj = resPattern.successPattern(httpStatus.OK, workerData, `success`);
          return res.status(obj.code).json({
            ...obj
          });
        }
      }
      else {
        const message = i18n.__({ phrase: ("workerNotFound"), locale: `${req.query.lang}` })
        let obj = resPattern.errorPattern(httpStatus.NOT_FOUND, message);
        return res.status(obj.code).json(obj);
      }
    }
    else {
      const message = i18n.__({ phrase: ("serviceNotFound"), locale: `${req.query.lang}` })
      let obj = resPattern.errorPattern(httpStatus.NOT_FOUND, message);
      return res.status(obj.code).json(obj);
    }

  } catch (e) {
    return next(new APIError(e.message, httpStatus.BAD_REQUEST, true));
  }
}
// select multiple service
const getMultipleService = async (req, res, next) => {
  try {
    let services = [];
    req.body.serviceId.forEach(id => {
      services.push(ObjectID(id))
    });

    let finalQuery = [{
      $match: { _id: { $in: services } }
    },
    {
      $lookup: {
        from: "worker",
        let: { worker: "$workerId.id" },
        pipeline: [
          {
            $match:
            {
              $expr:
              {
                $and: [
                  { $in: ["$_id", "$$worker"] },
                  { $eq: ["$isDeleted", false] }
                ]
              }
            }
          },
          {
            $project: { password: 0 }
          },
        ],
        as: "workerData"
      },
    },
    {
      $project: {
        _id: 1,
        centerIds: 1,
        workerData: 1
      }
    }
    ]
    let serviceData = await query.aggregate(Service, finalQuery);
    let docs = []
    await serviceData.forEach((doc) => docs.push(doc))
    const result = await query.findOne(userColl, { _id: ObjectID(docs[0].centerIds) });
    const timeZone = result.timezone.split(" ")
    const centerTimeZone = momentTimeZone.tz(moment(), timeZone[0])
    for (let a = 0; a < docs[0].workerData.length; a++) {
      let currentDates = moment(centerTimeZone).format("YYYY-MM-DD")
      let timeArray = []
      let temp, size;
      let currentDays = moment(centerTimeZone).isoWeekday()
      if (docs[0].workerData[a].customSchedule) {
        if (docs[0].workerData[a].customSchedule.length > 0) {
          let length = docs[0].workerData[a].customSchedule.length;
          for (let d = 0; d < length; d++) {
            let customDate = moment(docs[0].workerData[a].customSchedule[d].Date, "DD-MM-YYYY").format("YYYY-MM-DD")
            if (customDate >= currentDates) {
              if (docs[0].workerData[a].customSchedule[d].time.length > 0) {
                let time = docs[0].workerData[a].customSchedule[d].time.length

                for (let t = 0; t < time; t++) {
                  let currentTime = moment(centerTimeZone).format('YYYY-MM-DD HH:mm')
                  const startFullDate = moment(`${docs[0].workerData[a].customSchedule[d].Date} ${docs[0].workerData[a].customSchedule[d].time[t].startTime}`, 'DD-MM-YYYY HH:mm').format('YYYY-MM-DD HH:mm');
                  if (startFullDate >= currentTime) {
                    timeArray.push(`${moment(docs[0].workerData[a].customSchedule[d].Date, 'DD-MM-YYYY').format('YYYY-MM-DD')} ${docs[0].workerData[a].customSchedule[d].time[t].startTime}`)
                  }

                  size = timeArray.length;
                  for (let i = 0; i < size; i++) {
                    for (let j = i + 1; j < size; j++) {
                      if (timeArray[i] < timeArray[j]) {
                        temp = timeArray[i];
                        timeArray[i] = timeArray[j];
                        timeArray[j] = temp;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      if (docs[0].workerData[a].defaultSchedule) {
        if (docs[0].workerData[a].defaultSchedule.length > 0) {
          let length = docs[0].workerData[a].defaultSchedule.length;
          for (let d = 0; d < length; d++) {
            let defaultScheduleDay

            if (docs[0].workerData[a].defaultSchedule[d].Days == 'Monday') {
              defaultScheduleDay = 1
            }
            if (docs[0].workerData[a].defaultSchedule[d].Days == 'Tuesday') {
              defaultScheduleDay = 2
            }
            if (docs[0].workerData[a].defaultSchedule[d].Days == 'Wednesday') {
              defaultScheduleDay = 3
            }
            if (docs[0].workerData[a].defaultSchedule[d].Days == 'Thursday') {
              defaultScheduleDay = 4
            }
            if (docs[0].workerData[a].defaultSchedule[d].Days == 'Friday') {
              defaultScheduleDay = 5
            }
            if (docs[0].workerData[a].defaultSchedule[d].Days == 'Saturday') {
              defaultScheduleDay = 6
            }
            if (docs[0].workerData[a].defaultSchedule[d].Days == 'Sunday') {
              defaultScheduleDay = 7
            }
            if (defaultScheduleDay == currentDays) {
              if (docs[0].workerData[a].defaultSchedule[d].time.length > 0) {
                let time = docs[0].workerData[a].defaultSchedule[d].time.length

                for (let t = 0; t < time; t++) {
                  let currentTime = moment(centerTimeZone).format('YYYY-MM-DD HH:mm')
                  const startFullDate = moment(`${moment().format('DD-MM-YYYY')} ${docs[0].workerData[a].defaultSchedule[d].time[t].startTime}`, 'DD-MM-YYYY HH:mm').format('YYYY-MM-DD HH:mm');
                  if (startFullDate >= currentTime) {
                    timeArray.push(`${moment().format('YYYY-MM-DD')} ${docs[0].workerData[a].defaultSchedule[d].time[t].startTime}`)
                  }

                  size = timeArray.length;
                  for (let i = 0; i < size; i++) {
                    for (let j = i + 1; j < size; j++) {
                      if (timeArray[i] < timeArray[j]) {
                        temp = timeArray[i];
                        timeArray[i] = timeArray[j];
                        timeArray[j] = temp;
                      }
                    }
                  }
                }
              }
            }
            if (defaultScheduleDay > currentDays) {
              if (docs[0].workerData[a].defaultSchedule[d].time.length > 0) {
                let time = docs[0].workerData[a].defaultSchedule[d].time.length

                for (let t = 0; t < time; t++) {
                  timeArray.push(`${moment().add(defaultScheduleDay - currentDays, 'days').format('YYYY-MM-DD')} ${docs[0].workerData[a].defaultSchedule[d].time[t].startTime}`)
                  size = timeArray.length;

                  for (let i = 0; i < size; i++) {
                    for (let j = i + 1; j < size; j++) {
                      if (timeArray[i] < timeArray[j]) {
                        temp = timeArray[i];
                        timeArray[i] = timeArray[j];
                        timeArray[j] = temp;
                      }
                    }
                  }

                }
              }
            }
          }
        }
      }
      if (timeArray.length == 0) {
        if (docs[0].workerData[a].defaultSchedule) {
          if (docs[0].workerData[a].defaultSchedule.length > 0) {
            let length = docs[0].workerData[a].defaultSchedule.length;
            for (let d = 0; d < length; d++) {
              let defaultScheduleDay
              let nextWeekDay;
              if (docs[0].workerData[a].defaultSchedule[d].Days == 'Monday') {
                defaultScheduleDay = 1;
                nextWeekDay = 1
              }
              if (docs[0].workerData[a].defaultSchedule[d].Days == 'Tuesday') {
                defaultScheduleDay = 2;
                nextWeekDay = 2
              }
              if (docs[0].workerData[a].defaultSchedule[d].Days == 'Wednesday') {
                defaultScheduleDay = 3;
                nextWeekDay = 3
              }
              if (docs[0].workerData[a].defaultSchedule[d].Days == 'Thursday') {
                defaultScheduleDay = 4;
                nextWeekDay = 4
              }
              if (docs[0].workerData[a].defaultSchedule[d].Days == 'Friday') {
                defaultScheduleDay = 5;
                nextWeekDay = 5
              }
              if (docs[0].workerData[a].defaultSchedule[d].Days == 'Saturday') {
                defaultScheduleDay = 6;
                nextWeekDay = 6
              }
              if (docs[0].workerData[a].defaultSchedule[d].Days == 'Sunday') {
                defaultScheduleDay = 7;
                nextWeekDay = 7
              }
              let dayAdded = (7 - currentDays) + nextWeekDay
              if (defaultScheduleDay == nextWeekDay) {
                if (docs[0].workerData[a].defaultSchedule[d].time.length > 0) {
                  let time = docs[0].workerData[a].defaultSchedule[d].time.length

                  for (let t = 0; t < time; t++) {
                    timeArray.push(`${moment().add(dayAdded, 'days').format('YYYY-MM-DD')} ${docs[0].workerData[a].defaultSchedule[d].time[t].startTime}`)

                    size = timeArray.length;
                    for (let i = 0; i < size; i++) {
                      for (let j = i + 1; j < size; j++) {
                        if (timeArray[i] < timeArray[j]) {
                          temp = timeArray[i];
                          timeArray[i] = timeArray[j];
                          timeArray[j] = temp;
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      docs[0].workerData[a].soonestAvailable = moment(timeArray[size - 1], 'YYYY-MM-DD HH:mm').format('DD-MM-YYYY HH:mm')
    }
    // message = 'Service fetched successfully'
    let obj = resPattern.successPattern(httpStatus.OK, docs, 'success');
    return res.status(obj.code).json(obj);
  } catch (e) {
    return next(new APIError(e.message, httpStatus.BAD_REQUEST, true));
  }
}

// find Service 
const findCenterService = async (req, res, next) => {
  try {
    const centerId = ObjectID(req.params.centerId);
    let finalQuery = [{
      $sort: { _id: -1 }
    },
    {
      $match: { centerIds: centerId, isDeleted: false }
    },
    {
      $lookup: {
        from: "worker",
        let: { worker: "$workerId.id" },
        pipeline: [
          {
            $match:
            {
              $expr:
              {
                $and: [
                  { $in: ["$_id", "$$worker"] },
                  { $eq: ["$isDeleted", false] }
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
    }
      , {
      $lookup: {
        from: "user",
        let: { center: "$centerIds" },
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
            $project: {
              _id: 1, name: 1, image: 1, active: 1
            }
          },
        ],
        as: "centerData"
      }
    }]

    let categoryData = await query.aggregate(Service, finalQuery);
    let docs = []
    await categoryData.forEach((doc) =>
      docs.push(doc))
    for (let i = 0; i < docs.length; i++) {
      docs[i].workerId = undefined
      docs[i].centerIds = undefined
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

const serviceFilter = async (req, res, next) => {
  try {
    const centerId = ObjectID(req.body.centerId);
    let finalQuery = [{
      $sort: { _id: -1 }
    },
    {
      $match: { centerIds: centerId }
    },
    {
      $lookup: {
        from: "worker",
        let: { worker: "$workerId.id" },
        pipeline: [
          {
            $match:
            {
              $expr:
              {
                $and: [
                  { $in: ["$_id", "$$worker"] },
                  { $eq: ["$isDeleted", false] }
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
    }, {
      $lookup: {
        from: "user",
        let: { center: "$centerIds" },
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
            $project: {
              _id: 1, name: 1, image: 1, active: 1
            }
          },
        ],
        as: "centerData"
      }
    }]
    if (req.body.type !== undefined) {
      finalQuery[1]['$match'].type = req.body.type
    }
    let categoryData = await query.aggregate(Service, finalQuery);
    let docs = []
    await categoryData.forEach((doc) =>
      docs.push(doc))
    for (let i = 0; i < docs.length; i++) {
      docs[i].workerId = undefined
      docs[i].centerIds = undefined

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

const findWorkerService = async (req, res, next) => {
  try {
    let condition = {};
    condition.workerId = {
      "$elemMatch":
      {
        $eq: { id: ObjectID(req.body.workerId) }
      }
    }
    condition.centerIds = ObjectID(req.body.centerId)
    let serviceData = await query.find(Service, condition);
    if (serviceData.length > 0) {
      let obj = resPattern.successPattern(httpStatus.OK, serviceData, 'success');
      return res.status(obj.code).json(obj)
    } else {
      const message = i18n.__({ phrase: ("serviceNotFound"), locale: `${req.query.lang}` })
      let obj = resPattern.errorPattern(httpStatus.NOT_FOUND, message);
      return res.status(obj.code).json(obj);
    }
  }
  catch (e) {
    return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
  }
};

const removeWorker = async (req, res, next) => {
  try {
    let reqData = req.body;
    let testquery = { workerId: { $elemMatch: { id: ObjectID(reqData.id) } } }
    const serviceInfo = await query.find(Service, testquery)

    if (serviceInfo.length > 0) {

      for (let index = 0; index < serviceInfo.length; index++) {
        const element = serviceInfo[index];

        if (String(element._id) === reqData.serviceId) {
          if (element.workerId.length > 1) {
            for (let i = 0; i < element.workerId.length; i++) {
              if (String(element.workerId[i].id) === req.body.id) {
                const deleteCenter = {
                  id: ObjectID(req.body.id)
                }
                const userData = await query.findOneAndUpdate(Service, { _id: ObjectID(req.body.serviceId) }, { $pull: { workerId: deleteCenter } }, { returnOriginal: false })
                let obj = resPattern.successPattern(httpStatus.OK, { user: userData.value }, 'success');
                return res.status(obj.code).json(obj);
              }
            }

          } else {
            await query.findOneAndUpdate(Service, { _id: ObjectID(req.body.serviceId) }, { $set: { workerId: [] } });
            // if (result.deletedCount === 1) {
            const message = `Service Remove From Worker !'`;
            let obj = resPattern.successPattern(httpStatus.OK, message, 'success');
            return res.status(obj.code).json(obj);
            // }
          }
        }
      }
    } else {
      const message = i18n.__({ phrase: ("serviceNotFound"), locale: `${req.query.lang}` })
      let obj = resPattern.errorPattern(httpStatus.NOT_FOUND, message);
      return res.status(obj.code).json(obj);
    }
  } catch (e) {
    return next(new APIError(e.message, httpStatus.BAD_REQUEST, true));
  }
}

module.exports = {
  createServicePersonal,
  createServiceCollective,
  getServiceDetails,
  deleteService,
  findCenterService,
  getWorkerByService,
  getMultipleService,
  updateServicePersonal,
  updateServiceCollective,
  removeWorker,
  findWorkerService,
  findoverLappingService,
  serviceFilter
}