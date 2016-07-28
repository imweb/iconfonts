$(function(){
	$('.userAuth').on('click', function(){
		var value = parseInt($(this).data("value"));
		if (value) {
			$(this).data("value","0");
			$(this).text("设置权限");
			// console.log($(this).data("value"))
		}else{
			$(this).data("value","1");
			$(this).text("取消权限");
			// console.log($(this).data("value"))
		}
		var value = parseInt($(this).data("value"));
		var userID = $(this).parent().prev().data("id")
		// console.log(userID);
		var params = {
			'value': value,
			'userID': userID
		}
		sendValue();
		function sendValue(value){
			$.ajax({
				type: 'Post',
				url: '/management/value',
				data: params,
				success: function(data){
					if (data.retcode == 0) {
						alert("操作成功");
					}
				}
			})
		}
	})
})