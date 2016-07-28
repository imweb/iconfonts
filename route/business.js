'use strict';
/*
 * @author helondeng
 */
var express = require('express'),
    path = require('path'),
    fs = require('fs'),
    router = express.Router();

var bodyParser = require('body-parser'),
    Business = require('../models/business.js'),
    userAuthCheck = require('../utils/checkAuth.js'),
    conf = require('../conf.js'),
    auth = require('../midware/auth.js'),
    jsonParser = bodyParser.json();
var addUserToMongo = require('../midware/addUserToMongo.js');
// get all business
router.get('/', addUserToMongo, function(req, res, next) {
    // check auth
    var user = req.user;
        Business.find()
        .exec(function(err, business) {
            if(err) {
                next(err);
                return;
            }
            res.render('business', {
                user: user,
                business: business
            });
        });
});

// add business
router.post('/add', addUserToMongo, function(req, res, next) {
    var params = req.body;
    userAuthCheck(req.cookies.user, conf.auth.business, function(hasAuth) {
        if(hasAuth) {
            var business = new Business({
                name: params.business,
                pm: params.pm
            });
            business.save(function(err, b) {
                if(err) {
                    res.status(200).send({
                        retcode: 500
                    });
                    next(err);
                    return;
                }
                res.status(200).send({
                    retcode: 0,
                    result: b
                });
            });
        } else {
            res.status(200).send({
                retcode: 100000
            });
        }

    });
});

module.exports = router;