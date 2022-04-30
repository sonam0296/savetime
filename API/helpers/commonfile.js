const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodeMailer = require('nodemailer');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');
const dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid');
const s3 = require('../config/awsS3');
const moment = require('moment');
const crypto = require('crypto');
var CryptoJS = require("crypto-js");
const APIError = require('../helpers/APIError');
const resPattern = require('../helpers/resPattern');
const httpStatus = require('http-status');
dotenv.config();

// bcrypt password
const validPassword = (dbPassword, passwordToMatch) => {
    return bcrypt.compareSync(passwordToMatch, dbPassword);
};

const safeModel = () => {
    return _.omit(this.toObject(), ['password', '__v']);
};

const generatePassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

const cryptoEncrypt = (message, next) => {
    try {
        return CryptoJS.AES.encrypt(message, process.env.CRYPTO_KEY).toString();
    }
    catch (e) {
        return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
    }
};

const cryptoDecrypt = (message, next) => {
    try {
        var bytes = CryptoJS.AES.decrypt(message, process.env.CRYPTO_KEY);
        return bytes.toString(CryptoJS.enc.Utf8);
    }
    catch (e) {
        return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
    }
};

// generateOTP
function generateOTP() {
    const digits = '123456789';
    let otp = '';
    for (let i = 1; i <= 6; i++) {
        let index = Math.floor(Math.random() * (digits.length));
        otp = otp + digits[index];
    }
    return otp;
}
// generatePassword
function generateRandomPassword() {
    const digits = '123456789ABCDEFGHIJKLMNOPRSTUVWXYZ';
    let password = '';
    for (let i = 1; i <= 6; i++) {
        let index = Math.floor(Math.random() * (digits.length));
        password = password + digits[index];
    }
    return password;
}

// generatePIN
function generatePIN() {
    const digits = '123456789';
    let pin = '';
    for (let i = 1; i <= 4; i++) {
        let index = Math.floor(Math.random() * (digits.length));
        pin = pin + digits[index];
    }
    return pin;
}

const generateRandomToken = () => {
    return crypto.randomBytes(20).toString('hex');
}

// send mail
let sendEmail = async (toEmail, subject, bodyHtml) => {
    const transporter = nodeMailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
            user: process.env.email_user,
            pass: process.env.EMAIL_PASS
        }
    });
    
    let mailOptions = {
        from: `"Savetime" <${process.env.email_user}>`, // sender address
        to: `${toEmail}`,
        subject: subject,
        html: `${bodyHtml}`
    };

    await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};

// email template
const mailTemp = (title, info) => {
    let temp = `<table width="640" cellspacing="0" cellpadding="0" align="center" style="background: papayawhip;" >
 <tbody>
     <tr>
         <td style="border-bottom:2px solid #FAB811; background: #2F2F2F" align="center"><img src="https://savetime-image.s3.eu-west-3.amazonaws.com/savetimelogo-178dfaf7-1ccd-4fe8-b473-82c09333bd87.png"
                 alt="saveTime logo" height="95"></td>
     </tr>
     <tr>
         <td style="padding:0px 20px">
             <table width="100%" cellspacing="0" cellpadding="0" border="0">
                 <tbody>
                     <tr>
                         <td>
                             <div style="text-align:center; color: #000000">
                                <h2>${title}</h2>
                             </div>
                         </td>
                     </tr>
                     <tr>
                         <td>
                            <div style="font-size: 12px; text-align:center;color:black;">
                                <p>${info}</p>
                            </div>                           
                         </td>
                     </tr>
                 </tbody>
             </table>
         </td>
     </tr>
    
 </tbody>
 <div style="padding:10px;text-align:center;font-size: 12px; color: #000000">Copyright © 2020 saveTime.  All rights reserved.</div>
 </table>`
    return temp;
}

// upload s3
const uploadS3 = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_BUCKET_NAME,
        acl: 'public-read',
        key: function (req, file, cb) {
            const extname = path.extname(file.originalname);
            const key = path.basename(file.originalname, extname) + '-' + uuidv4() + extname;
            cb(null, key);
        }
    }),
    limits: {
        fileSize: 1000 * 1000 * 1000,
    },
});

function daysBetweenDates(startDate, endDate) {
    let date = []
    while (moment(startDate, "DD-MM-YYYY") <= moment(endDate, "DD-MM-YYYY")) {
        date.push(startDate);
        startDate = moment(startDate, "DD-MM-YYYY").add(1, 'days').format("DD-MM-YYYY");
    }
    return date;
}

module.exports = {
    validPassword,
    safeModel,
    generatePassword,
    generateRandomPassword,
    generateOTP,
    generatePIN,
    mailTemp,
    sendEmail,
    uploadS3,
    daysBetweenDates,
    generateRandomToken,
    cryptoEncrypt,
    cryptoDecrypt
}