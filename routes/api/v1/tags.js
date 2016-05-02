"use strict";

var express = require('express');
var router = express.Router();

var config = require('../../../app_config');

router.get('/', function (req, res, next) {
    res.json({success: true, result: config.tags});
});

module.exports = router;
