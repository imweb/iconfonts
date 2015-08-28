var express = require('express'),
    router = express.Router();

var Icon = require('../models/icon.js'),
    auth = require('../midware/auth.js'),
    User = require('../models/user.js');

router.get('/', function(req, res, next) {
    var cookies = req.cookies,
        user = cookies.user;
    
    Icon.find({
        // author: user
    }).exec(function(err, icons) {
        res.render('user', {
            all: icons,
            user: user
        });
    });

});

/*
* 检查用户是否有上传权限
* upload: 1
 */
function checkAdmin(user, cb) {
    User.find({
        user: user
    }).exec(function(err, users) {
        typeof cb === 'function' && cb(users.length > 0);
    });
}

module.exports = router;