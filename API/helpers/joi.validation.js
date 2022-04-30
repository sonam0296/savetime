// const Joi = require('@hapi/joi');
// const JoiBase = require('@hapi/joi');
// const JoiDate = require('@hapi/joi-date');
// const Joi = JoiBase.extend(JoiDate);

const Joi = require('@hapi/joi')
    .extend(require('@hapi/joi-date'));

const userParamsValidation = {
    createUser: {
        body: {
            name: Joi.string().required(),
            type: Joi.string()
                .valid("center", "client")
                .default("client")
                .insensitive(),
            // joi.string().length(1).pattern(/^[1-3]+$/).required(),
            calendarType: Joi.string()
                .valid("google", "ios", "outlook")
                .allow('', null),
            notification: Joi.string()
                .valid("true", "false")
                .allow('', null),
            emailAddress: Joi.string().lowercase().email().required(),
            password: Joi.string().required(),
            phonenumber: Joi.string().regex(/^([+])?[0-9]{6,20}$/).message('Phone Number not valid').required(),
            image: Joi.string().allow('', null),
            NIE_NIF_NRT: Joi.string().allow('', null),
            address: Joi.string().allow('', null),
            location: Joi.object().allow('', null).keys({
                type: Joi.string().valid("Point").required(),
                coordinates: Joi.array().required()
            }),
            idCard: Joi.string().allow('', null),
            categoryId: Joi.array().allow('', null),
            postalCode: Joi.string().allow('', null),
            direction: Joi.string().allow('', null),
            city: Joi.string().allow('', null),
            country: Joi.string().allow('', null),
            timezone: Joi.string().allow('', null),
            isCreatedByCenterAdmin: Joi.boolean(),
            centerId: Joi.string(),
            isExternalUrl: Joi.boolean(),
            externalUrl: Joi.string()
        },
    },
    updateUser: {
        body: {
            name: Joi.string(),
            // type: Joi.string()
            //     .valid("center", "client")
            //     .default("client")
            //     .insensitive(),
            emailAddress: Joi.string().lowercase().email(),
            password: Joi.string(),
            calendarType: Joi.string()
                .valid("google", "ios", "outlook")
                .allow('', null),
            notification: Joi.string()
                .valid("true", "false")
                .allow('', null),
            adminPanelPassword: Joi.string().allow('', null),
            phonenumber: Joi.string().regex(/^([+])?[0-9]{6,20}$/).message('Phone Number not valid').allow('', null),
            image: Joi.string().allow('', null),
            backgroundImage: Joi.string().allow('', null),
            NIE_NIF_NRT: Joi.string().allow('', null),
            address: Joi.string().allow('', null),
            idCard: Joi.string().allow('', null),
            categoryId: Joi.array().allow('', null),
            location: Joi.object().allow('', null).keys({
                type: Joi.string().valid("Point").required(),
                coordinates: Joi.array().required()
            }),
            postalCode: Joi.string().allow('', null),
            direction: Joi.string().allow('', null),
            city: Joi.string().allow('', null),
            country: Joi.string().allow('', null),
            timezone: Joi.string().allow('', null),
            permissions: Joi.object(),
            isExternalUrl: Joi.boolean(),
            externalUrl: Joi.string().allow('', null),
            planId: Joi.string(),
            centerFacebookLink: Joi.string(),
            centerInstagramLink: Joi.string(),
            language: Joi.string().valid("en", "es", "fr", "pt", "ca")
        },
    },
    socialAuth: {
        body: {
            socialId: Joi.string().required(),
            image: Joi.string().allow('', null),
            socialProvider: Joi.string()
                .valid("google", "facebook")
                .insensitive()
                .required(),
            emailAddress: Joi.string(),
            name: Joi.string(),
            userType: Joi.string()
                .valid("center", "client")
                .insensitive()
                .required(),
            deviceToken: Joi.string().allow('', null)
        }
    },
    login: {
        body: Joi.object({
            emailAddress: Joi.string().lowercase().email().required(),
            password: Joi.string().required(),
            deviceToken: Joi.string().allow('', null),
            fcm_registration_token: Joi.string().allow('', null),
        }),
    },
};

