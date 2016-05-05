"use strict";

var express = require('express');
var router = express.Router();
var sendError = require('../../../lib/customErrors');
var Token = require('mongoose').model('PushToken');

/**
 * @api {post} /tokens Register a push token
 * @apiName RegisterToken
 * @apiGroup Push Tokens
 * @apiVersion 1.0.0
 * @apiDescription This /POST request is used to register a new user Token. This token can be used to send PUSH notifications
 * to the application users. Whether they are registered or anonymous. If the user already has a registered token for that platform
 * then the token value is updated instead of created.
 *
 * @apiParam {String} [mail] User mail account.
 * @apiParam {String="android","ios"} platform OS of the device witch provide the token.
 * @apiParam {String} token The generated token from the client notifications system.
 *
 * @apiSuccess {Boolean} success Indicates if the request was successful or not.
 * @apiSuccess {Object} result Object containing registered/updated push token.
 *
 * @apiSuccessExample Success-Response:
 *      {
 *          "success": true,
 *          "result": {
 *              "token": "456534tqewfds4234543....",
 *              "platform": "ios",
 *              "user": "asdfasdfs@mail.com",
 *              "_id": "572a132690bf44b316d8ed56",
 *          }
 *      }
 *
 * @apiError TOKEN_PLATFORM_REQUIRED Platform required to register token.
 * @apiError TOKEN_PLATFORM_INVALID Provided platform is not valid.
 * @apiError TOKEN_TOKEN_REQUIRED Token required to register token.
 *
 * @apiErrorExample Error-Response:
 *     {
 *       "success": false,
 *       "error": "TOKEN_PLATFORM_INVALID",
 *       "description": "La plataforma de la aplicación cliente especificada no es válida"
 *     }
 */

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
