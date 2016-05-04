"use strict";

var express = require('express');
var router = express.Router();
var sendError = require('../../../lib/customErrors');
var Token = require('mongoose').model('PushToken');

router.post('/', function(req, res, next) {
    var mail = req.body.mail;
    var platform = req.body.platform;
    var token = req.body.token;

    if (!platform) {
        return sendError('TOKEN_PLATFORM_REQUIRED', req, res);
    }

    if (platform !== "ios" && platform !== "android") {
        return sendError('TOKEN_PLATFORM_INVALID', req, res);
    }

    if (!token) {
        return sendError('TOKEN_TOKEN_REQUIRED', req, res);
    }

    if (!mail) {
        createToken(res, token, platform, null);
    } else {
        Token.findOne({user:mail, platform:platform}).exec(function (err, pushToken) {
            if (err) {
                return res.status(500).json({success: false, error: err});
            }

            if (!pushToken) {
                createToken(res, token, platform, mail);
            } else {
                pushToken.token = token;
                pushToken.save(function (err, saved) {
                    if (err) {
                        return res.json({success: false, error: err});
                    }

                    res.json({success: true, result: saved});
                });
            }
        });
    }
});

function createToken(res, token, platform, mail) {
    var newToken = new Token({
        platform: platform,
        token: token,
        user: mail
    });

    newToken.save(function (err, saved) {
        if (err) {
            return res.json({success: false, error: err});
        }

        res.json({success: true, result: saved});
    });
};

module.exports = router;
