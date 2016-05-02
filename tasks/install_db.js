"use strict";

console.log('Starting database initialization script');

var mongooseConector = require('../lib/connectMongoose');
var mongoose = require('mongoose');

require('../models/Advert');
require('../models/User');

var Advert = mongoose.model('Advert');
var User = mongoose.model('User');
var config = require('../app_config');
var fs = require('fs');

var connected = false;

mongooseConector.connect(function(err, conn) {
    if (err) {
       terminate(err);
       return;
    }

    connected = true;

    clearDatabase([Advert, User], readJSONFile);
});

function clearDatabase(arrCollections, callback) {
    if (arrCollections.length == 0) {
        console.log("Database cleared");
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
};

function readJSONFile() {
    fs.readFile(__dirname + '/../' + config.initialDataScript, 'utf-8', function (errReading, data) {
        if (errReading) {
            console.error('Error while reading initial data file', errReading);
            return terminate(errReading);
        }

        console.log(config.initialDataScript + " file readed");
        var initialData = JSON.parse(data);
        var data = initialData.users.concat(initialData.adverts);
        console.log("Importing data...");
        importData(data);
    });
};

function importData(data) {
    if (data.length == 0) {
        console.log("Data imported correctly");
        terminate();
        return;
    }

    var importObj = data.shift();

    var schema;

    // Si no el objeto no tiene una propiedad mail se trata de un anuncio, de lo contrario es un usuario
    if (importObj.mail) {
        schema = User;
    } else {
        schema = Advert;
    }

    var newObj = new schema(importObj);
    newObj.save(function(errCreating, result) {
        if (errCreating) {
            console.error('Error while creating item', errCreating);
            return terminate(errCreating);
        }

        console.info("Item created:", result.name);
        importData(data);
    });
};

function terminate(err) {
    if (connected) {
        mongoose.disconnect();
    }

    if (err) {
        console.warn('One or more errors occurred while executing the script');
    } else {
        console.log('Script finished without errors');
    }
}
