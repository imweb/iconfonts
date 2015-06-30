var Datastore = require('nedb'), 
	conf = require('../conf.js'),
	db = new Datastore({filename: conf.db_path, autoload: true});

function findAll(cb){
	db.find({}, function(err, icons){
		typeof cb === 'function' && cb(err ? [] : icons)
	});
}

module.exports = {
	findAll: findAll
}

