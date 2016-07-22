var express = require('express'),
    path = require('path'),
    fs = require('fs'),
    router = express.Router();

var bodyParser = require('body-parser'),
    jsonParser = bodyParser.json();

var conf = require('../conf.js'),
    clean = require('../utils/file.js'),
    Icon = require('../model/icon.js'),
    auth = require('../midware/auth.js'),
    logger = require('../utils/logger.js'),
    checkUserAuth = require('../utils/checkAuth.js'),
    multer = require('multer'),
    svgParser = require('../utils/svg_parser.js'),
    store = require('../utils/store.js');

var allowExts = ['.svg', '.zip'],
    upMulter = multer({dest: './uploads/'}),
    maxUploadFileSize = 50*1024;

var Business = require('../model/business.js');

router.get('/', function(req, res, next){
	var user = req.user;
	if (!user) {
		res.render('intro', {
	        user: req.user
	    });
		return console.log("未登录")
	}
	Business.find({}).exec(function(err, bids){
		// console.log(bids);
		if (err) {
			console.error(err);
            next(err);
            return;
		}


		// if (bids.length === 0) {
		// 	var newBusiness = {
		// 		name: "默认icon库",
		// 		pm: req.user.nickname
		// 	}
		// 	Business.create(newBusiness, function(err){
		// 		if (err) return console.log("添加数据库失败");
		// 		console.log("添加数据库成功");
		// 	});
		// }
		res.render('upload', {
			user: req.user,
			bids: bids
		});
	})
});

router.post('/addproject', function(req, res){
	console.log(req.body);
	if (req.body.project) {

		var newBusiness = {
			name: req.body.project,
			pm: req.user.nickname
		}
		Business.create(newBusiness, function(err){
			if (err) return console.log("添加数据库失败");
			console.log("添加数据库成功");

			Business.find({}).exec(function(err, bids){
				// console.log(bids);
				if (err) {
					console.error(err);
		            next(err);
		            return;
				}
				res.send(bids);
			})
		});

		
	}
	
})

/*
 * upload 成功后，重新生成字体和css
 */
router.post('/', jsonParser, upMulter, function(req, res, next) {
    var user = req.user.nickname;

    var file = req.files.file,
        extname = path.extname(file.path);

    logger.logMulty({
        source: file.originalname,
        dest: file.name,
        username: user
    });

    file.author = user;
    file.business = req.body.business;

    
    if (allowExts.indexOf(extname) == -1) {
        fs.unlinkSync(path.join('./uploads', file.name));
        var errInfo = {};
        errInfo[file.originalname] = '文件后缀名必须是svg或zip';
        logger.logMulty({
            source: file.originalname,
            dest: file.name,
            username: user,
            error: 'illegal file extension'
        });
        res.status(200).send({
            retcode: 0,
            result: errInfo
        });
        return;
    }


    if (file.size > maxUploadFileSize) {
        var errInfo = {};
        errInfo[file.originalname] = 'SVG文件太大（' + (file.size / 1024).toFixed(2) + 'kb）！';
        fs.unlinkSync(path.join('./uploads', file.name));
        logger.logMulty({
            source: file.originalname,
            dest: file.name,
            username: user,
            error: 'file size too large'
        });
        res.status(200).send({
            retcode: 0,
            result: errInfo
        });

        return;
    }

    upload(file, function(errMaps) {
        var zips = fs.readdirSync('download'),
            zipPath;
        zips.forEach(function(zip) {
            zipPath = path.join('download', zip);
            if (fs.statSync(zipPath).isFile()) {
                fs.unlinkSync(zipPath);
            } else {
                clean.cleanDir(zipPath);
            }
        });

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


function upload(file, cb) {
    var ext = path.extname(file.path);
    logger.logMulty({
        extname: ext
    });

    if (ext == '.svg') {
        store.storeSvg(file, cb);
    } else if (['.zip'].indexOf(ext) > -1) {
        store.storeZip(file, cb);
    }
}


module.exports = router;