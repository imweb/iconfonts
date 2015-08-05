/*
 * 读取并解析docs/ke.qq.com-svg/中的svg
 * 导出font到public/css/font/中
 * 导出icon到public/css/iconfont.css中
 * 插入初始icon数据到数据库中
 */

var conf = require('../conf.js'),
    path = require('path'),
    db = require('./db.js'),
    parse = require('./parsesvg.js');

var IconModel = require('../models/icon_model.js');
var rets = parse.init();

rets.forEach(function(icon, index){
    var filename = icon.name.replace('i-', '');
    if(/^[mhHM]-(.*)/.test(filename)) {
        icon.kind = 'h5';
    } else {
        icon.kind = 'pc';
    }
    var aIcon = new IconModel(icon);
    aIcon.save();
});
