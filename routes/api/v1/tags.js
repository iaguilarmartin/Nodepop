"use strict";

var express = require('express');
var router = express.Router();

var config = require('../../../app_config');

/**
 * @api {get} /tags List available tags
 * @apiName GetTags
 * @apiGroup Tags
 * @apiVersion 1.0.0
 * @apiDescription This /GET request returns a list with all available tags for adverts.
 *
 * @apiSuccess {Boolean} success Indicates if the request was successful or not.
 * @apiSuccess {String} result List containing available tags.
 *
 * @apiSuccessExample Success-Response:
 *     {
 *       "success": true,
 *       "result": ["lifestyle","motor","mobile","work"]
 *     }
 *
 *
 */

router.get('/', function (req, res, next) {
    res.json({success: true, result: config.tags});
});

module.exports = router;
