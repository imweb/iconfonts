var express = require('express'),
    router = express.Router(),
    Icon = require('../model/icon.js'),
    Business = require('../model/business.js'),
    conf = require('../conf.js'),
    clean = require('../utils/file.js'),
    svgParser = require('../utils/svg_parser.js'),
    User = require('../model/user.js');

var author = ['imweb'];
router.get(['/', '/index'], function(req, res, next) {
    
    function getAllIcons(cb) {
        User.find({
            auth: 1
        }).exec(function(err, users){
            // console.log(users)
            if (users.length == 0) {
                // return console.error(err);
                return res.send("没有icon");
            }

            var newUsers = [];
            users.forEach(function(user) {
                newUsers.push({"author": user.user})
            })
            // console.log(newUsers)
            Icon.find({
                // author: newUsers
                $or: newUsers
                //这里用作设置权限
            }).sort({
                    iconId: 1
                }).exec(function(err, icons) {
                    if (err) {
                        console.error(err);
                        return typeof cb === 'function' && cb(err, icons);
                    }
                    // console.log(icons)
                    var rets = {};
                    icons.forEach(function(icon) {
                        icon.content = svgParser.generateHtmlIconContent(icon.iconId + conf.diff);
                        if(!rets[icon.business]) {
                            rets[icon.business] = [];
                        } 
                        rets[icon.business].push(icon);
                    });
                    // console.log(rets)
                    typeof cb === 'function' && cb(err, rets, icons, users);
                });
        })
    }


    clean.cleanPreviousFiles(path.dirname(conf.allSvgZipPath), 24*3600*1000);
    getAllIcons(function(err, rets, icons, users){
        if (err) {
            return next(err);
        }
        // if(icons.length > 0) {
            // svg 文件不存在情况兼容
             svgParser.genarateFonts(icons);
             svgParser.generateCss(icons);
        // }
        var newBusiness = [];
            users.forEach(function(user) {
                newBusiness.push({"pm": user.user})
            })
            // console.log('newBusiness',newBusiness)
        Business.find({
            $or: newBusiness
        }).exec(function(err, bids) {
            var bMaps = {};
            bids.forEach(function(b) {
                bMaps[b.bid] = b.name;
            });
            // console.log(bids)
            res.render('index', {
                all: rets,
                user: req.user,
                bMaps: bMaps,
            });
        });

    });
});



module.exports = router;