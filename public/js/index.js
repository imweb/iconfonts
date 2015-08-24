(function(root){
	function bindEvents(){
		$('#js-back2top').on('click', function(){
			$(window).scrollTop(0);
		});

		$('body').on('click', '.js-pcList li', function(){
			var $this = $(this);
			$this.toggleClass('icon-checked');
			$('#js-download-btn')[$('.icon-checked').length > 0 ? 'show' : 'hide']();
		});
		$('#js-download-btn').on('click', function(){
			var ids = [];
			$('.icon-checked').each(function(index, item){
				ids.push($(item).data('id'));
			});
			location.href = '/download/' + ids.join('-');
		});
	}

	function init(){
		bindEvents();
		$.get('/imwebauth');
	}
	root.init = init;

})(this);

this.init();