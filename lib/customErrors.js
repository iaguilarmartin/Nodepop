"use strict";

var fs = require('fs');
var config = require('../app_config');

var errorsCollection = null;

function getErrors() {
    return new Promise(function(resolve, reject) {
        if (!errorsCollection) {
            fs.readFile(__dirname + '/../' + config.errorsFile, 'utf-8', function (errReading, data) {
                if (errReading) {
                    console.error('Error while reading error messages file', errReading);
                    reject(errReading);
                    return;
                }

                errorsCollection = JSON.parse(data);
                resolve(errorsCollection);
            });
        } else {
            resolve(errorsCollection);
        }
    });
}

module.exports = function(errorCode, req, res, status) {
    var defaultLang = 'en';
    var returnMsg = errorCode;
    var responseStatus = 400;
    if (status) {
        responseStatus = status;
    }

    var requestLang = null;

    if (req.headers['accept-language']) {
        requestLang = req.headers['accept-language'];
    }

    getErrors().then((messages) => {
        if (requestLang && messages && messages[requestLang] && messages[requestLang][errorCode]) {
            returnMsg = messages[requestLang][errorCode];
        } else if (messages && messages[defaultLang] && messages[defaultLang][errorCode]) {
            returnMsg = messages[defaultLang][errorCode];
        }

        res.status(responseStatus).json({ success: false, error: errorCode, description: returnMsg });
    }).catch((err) => {
        res.status(500).json({ success: false, error: err });
    });
};

