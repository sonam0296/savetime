const express = require('express');
const session = require("express-session")
const bodyParser = require('body-parser')
const db = require('./config/database');
const APIError = require('./helpers/APIError');
const httpStatus = require('http-status');
const expressValidation = require('express-validation');
const path = require("path")
const fs = require('fs');
const cors = require('cors');

const logger = require('morgan');

const port = process.env.PORT || 8001

const app = express();
app.use(bodyParser.urlencoded({ limit: '15gb', extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(logger('dev'));

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', __dirname + '/public/views')
app.set('view engine', 'html')
app.engine('html', require('ejs').renderFile)

app.use(session({
    secret: "Savetime",
    resave: true,
    saveUninitialized: true
}));

db.connection().then((database) => {

    module.exports = database

    app.use('/api/user', require('./routes/user.route'));
    app.use('/api/auth', require('./routes/auth.route'));
    app.use('/api/admin', require('./routes/admin.route'));
    app.use('/api/center', require('./routes/center.route'));
    app.use('/api/category', require('./routes/category.route'));
    app.use('/api/schedule', require('./routes/schedule.route'));
    app.use('/api/service', require('./routes/service.route'));
    app.use('/api/worker', require('./routes/worker.route'));
    app.use('/api/appointment', require('./routes/appointment.route'));
    app.use('/api/event', require('./routes/event.route'));
    app.use('/api/image', require('./routes/imageUpload.route'));
    app.use('/api/suggestion', require('./routes/suggestion.route'));
    app.use('/api/compney', require('./routes/compney.route'));
    app.use('/api/plan', require('./routes/plan.route'));
    app.use('/api/pets', require('./routes/pets.route'));

    app.get('/', (req, res) => {
        res.render('index.html')
    });
    const i18n = require('./locales');
    app.use(i18n.init);
    app.use((err, req, res, next) => {
        if (err instanceof expressValidation.ValidationError) {
            // validation error contains errors which is an array of error each containing message[]
            const unifiedErrorMessage = err.errors.map(Error => Error.messages.join('. ')).join(' and ');
            const error = new APIError(unifiedErrorMessage, err.status, true);
            return next(error);
        } else if (!(err instanceof APIError)) {
            const apiError = new APIError(err.message, err.status, err.name === 'UnauthorizedError' ? true : err.isPublic);
            return next(apiError);
        }
        return next(err);
    });

    app.use((req, res, next) => {
        const err = new APIError('API Not Found', httpStatus.NOT_FOUND, true);
        return next(err);
    });

    app.use((err, req, res, next) => {
        res.status(err.status).json({
            error: {
                message: err.isPublic ? err.message : httpStatus[err.status],
            }
        });
    }
    );
    app.listen(port, () => {
        const { checkVerification, checkSubscription } = require('../API/controllers/user.controller');
        checkVerification()
        checkSubscription()
        console.log(`The Savetime app is up on port ${port}`);
    })
});
