'use strict';
/*
 * @author helondeng, moxhe
 */
var http = require('http'),
	fs = require('fs'),
	_ = require('underscore');
var authOptions = {
	host: 'imweb.io',
	path: '/domainauth',
	// host: 'proxy.tencent.com',
	// path: 'http://imweb.io/domainauth',
    // port: '8080',
	method: 'GET'
};
var express = require('express'),
	path = require('path'),
	fs = require('fs'),
	router = express.Router();

var conf = require('../conf.js'),
	Icon = require('../models/icon.js'),
	auth = require('../midware/auth.js'),
	Business = require('../models/business.js'),
	svgParser = require('../utils/svg_parser.js'),
	store = require('../utils/store.js');

/*
* 二进制权限验证方式
 */
function checkUserAuth(user, auth, cb) {
	var User = require('../models/user.js');
	User.find({
		user: user
	}).exec(function(err, users) {
		var hasAuth;
		if(users.length == 0) {
			hasAuth = false;
		} else {
			hasAuth = (users[0].auth & auth) != 0;
		}	
		typeof cb === 'function' && cb(hasAuth);
	});
}

router.get('/', /*auth, */function (req, res, next) {


	/*
	* iconfont.imweb.io 鉴权
	 */
	
	// checkUserAuth(req.cookies.user, conf.auth.upload, function(hasAuth) {
	// 	if(hasAuth) {
	// 		
		Business.find({}).exec(function(err, bids) {
			if(err) {
				console.error(err);
				next(err);
				return;
			}
			res.render('upload',{
		        user: req.cookies.user,
		        bids: bids
		    });
		});

	// 	} else {
	// 		res.render('404', {
	// 			info: '没有上传权限，请联系管理员'
	// 		});
	// 	}
	// });

});

/*
* upload 成功后，重新生成字体和css
 */
router.post('/', jsonParser, function (req, res, next) {
	var file = req.files.file,
		extname = path.extname(file.path);

	file.author = req.cookies.user;
	file.business = req.body.business;

	console.log(req.body);
	var allowExts = ['.svg', '.zip'];
	if(allowExts.indexOf(extname) == -1) {
		fs.unlinkSync(path.join('./uploads', file.name));
		var errInfo = {};
		errInfo[file.originalname] = '文件后缀名必须是svg或zip';
		res.status(200).send({
			retcode: 0,
			result: errInfo
		});
		return;
	}

	upload(file, function(errMaps){
		if(fs.existsSync('download/svgs.zip')) {
			fs.unlinkSync('download/svgs.zip');
		}
		
		// 重新生成字体
		Icon.find()
        .exec(function(err, icons) {
        	icons.forEach(function(icon) {
                icon.content = svgParser.generateHtmlIconContent(icon.iconId);
            }); 
	        svgParser.genarateFonts(icons);
	        svgParser.generateCss(icons);        
	        
	    });
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
