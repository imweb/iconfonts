var express = require('express'),
	fs = require('fs');
	path = require('path'),
	conf = require('./conf.js'),
	db = require('./db/index.js'),
	download = require('./libs/download.js'),
	multer  = require('multer'),
	upload = require('./libs/upload.js'),
	ejs = require('ejs');

var app = express();

var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()       // to support JSON-encoded bodies
var urlencodedParser = bodyParser.urlencoded({ extended: false });


app.engine('.html', ejs.renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, '/views'));

app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '/download')));
app.use(multer({ dest: './uploads/'}))
// 这里有问题
//app.use(bodyParser({uploadDir:'./uploads/'}));

app.get(['/', '/index'], function(req, res){
	db.findAll(function(arr){
		res.render('index', {'platform': arr.pcs, 'h5s': arr.h5s})
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

	// console.log(file);
	if(extname !== '.svg') return;
	
	fs.readFile(svgPath, function(err, data){
		if(err) {
			console.log(err);
			return;
		}
		fs.writeFile('./docs/ke.qq.com-svg/' + fileName, data, function(er){
			// 将上传的字体文件写入数据库
			// iconfont 的 content 是根据图标自动生成的，如何确保不重复
			if(er){
				console.log(er);
				return;
			}
			upload.insert([fileName]);
			res.redirect('index');
		});
		
	});	
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