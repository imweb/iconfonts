var conf = require('../conf.js'),
	path = require('path'),
	fontCarrier = require('font-carrier');
	fs = require('fs');

var font = fontCarrier.create(),
	outputCss = './public/css/iconfont.css',
	svgPath = path.join('./' + conf.svg_path);

function decimal2Hex(n){
	var hex = n.toString(16);
	hex = '000'.substr(0, 3 - hex.length) + hex;
	return hex;
}

// 生成 icon 对应的 content
function generateIconContent(n){
	return '&#xf' + decimal2Hex(n);
}

function generateCss(icons, cssPath, isExtended){
	var content = [],
		extendContents = [],
		iconContents = [];
	content.push('@font-face { ');
	content.push('font-family: "iconfont";src: url("iconfont.eot");');
	content.push('src: url("./fonts/iconfont.eot?#iefix") format("embedded-opentype"),');
	content.push('url("./fonts/iconfont.woff") format("woff"),');
	content.push('url("./fonts/iconfont.ttf") format("truetype"),');
	content.push('url("./fonts/iconfont.svg#iconfont") format("svg");}');
	extendContents = content.concat([]);
	content.push('.icon-font{font-family:"iconfont";font-size:16px;font-style:normal;}');
	extendContents.push('%icon-font{font-family:"iconfont";font-size:16px;font-style:normal;}');
	icons.forEach(function(icon, index){
		extendContents.push('%' + icon.name + '{\r\n\t&:after{\r\n\t\tcontent:"' + icon.content + '";\r\n\t}\r\n}');
		content.push('.' + icon.name + ':after{content: "' + icon.content + '";}');
	});
	if(isExtended && path.extname(cssPath) === '.scss'){
		fs.writeFileSync(path.join(path.dirname(cssPath), path.basename(cssPath).replace('.scss', '-extend.scss')), extendContents.join('\r\n'));
	}
	fs.writeFileSync(cssPath? cssPath : outputCss, content.join('\r\n'));
}

// 生成 demo 页面
function generateHtml(iconNames, htmlPath){
	var content = [];
	content.push('<!DOCTYPE html>\r\n<html lang="en">\r\n<head>\r\n<meta charset="UTF-8">\r\n<title>iconfont demo</title>');
	content.push('<link href="iconfont-embedded.css" rel="stylesheet" type="text/css" /> ');
	content.push('</head>\r\n<body>')

	iconNames.forEach(function(iconName, index){
		content.push('<i class="icon-font i-' + iconName + '"></i>');
	});
	content.push('</body>\r\n</html>')

	fs.writeFileSync(htmlPath, content.join('\r\n'));
}


// svg 生成字体文件
function genarateFonts(icons, csspath){
	var svgsObj = {},
		iconContents = [],
		iconContent;
	icons.forEach(function(icon, index){
		iconContent = generateIconContent(icon.iconId - 1);
		svgsObj[iconContent] = fs.readFileSync(path.join(svgPath, path.dirname(icon.path || ''), icon.name.replace('i-', '') + '.svg')).toString();
	});
	font.setSvg(svgsObj);
	// 导出字体
	font.output({
		path: path.join(path.dirname(outputCss ? outputCss : csspath), 'fonts/iconfont')
	});
}

// 文件转化成base64
function file2Base64(fp){
	//fp = 'download/iconfont.ttf';
	var base64 = new Buffer(fs.readFileSync(fp)).toString('base64');
	return base64;
}

function generateBase64Css(icons, cssPath, fontFileName){
	var cssDir = path.dirname(cssPath),
		fontFileDir = path.join(cssDir, 'fonts', fontFileName || 'iconfont' + '.ttf'),
		fontBase64 = file2Base64(fontFileDir);

	

	var content = [];
	content.push('@font-face { ');
	content.push('font-family: "iconfont";');
	content.push('src: url("data:application/octet-stream;base64,' + fontBase64 + '") format("truetype");}');
	content.push('.icon-font{font-family:"iconfont";font-size:16px;font-style:normal;}');
	icons.forEach(function(icon, index){
		content.push('.' + icon.name + ':after{content: "' + icon.content + '";}');
	});
	fs.writeFileSync(cssPath? cssPath : outputCss, content.join('\r\n'));
}

module.exports = {
	generateCss: generateCss,
	generateHtml: generateHtml,
	generateIconContent: generateIconContent,
	genarateFonts: genarateFonts,
	file2Base64: file2Base64,
	generateBase64Css: generateBase64Css
}

