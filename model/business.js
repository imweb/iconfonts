/*
* @author junmo
 */
var mongoose = require('mongoose'),
	autoIncrement = require('mongoose-auto-increment'),
	db = require('../utils/db.js');

var BusinessSchema = mongoose.Schema({
    name: String,
    pm: String,
    id: String
});


BusinessSchema.plugin(autoIncrement.plugin, {
    model: 'Business',
    field: 'bid', 
    startAt: 1,
    incrementBy: 1
});

var Business = mongoose.model('newbusinesses', BusinessSchema)
module.exports = Business;