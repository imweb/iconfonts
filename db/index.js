var tools = require('../libs/tools.js'),
	Icon = require('../models/icon.js');

function findAll(cb){
	Icon.find()
		.sort({iconId: 1})
		.exec(function(err, docs) {
			// err = {
			// 	msg: 'find all icons error.',
			// 	stack: 'db/index.js function findAll()'
			// }
			if (err) {
				console.error(err);
				return cb(err);
			}
			docs.forEach(function(icon) {
				icon.content = tools.generateHtmlIconContent(icon.iconId);
			});	
			typeof cb === 'function' && cb(err, docs);
	});
}


function generateType(name) {
    return /^[mhHM]-(.*)/.test(name) ? 'h5' : 'pc';
}

function insert(icons) {
	var toString = Object.prototype.toString;

	var insertOne = function (obj) {
		var icon = new Icon({
			name: obj.name,
			business: obj.business || generateType(obj.name),
			path: obj.path,
			className: 'i-' + obj.name
		});
		// name 不能重复
		Icon.find({
			name: obj.name
		}).exec(function(err, rets) {
			if(rets.length === 0) {
				icon.save();
			} else {
				// name 重复
			}
		});
	};

	if(toString.apply(icons) === '[object Array]') {
		// 一次插入多条记录
		icons.forEach(function(icon) {
			insertOne(icon);
		});
	} else if(toString.apply(icons) === '[object Object]') {
		// 一次插入单条记录
		insertOne(icons);
	} else {
		;
	}
}

module.exports = {
	findAll: findAll,
	insert: insert
};

