var conf = require('../conf.js'),
	tools = require('../libs/tools.js'),
	low = require('lowdb')/*,
	db = new Datastore({filename: conf.db_path})*/;



function findAll(cb){
/*	db.find({}, function(err, icons){
		typeof cb === 'function' && cb(err ? [] : icons)
	});*/
	var db = low(conf.low_db);

	var dbNames = conf.cats,
		rets = {},
		icons = [];
	for(var name in dbNames){
		_ret = db(name).sortBy('iconId');
		rets[name] = _ret;
		icons = icons.concat(_ret);
	}
	typeof cb === 'function' && cb(rets);
	tools.genarateFonts(icons);
	tools.generateCss(icons)
}

module.exports = {
	findAll: findAll
}

