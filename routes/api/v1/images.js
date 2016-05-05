"use strict";

var express = require('express');

/**
 * @api {get} /images/adverts/:image Get adverts images
 * @apiName GetImages
 * @apiGroup Images
 * @apiVersion 1.0.0
 * @apiDescription This /GET request returns the image associated with an advert.
 *
 * @apiParam {String} image The name of the image to get (i.e. audi.png).
 *
 * @apiSuccess {Image} Returns directly the requested image.
 */

module.exports = express.static('./public/images');
