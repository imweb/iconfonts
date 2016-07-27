(function(root){
	function bindEvents(){
		$('#js-back2top').on('click', function(){
			$(window).scrollTop(0);
		});

		$('body').on('click', '.js-pcList li', function(){
			var $this = $(this),
				$downloadBtn = $this.parents(".icon-list").siblings('h1').children('#js-download-btn');
				


			$this.toggleClass('i-right');
			var $li = $this.parents('.icon-list').children('.i-right');
			$downloadBtn[$li.length > 0 ? 'show' : 'hide']();
		});

		$('.downloadAllBtn').on('click', function() {
			var $list = $(this).parents("h1").siblings('.icon-list').children();
			$list.each(function(){
				$(this).addClass('i-right');
			})
			$(this).siblings('.downloadBtn').show();		
		})

		$('.downloadBtn').on('click', function(){
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
