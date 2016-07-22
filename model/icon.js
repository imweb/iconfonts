/*
 * @author junmo
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
    author: String,
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
IconSchema.statics.insertByOrder = function (icons, finishCb) {
    var self = this;
    var toString = Object.prototype.toString;
    var current = 0;
    var eventName = 'insert_success',
        errMaps = {};
    if(toString.apply(icons) === '[object Array]') {
        emitter.on(eventName, function(err) {
            errMaps[icons[current].name] = err;
            if (++current < icons.length) {
                self.insertOne(icons[current]);
            } else {
                emitter.off(eventName, arguments.callee);
                // finish upload all svgs
                typeof finishCb === 'function' && finishCb(errMaps);
            }
        });
        if (icons.length) self.insertOne(icons[current]);
    } else if(toString.apply(icons) === '[object Object]') {
        self.insertOne(icons);
        emitter.on(eventName, function(err, obj) {
            var _err = {};
            _err[obj.name] = err;
            typeof finishCb === 'function' && finishCb(_err);
            emitter.off(eventName, arguments.callee);
        });
    } else {
        ;
    }
};

IconSchema.statics.insertOne = function (obj) {
    this.find({
        name: obj.name
    }).exec(function (err, icons) {
        if (!icons.length) {
            var icon = new Icon({
                name: obj.name,
                business: obj.business,
                path: obj.path,
                author: obj.author,
                className: 'i-' + obj.name
            });
            icon.save(function (err, icon) {
                emitter.emit('insert_success', err, obj);
            });
        } else {
            emitter.emit('insert_success', '系统存在同名icon', obj);
        }
    });
};

var Icon = mongoose.model('newicons', IconSchema);

module.exports = Icon;