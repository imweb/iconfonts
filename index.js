var express = require('express'),
	fs = require('fs');
	path = require('path'),
	conf = require('./conf.js'),
	iconHandler = require('./db/index.js'),
	download = require('./libs/download.js'),
	tools = require('./libs/tools.js'),
	multer  = require('multer'),
	upload = require('./libs/upload.js'),
	search = require('./libs/search.js'),
	ejs = require('ejs');

var app = express();

var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();       // to support JSON-encoded bodies
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var errorLogfile = fs.createWriteStream('error.log', {flags: 'a'});

app.engine('.html', ejs.renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, '/views'));

app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '/download')));
app.use(multer({ dest: './uploads/'}));

app.get(['/', '/index'], function(req, res, next){
	iconHandler.findAll(function(err, arr){
		if (err) return next(err);
		if(arr.length > 0) {
			tools.genarateFonts(arr);
		    tools.generateCss(arr);
		}
		res.render('index', {all: arr});
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
app.post('/upload', jsonParser, function(req, res, next){
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
	}, function(err){
		if (err) return next(err);
		res.redirect('index');
	})
});

app.get('/download/:ids', function(req, res, next){
	var ids = req.params.ids.split('-');
	var handler = function(err, p, name){
		if (err) return next(err);
 		res.setHeader('Content-Type', 'application/zip');
 		var filename = path.basename(p);
    	res.setHeader('Content-Disposition', 'attachment; filename=' + filename);
		res.download(p, name, function(err){
			if(err) console.log(err);
		});
	};
	if (ids[0] === '$svgs') download.downloadSvgs(handler);
	else download.download(req.params.ids.split('-'), handler);
});

app.get('/search', function(req, res, next) {
	search.search(req.query.q, function(err, arr) {
		if (err) return next(err);
		if(arr.length > 0) {
			tools.genarateFonts(arr);
		    tools.generateCss(arr);
		}
		res.render('index', {all: arr});
	});
});

app.use(function(err, req, res, next) {
	var meta = '[' + new Date() + '] ' + req.url + '\r\n';
	errorLogfile.write(meta + err.stack + '\r\n');
	res.status(500).send({error: 'something blew up!'});
});

app.listen(conf.port);