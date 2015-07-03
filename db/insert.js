
/*
* 将 style.css 中的 icon 插入到数据库
*/
var Datastore = require('nedb'), 
	conf = require('../conf.js'),
	path = require('path'),
	db = new Datastore({filename: path.join('../', conf.db_path), autoload: true});
	parse = require('./parse.js');

var iconList = parse.getAllIcons(),
	insertObj = [];

db.count({}, function(err, count){
	iconList.forEach(function(item, index){
		insertObj.push({
			name: item,
			iconId: count++,
			content: '',
			svgPath: ''
		});
	});

})

db.insert(insertObj, function (err) {
	if(err) console.log(err);
});




