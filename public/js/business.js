

/*
* @author helondeng
 */

(function(exports){

    var $addBtn = $('#js-add'),
        $list = $('#js-list'),
        $form = $('#js-form'),
        $bis = $form.find('input[name="business"]'),
        $pm = $form.find('input[name="pm"]');

    function addBid(name, pm) {
        $.ajax({
            url: '/business/add',
            type: 'post', 
            dataType: 'json',
            data: {
                business: name,
                pm: pm 
            },
            success: function(data) {
                console.log(data);
                if(data.retcode === 0) {
                    data = data.result;
                    $list.append('\
                    <li class="bid">' + data.name + '</li>\
                    ');
                    $bis.val('');
                    $pm.val('');
                }
            },
            error: function(data) {
            }   
        });
    }

    exports.bindEvents = function() {
        $addBtn.on('click', function() {
            addBid($bis.val(), $pm.val());
        });
    };

})(this);


this.bindEvents();