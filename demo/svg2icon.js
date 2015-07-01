var fs = require('fs'),
	path = require('path'),
	conf = require('../conf.js'),
	fontCarrier = require('font-carrier');

var font = fontCarrier.create(),
	svgPath = path.join('../', conf.svg_path);

// 读取所有 svg, 并且自定义 content

var files = fs.readdirSync(svgPath),
	svgCnt = 0,
	iconNames = [],
	iconContents = [],
	iconContent,
	svgsObj = {};

/*
* icon content的内容累加
* http://astronautweb.co/snippet/font-awesome/
*/

console.log(svgPath)

files.forEach(function(file, index){
	if(path.extname(file) == '.svg'){
		iconContent = generateIconContent(svgCnt++);
		console.log(iconContent)
		iconNames.push(path.basename(file, '.svg'));
		iconContents.push(iconContent);
		svgsObj[iconContent] = fs.readFileSync(path.join(svgPath, file)).toString();
	}
});
font.setSvg(svgsObj);



// 导出字体
font.output({
	path: './fonts/iconfont'
});

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
	content.push('font-family: "iconfont";src: url("./fonts/iconfont.eot");');
	content.push('src: url("./fonts/iconfont.eot?#iefix") format("embedded-opentype"),');
	content.push('url("./fonts/iconfont.woff") format("woff"),');
	content.push('url("./fonts/iconfont.ttf") format("truetype"),');
	content.push('url("./fonts/iconfont.svg#iconfont") format("svg");}');
	content.push('.iconfont{font-family:"iconfont";font-size:16px;font-style:normal;}');
	iconNames.forEach(function(iconName, index){
		iconContents[index] = iconContents[index].replace('&#xf', '\\f');
		content.push('%i-' + iconName + '{\r\n\t&:after{\r\n\t\tcontent:"' + iconContents[index] + '";\r\n\t}\r\n}');
		content.push('.i-' + iconName + ':after{content: "' + iconContents[index] + '";}');
	});
	fs.writeFileSync('iconfont.css', content.join('\r\n'));
}

// 生成 demo 页面
function generateDemo(){
	var content = [];
	content.push('<!DOCTYPE html>\r\n<html lang="en">\r\n<head>\r\n<meta charset="UTF-8">\r\n<title>iconfont demo</title>');
	content.push('<link href="iconfont.css" rel="stylesheet" type="text/css" /> ');
	content.push('</head>\r\n<body>')

	iconNames.forEach(function(iconName, index){
		content.push('<i class="iconfont i-' + iconName + '"></i>');
	});
	content.push('</body>\r\n</html>')

	fs.writeFileSync('demo.html', content.join('\r\n'));
}

generateCss();
generateDemo();