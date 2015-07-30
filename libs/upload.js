var conf = require('../conf.js'),
	path = require('path'),
	Q = require('q'),
	fs = require('fs'),
	unzip = require('unzip'),
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
		console.log(id, name);
		// id这里有问题
		realDB.push({
			name: name,
			iconId: id,
			content: tools.generateIconContent(id - 1).replace('&#xf', '\\f')
		});
		
	});
	db.save();
}

// 处理上传的文件
function upload(formInfo, cb) {
	var filePath = formInfo.path,
		fileName = formInfo.name;

	var ext = path.extname(filePath);
	// 单个svg 文件上传
	if(ext == '.svg'){
		fs.readFile(filePath, function(err, data){
			if(err) {
				console.log(err);
				return;
			}
			fs.writeFile('./docs/ke.qq.com-svg/' + fileName, data, function(er){
				// 将上传的字体文件写入数据库
				// iconfont 的 content 是根据图标自动生成的，如何确保不重复
				if(er){
					console.log(er);
					return;
				}
				upload.insert([fileName], formInfo.platform);
				typeof cb == 'function' && cb();
			});
		});	
	}else if(['.zip'].indexOf(ext) > -1){
		// 多文件上传
		// 解压
		fs.createReadStream(formInfo.path)
			.pipe(unzip.Extract({
				path: './docs/ke.qq.com-svg'
			}))

		var arr = [];
		// 单文件处理
		fs.createReadStream(formInfo.path)
			.pipe(unzip.Parse())
			.on('entry', function (entry) {
				var _fileName = entry.path;
				var type = entry.type; // 'Directory' or 'File'
				if(type == 'File' && path.extname(_fileName) == '.svg'){
					arr.push(_fileName)
					//console.log(_fileName)
					//insert([path.basename(_fileName)], formInfo.platform);
				}

			}).on('close', function(){
				insert(arr, formInfo.platform);
			}).on('finish', function(){
			});
		// 过滤 svg 文件
		typeof cb == 'function' && cb();
	}
}

module.exports = {
	insert: insert,
	upload: upload
}
