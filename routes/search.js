var express = require('express'),
    router = express.Router();

var Icon = require('../models/icon.js'),
    svgParser = require('../utils/svg_parser.js');

router.get('/', function (req, res, next) {
    search(req.query.q, function(err, arr) {
        if (err) return next(err);
        if(arr.length > 0) {
            svgParser.genarateFonts(arr);
            svgParser.generateCss(arr);
        }
        res.render('index', {all: arr});
    });
});

function search(q, cb) {
    // todo: validate param q
    var toString = Object.prototype.toString;
    if (toString.apply(q) !== "[object String]" || q === "")
        typeof cb === 'function' && cb([]);
    Icon.$where('this.name.search("' + q + '") !== -1')
        .exec(function(err, docs) {
            if (err) {
                console.error(err);
                return cb(err);
            }
            docs.forEach(function(icon) {
                icon.content = svgParser.generateHtmlIconContent(icon.iconId);
            }); 
            typeof cb === 'function' && cb(err, docs);
        });
}

module.exports = router;
