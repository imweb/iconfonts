/*
* @author helondeng
 */
var mongoose = require('mongoose'),
    // autoIncrement = require('mongoose-auto-increment');
    db = require('../utils/db.js');

var UserSchema = mongoose.Schema({
    user: String,
    auth: Number
});



var User = mongoose.model('User', UserSchema);

module.exports = User;
