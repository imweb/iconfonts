(function(exports){
    var query = function (n) {
        var m = window.location.search.match(new RegExp("(\\?|&)" + n + "=([^&]*)(&|$)"));
        return !m ? "" : decodeURIComponent(m[2]);
    };


    var id = query('id'),
        $updateBtn = $('#js-update'),
        $form = $('#js-form'),
        $input = $form.find('input[name="newname"]'),
        $delBtn = $('#js-del');

    exports.bindEvents = function() {
        $updateBtn.on('click', function() {
            var val = $input.val();
            $.ajax({
                url: '/update',
                type: 'post', 
                dataType: 'json',
                data: {
                    id: id,
                    name: val,
                    business: $('#js-business').val()
                },
                success: function(data) {
                    console.log(data);
                    if(data.retcode === 0) {
                        alert('更新成功');
                    }
                },
                error: function(data) {
                    console.log(data.retcode);
                }   
            });
        });

        $delBtn.on('click', function() {
            $.ajax({
                url: '/update/del',
                type: 'post', 
                dataType: 'json',
                data: {
                    id: id,
                },
                success: function(data) {
                    if(data.retcode === 0) {
                        alert('删除成功');
                        window.location.href="http://iconfont.imweb.io/user";
                    }
                },
                error: function(data) {
                }   
            });
        });
    };


})(this)

this.bindEvents();