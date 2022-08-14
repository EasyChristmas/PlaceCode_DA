//发送
grid.sendOrderDlg = function () {
    var id = $.getSelectId();
    if (!id) {
        $.tips("请选择订单", $(event.toElement), 2000);
        return;
    }
    var status = $.getSelectAttrValue("data-status");

    if (status === "1") {
        $.tips("订单已发货！", $(event.toElement), 2000);
        return;
    } else if (status === "-1") {
        $.tips("订单已驳回！", $(event.toElement), 2000);
        return;
    } else if (status === "0") {
        $.tips("订单待审核！", $(event.toElement), 2000);
        return;
    }
    else if (status === "10") {
        $.tips("订单已审核！", $(event.toElement), 2000);
        return;
    }

    $.openDialog({
        title: "发送订单",
        jqObj: $("#sendModel"),
        width: "450"
    });
    $("#mallOrderId").val(id);
    //加载快递公司
    $.get({
        url: "common/dataDic",
        data: { type: "kd" },
        success: function (rst) {
            var data = rst.data;
            $(data).each(function (index, item) {
                $("#expressCompany").append("<option value=" + item.name + ">" + item.name + "</option>");
            });
        },
        error: function (resultErr) {
            $.errorMsg(resultErr.responseText);
        }
    });
}

//发送
grid.send = function () {
    $("#sendFormDialog").submitForm({
        type: "post",
        url: "mall/order/send",
        success: function (result) {
            $("#sendFormDialog").resetForm();
            $.closeDialog($("#sendModel"));
            query();
        },
        error: function (resultErr) {
            $.tips(resultErr.responseText, '#sendOrder', 2000);
        }
    });
}

//打印
grid.print = function () {
    window.open("/Mall/OrderPrint?id=" + $("#mallOrderId").val() + "&math=" + Math.random());
};

//金币是否异常
grid.scoreIsEx = ko.observable(false);
//原金币
grid.userScore = ko.observable(0);
//现金币
grid.scoreLogTotal = ko.observable(0);
//审核
grid.review = function () {
    var id = $.getSelectId();
    if (!id) {
        $.tips("请选择订单", $(event.toElement), 2000);
    } else {
        var status = $.getSelectAttrValue("data-status");
        if (status === "0") {
            $.get({
                async: true,
                url: "mall/order/checkUserScore/" + id,
                success: function (result) {
                    //console.log(result);
                    grid.scoreIsEx(result.isEqual);
                    grid.userScore(result.userScore);
                    grid.scoreLogTotal(result.scoreLogTotal);
                    //console.log(grid.scoreIsEx());
                },
                error: function (resultErr) {
                    $.errorMsg(resultErr.responseText);
                }
            });
            $.openDialog({
                title: "审核订单",
                jqObj: $("#reviewModel"),
                width: "450"
            });
            $("#reviewModel").attr("data-id", id);
        } else if (status === "1") {
            $.tips("订单已发货！", $(event.toElement), 2000);
        } else if (status === "-1") {
            $.tips("订单已驳回！", $(event.toElement), 2000);
        } else if (status === "10") {
            $.tips("订单已审核！", $(event.toElement), 2000);
        }

    }
}

//审核通过
grid.agree = function () {
    $.put({
        async: true,
        url: "mall/order/updatestatus/" + $.getSelectId(),
        data: { status: 10 },
        success: function (result) {
            $.closeDialog($("#reviewModel"));
            query();
        },
        error: function (resultErr) {
            $.errorMsg(resultErr.responseText);
        }
    });
}
//审核驳回
grid.reject = function () {
    $.put({
        async: true,
        url: "mall/order/updatestatus/" + $.getSelectId(),
        data: { status: -1 },
        success: function (result) {
            $.closeDialog($("#reviewModel"));
            query();
        },
        error: function (resultErr) {
            $.errorMsg(resultErr.responseText);
        }
    });
}

//采购
grid.purchaseOrderDlg = function () {
    var id = $.getSelectId();
    if (!id) {
        $.tips("请选择订单", $(event.toElement), 2000);
        return;
    }
    var status = $.getSelectAttrValue("data-status");

    if (status === "1") {
        $.tips("订单已发货！", $(event.toElement), 2000);
        return;
    } else if (status === "-1") {
        $.tips("订单已驳回！", $(event.toElement), 2000);
        return;
    } else if (status === "0") {
        $.tips("订单待审核！", $(event.toElement), 2000);
        return;
    } else if (status === "20") {
        $.tips("商品已采购！", $(event.toElement), 2000);
        return;
    }

    $.openDialog({
        title: "采购商品",
        jqObj: $("#purchaseModel"),
        width: "450"
    });

    $("#purchaseId").val(id);
}
//采购
grid.purchase = function () {
    $("#purchaseFormDialog").submitForm({
        type: "post",
        url: "mall/order/purchase",
        success: function (result) {
            $("#purchaseFormDialog").resetForm();
            $.closeDialog($("#purchaseModel"));
            query();
        },
        error: function (resultErr) {
            $.tips(resultErr.responseText, '#purchaseOrder', 2000);
        }
    });
}

//打开会员详情
grid.openUserDetail = function (id) {
    $.openTab({
        url: "/user/edit?id=" + id,
        title: "用户详情 - " + id
    });
};