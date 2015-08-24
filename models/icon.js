/*
* @author moxhe
* TODO:
* 1. 加入 mongoose-auto-increment，让iconId自增长，现在是通过程序来控制的
* 2. 
 */
var mongoose = require('mongoose'),
    db = require('../db/db.js'),
    autoIncrement = require('mongoose-auto-increment');

var IconSchema = mongoose.Schema({
    name: String, // 文件名，不包含后缀
    className: String,
    //content: String, // content 根据 iconId生成，不需要存储
    business: String, // 业务相关，方便后续分类
    path: String // 文件路径
});

// iconId 自增，确保唯一性
IconSchema.plugin(autoIncrement.plugin, {
    model: 'Icon',
    field: 'iconId', 
    startAt: 0,
    incrementBy: 1
});


var Icon = mongoose.model('Icon', IconSchema);

module.exports = Icon;
