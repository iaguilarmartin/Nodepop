"use strict";

var encrypt = require('../../../lib/encrypt');
var sendError = require('../../../lib/customErrors');

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

module.exports = router;
