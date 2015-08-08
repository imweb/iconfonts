var config = require('../conf.js'),
    mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

var dbInfo = config.dbInfo;
mongoose.connect('mongodb://' + dbInfo.IP + ':' + dbInfo.port + '/' + dbInfo.dbName);

var db = mongoose.connection;

autoIncrement.initialize(db);

db.on('error', console.error.bind(console, 'connection error'));

db.once('open', function(callback) {
    console.log('db connection success');
});

module.exports = db;
