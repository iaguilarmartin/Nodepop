"use strict";

var express = require('express');
var router = express.Router();
var Advert = require('mongoose').model('Advert');
var jwtAuth = require('../../../lib/jwtAuth');

/**
 * @api {get} /api/v1/adverts Find published adverts
 * @apiName FindAdverts
 * @apiGroup Adverts
 * @apiVersion 1.0.0
 * @apiDescription This /GET request is used to find published adverts that fits the conditions provided in the query string.
 *
 * @apiParam {String} token Authentication token. Mandatory to get results with the query.
 * @apiParam {String} [tag] Filter adverts with an specific tag.
 * @apiParam {Boolean=true, false} [sale] Filter adverts that are for sale or to buy.
 * @apiParam {String} [name] Filter adverts witch name starts with the string specified.
 * @apiParam {String} [price] Filter adverts witch price is within that value. The possibilities are:</br><ul>
 * <li>"50": Return adverts witch price is <b>exactly</b> 50</li>
 * <li>"50-": Return adverts witch price is <b>greater or equals</b> to 50</li>
 * <li>"-50": Return adverts witch price is <b>lower or equals</b> to 50</li>
 * <li>"20-50": Return adverts witch price is <b>between</b> 20 and 50</li>
 * </ul>
 * @apiParam {String} [sort] Return the adverts ordered by this field.
 * @apiParam {Number} [limit] Limit the number of adverts returned as result (Useful for pagination).
 * @apiParam {Number} [start] Skip all the adverts that are before that number (Useful for pagination).
 * @apiParam {Boolean=true, false} [includeTotal] If <b>true</b> inside the result would include the number of adverts found by the query (Useful for pagination).
 *
 * @apiSuccess {Boolean} success Indicates if the request was successful or not.
 * @apiSuccess {Object} result Object containing created user.
 *
 * @apiSuccessExample Success-Response:
 *      {
 *          "success": true,
 *          "adverts": [
 *              {
 *                  "name": "Bicicleta",
 *                  "isSale": true,
 *                  "price": 230.15,
 *                  "photo": "bici.jpg",
 *                  "tags": [
 *                      "lifestyle",
 *                      "motor"
 *                  ]
 *                  "_id": "572a0bdfccea0b6613430b4c"
 *              },
 *              {
 *                  "name": "iPhone 6s Plus",
 *                  "isSale": false,
 *                  "price": 500,
 *                  "photo": "iphone.jpg",
 *                  "tags": [
 *                      "lifestyle",
 *                      "mobile"
 *                  ]
 *                  "_id": "572a0bdfccea0b6613430b4d"
 *              }
 *          ]
 *      }
 *
 * @apiError AUTH_NO_TOKEN No token provided.
 *
 * @apiErrorExample Error-Response:
 *     {
 *       "success": false,
 *       "error": "AUTH_NO_TOKEN",
 *       "description": "Es necesario especificar un token"
 *     }
 */

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
