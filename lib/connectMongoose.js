"use strict";

var mongoose = require('mongoose');
var con = mongoose.connection;

// Connection event handlers
con.on('error', console.log.bind(console, 'Connection error!'));

con.once('open', function() {
    console.log('Connected to MongoDB!');
});

// Connecting to the database
mongoose.connect('mongodb://localhost:27017/nodepop');
