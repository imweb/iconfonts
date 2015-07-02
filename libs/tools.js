var fs = require('fs');

function decimal2Hex(n){
	var hex = n.toString(16);
	hex = '000'.substr(0, 3 - hex.length) + hex;
	return hex;
}

// 生成 icon 对应的 content
function generateIconContent(n){
	return '&#xf' + decimal2Hex(n);
}

function generateCss(icons, cssPath){
	var content = [],
		iconContents = [];
	content.push('@font-face { ');
	content.push('font-family: "iconfont";src: url("./fonts/iconfont.eot");');
	content.push('src: url("./fonts/iconfont.eot?#iefix") format("embedded-opentype"),');
	content.push('url("./fonts/iconfont.woff") format("woff"),');
	content.push('url("./fonts/iconfont.ttf") format("truetype"),');
	content.push('url("./fonts/iconfont.svg#iconfont") format("svg");}');
	content.push('.icon-font{font-family:"iconfont";font-size:16px;font-style:normal;}');
	icons.forEach(function(icon, index){
/*		iconContents[index] = icon.replace('&#xf', '\\f');*/
		content.push('%' + icon.name + '{\r\n\t&:after{\r\n\t\tcontent:"' + icon.content + '";\r\n\t}\r\n}');
		content.push('.' + icon.name + ':after{content: "' + icon.content + '";}');
	});
	fs.writeFileSync(cssPath, content.join('\r\n'));
}

// 生成 demo 页面
function generateHtml(iconNames, htmlPath){
	var content = [];
	content.push('<!DOCTYPE html>\r\n<html lang="en">\r\n<head>\r\n<meta charset="UTF-8">\r\n<title>iconfont demo</title>');
	content.push('<link href="iconfont.css" rel="stylesheet" type="text/css" /> ');
	content.push('</head>\r\n<body>')

	iconNames.forEach(function(iconName, index){
		content.push('<i class="icon-font i-' + iconName + '"></i>');
	});
	content.push('</body>\r\n</html>')

	fs.writeFileSync(htmlPath, content.join('\r\n'));
}

module.exports = {
	generateCss: generateCss,
	generateHtml: generateHtml
}

