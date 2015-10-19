/*
* 脏文件清理
 */
var fs = require('fs'),
    path = require('path');

var _ = module.exports;

var exec = require('child_process').exec;

// delete folder
_.cleanDir = function(folder) {
    exec('rm -rf ' + folder);
};

_.toString = function() {
    return Object.prototype.toString;
};

// 后缀名处理
_.processExt = function(ext) {
    var extReg = /^\./,
        extensions = [];
    if(_.toString().apply(ext) === '[object String]') {
        extensions.push(ext);
    } else if (_.toString().apply(ext) === '[object Array]') {
        extensions = extensions.concat(ext);
    } 

    extensions.forEach(function(exten, index) {
        extensions[index] = extReg.test(exten) ? exten : ('.' + exten);
    });
    return extensions;
};

// 删除目录下的某个后缀名的文件
_.cleanCertainExtensionFiles = function(folder, ext) {
    var files = fs.readdirSync(folder),
        extensions = _.processExt(ext);

    files.forEach(function(file) {
        if(fs.statSync(file).isFile() && ~extensions.indexOf(path.extname(file))) {
            fs.unlinkSync(path.join(folder, file));
        }
    });
};

// 删除除某些后缀名之外的文件
_.cleanExceptExtensionFiles = function(folder, ext) {
    var files = fs.readdirSync(folder),
        stat,
        _file,
        extensions = _.processExt(ext);
  
    files.forEach(function(file) {
        _file = file;
        file = path.join(folder, file);
        stat = fs.statSync(file);
        if(stat.isFile() && ~~extensions.indexOf(path.extname(file))) {
            fs.unlinkSync(file); 
        } else if (stat.isDirectory()) {
        }
    });

};

// 删除文件或文件夹
_.cleanFile = function(file) {
    var stat = fs.statSync(file);
    if(stat.isFile()) {
        fs.unlinkSync(file);
    } else if (stat.isDirectory()) {
        _.cleanDir(file);
    }
};

// 删除某个目录下，当前时间之前 time ms的所有文件
_.clearPreviousFiles = function(folder, time) {
    var now = +new Date(),
        stat,
        createTime,
        files = fs.readdirSync(folder);
    files.forEach(function(file){
        file = path.join(folder, file);
        stat = fs.statSync(file),
        createTime = +new Date(stat.ctime);
        if(createTime + time < now) {
            _.cleanFile(file);
        }
    });
};
