/*
* @author moxhe
* TODO:
* 1. 加入 mongoose-auto-increment，让iconId自增长，现在是通过程序来控制的
* 2. 
 */
var mongoose = require('mongoose'),
    autoIncrement = require('mongoose-auto-increment');

var IconSchema = mongoose.Schema({
    //iconId: Number,
    name: String,
    //content: String,
    kind: String, // three kinds: h5, pc, other
    path: String
});

IconSchema.plugin(autoIncrement.plugin, {
    model: 'Icon',
    field: 'iconId',
    startAt: 0,
    incrementBy: 1
});

// create Schema methods
// IconSchema.methods.methodname = fn() {}
// 

var Icon = mongoose.model('Icon', IconSchema);

module.exports = Icon;
