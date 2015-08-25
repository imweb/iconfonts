var path = require('path'),
    fs = require('fs'),
    archiver = require('archiver');

var Q = require('q'),
    fontCarrier = require('font-carrier'),
    font = fontCarrier.create();

var conf = require('../conf.js'),
    svgParser = require('../utils/svg_parser.js'),
    svgPath = conf.svgPath;

function packUpSvgs (downloadCb) {
    var zipPath = conf.allSvgZipPath;
    var folderName = path.basename(zipPath, '.zip');
    
    if (!fs.existsSync('download')) fs.mkdirSync('download');
    if (fs.existsSync(zipPath)) {
        // 假设其存在的话，则未更改
        // 当撒上传svg时，在upload逻辑中update或remove这个文件
        typeof downloadCb === 'function' && downloadCb(undefined, zipPath);
    } else {
        var svgNames = fs.readdirSync(svgPath);
        if (!fs.existsSync(folderName)) fs.mkdirSync(folderName);
        svgNames.forEach(function (svgName) {
            var svgSrc = path.join(svgPath, svgName);
                svgDest = path.join(folderName, svgName);
            if (!fs.statSync(svgSrc).isFile()) return;
            var content = fs.readFileSync(svgSrc).toString();
            fs.writeFileSync(svgDest, content);
        });
        var output = fs.createWriteStream(zipPath);
        var archive = archiver('zip');
        archive.on('error', function (err) {
            console.error(err);
            typeof downloadCb === 'function' && downloadCb(err);
        });
        archive.pipe(output);
        archive.bulk([
            {expand: true, cwd: folderName, src: ['**']}
        ]);
        archive.finalize();

        output.on('close', function () {
            typeof downloadCb === 'function' && downloadCb(undefined, zipPath);
        });
    }
}

// 根据icons生成对应的字体文件和样式
function packUpIconfonts (icons, downloadCb) {
    if(!fs.existsSync('download')) fs.mkdirSync('download');
    var folderName = 'download/iconfont-' + Date.now(),
        pngsFolder = path.join(folderName, 'pngs'), 
        svgsObj = {},
        svgFilePath,
        iconNames = [];

    fs.mkdirSync(folderName);
    fs.mkdirSync(pngsFolder);
    icons.forEach(function(icon, index){
        svgFilePath = path.join(svgPath, icon.name.replace('i-', '') + '.svg');
        svgsObj[icon.content.replace('\\f', '&#xf')] = fs.readFileSync(svgFilePath).toString();
        iconNames.push(icon.name.replace('i-', ''));
    });

    font.setSvg(svgsObj);
    var zipPath = folderName + '.zip';
    fs.mkdirSync(path.join(folderName, 'fonts'));
    // 异步
    Q.fcall(function(){
        var output = path.join(folderName, 'fonts/iconfont');
        var outFonts = font.output({});
        //  先生成字体 buffer，然后手动写文件
        for(var type in outFonts){
            fs.writeFileSync(output + '.' + type, outFonts[type]);
        }
        // 这里生成字体后，需要读取字体文件，生成base64，但是output方法没有提供回调
        svgParser.generateCss(icons, path.join(folderName, 'iconfont.scss'), true);
        svgParser.generateHtml(iconNames, path.join(folderName, 'demo.html'));
        // console.log(font.output().ttf);
        // 这里生成字体后，需要读取字体文件，生成base64，但是output方法没有提供回调, 已经向作者pull requrest
        // font-carrier/lib/helpler/engine.js 280行，写文件 改正writeFileSync 同步
        svgParser.generateBase64Css(icons, path.join(folderName, 'iconfont-embedded.css'));
    }).then(function(){

        var output = fs.createWriteStream(zipPath);
        var archive = archiver('zip');

        archive.on('error', function(err){
            // throw err;
            console.error(err);
            downloadCb(err);
        });

        archive.pipe(output);
        archive.bulk([
            { src: [folderName + '/**']}
        ]);
        archive.finalize();

        // stream close event
        output.on('close', function(){
            typeof downloadCb === 'function' && downloadCb(undefined, zipPath);
        });
        
    });
}

module.exports = {
    packUpSvgs: packUpSvgs,
    packUpIconfonts: packUpIconfonts
}
