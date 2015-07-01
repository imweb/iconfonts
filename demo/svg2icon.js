var fs = require('fs'),
	fontCarrier = require('font-carrier');

var font = fontCarrier.create();

font.setSvg({
	'+': fs.readFileSync('./svg/add.svg').toString(),
	'v': fs.readFileSync('./svg/media.svg').toString()
});

// 导出字体
font.output({
	path: './fonts/iconfont'
});

function generateCss(){
	var content = [];
	content.push('@font-face { ');
	content.push('font-family: "iconfont";src: url("./fonts/iconfont.eot");');
	content.push('src: url("./fonts/iconfont.eot?#iefix") format("embedded-opentype"),');
	content.push('url("./fonts/iconfont.woff") format("woff"),');
	content.push('url("./fonts/iconfont.ttf") format("truetype"),');
	content.push('url("./fonts/iconfont.svg#iconfont") format("svg");}');
	content.push('.iconfont{font-family:"iconfont";font-size:16px;font-style:normal;}');
	content.push('.icon-add:after{content: "+";}');
	content.push('.icon-media:after{content: "v";}');
	fs.writeFileSync('iconfont.css', content.join('\r\n'));
}

function generateDemo(){
	var content = [];
	content.push('<!DOCTYPE html>\r\n<html lang="en">\r\n<head>\r\n<meta charset="UTF-8">\r\n<title>iconfont demo</title>');
	content.push('<link href="iconfont.css" rel="stylesheet" type="text/css" /> ');
	content.push('</head>\r\n<body>')

	content.push('<i class="iconfont icon-add"></i>');
	content.push('<i class="iconfont icon-media"></i>');
	content.push('</body>\r\n</html>')

	fs.writeFileSync('demo.html', content.join('\r\n'));
}

generateCss();
generateDemo();