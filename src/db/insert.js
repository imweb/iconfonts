
var model = require('./model.js');
var Icon = model.Icon;


var randomIcon = ['daxiao', 'shuangyuzuo', 'top'],
	types = [0, 1];
var icon;

for(var i=0;i<60;i++){
	icon = new Icon({
		name: randomIcon[Math.floor(Math.random() * 3)],
		svg: '',
		type: types[Math.floor(Math.random() * 2)]
	});
	icon.save(function(err, i){
		if(err) return console.error(err);
	});
}

