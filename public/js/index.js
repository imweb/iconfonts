(function(root){
	function bindEvents(){
		$('#js-back2top').on('click', function(){
			$(window).scrollTop(0);
		});
	}

	function init(){
		bindEvents();
	}
	root.init = init;

})(this);

this.init();