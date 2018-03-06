define(function(require, module, exports) {
    var $ = require('jquery'),
        $el = $('.form-horizontal'),
        bootbox = require('bootbox');
    var test = {
        local: {},
        params_obj: {},
        params:{},
        init: function () {
            $el.find('input[type="submit"]').on('click', test.submit);
            console.log("init");
        },
        submit: function(){
            console.log("hello");
            var req = $.ajax({
                url: $('#service_post_form').attr('action'),
                data: test.params,
                type: 'POST',
				dataType:'json'
            });
            req.done(function(data) {if(data.return==false){bootbox.alert(data.msg)}else{
                bootbox.alert('保存成功');
                console.log(data);
                document.location=baseurl+data.url;
            }});
            req.fail(function(error) {console.log("error")});
        }
    };
    test.init();
    return test;
});