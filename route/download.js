var express = require('express'),
	router = express.Router();

var Icon = require('../model/icon.js'),
    conf = require('../conf.js'),
	svgParser = require('../utils/svg_parser.js'),
	download = require('../utils/download.js');


router.get(['/:ids', '/:ids/:bid'], function (req, res, next) {
	var ids = req.params.ids.split('-'),
		bid = req.params.bid;
	var handler = function(err, p){
		if (err) return next(err);
 		res.setHeader('Content-Type', 'application/zip');
 		var filename = path.basename(p);
    	res.setHeader('Content-Disposition', 'attachment; filename=' + filename);
		res.download(p, function(err){
			if(err) console.log(err);
		});
	};
	if (ids[0] === '$svgs') download.packUpSvgs(handler, bid);
	else downloadIconfonts(req.params.ids.split('-'), handler);
});

function downloadSvgs (cb) {
	// download by project name in future
	download.packUpSvgs(cb);
}

function downloadIconfonts(ids, cb) {
	Icon.find({
		iconId : {
			'$in' : ids
		}
	}, function (err, icons) {
		if (err) {
			console.error(err);
			return cb(err, icons);
		}
		icons.forEach(function (icon) {
			icon.content = svgParser.generateHtmlIconContent(icon.iconId + conf.diff);
		});
		download.packUpIconfonts(icons, cb);
	});
}

module.exports = router;
