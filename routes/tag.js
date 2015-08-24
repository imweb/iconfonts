var express = require('express'),
    router = express.Router();

var bodyParser = require('body-parser'),
	jsonParser = bodyParser.json();

var Tag = require('../utils/tag.js'),
	Icon = require('../models/icon.js');

router.get('/', function (req, res, next) {
	var id = req.query.id;

	Tag.findAllTagsByIconId(id, function(err, tags) {
		if(tags.length > 0){
			res.render('tag', {
				icon: {
					iconId: id,
					name: tags[0].iconName,
					tags: tags,
					className: 'i-' + tags[0].iconName
				}
			});
		} else {
			// no tags, find iconName and className
			Icon.find({
				iconId: id
			}, function(err, icons) {
				if(icons.length == 0) {
					return res.render('404');
				}
				var toString = Object.prototype.toString;
				if(toString.apply(icons) === '[object Array]') {
					icons = icons[0];
				}
				icons.iconId = id;
				res.render('tag', {icon: icons});
			});
		}

	});
});

/*
* referer 检查，
* 鉴权
 */
router.post('/add', function(req, res, next) {
	var params = req.body;
	var tagInfo = {
		tag: params.tag,
		iconName: params.iconName,
		iconId: params.iconId
	};

	Tag.add(tagInfo, function(tag) {
		res.status(200).send({
			retcode: 0,
			result: tag
		});
	});
});


router.post('/del',jsonParser, function(req, res, next) {
	var id = req.body.id;

	Tag.remove(id, function(err, tag) {
		if(err) {
			return next(err);
		}
		res.status(200).send({
			retcode: 0,
			result: tag
		});
	});
});


module.exports = router;