const authParamsValidation = {
    verifyOTP: {
        body: {
            otp: Joi.number().required().min(6),
            emailAddress: Joi.string().lowercase().email().required(),
        },
    },
    forgotPassword: {
        body: {
            emailAddress: Joi.string().lowercase().email().required(),
        },
    },
    resetPassword: {
        body: {
            otp: Joi.number().required().min(6),
            emailAddress: Joi.string().lowercase().email().required(),
            resetPassword: Joi.string().required(),
        },
    },
    changePassword: {
        body: {
            id: Joi.string().required(),
            password: Joi.string().allow('', null),
            newpass: Joi.string().required(),
        },
    },
}

const serviceParamsValidation = {
    createServicePersonal: {
        body: {
            serviceName: Joi.string().required(),
            duration: Joi.number().integer().required(),
            type: Joi.string().required(),
            price: Joi.number().integer(),
            centerIds: Joi.string(),
            workerId: Joi.array(),
            overLappedServices: Joi.array().allow('', null).items(Joi.object().keys({
                serviceId: Joi.string().required(),
                startTime: Joi.number().integer().required(),
                endTime: Joi.number().integer().required(),
            })),
            isSelfSufficient: Joi.boolean()
        },
    },
    createServiceCollective: {
        body: {
            serviceName: Joi.string().required(),
            duration: Joi.number().integer().required(),
            type: Joi.string().required(),
            price: Joi.number().integer(),
            maxPerson: Joi.number().integer().required(),
            centerIds: Joi.string(),
            workerId: Joi.array(),
            defaultSchedule: Joi.array().allow('', null).items(Joi.object().keys({
                isChecked: Joi.boolean(),
                Days: Joi.string()
                    .valid("Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday")
                    .default("Monday")
                    .insensitive().required(),
                time: Joi.array().allow('', null).items(Joi.object().keys({
                    startTime: Joi.string()
                        .regex(/(?:[01]\d|2[0123]):(?:[012345]\d)/)
                        .allow(""),
                    endTime: Joi.string()
                        .regex(/(?:[01]\d|2[0123]):(?:[012345]\d)/)
                        .allow(""),
                })),
            })),
            customDate: Joi.array().allow('', null).items(Joi.object().keys({
                startDate: Joi.date().required().allow()
                    .format("DD-MM-YYYY"),
                endDate: Joi.date().required().allow()
                    .format("DD-MM-YYYY"),
                time: Joi.array().required().items(Joi.object().keys({
                    startTime: Joi.string()
                        .regex(/(?:[01]\d|2[0123]):(?:[012345]\d)/)
                        .allow(""),
                    endTime: Joi.string()
                        .regex(/(?:[01]\d|2[0123]):(?:[012345]\d)/)
                        .allow(""),
                })),
            })),
            customSchedule: Joi.array().allow('', null).items(Joi.object().keys({
                Date: Joi.date().required().allow()
                    .format("DD-MM-YYYY"),
                time: Joi.array().required().items(Joi.object().keys({
                    startTime: Joi.string()
                        .regex(/(?:[01]\d|2[0123]):(?:[012345]\d)/)
                        .allow(""),
                    endTime: Joi.string()
                        .regex(/(?:[01]\d|2[0123]):(?:[012345]\d)/)
                        .allow(""),
                })),
            })),
            overLappedServices: Joi.array().allow('', null).items(Joi.object().keys({
                serviceId: Joi.string().required(),
                startTime: Joi.number().integer().required(),
                endTime: Joi.number().integer().required(),
            })),
            isSelfSufficient: Joi.boolean()

        },
    },
    updateServicePersonal: {
        body: {
            serviceName: Joi.string(),
            duration: Joi.number().integer(),
            type: Joi.string(),
            price: Joi.number().integer(),
            centerIds: Joi.string(),
            workerId: Joi.array(),
            serviceId: Joi.string(),
            active: Joi.boolean(),
            overLappedServices: Joi.array().allow('', null).items(Joi.object().keys({
                serviceId: Joi.string().required(),
                startTime: Joi.number().integer().required(),
                endTime: Joi.number().integer().required(),
            })),
            overLappedServiceId: Joi.string(),
            overLappedStartTime: Joi.number().integer(),
            overLappedEndtime: Joi.number().integer(),
            defaultSchedule: Joi.array().allow('', null).items(Joi.object().keys({
                isChecked: Joi.boolean(),
                Days: Joi.string()
                    .valid("Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday")
                    .default("Monday")
                    .insensitive().required(),
                time: Joi.array().allow('', null).items(Joi.object().keys({
                    startTime: Joi.string()
                        .regex(/(?:[01]\d|2[0123]):(?:[012345]\d)/)
                        .allow(""),
                    endTime: Joi.string()
                        .regex(/(?:[01]\d|2[0123]):(?:[012345]\d)/)
                        .allow(""),
                })),
            })),
            customDate: Joi.array().allow('', null).items(Joi.object().keys({
                startDate: Joi.date().required().allow()
                    .format("DD-MM-YYYY"),
                endDate: Joi.date().required().allow()
                    .format("DD-MM-YYYY"),
                time: Joi.array().required().items(Joi.object().keys({
                    startTime: Joi.string()
                        .regex(/(?:[01]\d|2[0123]):(?:[012345]\d)/)
                        .allow(""),
                    endTime: Joi.string()
                        .regex(/(?:[01]\d|2[0123]):(?:[012345]\d)/)
                        .allow(""),
                })),
            })),
            customSchedule: Joi.array().allow('', null).items(Joi.object().keys({
                Date: Joi.date().required().allow()
                    .format("DD-MM-YYYY"),
                time: Joi.array().required().items(Joi.object().keys({
                    startTime: Joi.string()
                        .regex(/(?:[01]\d|2[0123]):(?:[012345]\d)/)
                        .allow(""),
                    endTime: Joi.string()
                        .regex(/(?:[01]\d|2[0123]):(?:[012345]\d)/)
                        .allow(""),
                })),
            })),
            isSelfSufficient: Joi.boolean(),
            isSendMail: Joi.boolean()
        },
    },
    updateServiceCollective: {
        body: {
            serviceName: Joi.string(),
            duration: Joi.number().integer(),
            type: Joi.string(),
            price: Joi.number().integer(),
            maxPerson: Joi.number().integer(),
            centerIds: Joi.string(),
            serviceId: Joi.string(),
            workerId: Joi.array(),
            customSchedule: Joi.array(),
            active: Joi.boolean(),
            overLappedServices: Joi.array().allow('', null).items(Joi.object().keys({
                serviceId: Joi.string().required(),
                startTime: Joi.number().integer().required(),
                endTime: Joi.number().integer().required(),
            })),
        },
    },
    findService: {
        params: {
            serviceId: Joi.string().required(),
        },
    },
    findMultipleService: {
        body: {
            serviceId: Joi.array(),
        },
    },
    findoverLappedService: {
        body: {
            serviceId: Joi.string().required(),
            centerId: Joi.string().required()
        },
    },
    findCenterService: {
        params: {
            centerId: Joi.string().required(),
        },
    }
}

