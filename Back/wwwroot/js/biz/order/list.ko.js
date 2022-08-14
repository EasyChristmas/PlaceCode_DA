
//重新加载报单
grid.reloadOrder = function () {
    query();
}

//全选
grid.selectAll = function (obj) {
    $(obj).children("i").toggleClass("icon-check").toggleClass("icon-check-empty");
    if ($(obj).children("i").hasClass("icon-check")) {
        $("#PagerGird tr:not(.none_select)").each(function (index, item) {
            $(item).data("isSelect", true);
            $(item).attr("style", "background-color: rgb(253, 235, 133);");
        });
    } else {
        $("#PagerGird tr:not(.none_select)").each(function (index, item) {
            $(item).data("isSelect", false);
            $(item).attr("style", "background-color: rgb(255, 255, 255);");
        })
    }
};

//分配矿池
grid.updateMiningPool = function (obj) {
    var orderId = $.getSelectId();
    if (!orderId) {
        $.tips('请选择订单', $(obj));
        return;
    }

    $("#selAddToMiningPool").attr("validate", null);
    $("#selAddToMiningPool").val("").trigger("change");
    $("#selAddToMiningPool").attr("validate", "requried");

    $.get({
        url: "trade/order/" + orderId,
        success: function (result) {
            var dialog = $('#dialog_UpdatePool');
            $.openDialog({
                title: '分配矿池',
                jqObj: dialog
            });

            //表示物理机
            if (result.data.productType == 1) {
                //绑定设备
                $.Data.bindDevice({ selId: "selDevice", data: { productId: result.data.productId, status: 0 } });

                //选择设备placeholder重绘
                $('#selDevice').select2({
                    placeholder: "请选择设备"
                });
                $("#divDevice").show();
            }
            else {
                $("#divDevice").hide();
            }
        },
        error: function (resultErr) {
            $.errorMsg(resultErr.responseText);
        }
    });

};

//添加到矿池
grid.addToMiningPool = function (obj) {
    if ($("#updatePoolForm").validate()) {
        var orderIds = $.getSelectId(true);
        var deviceCodes = $("#selDevice").val();
        if (deviceCodes)
            deviceCodes = deviceCodes.join(",");
        var poolId = $("#selAddToMiningPool").val();
        var msg = '您确定要将这订单添加到矿池吗?';
        $.confirm(msg, function () {
            $.post({
                url: 'trade/holdProduct/modifyMiningPool',
                data: {
                    orderIds: orderIds.join(","),
                    poolId: poolId,
                    deviceCodes: deviceCodes,
                },
                success: function () {
                    query(1);
                    //关闭弹框
                    $.closeDialog($('#dialog_UpdatePool'));
                    $.success('操作成功');
                },
                error: function (resultErr) {
                    $.errorMsg(resultErr.responseText);
                }
            });
        });
    }
};
