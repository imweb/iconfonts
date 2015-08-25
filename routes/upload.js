'use strict';
/*
 * @author helondeng, moxhe
 */
var express = require('express'),
	path = require('path'),
	fs = require('fs'),
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
	var allowExts = ['.svg', '.zip'];
	if(allowExts.indexOf(extname) == -1) {
		console.log(path.join('./uploads', file.name));
		fs.unlinkSync(path.join('./uploads', file.name));
		var errMaps = {};
		// path.basename(file.originalname, extname)
		errMaps[file.originalname] = '文件后缀名必须是svg或zip';
		res.status(200).send({
			retcode: 0,
			result: errMaps
		});
		return;
	}

	upload(file, function(errMaps){
		fs.unlinkSync('download/svgs.zip');
		res.status(200).send({
			retcode: 0,
			result: errMaps
		});
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

module.exports = router;
