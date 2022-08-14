$(function () {
    var parentProductId = 0;
    //点击展开弹框
    $('#productPublicinfo').on('click', function () {
        var productId = $.getSelectId();
        $(".table tr").each(function (index, item) {
            if ($(item).data("isSelect") == true) {
                parentProductId = $(item).attr("parentId");
                return false;
            }
        });
        

        if (!productId) {
            $.tips('请先选择产品', $(this), 1000);
            return;
        }
        $.openDialog({
            title: '公示信息',
            jqObj: $('#divProductPublicInfo')
        });
        $.get({
            url: 'product/productPublicInfo/getByProduct',
            data: { parentProductId: parentProductId },
            success: function (result) {
                $('#productPublicForm').loadForm(result);
                //showSwitchery();
            },
            error: function () {
                showSwitchery();
            }
        });

        $("#parentProductId").val(parentProductId);
    });
    //保存公示信息
    $('#btnProductPublic').on('click', function () {
        $('#productPublicForm').submitForm({
            type: 'post',
            url: 'product/productPublicInfo',
            data: { 'isDelete': $("#isDelete").is(":checked") },
            success: function () {
                $.success('操作成功');
                //关闭弹框
                $.closeDialog($('#divProductPublicInfo'));
            },
            error: function (resultErr) {
                $.errorMsg(resultErr.responseText);
            }
        })
    });
});