var express = require('express'),
	fs = require('fs');
	path = require('path'),
	conf = require('./conf.js'),
	multer  = require('multer'),
    cookieParser = require('cookie-parser'),
	ejs = require('ejs');

var app = express();

var bodyParser = require('body-parser');

var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var errorLogfile = fs.createWriteStream('error.log', {flags: 'a'});

app.engine('.html', ejs.renderFile);
app.set('etag', 'strong');
app.set('view engine', 'html');
app.set('views', path.join(__dirname, '/views'));

app.use(express.static(path.join(__dirname, '/public')));

app.use(express.static(path.join(__dirname, '/download')));

app.use(multer({ dest: './uploads/'}));
app.use(cookieParser());

// middleware for auth
// {uin, skey, accessToken}
app.use(function (req, res, next) {
    req.user = req.cookies.accessToken ? req.cookies.user : ''
    next();
});

app.use(jsonParser);
// 缺少这个，会导致 req.body = {}
app.use(urlencodedParser);

// cookie
var cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(require('./routes'));

// app.use(function(err, req, res, next) {
// 	var meta = '[' + new Date() + '] ' + req.url + '\r\n';
// 	errorLogfile.write(meta + err.stack + '\r\n');

// 	res.status(500).send({error: 'something blew up!'});
//     // req.end();
// });

app.listen(conf.port);
