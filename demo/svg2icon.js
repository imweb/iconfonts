var fs = require('fs'),
	path = require('path'),
	conf = require('../conf.js'),
	fontCarrier = require('font-carrier');

var font = fontCarrier.create(),
	svgPath = path.join('../', conf.demo_svg_path);

// 读取所有 svg, 并且自定义 content

var files = fs.readdirSync(svgPath),
	svgCnt = 4095, // \ffff
	iconNames = [],
	iconContents = [],
	iconContent,
	svgsObj = {};

/*
* icon content的内容累加
* http://astronautweb.co/snippet/font-awesome/
*/

files.forEach(function(file, index){
	if(path.extname(file) == '.svg'){
		iconContent = generateIconContent(svgCnt--);
		iconNames.push(path.basename(file, '.svg'));
		iconContents.push(iconContent);
		svgsObj[iconContent] = fs.readFileSync(path.join(svgPath, file)).toString();
	}
});
font.setSvg(svgsObj);



// 导出字体
var fontContent = font.output({
	path: './fonts/platfont'
});

console.log(fontContent);

// 十进制 转 16进制
function decimal2Hex(n){
	var hex = n.toString(16);
	hex = '000'.substr(0, 3 - hex.length) + hex;
	return hex;
}

// 生成 icon 对应的 content
function generateIconContent(n){
	return '&#xf' + decimal2Hex(n);
}

// 生成 icon 样式
function generateCss(){
	var content = [];
	content.push('@font-face { ');
	content.push('font-family: "platfont";src: url("./fonts/platfont.eot");');
	content.push('src: url("./fonts/platfont.eot?#iefix") format("embedded-opentype"),');
	content.push('url("./fonts/platfont.woff") format("woff"),');
	content.push('url("./fonts/platfont.ttf") format("truetype"),');
	content.push('url("./fonts/platfont.svg#platfont") format("svg");}');
	content.push('.icon-font{font-family:"platfont";font-size:40px;font-style:normal;}');
	iconNames.forEach(function(iconName, index){
		iconContents[index] = iconContents[index].replace('&#xf', '\\f');
		content.push('%i-' + iconName + '{\r\n\t&:after{\r\n\t\tcontent:"' + iconContents[index] + '";\r\n\t}\r\n}');
		content.push('.i-' + iconName + ':after{content: "' + iconContents[index] + '";}');
	});
	fs.writeFileSync('platfont.css', content.join('\r\n'));
}

// 生成 demo 页面
function generateDemo(){
	var content = [];
	content.push('<!DOCTYPE html>\r\n<html lang="en">\r\n<head>\r\n<meta charset="UTF-8">\r\n<title>iconfont demo</title>');
	content.push('<link href="platfont.css" rel="stylesheet" type="text/css" /> ');
	content.push('</head>\r\n<body>')

	iconNames.forEach(function(iconName, index){
		content.push('<i class="icon-font i-' + iconName + '"></i>');
	});
	content.push('</body>\r\n</html>')

	fs.writeFileSync('demo.html', content.join('\r\n'));
}

// 文件转化成base64
function file2Base64(){
	//fp = 'download/iconfont.ttf';
	var base64 = new Buffer(fontContent.ttf).toString('base64');
	return base64;
}



function generateBase64Css(){
	var fontFileDir = path.join('fonts', 'platfont.ttf'),
		fontBase64 = file2Base64(fontFileDir);

	var content = [];
	content.push('@font-face { ');
	content.push('font-family: "iconfont";');
	content.push('src: url("data:application/octet-stream;base64,' + fontBase64 + '") format("truetype");}');
	content.push('.icon-font{font-family:"iconfont";font-size:16px;font-style:normal;}');
	iconNames.forEach(function(iconName, index){
		iconContents[index] = iconContents[index].replace('&#xf', '\\f');
		content.push('.i-' + iconName + ':after{content: "' + iconContents[index] + '";}');
	});
	fs.writeFileSync('platfont--embedded.css', content.join('\r\n'));
}


generateCss();
generateDemo();
generateBase64Css();