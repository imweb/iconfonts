$(function(){

	$('.submit').click(function(){
		if ($('.addProject #project').val()) {
			sendProjectName();
			$('.addProject,.bg').hide();
			$('#project').val("");

		}else{
			$('#project').attr('placeholder','项目不能为空')
			// console.log($('.addProject span').text(""));
		}
		
	})

	$('.add').on('click', function() {
		$('.addProject,.bg').toggle();
		$('#project').focus().attr('placeholder','项目名称');
		$('.addProject span').text("")
	})
	$('.bg').on('click', function(){
		$('.addProject,.bg').hide();
	})
	// $("#js-business").find("option[value='47']").attr("selected",true);
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
				$("#js-business").find("option[value="+data[data.length-1].bid+"]").attr("selected",true);

			}
		})
	}
})