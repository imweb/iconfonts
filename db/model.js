var Datastore = require('nedb'), 
	db = new Datastore({filename: '../data/icon.db'});

module.exports = {
	db: db
}