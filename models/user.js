/*
* @author helondeng
 */
var mongoose = require('mongoose'),
    // autoIncrement = require('mongoose-auto-increment');
    db = require('../utils/db.js');

var UserSchema = mongoose.Schema({
	// imweb.io cookie user's name
    user: String,
    id: String,
    // 有无更新权限
    auth: {
    	type: Number,
    	default: 0
    }
});



var User = mongoose.model('User', UserSchema);

module.exports = User;
