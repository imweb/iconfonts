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
    clean = require('../utils/file.js'),
    Icon = require('../models/icon.js'),
    auth = require('../midware/auth.js'),
    logger = require('../utils/logger.js'),
    checkUserAuth = require('../utils/checkAuth.js'),
    Business = require('../models/business.js'),
    multer = require('multer'),
    svgParser = require('../utils/svg_parser.js'),
    store = require('../utils/store.js');

var allowExts = ['.svg', '.zip'],
    upMulter = multer({dest: './uploads/'}),
    maxUploadFileSize = 50*1024;

router.get('/', auth, function(req, res, next) {
    checkUserAuth(req.cookies.user, conf.auth.upload, function(hasAuth) {
        if (hasAuth) {

            Business.find({}).exec(function(err, bids) {
                if (err) {
                    console.error(err);
                    next(err);
                    return;
                }
                res.render('upload', {
                    user: req.cookies.user,
                    bids: bids
                });
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
router.post('/', auth, jsonParser, upMulter, function(req, res, next) {
    var user = req.cookies.user;

    checkUserAuth(user, conf.auth.upload, function(hasAuth) {
        if (!hasAuth) {
            logger.logMulty({
                source: file.originalname,
                dest: file.name,
                username: user,
                error: 'has no auth to upload'
            });
            res.status(200).send({
                retCode: 100000,
                result: {
                    info: '没有权限'
                }
            });
        } else {
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
        }
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
