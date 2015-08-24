/*
 * @author moxhe
 */
var EventEmitter = require('eventemitter2').EventEmitter2,
    emitter = new EventEmitter();
var mongoose = require('mongoose'),
    autoIncrement = require('mongoose-auto-increment');

var db = require('../utils/db.js');

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

function generateType(name) {
    return /^[mhHM]-(.*)/.test(name) ? 'h5' : 'pc';
}        

// insert icon by name and path
IconSchema.statics.insertByOrder = function (icons) {
    var toString = Object.prototype.toString;
    var current = 0;
    if(toString.apply(icons) === '[object Array]') {
        var eventName = 'insert_success';
        emitter.on(eventName, function() {
            if (++current < icons.length) {
                insertOne(icons[current]);
            } else {
                emitter.off(eventName, arguments.callee);
            }
        });
        if (icons.length) this.insertOne(icons[current]);
    } else if(toString.apply(icons) === '[object Object]') {
        this.insertOne(icons);
    } else {
        ;
    }
}

IconSchema.statics.insertOne = function (obj) {
    this.find({
        name: obj.name
    }).exec(function (err, icons) {
        if (!icons.length) {
            var icon = new Icon({
                name: obj.name,
                business: obj.business || generateType(obj.name),
                path: obj.path,
                className: 'i-' + obj.name
            });
            icon.save(function (err, icon) {
                emitter.emit('insert_success');
            })
        }
    });
}

var Icon = mongoose.model('Icon', IconSchema);

module.exports = Icon;
