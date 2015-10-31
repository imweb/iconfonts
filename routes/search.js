var express = require('express'),
    router = express.Router();

var Icon = require('../models/icon.js'),
    Tag = require('../models/tag.js'),
    Business = require('../models/business.js'),
    EventEmitter = require('eventemitter2').EventEmitter2,
    emitter = new EventEmitter();
    svgParser = require('../utils/svg_parser.js');

router.get('/', function (req, res, next) {
    search(req.query.q, function(err, arr) {
        if (err) return next(err);
        Business.find().exec(function(err, bids) {
            var bMaps = {};
            bids.forEach(function(b) {
                bMaps[b.bid] = b.name;
            });
            res.render('index', {
                all: arr,
                user: req.cookies.user,
                bMaps: bMaps
            });
        });
    });
});


function uniqList(arr) {
    // 去重
    var ret = [],
        tmpl = {},
        item;
    for(var k=0,len=arr.length; k<len; k++){
        item = arr[k];
        if(!tmpl[item]){
            tmpl[item] = 1;
            ret.push(item);
        }
    }
    return ret;
}

/*
* 图标名
* 标签
 */
function search(q, cb) {
    // todo: validate param q
    var toString = Object.prototype.toString;
    if (toString.apply(q) !== "[object String]" || q === "") {
        return typeof cb === 'function' && cb([]);
    }

    var ids = [],
        SOURCE_TOTAL = 2,
        total = 0,
        regexp = new RegExp(q, 'i');
    emitter.on('finish', function() {
        if(++total == SOURCE_TOTAL) {
            ids = uniqList(ids);
            Icon.find({
                iconId: {
                    $in: ids
                }
            }).exec(function(err, icons) {

                var rets = {};
                icons.forEach(function(icon) {
                    icon.content = svgParser.generateHtmlIconContent(icon.iconId);
                    if(!rets[icon.business]) {
                        rets[icon.business] = [];
                    } 
                    rets[icon.business].push(icon);
                });
                typeof cb === 'function' && cb(err, rets);
            });
        }

    });

    Icon.find({
        name: regexp
    }).exec(function(err, icons) {
        if(err) {
            console.error(err);
            return cb(err);
        }
        icons.forEach(function(r) {
            ids.push(r.iconId);
        });
        emitter.emit('finish');
    })

    Tag.find({
        $or: [
            {
                iconName: regexp
            }, {
                tag: regexp
            }
        ]
    }).exec(function(err, tags) {
        if(err) {
            console.error(err);
            return cb(err);
        }
        tags.forEach(function(r) {
            ids.push(r.iconId);
        });
        emitter.emit('finish');
    });

}


module.exports = router;
