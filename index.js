var express = require('express'),
	fs = require('fs');
	path = require('path'),
	conf = require('./conf.js'),
	db = require('./db/index.js'),
	download = require('./libs/download.js'),
	multer  = require('multer'),
	ejs = require('ejs');

var app = express();

var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()       // to support JSON-encoded bodies
var urlencodedParser = bodyParser.urlencoded({ extended: false });


app.engine('.html', ejs.renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, '/views'));

app.use(express.static(path.join(__dirname, '/public')));
app.use(multer({ dest: './uploads/'}))
// 这里有问题
//app.use(bodyParser({uploadDir:'./uploads/'}));

app.get(['/', '/index'], function(req, res){
	db.findAll(function(arr){
		res.render('index', {'platform': arr})
	});
});

app.get('/rule', function(req, res){
	res.render('rule');
});

app.get('/intro', function(req, res){
	res.render('intro');
});

app.get('/upload', function(req, res){
	res.render('upload');
});

// 上传
app.post('/upload', jsonParser, function(req, res){
	console.log(req.files);
	var file = req.files.file,
		svgPath = file.path,
		extname = path.extname(svgPath),
		fileName = file.originalname;

	//if(extname !== '.svg') return;
	
	fs.readFile(svgPath, function(err, data){
		if(err) {
			console.log(err);
			return;
		}
		fs.writeFile(__dirname + '/uploadSvg/' + fileName + path.extname(svgPath), data, function(er){

		});
	});
	res.writeHead(302, {
	    'Location': '/index'
	});
});

app.get('/download/:ids', function(req, res){
	download.download(req.params.ids.split('-'), function(path){
		res.download(path, function(err){
			if(err) console.log(err);
		});
	});
});

app.listen(conf.port);