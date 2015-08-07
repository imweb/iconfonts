var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

mongoose.connect('mongodb://localhost:27017/');

var db = mongoose.connection;
autoIncrement.initialize(db);

db.on('error', console.error.bind(console, 'connection error'));

db.once('open', function(callback) {
    console.log('db connection success');
});

module.exports = db;
