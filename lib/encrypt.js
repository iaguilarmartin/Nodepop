"use strict";

var createHash = require('sha.js');
var sha512 = createHash('sha512');

module.exports = function(text) {
    return sha512.update(text, 'utf8').digest('hex');
};


