var express = require('express'),
    router = express.Router(),
    Icon = require('../model/icon.js'),
    Business = require('../model/business.js'),
    conf = require('../conf.js'),
    clean = require('../utils/file.js'),
    svgParser = require('../utils/svg_parser.js');

function getAllIcons(cb) {
    Icon.find()
        .sort({
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

router.get('/', function(req, res, next) {
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

        Business.find().exec(function(err, bids) {
            var bMaps = {};
            bids.forEach(function(b) {
                bMaps[b.bid] = b.name;
            });
            res.render('myindex', {
                all: icons,
                user: req.user,
                bMaps: bMaps
            });
        });

    });
});



module.exports = router;