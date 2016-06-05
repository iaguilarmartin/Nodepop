'use strict';

console.log('Starting database initialization script');

var mongooseConector = require('../lib/connectMongoose');
var mongoose = require('mongoose');
var encrypt = require('../lib/encrypt');

require('../models/Advert');
require('../models/User');

var Advert = mongoose.model('Advert');
var User = mongoose.model('User');

var config = require('../app_config');
var fs = require('fs');

var connected = false;

mongooseConector.connect(function(err) {
    if (err) {
       terminate(err);
       return;
    }

    connected = true;

    clearDatabase([Advert, User], readJSONFile);
});

function clearDatabase(arrCollections, callback) {
    if (arrCollections.length === 0) {
        console.log('Database cleared');
        callback();
        return;
    }

    var schema = arrCollections.shift();
    schema.remove({}, function(errDeleting) {
        if (errDeleting) {
            console.error('Error while clearing database', errDeleting);
            return terminate(errDeleting);
        }

        clearDatabase(arrCollections, callback);
    });
}

function readJSONFile() {
    fs.readFile(__dirname + '/../' + config.initialDataScript, 'utf-8', function (errReading, data) {
        if (errReading) {
            console.error('Error while reading initial data file', errReading);
            return terminate(errReading);
        }

        console.log(config.initialDataScript + ' file readed');
        var initialData = JSON.parse(data);

        var completeData = [
            {schema: User, data: initialData.users},
            {schema: Advert, data: initialData.adverts}
        ];

        console.log('Importing data...');
        importData(completeData);
    });
}

function importData(data) {
    if (data.length === 0) {
        terminate();
        return;
    }

    var schemaData = data.shift();
    loadSchema(schemaData.schema, schemaData.data, function () {
        importData(data);
    });
}

function loadSchema(schema, data, cb) {
    if (data.length === 0) {
        cb();
        return;
    }

    var importObj = data.shift();
    if (importObj.pass) {
        importObj.pass = encrypt(importObj.pass);
    }

    var newObj = new schema(importObj);
    newObj.save(function(errCreating, result) {
        if (errCreating) {
            console.error('Error while creating item', errCreating);
            return terminate(errCreating);
        }

        loadSchema(schema, data, cb);
    });
}

function terminate(err) {
    if (connected) {
        mongoose.disconnect();
    }

    if (err) {
        console.warn('One or more errors occurred while executing the script');
    } else {
        console.log('Script finished SUCCESSFULLY');
    }
}
