/*
* Generate model
*/
var conf = require('../conf.js'),
	mongoose = require('mongoose');

mongoose.connect('mongodb://' + conf.mongodb_ip + '/' +  conf.mongodb_name);

var iconSchema = mongoose.Schema({
		name: String,
		svg: String,
		type: String // 0: platform, 1: mobile
	}),
	Icon = mongoose.model('Icon', iconSchema);

module.exports = {
	Icon: Icon
};