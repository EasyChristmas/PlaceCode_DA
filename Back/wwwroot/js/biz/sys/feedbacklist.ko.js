//提交工单
grid.submitFeed = function () {
    $.openDialog({
        title: "提交工单",
        jqObj: $("#modalAdd"),
        width: "600"
    });
};
//保存工单
grid.saveForm = function () {
    $("#addForm").submitForm({
        type: "post",
        url: "sys/feedback",
        data: $("#addForm").toJson(),
        success: function (result) {
            $("#addForm").resetForm();
            $.closeDialog($("#modalAdd"));
            query();
        },
        error: function (resultErr) {
            $.errorMsg(resultErr.responseText);
        }
    });
};
//回复工单
grid.replyFeed = function () {
    var id = $.getSelectId();
    if (!id) {
        $.tips('请先选择一条记录', $(event.toElement), 1000);
    } else {
        $.openDialog({
            title: '回复',
            jqObj: $('#modalReply'),
            width: '600'
        });
    }
}
grid.replyForm = function () {
    var id = $.getSelectId();
    if (id > 0) {
        $("#applyForm").submitForm({
            type: 'put',
            url: 'sys/feedback/' + id,
            data: $("#applyForm").toJson(),
            success: function (result) {
                $("#applyForm").resetForm();
                $.closeDialog($('#modalReply'));
                query();
            },
            error: function (resultErr) {
                $.errorMsg(resultErr.responseText);
            }
        });
    }
}

//删除工单
grid.deleteFeed = function () {
    var id = $.getSelectId();
    if (!id) {
        $.tips('请先选择一条记录', $(event.toElement), 1000);
    } else { 
        $.confirm('您确定要删除吗?', function () {
            $.delete({
                url: "sys/feedback/" + id,
                success: function () {
                    $.success('操作成功');  
                    query();
                },
                error: function (resultErr) {
                    $.errorMsg(resultErr.responseText);
                }
            });
        });
    }
};