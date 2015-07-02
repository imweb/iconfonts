/*
* 用户选择图标后，生成对应的字体文件和样式,
*/
var Datastore = require('nedb'), 
	path = require('path'),
	Q = require('q'),
	fs = require('fs'),
	easyzip = require('easy-zip'),
	fontCarrier = require('font-carrier'),
	conf = require('../conf.js'),
	tools = require('./tools.js'),
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
	fs.mkdirSync(path.join(folderName, 'fonts'));
	// 异步
	Q.fcall(function(){
		font.output({
			path: path.join(folderName, 'fonts/iconfont')
		});
		tools.generateCss(icons, path.join(folderName, 'iconfont.css'));
		tools.generateHtml(iconNames, path.join(folderName, 'demo.html'));
	}).then(function(){
		var zip = new easyzip.EasyZip(); 
		zip.zipFolder('./' + folderName ,function(){
		    zip.writeToFileSycn('./' + zipPath);
		    typeof downloadCb === 'function' && downloadCb('./' + zipPath);
		});
		
	});
	//return zipPath;
}

module.exports = {
	download: function(ids, cb){
		getIconsByIds(ids, function(icons){
			generateZip(icons, cb);
			//tools.generateCss(iconNames, path.join(folderName, 'iconfont.css'));
			//tools.generateHtml(iconNames, path.join(folderName, 'demo.html'));
		});
	}
}