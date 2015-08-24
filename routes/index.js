var express = require('express'),
    router = express.Router();

var main = require('./main.js'),
    upload = require('./upload'),
    download = require('./download'),
    search = require('./search'),
    tag = require('./tag');

router.use('/', main);
router.use('/upload', upload);
router.use('/download', download);
router.use('/search', search);
router.use('/tag', tag);

router.get('/rule', function(req, res){
    res.render('rule');
});

router.get('/intro', function(req, res){
    res.render('intro');
});

module.exports = router
