
/*
* @author helondeng
* 判断用户是否有某个权限
* 二进制权限验证方式
 */
var User = require('../model/user.js');

function checkUserAuth(user, auth, cb) { 
    User.find({
        user: user
    }).exec(function(err, users) {
        var hasAuth;
        if(users.length == 0 || err) {
            hasAuth = false;
        } else {
            hasAuth = (users[0].auth & auth) != 0;
        }   
        typeof cb === 'function' && cb(hasAuth);
    });
}


module.exports = checkUserAuth;
