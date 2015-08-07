var express = require('express'),
	fs = require('fs');
	path = require('path'),
	conf = require('./conf.js'),
	iconHandler = require('./db/index.js'),
	download = require('./libs/download.js'),
	multer  = require('multer'),
	upload = require('./libs/upload.js'),
	ejs = require('ejs');

var app = express();

var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();       // to support JSON-encoded bodies
var urlencodedParser = bodyParser.urlencoded({ extended: false });


app.engine('.html', ejs.renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, '/views'));

app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '/download')));
app.use(multer({ dest: './uploads/'}));
// 这里有问题
//app.use(bodyParser({uploadDir:'./uploads/'}));

app.get(['/', '/index'], function(req, res){
	iconHandler.findAll(function(arr){
		res.render('index', {all: arr, maps: conf.cats})
	});
});

app.get('/rule', function(req, res){
	res.render('rule');
});

app.get('/intro', function(req, res){
	res.render('intro');
});

app.get('/upload', function(req, res){
	res.render('upload', {cats: conf.cats});
});

// 上传
app.post('/upload', jsonParser, function(req, res){
	var platform = req.body.platform;
	var file = req.files.file,
		svgPath = file.path,
		extname = path.extname(svgPath),
		fileName = file.originalname;

	var allowExt = ['.svg', '.zip'/*, '.rar', '.7z', '.tar'*/];

	if(allowExt.indexOf(extname) == -1) {
		res.redirect('index');
		return;
	}


	upload.upload({
		path: file.path,
		name: fileName,
		platform: platform
	}, function(){
		res.redirect('index');
	})
});

app.get('/download/:ids', function(req, res){
	download.download(req.params.ids.split('-'), function(p){
 		res.setHeader('Content-Type', 'application/zip');
 		var filename = path.basename(p);
    	res.setHeader('Content-Disposition', 'attachment; filename=' + filename);
		res.download(p, function(err){
			if(err) console.log(err);
		});
	});
});

app.listen(conf.port);