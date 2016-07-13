var express = require('express'),
    ejs = require('ejs'),
    //multer  = require('multer'),
    passport = require('passport');

var fs = require('fs'),
	path = require('path');

var conf = require('./conf.js');

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

// app.use(multer({ dest: './uploads/'}));

app.use(jsonParser);
app.use(urlencodedParser);

// cookie
var cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(require('./routes'));

// 授权成功将整个user对象存入session
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

app.use(passport.initialize());
app.use(passport.session());

// app.use(function(err, req, res, next) {
// 	var meta = '[' + new Date() + '] ' + req.url + '\r\n';
// 	errorLogfile.write(meta + err.stack + '\r\n');
// 	res.status(500).send({error: 'something blew up!'});
// req.end();
// });

app.listen(conf.port);
