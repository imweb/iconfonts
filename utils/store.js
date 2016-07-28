var path = require('path'),
    clean =  require('../utils/file.js'),
    fs = require('fs'),
    unzip = require('unzip');
var conf = require('../conf.js'),
    Icon = require('../model/icon.js');

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
                author: file.author,
                path: '/' + fileName,
                business: file.business,
                id: file.id
            }, function(errMaps) {
                // 删除临时文件
                // console.log(file);
                if(fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
                
                typeof cb === 'function' && cb(errMaps);
            });

        });
    }); 
}

function storeZip (file, cb) {
    var filePath = file.path,
        files = [],
        illegalFiles = [],
        fileInfo = {};
    // 解压, 上传的zip包中包含文件夹结构，会带上原来的文件夹结构
    fs.createReadStream(filePath).pipe(unzip.Extract({
        path: conf.svgPath
    })).on('close', function() {
        illegalFiles.forEach(function(f){
            clean.cleanFile(f.path);    
        })
    });

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
                    path: fileInfo.path,
                    author: file.author,
                    business: file.business,
                    id: file.id
                });
            } else {
                entry.autodrain();
                // clean.cleanFile(path.join(conf.svgPath, entry.path));
                illegalFiles.push({
                    path: path.join(conf.svgPath, entry.path)
                });
            }

        }).on('close', function(){
            if(files.length === 0) {
                var _errMsg = {};
                _errMsg[file.originalname] = '压缩包内没有svg文件';
                if(fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
                typeof cb === 'function' && cb(_errMsg);
                return;
            }
            Icon.insertByOrder(files, function(errMaps) {
                // delete tmpl file
                if(fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
                typeof cb == 'function' && cb(errMaps);
            });

        });
}

module.exports = {
    storeSvg: storeSvg,
    storeZip: storeZip
}
