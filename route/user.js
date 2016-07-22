var express = require('express'),
	router = express.Router();

var User = require('../model/user.js'),
	Icon = require('../model/icon.js');

router.get('/', function(req, res, next){
	var user = req.user;
	if (!user) {
		res.render('intro', {
	        user: req.user
	    });
		return console.log("未登录")
	}
	
	Icon.find({
		author: user.nickname
	}).exec(function(err, icons){
		User.find({
			user: user.nickname
		}).exec(function(err, user){
			// console.log(user);
			if (err) {
				return console.log("find user出错")
			}

			var params = {
				all: icons,
				user: req.user
			}
			if (user.length === 0) {
				var newuser = {
					user: req.user.nickname,
					id: req.user.id
				};
				User.create(newuser, function(err){
					if (err) return console.log("添加数据库失败");
					// console.log("添加数据库成功");
				});
			}
				// console.log("已登录")
				// res.render('intro', {
			 //        user: req.user
			 //    });
			    res.render('user', params);
		})
	})

	
});

module.exports = router;