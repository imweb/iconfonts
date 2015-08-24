/*
 * @author helondeng, moxhe
 */
var express = require('express'),
	router = express.Router();

var bodyParser = require('body-parser'),
	jsonParser = bodyParser.json();

var conf = require('../conf.js'),
	store = require('../utils/store.js');

router.get('/', function (req, res, next) {
    res.render('upload');
});

router.post('/', jsonParser, function (req, res, next) {
	var file = req.files.file,
		extname = path.extname(file.path);

	var allowExts = ['.svg', '.zip'/*, '.rar', '.7z', '.tar'*/];
	if(allowExts.indexOf(extname) == -1) {
		res.redirect('index');
		return;
	}

	upload(file, function(err){
		if (err) return next(err);
		res.redirect('index');
	});
});


function upload(file, cb) {
	var ext = path.extname(file.path);
	if (ext == '.svg') {
		store.storeSvg(file, cb);
	} else if (['.zip'].indexOf(ext) > -1) {
		// just support zip
		store.storeZip(file, cb);
	}
}

module.exports = router
