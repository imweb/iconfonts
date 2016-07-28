var http = require('http'),
    fs = require('fs');

var AUTH_URL = '/domainauth';
var authOptions = {
    host: 'imweb.io',
    // path: '/webauth',
    // host: 'proxy.tencent.com',
    // port: '8080',
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
};

function authCheck(req, res, next) {
    if (req.user.accessToken) {
        console.log(req.user);
        authOptions.path = AUTH_URL;
        ['uin', 'skey', 'accessToken'].forEach(function(key) {
            authOptions.path += '/' + req.cookies[key];
        });
        var authReq = http.request(authOptions, function (res) {
            var data = '';
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                data += chunk;
            });
            res.on('end', function () {
                var d = JSON.parse(data);
                if(d.retcode !== 200) {
                    return res.redirect('http://iconfont.imweb.io/intro');
                }
                next();
            });
        }).on('error', function (err) {
            console.error(err.message);
            res.status(500).end();
        });
        return authReq.end();
    }
    console.log(req.user);
    res.redirect('http://iconfont.imweb.io/intro');
}

module.exports = authCheck;
//module.exports = function(req, res, next){next()};
