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

var Icon = require('../models/icon.js');
db.collections['icons'].drop(function(err) {
    if (err) console.error('Icon drop failed.');
    else console.log('Icon drop success.');
    
    var rets = parse.init();
    console.log('parse init finished.')

    rets.forEach(function(icon, index){
        var filename = icon.name.replace('i-', '');
        if(/^[mhHM]-(.*)/.test(filename)) {
            icon.kind = 'h5';
        } else {
            icon.kind = 'pc';
        }
        var one = new Icon(icon);
        one.save(function(err, one) {
            if (err) console.error(err, 'icon insert failed: ' + one.path);
            else console.log('icon insert success: ' + one.path);
        });
    });
});

module.exports = {}
