/*
* 解析 css, 获取icon信息
*/
var conf = require('../conf.js'),
	path = require('path'),
	fs = require('fs');

var projFontsPath = '../public/css/fonts';

var cssPath = conf.css_path;
cssPath = path.join('../', cssPath);

function getAllIcons(){
	var content = fs.readFileSync(cssPath),
		matches = content.toString().match(conf.icon_reg);
		copyCssAndFonts();
	return matches || [];
}


// 将对应的 css 和 font copy到项目目录下面
function copyCssAndFonts(){
	var content = fs.readFileSync(cssPath);
	fs.writeFileSync('../public/css/iconfont.css', content,  'utf-8');

	var fontsPath = path.join(path.dirname(cssPath), 'fonts');
	if(!fs.existsSync(projFontsPath)) fs.mkdirSync(projFontsPath);
	var realPath;
	fs.readdir(fontsPath, function(err, files){
		console.log(files)
		files.forEach(function(file, index){
			realPath = path.join(fontsPath, file);
			console.log(path.join(projFontsPath, file), realPath, fs.existsSync(realPath));
			if(fs.existsSync(realPath)){
				fs.writeFileSync(path.join(projFontsPath, file), fs.readFileSync(realPath), 'utf-8');
			}
		});
	});
}

module.exports = {
	getAllIcons: getAllIcons
}