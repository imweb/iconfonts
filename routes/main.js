var express = require('express'),
    router = express.Router();

var Icon = require('../models/icon.js');
var svgParser = require('../utils/svg_parser.js');

function getAllIcons(cb) {
    Icon.find()
        .sort({iconId: 1})
        .exec(function(err, icons) {
            if (err) {
                console.error(err);
                return typeof cb === 'function' && cb(err, icons);
            }
            icons.forEach(function(icon) {
                icon.content = svgParser.generateHtmlIconContent(icon.iconId);
            }); 
            typeof cb === 'function' && cb(err, icons);
        }); 
}

router.get(['/', '/index'], function (req, res, next) {
    getAllIcons(function(err, icons){
        if (err) return next(err);
        if(icons.length > 0) {
            svgParser.genarateFonts(icons);
            svgParser.generateCss(icons);
        }
        res.render('index', {all: icons});
    });
})

module.exports = router
