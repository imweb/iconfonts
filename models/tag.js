/*
* @author helondeng
 */
var mongoose = require('mongoose'),
    autoIncrement = require('mongoose-auto-increment');
    db = require('../utils/db.js');

var TagSchema = mongoose.Schema({
    iconName: String, // icon name
    tag: String, // tag text
    iconId: String // icon id
});

TagSchema.plugin(autoIncrement.plugin, {
    model: 'Tag',
    field: 'tagId', 
    startAt: 0,
    incrementBy: 1
});


var Tag = mongoose.model('Tag', TagSchema);




module.exports = Tag;
