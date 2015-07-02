(function(root){
	function bindEvents(){
		$('#js-back2top').on('click', function(){
			$(window).scrollTop(0);
		});

		$('#js-pcList').on('click', 'li', function(){
			var $this = $(this),
				id = $this.data('id');
			$this.addClass('icon-checked')
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
	}
	root.init = init;

})(this);

this.init();