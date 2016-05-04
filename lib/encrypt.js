"use strict";

var crypto = require('crypto');
var secret = require('../app_config').crypto.secret;

module.exports = function(text) {
    return crypto.createHmac('sha256', secret)
        .update(text)
        .digest('hex');
};



