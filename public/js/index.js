(function(root){
	function bindEvents(){
		$('#js-back2top').on('click', function(){
			$(window).scrollTop(0);
		});

		$('body').on('click', '.js-pcList li', function(){
			var $this = $(this);
			$this.toggleClass('i-right');
			$('#js-download-btn')[$('.i-right').length > 0 ? 'show' : 'hide']();
		});
		$('#js-download-btn').on('click', function(){
			var ids = [];
			$('.js-pcList li.i-right').each(function(index, item){
				ids.push($(item).data('id'));
			});
			location.href = '/download/' + ids.join('-');
		});

		$(document).on('click', function(){
			$('#personOption,#loginReg,.arrow').hide();
		});

		// $('#logIn').on('click', function(e){
		// 	e.stopPropagation();
		// 	$('#loginReg').toggle();
		// });

		$('#person,#personImg').on('click', function(e){
			e.stopPropagation();
			$('#personOption,.arrow').toggle();
		});

		$('.add').on('click', function(){
			$('.addProject').toggle();
			$('#project').focus();
			$('.addProject span').text("")
		})


	}

	function init(){
		bindEvents();
	}
	root.init = init;

})(this);

this.init();
