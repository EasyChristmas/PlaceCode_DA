//选择的订单状态
grid.selectedStatus = ko.observable();

//查看交易详情
grid.openDetail = function (item) {
    $.openTab({
        url: "/trade/detail?id=" + $(window.frameElement).attr("data-id") + "&id=" + item.id,
        title: "交易详情 - " + item.id
    });
};

//通过
grid.approve = function (data) {
    $.confirm('您确定要通过吗?', function () {
        $.post({
            url: "trade/approve",
            async: false,
            data: {
                tradeId: data.id
            },
            success: function () {
                $.success('操作成功');
                query();
            },
            error: function (resultErr) {
                if (swal)
                    swal.close();
                $.errorMsg(resultErr.responseText, 2500);
            }
        });
    });
}

//打开驳回界面
grid.openReject = function (data) {
    var dialog = $('#dialog_TradeReject');
    $.openDialog({
        title: '驳回',
        jqObj: dialog
    });
    $("#tradeRejectForm").loadForm({ tradeId: data.id });
}

//驳回
grid.reject = function () {
    var data = $("#tradeRejectForm").toJson();
    if ($("#tradeRejectForm").validate()) {
        $.post({
            url: "trade/reject",
            data: data,
            success: function () {
                //关闭弹框
                $.closeDialog($('#dialog_TradeReject'));
                $.success('操作成功');
                query();
            },
            error: function (resultErr) {
                $.tips(resultErr.responseText, $("#btnReject"), 2000);
            }
        });
    }
}

//批量操作
grid.batchProc = function () {
    if ($.getSelectId(true).length < 1) {
        $.tips("请选择数据", $(event.toElement), 2000);
        return;
    }
    $.confirm("确定要批量通过吗？", function () {
        swal.close();
        //loading效果
        layer.load(1, { shade: [0.5, '#fff'] });
        $.post({
            url: "trade/batchproc",
            async: false,
            data: {
                tradeIds: $.getSelectId(true)
            },
            success: function () {
                $.success('操作成功');
                query();
            },
            complete: function () {
                //关闭loading效果   
                layer.closeAll('loading');
            },
            error: function (resultErr) {
                $.tips(resultErr.responseText, $("#batchProc"), 2500);
            }
        });
    });
};


//复制
grid.copyText = function (text) {
    //$("#copyText").val(text);
    //if (text) {
    //    var ele = document.getElementById("copyText");
    //    ele.select(); // 选择对象
    //    document.execCommand("Copy"); // 执行浏览器复制命令
    //    $.success("已复制好，可贴粘。", 1000);
    //}
}
