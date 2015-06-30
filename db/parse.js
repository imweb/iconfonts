/*
* 解析 css, 获取icon信息
*/
var conf = require('../conf.js'),
	path = require('path'),
	fs = require('fs');

function getAllIcons(){
	var cssPath = conf.css_path;
	cssPath = path.join('../', cssPath);

	var content = fs.readFileSync(cssPath),
		matches = content.toString().match(conf.icon_reg);
	return matches || [];
}

module.exports = {
	getAllIcons: getAllIcons
}