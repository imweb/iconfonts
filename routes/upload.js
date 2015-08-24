/*
 * @author helondeng, moxhe
 */
var http = require('http');
var authOptions = {
	// host: 'imweb.io',
	// path: '/webauth',
	host: 'proxy.tencent.com',
	path: 'http://imweb.io/webauth',
    port: '8080',
	method: 'POST',
	headers: {
		'Content-Type': 'application/json'
		// 'Content-Length': 0
	}
};
var express = require('express'),
	router = express.Router();

var bodyParser = require('body-parser'),
	jsonParser = bodyParser.json();

var conf = require('../conf.js'),
	store = require('../utils/store.js');

router.get('/', function (req, res, next) {
    res.render('upload', {
        user: req.user
    });
});

router.post('/', jsonParser, authCheck, function (req, res, next) {
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

function authCheck(req, res, next) {
	if (req.cookies.accessToken) {
		var body = JSON.stringify(req.cookies);
		authOptions.headers['Content-Length'] = body.length;
		var authReq = http.request(authOptions, function (res) {
			var data = '';
			res.setEncoding('utf8');
			console.log(res.headers)
			res.on('data', function (chunk) {
				data += chunk;
			});
			res.on('end', function () {
				console.log(data);
				next();
			});
		}).on('error', function (err) {
			console.error(err.message);
			res.status(500).end();
		});
		authReq.write(body);
		authReq.end();
	}
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
