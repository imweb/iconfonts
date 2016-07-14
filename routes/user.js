var express = require('express'),
    router = express.Router();

var Icon = require('../models/icon.js'),
    auth = require('../midware/auth.js'),
    User = require('../models/user.js');

var passport = require('passport');
var StrategyQQ = require('passport-qq').Strategy;

var conf = require('../conf.js');

// QQ第三方登录
passport.use(new StrategyQQ({
    clientID: conf.appId,
    clientSecret: conf.appKey,
    callbackURL: conf.origin + '/user/auth/qq/callback',
    state: 1
},function(accessToken, refreshToken, profile, done){
    // json格式详情见 http://wiki.connect.qq.com/get_user_info
    // profile = {
    //     id: openid,
    //     nickname: nickname,
    //     _json: json
    // }
    User.find({
        profile: {
            id: profile.id
        }
    }).exec(function(err, user){
        if (user) {
            return done(err, user);
        }
        console.log("1");
        new User({
            user: profile.nickname,
            profile: {
                id: profile.id,
                info: profile._json
            }
        }).save(function(err, doc){
            return done(err, user);
        });
    });
}));


router.get('/', auth, function(req, res, next) {
    var cookies = req.cookies,
        user = cookies.user;
    // console.log(cookies);
    Icon.find({
        // author: user
    }).exec(function(err, icons) {

        User.find({
            user: user
        }).exec(function(err, users) {
            var params = {
                all: icons,
                user: user
            };
            if(err || users.length == 0) {
                res.render('user', params);
                return;
            }
            // 有更新权限
            if((users[0].auth & conf.auth.updateIcon) != 0) {
                params.update = 1;
            }

            if((users[0].auth & conf.auth.business) != 0) {
                params.business = 1;
            }
            res.render('user', params);
        });

    });

});

router.get('/auth/qq', passport.authenticate('qq'));

router.get(
    '/auth/qq/callback', 
    passport.authenticate('qq',{failureRedirect: '/?err=1'}),
    function(req, res){
        res.redirect('/');
    }
)

/*
* 检查用户是否有上传权限
* upload: 1
 */
// function checkAdmin(user, cb) {
//     User.find({
//         user: user
//     }).exec(function(err, users) {
//         typeof cb === 'function' && cb(users.length > 0);
//     });
// }

module.exports = router;
