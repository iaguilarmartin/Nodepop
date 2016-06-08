'use strict';

var encrypt = require('../../../lib/encrypt');
var sendError = require('../../../lib/customErrors');
var config = require('../../../app_config');

var jwt = require('jsonwebtoken');
var express = require('express');
var router = express.Router();
var User = require('mongoose').model('User');

/**
 * @api {post} /api/v1/users Register a new user
 * @apiName RegisterUser
 * @apiGroup Users
 * @apiVersion 1.0.0
 * @apiDescription This /POST request is used to register new users.
 *
 * @apiParam {String} mail User mail account.
 * @apiParam {String} name User name.
 * @apiParam {String} pass User login password.
 *
 * @apiSuccess {Boolean} success Indicates if the request was successful or not.
 * @apiSuccess {Object} result Object containing created user.
 *
 * @apiSuccessExample Success-Response:
 *      {
 *          "success": true,
 *          "result": {
 *              "name": "adminEn",
 *              "pass": "*******",
 *              "mail": "asdfasdfs@mail.com",
 *              "_id": "572b8481a607cf6710e6cb43"
 *          }
 *      }
 *
 * @apiError USER_MAIL_REQUIRED Email required for new users.
 * @apiError USER_NAME_REQUIRED User name required for new users.
 * @apiError USER_PASS_REQUIRED Password required for new users.
 *
 * @apiErrorExample Error-Response:
 *     {
 *       "success": false,
 *       "error": "USER_MAIL_REQUIRED",
 *       "description": "El mail es obligatorio para poder crear nuevos usuarios"
 *     }
 */

router.post('/', function (req, res) {
    var mail = req.body.mail;
    var name = req.body.name;
    var pass = req.body.pass;

    if (!mail) {
        return sendError('USER_MAIL_REQUIRED', req, res);
    }
    if (!name) {
        return sendError('USER_NAME_REQUIRED', req, res);
    }
    if (!pass) {
        return sendError('USER_PASS_REQUIRED', req, res);
    }

    var newUser = new User({
       name: name,
        pass: encrypt(pass),
        mail: mail
    });

    newUser.save(function (err, saved) {
        if (err) {
            return res.json({success: false, error: err});
        }

        saved.pass = '*******';
        res.json({success: true, result: saved});
    });
});

/**
 * @api {post} /api/v1/users/authenticate Authenticate user
 * @apiName  AuthenticateUser
 * @apiGroup Users
 * @apiVersion 1.0.0
 * @apiDescription This /POST request is used to authenticate a pair of user mail and password. If the information
 * provided is correct then a token is returned to use in following requests made to the API.
 *
 * @apiParam {String} mail User mail account.
 * @apiParam {String} pass User login password.
 *
 * @apiSuccess {Boolean} success Indicates if the request was successful or not.
 * @apiSuccess {String} token Token needed for requesting adverts.
 *
 * @apiSuccessExample Success-Response:
 *      {
 *          "success": true,
 *          "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI....."
 *      }
 *
 * @apiError AUTH_MAIL_NOT_FOUND Auth failed, Mail not found.
 * @apiError AUTH_INVALID_PASS Auth failed, Pass is invalid.
 *
 * @apiErrorExample Error-Response:
 *     {
 *       "success": false,
 *       "error": "AUTH_MAIL_NOT_FOUND",
 *       "description": "Fallo de autenticación, email no encontrado"
 *     }
 */

router.post('/authenticate', function(req, res) {
    var mail = req.body.mail;
    var pass = req.body.pass;

    if (!mail) {
        return sendError('AUTH_MAIL_NOT_FOUND', req, res, 401);
    }
    if (!pass) {
        return sendError('AUTH_INVALID_PASS', req, res, 401);
    }

    User.findOne({mail:mail}).exec(function (err, user) {
        if (err) {
            return res.status(500).json({success: false, error: err});
        }

        if (!user) {
            return sendError('AUTH_MAIL_NOT_FOUND', req, res, 401);
        }

        if (user.pass !== encrypt(pass)) {
            return sendError('AUTH_INVALID_PASS', req, res, 401);
        }

        var token = jwt.sign({ id: user._id}, config.jwt.secret, { expiresIn: '7 days' });

        res.json({success: true, token: token});
    });
});

module.exports = router;
