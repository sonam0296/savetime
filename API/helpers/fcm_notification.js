const admin = require("firebase-admin");
const defaultAppConfig = require("../config/FB_Admin_SDK_key.json");
const moment = require('moment');
const User = require('../model/user.model');
// Get the Messaging service for the default app
const defaultApp = admin.initializeApp({ credential: admin.credential.cert(defaultAppConfig) });

const defaultMessaging = defaultApp.messaging();


const send_notification = async (message_body) => {

    let link = "http://localhost:3000/#/saveTime";
    link = message_body.link ? message_body.link : link;
    const message = {
        tokens: message_body.tokens,
        notification: message_body.notification,
        data: message_body.data,
        webpush: {
            headers: message_body.headers,
            notification: message_body.notification,
            data: message_body.data,
            fcm_options: {
                link: link
            }
        },
        android: {
            notification: message_body.notification,
            data: message_body.data,
            priority: "high",
            // ttl:"5s"
        },
        apns: {
            payload: {
                aps: {
                    'mutable-content': 1
                }
            },
            fcm_options: {
                image: message_body.notification.image
            }
        },
    }

    let value = await defaultMessaging.sendMulticast(message);
    return value
}

module.exports = { send_notification }
