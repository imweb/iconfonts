var express = require('express'),
	router = express.Router();

var business = require('../model/business.js');

router.get('/user', function(req, res, next){
	var user = req.user;
	if (!user) {
		res.render('intro', {
	        user: req.user
	    });
		return console.log("未登录")
	}
	
	User.find({
		user: user.nickname
	}).exec(function(err, user){
		console.log(user);
		// if (err) {
		// 	return console.log("find user出错")
		// }
		if (user.length === 0) {
			var newuser = {
				user: req.user.nickname,
				id: req.user.id
			};
			User.create(newuser, function(err){
				if (err) return console.log("添加数据库失败");
				console.log("添加数据库成功");
			});
		}
			console.log("已登录")
			res.render('intro', {
		        user: req.user
		    });
	})
});

module.exports = router;