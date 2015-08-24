var path = require('path'),
    fs = require('fs'),
    unzip = require('unzip');
var conf = require('../conf.js'),
    Icon = require('../models/icon.js');

function storeSvg (file, cb) {
    var filePath = file.path,
        fileName = file.originalname;
    fs.readFile(filePath, function(err, data){
        if(err) {
            console.error(err);
            return cb(err);
        }
        fs.writeFile(path.join(conf.svgPath, fileName), data, function(err) {
            if(err) {
                console.error(err);
                return cb(err);
            }
            Icon.insertByOrder({
                name: path.basename(fileName, '.svg'),
                path: '/' + fileName
            });
            // 删除临时文件
            fs.unlinkSync(filePath);
            typeof cb === 'function' && cb();
        });
    }); 
}

function storeZip (file, cb) {
    var filePath = file.path,
        files = [],
        fileInfo = {};
    // 解压, 上传的zip包中包含文件夹结构，会带上原来的文件夹结构
    fs.createReadStream(filePath).pipe(unzip.Extract({
        path: conf.svgPath
    }));

    // 单个文件处理
    fs.createReadStream(filePath)
        .pipe(unzip.Parse())
        .on('entry', function (entry) {
            fileInfo = {
                name: path.basename(entry.path),
                type: entry.type,
                path: entry.path
            };
            if(fileInfo.type == 'File' && path.extname(fileInfo.name) == '.svg'){
                files.push({
                    name: path.basename(fileInfo.name, '.svg'),
                    path: fileInfo.path
                });
            }
        }).on('close', function(){
            Icon.insertByOrder(files);
            // delete tmpl file
            fs.unlinkSync(filePath);
            typeof cb == 'function' && cb();
        }).on('finish', function(){
            // not fire
        });
}

module.exports = {
    storeSvg: storeSvg,
    storeZip: storeZip
}