const scheduleParamsValidation = {
    createTimeTable: {
        body: {
            defaultSchedule: Joi.array().allow('', null).items(Joi.object().keys({
                isChecked: Joi.boolean(),
                Days: Joi.string()
                    .valid("Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday")
                    .default("Monday")
                    .insensitive().required(),
                time: Joi.array().allow('', null).items(Joi.object().keys({
                    startTime: Joi.string()
                        .regex(/(?:[01]\d|2[0123]):(?:[012345]\d)/)
                        .allow(""),
                    endTime: Joi.string()
                        .regex(/(?:[01]\d|2[0123]):(?:[012345]\d)/)
                        .allow(""),
                })),
            })),
            customDate: Joi.array().allow('', null).items(Joi.object().keys({
                startDate: Joi.date().required().allow()
                    .format("DD-MM-YYYY"),
                endDate: Joi.date().required().allow()
                    .format("DD-MM-YYYY"),
                time: Joi.array().required().items(Joi.object().keys({
                    startTime: Joi.string()
                        .regex(/(?:[01]\d|2[0123]):(?:[012345]\d)/)
                        .allow(""),
                    endTime: Joi.string()
                        .regex(/(?:[01]\d|2[0123]):(?:[012345]\d)/)
                        .allow(""),
                })),
            })),
            customSchedule: Joi.array().allow('', null).items(Joi.object().keys({
                Date: Joi.date().required().allow()
                    .format("DD-MM-YYYY"),
                time: Joi.array().required().items(Joi.object().keys({
                    startTime: Joi.string()
                        .regex(/(?:[01]\d|2[0123]):(?:[012345]\d)/)
                        .allow(""),
                    endTime: Joi.string()
                        .regex(/(?:[01]\d|2[0123]):(?:[012345]\d)/)
                        .allow(""),
                })),
            })),
        },
    },
    updateTimeTable: {
        body: {
            defaultSchedule: Joi.array().allow('', null).items(Joi.object().keys({
                isChecked: Joi.boolean(),
                Days: Joi.string()
                    .valid("Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday")
                    .default("Monday")
                    .insensitive().required(),
                time: Joi.array().allow('', null).items(Joi.object().keys({
                    startTime: Joi.string()
                        .regex(/(?:[01]\d|2[0123]):(?:[012345]\d)/)
                        .allow(""),
                    endTime: Joi.string()
                        .regex(/(?:[01]\d|2[0123]):(?:[012345]\d)/)
                        .allow(""),
                })),
            })),
            customDate: Joi.array().allow('', null).items(Joi.object().keys({
                startDate: Joi.date().required().allow()
                    .format("DD-MM-YYYY"),
                endDate: Joi.date().required().allow()
                    .format("DD-MM-YYYY"),
                time: Joi.array().required().items(Joi.object().keys({
                    startTime: Joi.string()
                        .regex(/(?:[01]\d|2[0123]):(?:[012345]\d)/)
                        .allow(""),
                    endTime: Joi.string()
                        .regex(/(?:[01]\d|2[0123]):(?:[012345]\d)/)
                        .allow(""),
                })),
            })),
            customSchedule: Joi.array().allow('', null).items(Joi.object().keys({
                Date: Joi.date().required().allow()
                    .format("DD-MM-YYYY"),
                time: Joi.array().required().items(Joi.object().keys({
                    startTime: Joi.string()
                        .regex(/(?:[01]\d|2[0123]):(?:[012345]\d)/)
                        .allow(""),
                    endTime: Joi.string()
                        .regex(/(?:[01]\d|2[0123]):(?:[012345]\d)/)
                        .allow(""),
                })),
            })),
        },
    },
    deleteTimeTable: {
        type: Joi.string()
            .valid("customSchedule")
            .allow('', null),
    },
    getCenterByDate: {
        Date: Joi.date().allow()
            .format("DD-MM-YYYY"),
        Time: Joi.string()
            .regex(/(?:[01]\d|2[0123]):(?:[012345]\d)/)
            .allow("")
    }
}

