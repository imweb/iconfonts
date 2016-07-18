var express = require('express'),
    router = express.Router();

var main = require('./main.js'),
    upload = require('./upload'),
    download = require('./download'),
    search = require('./search'),
    user = require('./user'),
    tag = require('./tag');

var conf = require('../conf.js');
var User = require('../models/user.js');

router.use('/', main);
router.use('/upload', upload);
router.use('/download', download);
router.use('/search', search);
router.use('/checkin', function(req, res){
    res.render('checkin', {
        user: req.user
     });
 });


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
    process.nextTick(function () {
      // To keep the example simple, the user's qq profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the qq account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
    User.find({
        profile: {
            id: profile.id
        }
    }).exec(function(err, user){
        if (user) {
            return done(err, user);
        }
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


router.use('/tag', tag);

router.use('/user', user);

router.get('/rule', function(req, res){
    res.render('rule',{
        user: req.user
    });
});

router.get('/intro', function(req, res){
    res.render('intro', {
        user: req.user
    });
});

router.use('/update', require('./updateIcon'));
router.use('/business', require('./business'));

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
