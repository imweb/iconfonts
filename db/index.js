var conf = require('../conf.js'),
	tools = require('../libs/tools.js'),
	db = require('./db.js'),
	Icon = require('../models/icon.js');

function findAll(cb){
	var cats = conf.cats;
		rets = {'pc': [], 'h5': [], 'other': []},
		icons = [];
	Icon.find()
		.sort({iconId: 1})
		.exec(function(err, docs) {
			for (var i = 0, len = docs.length; i < len; i++) {
				var icon = docs[i];
				icon.content = tools.generateHtmlIconContent(icon.iconId);
				rets[icon.kind].push(icon);	
			}
			for (var name in cats) {
				icons = icons.concat(rets[name]);
			}
			typeof cb === 'function' && cb(rets);
			tools.genarateFonts(icons);
			tools.generateCss(icons);
	});
}

module.exports = {
	findAll: findAll
}

