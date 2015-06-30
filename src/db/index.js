
var model = require('./model.js');

var Icon = model.Icon;

function findAll(cb){
	Icon.find(function(err, icons){
		typeof cb === 'function' && cb(err ? [] : icons);
	});
}

function findBy(condition, cb){
	Icon.find(condition, function(err, icons){
		typeof cb === 'function' && cb(err ? [] : icons);
	});
}

module.exports = {
	findAll: findAll,
	findBy: findBy
}

