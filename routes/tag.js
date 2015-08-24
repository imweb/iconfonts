var express = require('express'),
    router = express.Router();

var Icon = require('../models/icon.js');

router.get('/:id', function (req, res, next) {
	Icon.find({
		iconId: req.params.id
	}).exec(function (err, icons) {
		if (err) {
			console.error(err);
			return cb(err);
		}
		var toString = Object.prototype.toString;
		if(toString.apply(icons) === '[object Array]') {
			icons = icons[0];
		}
		res.render('tag', {
            user: req.user,
			icon: icons
		});
	});
});

module.exports = router;
