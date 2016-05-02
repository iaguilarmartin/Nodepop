"use strict";

var mongoose = require('mongoose');
var config = require('../app_config');

module.exports.connect = function(callback) {
    var con = mongoose.connection;

    // Connection event handlers
    con.on('error', function(err) {
        console.error('Connection error!', err);
        if (callback) {
            callback(err);
        }
    });

    con.on('disconnected', function() {
        console.log('Disconnected from MongoDB!');
    });

    con.once('open', function() {
        console.log('Connected to MongoDB!');
        if (callback) {
            callback(null, con);
        }
    });

    // Connecting to the database
    mongoose.connect(config.dbURL);
};;
