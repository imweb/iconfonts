/*
 * 读取并解析docs/ke.qq.com-svg/中的svg
 * 导出font到public/css/font/中
 * 导出icon到public/css/iconfont.css中
 * 插入初始icon数据到数据库中
 */

var path = require('path'),
    fs = require('fs'),
    Icon = require('../model/icon.js'),
    conf = require('../conf.js');


var svgPath = path.join('../' + conf.svgPath);

function getAllIconFromSvg(){
    var allIcons = [];  
        svgFiles = fs.readdirSync(svgPath);
    svgFiles.forEach(function(file, index){
        if(path.extname(file) == '.svg') {
            allIcons.push(file);
        }
    });
    return allIcons;
}


function importAllSvg() {
    var allIcons = getAllIconFromSvg(),
        rets = [];
    allIcons.forEach(function(icon){
        rets.push({
            name: icon.replace('.svg', ''),
            path: '/' + icon
        });
    });
    Icon.insertByOrder(rets);
}

importAllSvg();

module.exports = {};
