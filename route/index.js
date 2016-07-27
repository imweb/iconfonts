var express = require('express'),
    router = express.Router();
var User = require('../model/user.js'),
    Business = require('../model/business.js'),
    Icon = require('../model/icon.js');
// var main = require('../routes/main.js'),
//     upload = require('./upload'),
//     download = require('./download'),
//     search = require('./search'),
//     user = require('./user'),
//     tag = require('./tag');


var myupload = require('../route/upload'),
    // mybusiness = require('../route/business'),
    mymain = require('../route/main'),
    myuser = require('../route/user'),
    mytag = require('../route/tag'),
    myupdate = require('../route/updateIcon'),
    mydownload = require('../route/download'),
    mysearch = require('../route/search'),
    management = require('../route/management');
    
var addUserToMongo = require('../midware/addUserToMongo.js');

var conf = require('../conf.js');
// var User = require('../models/user.js');

router.use('/', mymain);
router.use('/upload', myupload);
router.use('/download', mydownload);
router.use('/search', mysearch);
router.use('/management', management);
router.use('/checkin', function(req, res){
    res.render('checkin', {
        user: req.user
     });
 });

// QQ接口登录设置
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

    var newuser = {
      user: profile.nickname,
      id: profile.id,
      img: profile._json.figureurl_qq_1
    };
    User.find({
      id: newuser.id
    }).exec(function(err, user){
      if (user.length !== 0) {
          // Business.update({
          //   pm: user[0].user
          // },{
          //   "$set":{"id" :user[0].id}
          // },{multi: 1}).exec(function(err){
          //   if (err) {
          //     console.log(err)
          //   }
          //   console.log("更新成功");
          // })


          // Icon.update({
          //   author: user[0].user
          // },{
          //   "$set":{"id" :user[0].id}
          // },{multi: true}).exec(function(err){
          //   if (err) {
          //     console.log(err)
          //   }
          //   console.log("更新成功");
          // })

          return done(err, profile);
      }
      User.create(newuser, function(err){
        if (err) return console.log(err);
        return done(err, profile);
      });

    })
    
}));


router.use('/tag', mytag);

router.use('/user', myuser);

router.get('/rule', function(req, res){
    res.render('rule',{
        user: req.user
    });
});

router.use('/intro', function(req, res){
    res.render('intro', {
        user: req.user
     });
 });
router.use('/myindex', mymain);
// router.get('/myindex', function(req, res){
//   res.send("ok");
// });
router.use('/update', myupdate);
router.get('/business',function(req, res) {
    res.render('404', {
        user: req.user
    });
});

router.get('/404', function(req, res) {
    res.render('404', {
        user: req.user
    });
});


router.get('/user/auth/qq',
  passport.authenticate('qq'),
  function(req, res){
// The request will be redirected to qq for authentication, so this
// function will not be called.
});

// GET /auth/qq/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
router.get('/user/auth/qq/callback', 
  passport.authenticate('qq', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/intro');
  });

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});



module.exports = router;
