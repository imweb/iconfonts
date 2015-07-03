
/*
* 将 style.css 中的 icon 插入到数据库
*/
var Datastore = require('nedb'), 
	conf = require('../conf.js'),
	path = require('path'),
	db = new Datastore({filename: path.join('../', conf.db_path), autoload: true});
	parse = require('./parsesvg.js');

var rets = parse.init();

db.insert(rets, function (err) {
	if(err) console.log(err);
});




