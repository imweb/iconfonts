/*
* 用户选择图标后，生成对应的字体文件和样式,
*/
var path = require('path'),
	Q = require('q'),
	fs = require('fs'),
	fontCarrier = require('font-carrier'),
	conf = require('../conf.js'),
	tools = require('./tools.js'),
	fs = require('fs'),
	archiver = require('archiver');

var Icon = require('../models/icon.js');

var font = fontCarrier.create(),
	svgPath = conf.svg_path;

function getIconsByIds(ids, cb){

	Icon.find({
		iconId : {
			'$in' : ids
		}
	}, function (err, icons) {
		if (err) {
			console.error(err);
			return cb(err, icons);
		}
		icons.forEach(function (icon) {
			icon.content = tools.generateHtmlIconContent(icon.iconId);
		});
		typeof cb === 'function' && cb(err, icons);
	});
}

function generateZip(icons, downloadCb){
	if(!fs.existsSync('download')) fs.mkdirSync('download');
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
	fs.mkdirSync(path.join(folderName, 'fonts'));
	// 异步
	Q.fcall(function(){
		var output = path.join(folderName, 'fonts/iconfont');
		var outFonts = font.output({});
		//  先生成字体 buffer，然后手动写文件
		for(var type in outFonts){
			fs.writeFileSync(output + '.' + type, outFonts[type]);
		}
		// 这里生成字体后，需要读取字体文件，生成base64，但是output方法没有提供回调
		tools.generateCss(icons, path.join(folderName, 'iconfont.scss'), true);
		tools.generateHtml(iconNames, path.join(folderName, 'demo.html'));
		// console.log(font.output().ttf);
		// 这里生成字体后，需要读取字体文件，生成base64，但是output方法没有提供回调, 已经向作者pull requrest
		// font-carrier/lib/helpler/engine.js 280行，写文件 改正writeFileSync 同步
		tools.generateBase64Css(icons, path.join(folderName, 'iconfont-embedded.css'));
	}).then(function(){

		var output = fs.createWriteStream(zipPath);
		var archive = archiver('zip');

		archive.on('error', function(err){
		    // throw err;
		    console.error(err);
		    downloadCb(err);
		});

		archive.pipe(output);
		archive.bulk([
		    { src: [folderName + '/**']}
		]);
		archive.finalize();

		// stream close event
		output.on('close', function(){
			typeof downloadCb === 'function' && downloadCb(undefined, zipPath);
		});
		
	});
}

module.exports = {
	download: function(ids, cb){
		getIconsByIds(ids, function(err, icons){
			if (err) return cb(err, icons);
			generateZip(icons, cb);
		});
	}
};