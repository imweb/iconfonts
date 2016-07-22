$(function(){

	$('.submit').click(function(){
		if ($('.addProject #project').val()) {
			sendProjectName();
			$('.addProject').hide();
			$('#project').val("")
		}else{
			$('.addProject span').text("项目不能为空")
			// console.log($('.addProject span').text(""));
		}
		
	})
	function sendProjectName(){
		var data = $('#project').val();
		var params = {
			"project": data
		}
		$.ajax({
			type: 'Post',
			url: '/upload/addproject',
			data: params,
			success: function(data){
				
				$('#js-business').append("<option value="+data[data.length-1].bid+">"+data[data.length-1].name+"</option>");
			}
		})
	}
})