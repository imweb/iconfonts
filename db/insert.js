
/*
* 将 style.css 中的 icon 插入到数据库
*/
var Datastore = require('nedb'), 
	conf = require('../conf.js'),
	db = new Datastore({filename: path.join('../', conf.db_path), autoload: true});
	parse = require('./parse.js');

var db = model.db,
	iconList = parse.getAllIcons(),
	insertObj = [];

iconList.forEach(function(item, index){
	insertObj.push({name: item});
});

db.insert(insertObj, function (err) {
	if(err) console.log(err);
});




