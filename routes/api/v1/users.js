"use strict";

var encrypt = require('../../../lib/encrypt');

var express = require('express');
var router = express.Router();
var User = require('mongoose').model('User');

router.post('/', function (req, res, next) {
    var mail = req.body.mail;
    var name = req.body.name;
    var pass = req.body.pass;

    if (!mail) {
        return res.json({success: false, error: 'Email required for new users'});
    }
    if (!name) {
        return res.json({success: false, error: 'User name required for new users'});
    }
    if (!pass) {
        return res.json({success: false, error: 'Password required for new users'});
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
