'use strict';

var mongoose = require('mongoose');

var tokensSchema = mongoose.Schema({
    platform: {
        type: String,
        enum: ['ios', 'android']
    },
    token: {
        type: String,
        required: true
    },
    user: String
});

mongoose.model('PushToken', tokensSchema);