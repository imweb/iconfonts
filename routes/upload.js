'use strict';
/*
 * @author helondeng, moxhe
 */
var http = require('http'),
	fs = require('fs'),
	_ = require('underscore');
var authOptions = {
	// host: 'imweb.io',
	// path: '/webauth',
	host: 'proxy.tencent.com',
	path: 'http://imweb.io/domainauth',
    port: '8080',
	method: 'GET'
};
var express = require('express'),
	path = require('path'),
	fs = require('fs'),
	router = express.Router();

var conf = require('../conf.js'),
	store = require('../utils/store.js');

router.get('/', function (req, res, next) {
    res.render('upload', {
        user: req.user
    });
});

router.post('/', authCheck, function (req, res, next) {
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
		fs.unlinkSync(conf.allSvgZipPath);
		res.status(200).send({
			retcode: 0,
			result: errMaps
		});
	});
});

function authCheck(req, res, next) {
	if (req.cookies.accessToken) {
		['uin', 'skey', 'accessToken'].forEach(function (key) {
			authOptions.path += '/' + req.cookies[key];
		});
		var authReq = http.request(authOptions, function (res) {
			var str = '';
			res.setEncoding('utf8');
			res.on('data', function (chunk) {
				str += chunk;
			});
			res.on('end', function () {
				var data = JSON.parse(str);
				if (data.retcode !== 200) res.status(401).end();
				next();
			});
		}).on('error', function (err) {
			console.error(err.message);
			res.status(500).end();
		});
		authReq.end();
	}
	res.status(401).end();
}

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
