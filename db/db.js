var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27027/');

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error'));

db.once('open', function(callback) {
    console.log('db connection success');
});

module.exports = db;
