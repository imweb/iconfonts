var obj = $("#upload"),
	$mask = $('.js-mask'),
	$select = $('#js-business'),
	select = $select[0];

$select.on('change', function() {
	if(select.value == -1) {
    	$mask.find('p').text('请选择项目！');
    	$mask.show();
	} else {
		$mask.hide();
	}
});
obj.on('dragenter', function (e){
    e.stopPropagation();
    e.preventDefault();
    $(this).css('border', '2px solid #0B85A1');
});
obj.on('dragover', function (e) {
     e.stopPropagation();
     e.preventDefault();
});
obj.on('drop', function (e) {
 
    $(this).css('border', '2px dotted #0B85A1');
    e.preventDefault();
    var files = e.originalEvent.dataTransfer.files;
 
     //We need to send dropped files to Server
     //console.log(files)
     //
    if(select.value == -1) {
    	$mask.find('p').text('请选择项目！');
    	$mask.show();
    } else {
    	$mask.find('p').text('上传中...');
    	$mask.show();
    	handleFileUpload(files,obj);
    }
    
});

function handleFileUpload(files,obj){
    for (var i = 0; i < files.length; i++){
        var fd = new FormData();
        fd.append('file', files[i]);
        fd.append('business', select.value);
        sendFileToServer(fd,status);
    }
}

function sendFileToServer(formData,status){
	
    var uploadURL ="/upload"; //Upload URL
    var extraData ={}; //Extra Data.
    var jqXHR = $.ajax({
        xhr: function() {
            var xhrobj = $.ajaxSettings.xhr();
            if (xhrobj.upload) {
                    xhrobj.upload.addEventListener('progress', function(event) {
                        var percent = 0;
                        var position = event.loaded || event.position;
                        var total = event.total;
                        if (event.lengthComputable) {
                            percent = Math.ceil(position / total * 100);
                        }
                        //Set progress
                        //status.setProgress(percent);
                    }, false);
                }
            return xhrobj;
        },
        url: uploadURL,
        type: "POST",
        contentType:false,
        processData: false,
        cache: false,
        data: formData,
        success: function(data){
        	if(data.retcode == 0) {
        		data = data.result;
        		$('#upload').hide();
        		var succInfo = [],
        			errInfo = []
        		for(var i in data) {
        			if(data[i]) { 
        				errInfo.push('<li class="error">' + i + '  :  ' + data[i] + '</li>') 				
        			} else {
        				succInfo.push('<li>' + i + '  :  ' + '添加成功 </li>');
        			}
        			
        		}
        		$('#js-info').append(errInfo.concat(succInfo).join(''));
        		$('#js-upInfo').show();
        	}       
        },
        error: function(){
    		$('#js-info').append('<li class="error">服务错误！请联系管理员！</li>');
    		$('#js-upInfo').show();
        }
    });  
}