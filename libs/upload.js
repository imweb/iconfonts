var conf = require('../conf.js'),
	path = require('path'),
	tools = require('./tools.js'),
	parse = require('../db/parsesvg.js'),
	low = require('lowdb');





function insert(iconList, platform){
	var db = low(conf.low_db);
	low.autoSave = true;

	var allDBs = conf.cats;
	var dbName = platform == -1 ? 'pc' : platform;

	var realDB;
	var id = 0;
	for(var key in allDBs){
		if(allDBs.hasOwnProperty(key)){
			id += db(key).size();
		}
		
	}
	
	var icons,
		name;
	iconList.forEach(function(item, index){
		name = 'i-' + item.replace('.svg', '');
		if(/^[mhHM]-(.*)/.test(item) && platform == -1){
			dbName = 'h5';
		}
		realDB = db(dbName);
		icons = realDB.chain().where({name: name}).value();
		if(icons && icons.length > 0){
			console.log('find', icons)
			return;
		}
		id++;
		realDB.push({
			name: name,
			iconId: id,
			content: tools.generateIconContent(id - 1).replace('&#xf', '\\f')
		});
		
	});
	db.save();


/*	tools.genarateFonts(icons);
	tools.generateCss(icons)*/

}

module.exports = {
	insert: insert
}