const centerParamsValidation = {
    Favorite: {
        body: {
            centerId: Joi.string().required(),
        },
    },
    centerWorker: {
        body: {
            centerId: Joi.string().required(),
            Date: Joi.date().allow()
                .format("DD-MM-YYYY"), // set desired date format here
        },
    },
}
const workerParamsValidation = {
    createWorker: {
        body: {
            name: Joi.string().required(),
            lastname: Joi.string().required(),
            active: Joi.boolean(),
            pinCode: Joi.string(),
            centerIds: Joi.string().required(),
            image: Joi.string().allow('', null),
            defaultSchedule: Joi.array().allow('', null),
            customSchedule: Joi.array().allow('', null),
            customDate: Joi.array().allow('', null),
            isPincodeActive: Joi.boolean()
        },
    },
    getWorker: {
        params: {
            workerId: Joi.string().required(),
        },
    }
}
const appointmentParamsValidation = {
    createAppointment: {
        body: Joi.array().items(Joi.object({
            name: Joi.string(),
            serviceId: Joi.string().required(),
            lastname: Joi.string(),
            appointmentBy: Joi.string()
                .allow('', null)
                .valid("app", "web")
                .default("app")
                .insensitive(),
            userId: Joi.string()
                .allow('', null),
            telephone: Joi.string().regex(/^([+])?[0-9]{6,20}$/).message('Phone Number not valid'),
            emailAddress: Joi.string().lowercase().email(),
            startTime: Joi.string()
                .regex(/(?:[01]\d|2[0123]):(?:[012345]\d)/)
                .allow(""),
            endTime: Joi.string()
                .regex(/(?:[01]\d|2[0123]):(?:[012345]\d)/)
                .allow(""),
            Date: Joi.date().allow()
                .format("DD-MM-YYYY"), // set desired date format here
            centerId: Joi.string().required(),
            workerId: Joi.string(),
            suggestion: Joi.string(),
        }))
    },
    emergencyCancel: {
        body: {
            startTime: Joi.string()
                .regex(/(?:[01]\d|2[0123]):(?:[012345]\d)/)
                .allow(""),
            endTime: Joi.string()
                .regex(/(?:[01]\d|2[0123]):(?:[012345]\d)/)
                .allow(""),
            startDate: Joi.date().allow()
                .format("DD-MM-YYYY"),
            endDate: Joi.date().allow()
                .format("DD-MM-YYYY"), // set desired date format here
            workerId: Joi.string(),
            serviceId: Joi.string(),
            customDateForCancleAppointment: Joi.boolean()
        },
    },
    updateAppointment: {
        body: {
            name: Joi.string(),
            serviceId: Joi.string(),
            lastname: Joi.string(),
            appointmentBy: Joi.string()
                .allow('', null)
                .valid("app", "phone")
                .insensitive(),
            telephone: Joi.string().regex(/^([+])?[0-9]{6,20}$/).message('Phone Number not valid'),
            emailAddress: Joi.string().lowercase().email(),
            startTime: Joi.string()
                .regex(/(?:[01]\d|2[0123]):(?:[012345]\d)/)
                .allow(""),
            endTime: Joi.string()
                .regex(/(?:[01]\d|2[0123]):(?:[012345]\d)/)
                .allow(""),
            Date: Joi.date().allow()
                .format("DD-MM-YYYY"), // set desired date format here
            workerId: Joi.string(),
            suggestion: Joi.string(),
            price: Joi.number().integer(),
            isDeleted: Joi.boolean()
        },
    },
    deleteAppointment: {
        params: {
            appointmentId: Joi.string().required(),
        },
    },
    statusAppointment: {
        body: {
            status: Joi.string().allow('', null),
        },
    },
}
const suggestionParamsValidation = {
    sendSuggestion: {
        body: {
            name: Joi.string().required(),
            affair: Joi.string(),
            suggestion: Joi.string().required()
        },
    }
}

module.exports = {
    userParamsValidation,
    authParamsValidation,
    serviceParamsValidation,
    scheduleParamsValidation,
    centerParamsValidation,
    workerParamsValidation,
    appointmentParamsValidation,
    suggestionParamsValidation,
};