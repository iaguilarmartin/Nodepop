"use strict";

var encrypt = require('../../../lib/encrypt');
var sendError = require('../../../lib/customErrors');
var config = require('../../../app_config');

var jwt = require('jsonwebtoken');
var express = require('express');
var router = express.Router();
var User = require('mongoose').model('User');

router.post('/', function (req, res, next) {
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

        res.json({success: true, result: saved});
    });
});

router.post("/authenticate", function(req, res, next) {
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
