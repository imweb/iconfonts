var express = require('express'),
	path = require('path'),
	conf = require('./conf.js'),
	db = require('./db/index.js'),
	ejs = require('ejs');

var app = express();

app.engine('.html', ejs.renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, '/views'));

app.use(express.static(path.join(__dirname, '/public')));

app.get(['/', '/index'], function(req, res){
	db.findAll(function(arr){
		res.render('index', {'platform': arr})
	});
});

app.get('/rule', function(req, res){
	res.render('rule');
});

app.listen(conf.port);