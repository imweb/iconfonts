var fs = require('fs');

var logPath = './log.txt';


function log(info) {
    info = 'time: ' + new Date().toString() + ' | ' + info + '\r\n';
    fs.appendFileSync(logPath, info);
}

function logMulty(obj) {
    var info = '';
    for(var key in obj) {
        if(obj.hasOwnProperty(key)) {
            info += key + ': ' + obj[key] + ' | ';
        }
    }

    log(info);
}


function error() {

}



module.exports = {
    log: log,
    logMulty: logMulty
};
