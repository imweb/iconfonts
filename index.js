var express = require('express'),
	path = require('path'),
	conf = require('./conf.js'),
	db = require('./db/index.js'),
	Q = require('q'),
	download = require('./libs/download.js'),
	ejs = require('ejs');

var app = express();

app.engine('.html', ejs.renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, '/views'));

app.use(express.static(path.join(__dirname, '/public')));

app.get(['/', '/index'], function(req, res){
	db.findAll(function(arr){
		console.log(arr.length)
		res.render('index', {'platform': arr})
	});
});

app.get('/rule', function(req, res){
	res.render('rule');
});

app.get('/download/:ids', function(req, res){
/*	res.setHeader('Content-type', 'application/zip');*/
	var path;
	//res.download(path)
	download.download(req.params.ids.split('-'), function(path){
		console.log('path', path);
		res.download(path, function(err){
			if(err) console.log(err);
		});
	});
	
	//res.send('hello world')
});

app.listen(conf.port);