(function(root) {
	function bindEvents() {
		$('#js-back2top').on('click', function() {
			$(window).scrollTop(0);
		});

		$('body').on('click', '.js-pcList li', function() {
			var $this = $(this),
				$downloadBtn = $this.parents(".icon-list").siblings('h1').children('#js-download-btn');

			$this.toggleClass('i-right');
			var $li = $this.parents('.icon-list').children('.i-right');
			$downloadBtn[$li.length > 0 ? 'addClass' : 'removeClass']('disabled');
		});
		
		$('.selectAllBtn').on('click', function() {
			var $list = $(this).parents("h1").siblings('.icon-list').children();
			var value = $(this).data("value");
			if (value == 0) {
				$list.each(function() {
					$(this).addClass('i-right');
				})
				$(this).text("取消全选");
				$(this).siblings('.downloadBtn').addClass('disabled');
				$(this).data("value","1");
			} else {
				$list.each(function() {
					$(this).removeClass('i-right');
				})
				$(this).text("全选");
				$(this).siblings('.downloadBtn').removeClass('disabled');
				$(this).data("value", "0");
				// value = 0
			}

		})

		$('.downloadBtn').on('click', function() {
			var $iconLi = $(this).parents("h1").siblings('.icon-list').children('li.i-right')
			if ($iconLi.length == 0) {
				alert("还未选择icon");
				return false
			}
			// console.log($iconLi.length);
			var ids = [];
			$iconLi.each(function(index, item) {
				ids.push($(item).data('id'));
			});
			location.href = '/download/' + ids.join('-');
		});

		// $(document).on('click', function() {
		// 	$('#personOption,#loginReg,.arrow').hide();
		// });

		// $('#logIn').on('click', function(e){
		// 	e.stopPropagation();
		// 	$('#loginReg').toggle();
		// });

		// $('#person,#personImg').on('click', function(e){
		// 	e.stopPropagation();
		// 	$('.arrow').toggle();
		// });

		

	}

	function init() {
		bindEvents();
	}
	root.init = init;

})(this);

this.init();