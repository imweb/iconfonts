var conf = require('../conf.js'),
	path = require('path'),
	tools = require('./tools.js'),
	parse = require('../db/parsesvg.js'),
	low = require('lowdb')/*,
	db = new Datastore({filename: conf.db_path})*/;




// var	insertObj = [];


function insert(iconList){
/*	db.count({}, function(err, count){
		if(err){
			console.log(err);
			return;
		}
		var id = count;
		console.log(id);
		iconList.forEach(function(item, index){
			insertObj.push({
				name: 'i-' + item.replace('.svg', ''),
				iconId: id + 1,
				content: tools.generateIconContent(id + 1)
			});
			id++;
		});
		db.insert(insertObj, function (err) {
			if(err) console.log(err);
		});
		parse.init();
	});*/
	var db = low(conf.low_db);
	low.autoSave = true;

	var pc = db('pc');
	var id = pc.size();
	var icons,
		name;
	iconList.forEach(function(item, index){
		name = 'i-' + item.replace('.svg', '');
		icons = pc.chain().where({name: name}).value();
		if(icons && icons.length > 0){
			console.log('find', icons)
			return;
		}
		id++;
		db('pc').push({
			name: name,
			iconId: id,
			content: tools.generateIconContent(id).replace('&#xf', '\\f')
		});
		
	});
	db.save();


/*	tools.genarateFonts(icons);
	tools.generateCss(icons)*/

}

module.exports = {
	insert: insert
}
