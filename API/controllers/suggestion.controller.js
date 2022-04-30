const APIError = require('../helpers/APIError');
const resPattern = require('../helpers/resPattern');
const httpStatus = require('http-status');
const db = require('../server')
const suggestionColl = db.collection('suggestion');
const query = require('../query/query')
const bcrypt = require('bcrypt');
const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');
const uniqueString = require('unique-string');
const { sendEmail, mailTemp } = require('../helpers/commonfile');
const i18n= require('i18n');


const sendSuggestion = async (req, res, next) => {
    try {
        const suggestion = req.body
        suggestion.emailAddress = req.user.emailAddress
        const insertdata = await query.insert(suggestionColl, suggestion)

        const toEmail = 'soporte@savetime.es';
        const title = `SaveTime`;
        let tempTitle = `Suggestion by client`
        let info = `Here is the suggestion given by client <br>
            Name : ${insertdata.ops[0].name}<br>
            Email :  ${req.user.emailAddress}<br>
            Suggestion : ${insertdata.ops[0].suggest}`

        const emailBody = mailTemp(tempTitle, info)

        await sendEmail(toEmail, title, emailBody);

        let data = insertdata.ops
        let obj = resPattern.successPattern(httpStatus.OK, data, 'success');
        return res.status(obj.code).json(obj);
    } catch (e) {
        return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
    }
}

module.exports = {
    sendSuggestion
}