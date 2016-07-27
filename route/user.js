var express = require('express'),
    router = express.Router(),
    Icon = require('../model/icon.js'),
    Business = require('../model/business.js'),
    conf = require('../conf.js'),
    clean = require('../utils/file.js'),
    svgParser = require('../utils/svg_parser.js');

var addUserToMongo = require('../midware/addUserToMongo.js');


router.post('/delete', function(req, res, next){
    var name = req.body.name;
    Business.remove({
        name: name
    }).exec(function(err, next){
        if (err) {
            return console.log(err)
        }
        res.status(200).send({
            retcode: 0
        });
    })
})


router.get('/', addUserToMongo, function(req, res, next) {
    function getAllIcons(cb) {
        Icon.find({
            id: req.user.id
        }).sort({
                iconId: 1
            }).exec(function(err, icons) {
                if (err) {
                    console.error(err);
                    return typeof cb === 'function' && cb(err, icons);
                }

                var rets = {};
                icons.forEach(function(icon) {
                    icon.content = svgParser.generateHtmlIconContent(icon.iconId + conf.diff);
                    if(!rets[icon.business]) {
                        rets[icon.business] = [];
                    } 
                    rets[icon.business].push(icon);
                });
                typeof cb === 'function' && cb(err, rets, icons);
            });
    }


    clean.cleanPreviousFiles(path.dirname(conf.allSvgZipPath), 24*3600*1000);
    getAllIcons(function(err, icons, ret){
        if (err) {
            return next(err);
        }
        // if(icons.length > 0) {
            // svg 文件不存在情况兼容
             svgParser.genarateFonts(ret);
             svgParser.generateCss(ret);
        // }

        Business.find({
            id: req.user.id
        }).exec(function(err, bids) {
            var bMaps = {};
            bids.forEach(function(b) {
                bMaps[b.bid] = b.name;
            });

            res.render('user', {
                all: icons,
                user: req.user,
                bMaps: bMaps
            });
        });

    });
});




module.exports = router;