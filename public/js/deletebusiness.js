$(function(){
	$('.del').on('click',function(){
		var a = confirm("确定删除吗？")
		if (a) {
			deletebusiness(this)
		}

		function deletebusiness(target){
			var params = {
				name: $(target).data('name')
			}
			$.ajax({
				type: 'Post',
				url: '/user/delete',
				data: params,
				success: function(data){
					if (data.retcode == 0) {
						alert("删除成功");
						window.location.reload()
					}
				}
			})
		}
	})
})