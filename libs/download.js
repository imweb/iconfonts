/*
* 用户选择图标后，生成对应的字体文件和样式,
*/
var Datastore = require('nedb'), 
	path = require('path'),
	Q = require('q'),
	fs = require('fs'),
	fontCarrier = require('font-carrier'),
	conf = require('../conf.js'),
	tools = require('./tools.js'),
	fs = require('fs'),
	archiver = require('archiver'),
	db = new Datastore({filename: conf.db_path, autoload: true});

var font = fontCarrier.create(),
	svgPath = conf.svg_path;

function getIconsByIds(ids, cb){
	var _ids = [];
	ids.forEach(function(id, index){
		_ids.push(id - 0);
	});
	db.find({"iconId": { $in: _ids }}, function(err, icons){
		typeof cb === 'function' && cb(err ? [] : icons)
	});
}

function generateZip(icons, downloadCb){
	var folderName = 'download/iconfont-' + Date.now();
	var folder = fs.mkdirSync(folderName);
	var svgsObj = {},
		iconNames = [];
	
	icons.forEach(function(icon, index){
		svgsObj[icon.content.replace('\\f', '&#xf')] = fs.readFileSync(path.join(svgPath, icon.name.replace('i-', '') + '.svg')).toString();
		iconNames.push(icon.name.replace('i-', ''));
	});
	font.setSvg(svgsObj);
	var zipPath = folderName + '.zip';
	// 导出字体
	// 多一层目录，.woff 文件在本地解压失败，原因未知
	// fs.mkdirSync(path.join(folderName, 'fonts'));
	// 异步
	Q.fcall(function(){
		font.output({
			path: path.join(folderName, '/iconfont')
		});
		tools.generateCss(icons, path.join(folderName, 'iconfont.css'));
		tools.generateHtml(iconNames, path.join(folderName, 'demo.html'));
	}).then(function(){
		Q.fcall(function(){
			var output = fs.createWriteStream(zipPath);
			var archive = archiver('zip');

			archive.on('error', function(err){
			    throw err;
			});

			archive.pipe(output);
			archive.bulk([
			    { src: [folderName + '/**']}
			]);
			archive.finalize();
		}).then(function(){
			// 下载的文件有问题，跟异步有关系
			typeof downloadCb === 'function' && downloadCb(zipPath);
		})

		
	}).then(function(){
		
	});
}

module.exports = {
	download: function(ids, cb){
		getIconsByIds(ids, function(icons){
			generateZip(icons, cb);
		});
	}
}