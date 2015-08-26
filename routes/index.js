var express = require('express'),
    router = express.Router();

var main = require('./main.js'),
    upload = require('./upload'),
    download = require('./download'),
    search = require('./search'),
    user = require('./user'),
    tag = require('./tag');


router.use('/', main);
router.use('/upload', upload);
router.use('/download', download);
router.use('/search', search);
router.use('/tag', tag);

router.use('/user', user);

router.get('/rule', function(req, res){
    res.render('rule',{
        user: req.cookies.user
    });
});

router.get('/intro', function(req, res){
    res.render('intro', {
        user: req.cookies.user
    });
});


router.get('/404', function(req, res) {
    res.render('404', {
        user: req.cookies.user
    });
});

module.exports = router;
