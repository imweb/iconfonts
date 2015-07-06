var Datastore = require('nedb'), 
	conf = require('../conf.js'),
	tools = require('../libs/tools.js'),
	low = require('lowdb')/*,
	db = new Datastore({filename: conf.db_path})*/;



function findAll(cb){
/*	db.find({}, function(err, icons){
		typeof cb === 'function' && cb(err ? [] : icons)
	});*/
	var db = low(conf.low_db);
	var pcs = db('pc').sortBy('iconId'),
		h5s = db('h5').sortBy('iconId'),
		rets = [];
	rets = pcs.concat(h5s);
	typeof cb === 'function' && cb({
		pcs: pcs,
		h5s: h5s
	});
	tools.genarateFonts(rets);
	tools.generateCss(rets)
}

module.exports = {
	findAll: findAll
}

