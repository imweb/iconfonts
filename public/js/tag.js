(function(exports){

    var $addBtn = $('#js-addtag'),
        $tagList = $('#js-taglist'),
        $input = $('#new-tag'),
        $icon = $('.js-icon');
    function bindEvents() {
        // add
        $addBtn.on('click', function() {
            var newTag = $input.val(),
                iconName = $icon.data('name'),
                iconId = $icon.data('id');
            $.ajax({
                url: '/add',
                type: 'post', 
                dataType: 'json',
                data: {
                    tag: newTag,
                    iconName: iconName,
                    iconId: iconId
                },
                success: function(data) {
                    console.log(data);
                    // if(data.retcode === 0) {
                    //     data = data.result;
                    //     $tagList.append('\
                    //         <li class="tag" data-id="' + data.tagId + '">' + data.tag + '\
                    //             <a href="javascript:;" class="js-del del-btn">\
                    //                 <i class="icon-font i-close"></i>\
                    //                 </a>\
                    //     </li>');

                    //     $input.val('');
                    // }
                },
                error: function(data) {
                    console.log(data);
                }   
            });
        });

        // delete
        $tagList.on('click', '.js-del', function() {
            var $this = $(this),
                $li = $this.parent('.tag'),
                id = $li.data('id');

            $.ajax({
                url: '/tag/del',
                type: 'post',
                dataType: 'json',
                data: {
                    id: id
                },
                success: function(data) {
                    if(data.retcode === 0) {
                        $li.remove();
                    }
                }, 
                error: function(data) {

                }
            });
        });
    }


    exports.init = function() {
        bindEvents();
    };
})(this);

this.init();