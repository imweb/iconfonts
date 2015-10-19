var http = require('http'),
    fs = require('fs');

// var AUTH_URL = '/domainauth';
var AUTH_URL = 'http://imweb.io/domainauth';
var authOptions = {
    // host: 'imweb.io',
    // path: '/webauth',
    host: 'proxy.tencent.com',
    port: '8080',
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
};

function authCheck(req, res, next) {
    if (req.cookies.accessToken) {
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
                console.log(data);
                // var d = JSON.parse(data);
                // if(d.retcode !== 200) {
                //     return res.redirect('http://imweb.io');
                // }
                // next();
            });
        }).on('error', function (err) {
            console.error(err.message);
            res.status(500).end();
        });
        return authReq.end();
    }
    res.redirect('http://imweb.io');
}


// module.exports = authCheck;
module.exports = function(req, res, next) {
    next();
};