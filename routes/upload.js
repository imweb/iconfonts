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
	auth = require('../midware/auth.js'),
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

router.get('/', auth, function (req, res, next) {

	/*
	* iconfont.imweb.io 鉴权
	 */
	
	checkUserAuth(req.cookies.user, conf.auth.upload, function(hasAuth) {
		if(hasAuth) {
			res.render('upload',{
		        user: req.cookies.user
		    });
		} else {
			res.render('404', {
				info: '没有上传权限，请联系管理员'
			});
		}
	});


});

/*
* upload 成功后，重新生成字体和css
 */
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
		console.log(errMaps);
		res.status(200).send({
			retcode: 0,
			result: errMaps
		});
		return;
	}

	upload(file, function(errMaps){
		// 重新生成字体
        svgParser.genarateFonts(icons);
        svgParser.generateCss(icons);

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
