var conf = require('../conf.js'),
	path = require('path'),
	fontCarrier = require('font-carrier');
	fs = require('fs');
// 从 svg 中获取所有 icons

var font = fontCarrier.create(),
	outputCss = '../public/css/iconfont.css',
	svgPath = path.join('../' + conf.svg_path);

function getAllIconFromSvg(){
	var allIcons = [];	
		svgFiles = fs.readdirSync(svgPath);
	svgFiles.forEach(function(file, index){
		if(path.extname(file) == '.svg'){
			allIcons.push(file);
		}
	});
	return allIcons;
}

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
function generateCss(iconNames){
	var content = [],
		iconContents = [];
	content.push('@font-face { ');
	content.push('font-family: "iconfont";src: url("./fonts/iconfont.eot");');
	content.push('src: url("./fonts/iconfont.eot?#iefix") format("embedded-opentype"),');
	content.push('url("./fonts/iconfont.woff") format("woff"),');
	content.push('url("./fonts/iconfont.ttf") format("truetype"),');
	content.push('url("./fonts/iconfont.svg#iconfont") format("svg");}');
	content.push('.icon-font{font-family:"iconfont";font-size:16px;font-style:normal;}');
	iconNames.forEach(function(iconName, index){
		iconContents[index] = generateIconContent(index).replace('&#xf', '\\f');
		// iconContents[index] = iconContents[index].replace('&#xf', '\\f');
		// content.push('%i-' + iconName + '{\r\n\t&:after{\r\n\t\tcontent:"' + iconContents[index] + '";\r\n\t}\r\n}');
		content.push('.i-' + iconName.replace('.svg', '') + ':after{content: "' + iconContents[index] + '";}');
	});
	fs.writeFileSync(outputCss, content.join('\r\n'));
	return iconContents;
}

// svg 生成字体文件
function genarateFonts(iconNames){
	var svgsObj = {},
		iconContents = [],
		iconContent;
	iconNames.forEach(function(iconName, index){
		iconContent = generateIconContent(index);
		svgsObj[iconContent] = fs.readFileSync(path.join(svgPath, iconName)).toString();
	});
	font.setSvg(svgsObj);
	// 导出字体
	font.output({
		path: path.join(path.dirname(outputCss), 'fonts/iconfont')
	});
}


function init(){
	var allIcons = getAllIconFromSvg(),
		iconContents = generateCss(allIcons),
		ret = [];
	genarateFonts(allIcons);
	allIcons.forEach(function(icon, index){
		ret.push({
			iconId: index + 1,
			name: 'i-' + icon.replace('.svg', ''),
			//svg: path.join(svgPath, icon),
			content: iconContents[index]
		})
	});
	return ret;
}

module.exports = {
	init: init
}

