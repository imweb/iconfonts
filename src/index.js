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
	var platArr = [],
		mbArr = [];
	db.findAll(function(arr){
		arr.forEach(function(item, index){
			if(item.type == '0'){
				// 平台 icon
				platArr.push(item);
			}else{
				mbArr.push(item);
			}
		});
		res.render('index', {'platform': platArr, 'mobile': mbArr})
	});
	// res.render('index');
});

app.get('/rule', function(req, res){
	res.render('rule');
});

app.listen(conf.port);