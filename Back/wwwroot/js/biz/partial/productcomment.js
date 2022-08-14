$(function () {
    //点击展开弹框
    $('#productComment').on('click', function () {
        var productId = $.getSelectId();
        if (!productId) {
            $.tips('请先选择产品', $(this), 1000);
            return;
        }
        $.openDialog({
            title: '点评',
            jqObj: $('#divProductComment')
        });
        $.get({
            url: 'product/getProductComment/' + productId,
            data: { productId: $.getSelectId() },
            success: function (res) {
                $('#formProductComment').loadForm(res);
                $('#divProductComment').attr('isContent', 'true');
                if (res.isDelete == false) {
                    $('#btnDelete').show();
                } else { 
                    $('#btnDelete').hide();
                }
            },
            error: function () { 
                $('#divProductComment').attr('isContent', 'false');
                $('#btnDelete').hide();
            }
        });
    });
    //保存评论
    $('#btnProductComment').on('click', function () {
        var productId = $.getSelectId();
        var isContent = $('#divProductComment').attr('isContent');
        if (isContent == "false") {
            var type = 'post';
            var url = 'product/addProductComment';
        }
        else if (isContent == "true") {
            var type = 'put';
            var url = 'product/editProductComment/' + productId;
        }
        $('#formProductComment').submitForm({
            type: type,
            url: url,
            data: { productId: $.getSelectId() },
            success: function () {
                $.success('操作成功');
                //关闭弹框
                $.closeDialog($('#divProductComment'));
            },
            error: function (resultErr) {
                $.errorMsg(resultErr.responseText);
            }
        })
    });
    //删除点评
    $('#btnDelete').on('click', function () {
        var productId = $.getSelectId();
        $.confirm('确定删除点评吗？', function () {
            $.put({
                url: "product/deleteProductComment/" + productId,
                data: { productId: $.getSelectId() },
                success: function (result) { 
                    $.success('操作成功');
                    //关闭弹框
                    $.closeDialog($('#divProductComment'));
                },
                error: function (error) {
                    console.log(error.responseText);
                }
            })
        });
    })
})