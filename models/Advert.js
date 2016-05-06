'use strict';

var mongoose = require('mongoose');

var advertSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        index: true
    },
    isSale: Boolean,
    price: Number,
    photo: String,
    tags: [String]
});

mongoose.model('Advert', advertSchema);
