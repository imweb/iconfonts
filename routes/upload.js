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

	var allowExts = ['.svg', '.zip'/*, '.rar', '.7z', '.tar'*/];
	if(allowExts.indexOf(extname) == -1) {
		res.redirect('index');
		return;
	}

	upload(file, function(err){
		if (err) return next(err);
		fs.unlink(conf.downloadPath + 'svgs.zip');
		res.redirect('index');
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

module.exports = router
