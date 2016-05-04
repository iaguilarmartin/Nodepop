"use strict";

var express = require('express');
var router = express.Router();
var Advert = require('mongoose').model('Advert');
var jwtAuth = require('../../../lib/jwtAuth');

router.get('/', jwtAuth(), function (req, res, next) {
    var filter = {};

    var tag = req.query.tag;
    var sale = req.query.sale;
    var name = req.query.name;
    var price = req.query.price;
    var sort = req.query.sort;
    var limit = req.query.limit;
    var start = req.query.start;
    var includeTotal = req.query.includeTotal;

    if (tag !== undefined) {
        filter.tags = tag;
    }

    if (sale !== undefined && (sale.toUpperCase() === "TRUE" || sale.toUpperCase() === "FALSE")) {
        filter.isSale = sale.toUpperCase() === "TRUE" ? true : false;
    }

    if (name !== undefined) {
        filter.name = new RegExp('^' + name, 'i');
    }

    if (price !== undefined) {
        var pos = price.indexOf('-');
        if (pos == -1 && isFloat(price)) {
            filter.price = price;
        } else if (pos == 0 && isFloat(price.substr(1))) {
            filter.price = {'$lte':price.substr(1)};
        } else if (pos == price.length - 1 && isFloat(price.substr(0, price.length - 1))) {
            filter.price = {'$gte':price.substr(0, price.length - 1)};
        } else {
            var minPrice = price.split('-')[0];
            var maxPrice = price.split('-')[1];
            if (isFloat(minPrice) && isFloat(maxPrice)) {
                filter.price = {'$gte':minPrice, '$lte':maxPrice};
            }
        }
    }

    var query = Advert.find(filter);

    if (sort !== undefined) {
        query.sort(sort);
    }

    if (limit !== undefined && isInt(limit)) {
        query.limit(parseInt(limit));
    }

    if (start !== undefined && isInt(start)) {
        query.skip(parseInt(start));
    }

    query.exec(function(err, rows) {
        if (err) {
            return res.status(500).json({success: false, error: err});
        }

        if (includeTotal !== undefined && includeTotal.toUpperCase() === "TRUE") {
            var queryCount = Advert.find(filter);
            queryCount.count(function(err, count) {
                if (err) {
                    return res.status(500).json({success: false, error: err});
                }

                res.json({success: true, total: count, adverts: rows});
            });
            return;
        }

        res.json({success: true, adverts: rows});
    });
});

function isFloat(text) {
    var num = parseFloat(text);
    if (!isNaN(num) && text == num) {
        return true;
    } else {
        return false;
    }
}

function isInt(text) {
    var num = parseInt(text);
    if (!isNaN(num) && text == num) {
        return true;
    } else {
        return true;
    }
}

module.exports = router;
