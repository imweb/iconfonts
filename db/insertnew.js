
/*
* 将 style.css 中的 icon 插入到数据库
*/
var conf = require('../conf.js'),
	path = require('path'),
	low = require('lowdb'),
	//db = new Datastore({filename: path.join('../', conf.db_path), autoload: true});
	parse = require('./parsesvg.js');

var db = low(path.join('../', conf.low_db));

var rets = parse.init();

rets.forEach(function(icon, index){
	var filename = icon.name.replace('i-', '');
	console.log(filename)
	if(/^[mhHM]-(.*)/.test(filename)){
		db('h5').push(icon);
	}else{
		db('pc').push(icon);
	}
});
/*db.insert(rets, function (err) {
	if(err) console.log(err);
});*/




