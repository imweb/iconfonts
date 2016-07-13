/*
* @by helondeng, moxhe
* config info
*/

module.exports = {
	// 监听端口
	port: 4001,
	// svg path
	svgPath: './store/ke.qq.com-svg',
	allSvgZipPath: 'download/svgs.zip',
	// mongodb info
	dbInfo: {
		IP: '127.0.0.1',
		port: 27017,
		dbName: 'iconfonts'
	},
	// QQ互联应用信息
	appId: 101334858,
	appKey: '6db56cd9b88dc0074cc468d0c444cd0a',
	origin: 'http://iconfont.imweb.io',

    diff: 32,
	auth: {
		upload: 1,
        business: 2,
        updateIcon: 4
	}
};
