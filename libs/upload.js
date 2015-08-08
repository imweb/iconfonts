/*
* @author helondeng
 */
var path = require('path'),
	fs = require('fs'),
	unzip = require('unzip'),
	db = require('../db/index.js');

// TODO：存储icon的路径，上传的压缩包中可能包含文件夹
/*function insert(iconList, platform){
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
		//带有路径信息
		var fileName;
		fileName = path.basename(typeof item == 'object' ? item.name : item, '.svg');
		name = 'i-' + fileName;
		if(/^[mhHM]-(.*)/.test(fileName) && platform == -1){
			dbName = 'h5';
		}
		realDB = db(dbName);
		icons = realDB.chain().where({name: name}).value();
		if(icons && icons.length > 0){
			return;
		}
		id++;
		var pushParam = {
			name: name,
			iconId: id,
			content: tools.generateIconContent(id - 1).replace('&#xf', '\\f')
		};
		typeof item == 'object' && (pushParam.path = item.path);
		realDB.push(pushParam);
		
	});
	db.save();
}*/

// 处理上传的文件
function upload(formInfo, cb) {
	var filePath = formInfo.path,
		ext = path.extname(filePath);
	// 单个svg 文件上传
	if(ext == '.svg'){
		uploadSvg(formInfo, cb);
	}else if(['.zip'].indexOf(ext) > -1){
		// just support zip
		uploadZip(formInfo, cb);
	}
}

/*
* 上传 svg 文件
 */
function uploadSvg(formInfo,cb) {
	var filePath = formInfo.path,
		file = formInfo.name;
	fs.readFile(filePath, function(err, data){
		if(err) {
			console.log(err);
			return;
		}
		fs.writeFile('./docs/ke.qq.com-svg/' + file, data, function(er){
			if(er){
				console.log(er);
				return;
			}
			db.insert({
				name: path.basename(file, '.svg'),
				path: '/' + file
			});
			// 删除临时文件
			fs.unlinkSync(filePath);
			typeof cb == 'function' && cb();
		});
	});	
}

/*
* 上传 zip 压缩包
 */
function uploadZip(formInfo, cb) {
	var filePath = formInfo.path,
		files = [],
		fileInfo = {};
		// 解压, 上传的zip包中包含文件夹结构，会带上原来的文件夹结构
		fs.createReadStream(filePath)
		.pipe(unzip.Extract({
			path: './docs/ke.qq.com-svg'
		}));

		// 单个文件处理
		fs.createReadStream(filePath)
		.pipe(unzip.Parse())
		.on('entry', function (entry) {
			fileInfo = {
				name: path.basename(entry.path),
				type: entry.type,
				path: entry.path
			};
			if(fileInfo.type == 'File' && path.extname(fileInfo.name) == '.svg'){
				files.push({
					name: path.basename(fileInfo.name, '.svg'),
					path: fileInfo.path
				});
			}
		}).on('close', function(){
			db.insert(files);
			// delete tmpl file
			fs.unlinkSync(filePath);
			typeof cb == 'function' && cb();
		}).on('finish', function(){
			// not fire
		});
		
}

module.exports = {
	upload: upload
};
