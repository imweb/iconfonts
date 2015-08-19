/*
* @author helondeng
 */
var mongoose = require('mongoose'),
    db = require('../db/db.js');

var TagSchema = mongoose.Schema({
    iconName: String, // icon name
    tag: String, // tag text
    iconId: String, // icon id
    author: String // author
});


var Tag = mongoose.model('Tag', TagSchema);

module.exports = Tag;
