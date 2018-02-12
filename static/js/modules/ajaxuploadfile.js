seajs.use(['jquery','bootbox','libs/ajaxfileupload'], function($,bootbox) {

//上传附件
    var $uploadBtn = $('.buttonUpload');
    var $reUploadBtn = $('.changeupload');

    $uploadBtn.on('click', function () {
        var id =$(this).siblings("input[type='file']").attr("id")
        ajaxFileUpload(id);
    });


    $reUploadBtn.on('click', function () {
        $(this).parent().hide();
        $uploadBtn.parent().show();
    });


    function ajaxFileUpload(id) {
        console.log(id);
        if ($('#' + id).val() == '') {
            bootbox.alert('请选择要上传的文件！');
            return false;
        }
        $("#loading").parent().children('div').hide();
        $("#loading").show();
        var url = baseurl + 'uploadfile';
        $.ajaxFileUpload({
            url: url,
            secureuri: false,
            fileElementId: id,
            dataType: 'json',
            success: function (data) {
                $("#loading").hide();
                if (data.status == true) {
                    $('#attachment').attr('href', baseurl +'downloadfile?filename='+ unescape(data.filename));
                    $(".attachment_url").val(data.filename);
                    $reUploadBtn.parent().show();
                } else {
                    $uploadBtn.parent().show();
                    bootbox.alert(data.msg);
                }
            },
            error: function (data, status, e) {
                alert(e);
            }
        })

        return false;

    }
})