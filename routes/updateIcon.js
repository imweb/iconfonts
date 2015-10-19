var express = require('express'),
    fs = require('fs'),
    router = express.Router();

var bodyParser = require('body-parser'),
    jsonParser = bodyParser.json();

var Tag = require('../utils/tag.js'),
    auth = require('../midware/auth.js'),
    userAuthCheck = require('../utils/checkAuth.js'),
    Business = require('../models/business.js'),
    svgParser = require('../utils/svg_parser.js'),
    Icon = require('../models/icon.js');


var currentPath;

router.get('/',/* auth,*/ function (req, res, next) {
    var id = req.query.id,
        user = req.cookies.user;
    // update
    userAuthCheck(user, conf.auth.updateIcon, function(hasAuth) {
        if(hasAuth) {
            Icon.find({
                    iconId: id
            }).exec(function(err, icons) {
                if(err) {
                    res.render('404', {
                        info: '500 内部错误'
                    });
                    return;
                }
                if(icons.length === 0) {
                    res.render('404', {
                        info: '未查找到对应的Icon！'
                    });
                    return;
                }
                currentPath = icons[0].path || '';
                Business.find({}).exec(function(err, bids) {
                    if(err) {
                        console.error(err);
                        next(err);
                        return;
                    }
                    res.render('updateIcon', {
                        icon: icons[0],
                        bids: bids
                    });
                });
               

            });
        } else {
            res.render('404', {
                info: '暂无权限操作，请联系管理员！'
            });
        }
    });

});


router.post('/',/* auth,*/ function (req, res, next) {
    var user = req.cookies.user,
        params = req.body;
    // update
    userAuthCheck(user, conf.auth.updateIcon, function(hasAuth) {
        if(hasAuth && currentPath) {             
            // 修改文件名
            Icon.update({
                iconId: params.id
            }, {
                $set: {
                    name: params.name,
                    className: 'i-' + params.name,
                    business: params.business,
                    path: '' + path.dirname(currentPath) + '/' + params.name + '.svg'
                }
            }, function(err) {
               // 字体文件重新生成
                if(err) {
                    res.status(200).send({
                        retcode: 2,
                        result: {
                            msg: 'update error!'
                        }
                    })
                } else {
                    fs.renameSync(path.join(conf.svgPath, currentPath), path.join(conf.svgPath, path.dirname(currentPath), params.name + '.svg'));
                    svgParser.refreshFonts();
                    res.status(200).send({
                        retcode: 0
                    });
                }
            });

        } else {
            res.render('404', {
                info: '暂无权限操作，请联系管理员！'
            });
        }
    });
});


/*
* del icon
* remove record from db
* not unlink file on disk
 */
router.post('/del',/* auth,*/ function (req, res, next) {
    var user = req.cookies.user,
        id = req.body.id;
    userAuthCheck(user, conf.auth.updateIcon, function(hasAuth) {
        if(hasAuth) {
            if(!id) {
                // id not exist
                res.status(200).send({
                    retcode: 10
                });  
                return;
            }
            Icon.remove({
                iconId: id
            }).exec(function(err, icons) {
                if(err) {
                    res.status(200).send({
                        retcode: -1,
                        result: {
                            msg: 'remove error !'
                        }
                    });
                    return ;
                }
                res.status(200).send({
                    retcode: 0
                });
            }) 
        } else {
            res.status(200).send({
                retcode: 10000,
                result: {
                    msg: 'has no auth!'
                }
            });
        }

    });
});


module.exports = router;