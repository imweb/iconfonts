var model = require('./model.js');

var db = model.db;

function findAll(cb){
	db.find({}, function(err, icons){
		typeof cb === 'function' && cb(err ? [] : icons)
	});
}

module.exports = {
	findAll: findAll
}

