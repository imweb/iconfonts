var express = require('express'),
    router = express.Router();

var Icon = require('../models/icon.js');

router.get('/', function(req, res, next) {
    var cookies = req.cookies,
        user = cookies.user;
    // user = 'hale';

    // 鉴权
    Icon.find({
        author: user
    }).exec(function(err, icons) {
        res.render('user', {
            all: icons
        });
    });
});

module.exports = router;