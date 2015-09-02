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

        User.find({
            user: user
        }).exec(function(err, users) {
            if(err || users.length == 0) {
                res.render('user', {
                    all: icons,
                    user: user,
                    update: 1
                });
                return;
            }
            // 有更新权限
            if((users[0].auth & conf.auth.updateIcon) != 0) {
                res.render('user',{
                    all: icons,
                    user: user,
                    update: 1
                });
            }
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