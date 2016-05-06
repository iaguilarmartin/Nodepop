'use strict';

var mongoose = require('mongoose');

// Creamos el esquema
var userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    mail: {
        type: String,
        required: true,
        index: true
    },
    pass: {
        type: String,
        required: true
    }
});

mongoose.model('User', userSchema);