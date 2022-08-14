
//设备变更列表
grid.deviceChangeList = ko.observableArray([]);

grid.changeQueryMiningPool = function () {
    query();
};

grid.changeProduct = function () {
    var productId = $("#selProduct").val();
    if (productId) {
        //绑定设备
        $.Data.bindDevice({ selId: "selChangeDevice", data: { productId: productId }, isBindValue: true });

        //选择设备placeholder重绘
        $('#selChangeDevice').select2({
            placeholder: "-"
        });
    }
};

//分配矿池
grid.updateMiningPool = function (obj) {
    var userholdProductIds = $.getSelectId(true);
    if (userholdProductIds.length == 0) {
        $.tips('请选择要分配的矿机', $(obj));
        return;
    }

    $("#selAddToMiningPool").attr("validate", null);
    $("#selAddToMiningPool").val("").trigger("change");
    $("#selAddToMiningPool").attr("validate", "requried");

    $.get({
        url: "userHoldProduct/" + userholdProductIds[0],
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

//变更矿池
grid.changeMiningPool = function (obj) {
    var userholdProductIds = $.getSelectId(true);
    if (userholdProductIds.length == 0) {
        $.tips('请选择要变更的矿机', $(obj));
        return;
    }

    var dialog = $('#dialog_ChangePool');
    $.openDialog({
        title: '分配矿池',
        jqObj: dialog
    });

};

//变更设备
grid.changeDevice = function (obj) {
    var userholdProductIds = $.getSelectId(true);
    if (userholdProductIds.length == 0) {
        $.tips('请选择要变更的矿机', $(obj));
        return;
    }
    if (userholdProductIds.length != 1) {
        $.tips('一次只能变更一台矿机', $(obj));
        return;
    }

    var dialog = $('#dialog_ChangeDevice');
    $.openDialog({
        title: '变更设备',
        jqObj: dialog
    });

    $("#selChangeDevice").attr("validate", null);
    $("#selChangeDevice").val("").trigger("change");
    $("#selChangeDevice").attr("validate", "requried");
};

//变更收益时间
grid.changeTime = function (obj) {
    var userholdProductIds = $.getSelectId(true);
    if (userholdProductIds.length == 0) {
        $.tips('请选择要变更的矿机', $(obj));
        return;
    }

    var dialog = $('#dialog_ChangeTime');
    $.openDialog({
        title: '变更收益时间',
        jqObj: dialog
    });
};

//设备下架
grid.pull = function (obj) {
    var userHoldProductIds = $.getSelectId(true);
    if (userHoldProductIds.length == 0) {
        $.tips('请选择要下架的矿机', $(obj));
        return;
    }

    var msg = '您确定要下架吗?';
    $.confirm(msg, function () {
        $.post({
            url: 'userHoldProduct/pull',
            data: {
                userHoldProductIds: userHoldProductIds.join(",")
            },
            success: function () {
                query(1);
                $.success('操作成功');
            },
            error: function (resultErr) {
                $.errorMsg(resultErr.responseText);
            }
        });
    });
};

//设备删除
grid.deleteDevice = function (obj) {
    var userHoldProductIds = $.getSelectId(true);
    if (userHoldProductIds.length == 0) {
        $.tips('请选择要删除的矿机', $(obj));
        return;
    }

    var msg = '您确定要删除吗?';
    $.confirm(msg, function () {
        $.post({
            url: 'userHoldProduct/deleteDevice',
            data: {
                userHoldProductIds: userHoldProductIds.join(",")
            },
            success: function () {
                query(1);
                $.success('操作成功');
            },
            error: function (resultErr) {
                $.errorMsg(resultErr.responseText);
            }
        });
    });
};

//变更销售提成
grid.changeSaleCommission = function (obj) {
    var userholdProductIds = $.getSelectId(true);
    if (userholdProductIds.length == 0) {
        $.tips('请选择要变更的矿机', $(obj));
        return;
    }

    var dialog = $('#dialog_ChangeSaleCommission');
    $.openDialog({
        title: '变更销售提成',
        jqObj: dialog
    });
};

//添加到矿池
grid.addToMiningPool = function (obj) {
    if ($("#updatePoolForm").validate()) {
        var userHoldProductIds = $.getSelectId(true);
        var deviceCodes = $("#selDevice").val();
        if (deviceCodes)
            deviceCodes = deviceCodes.join(",");
        var poolId = $("#selAddToMiningPool").val();
        var msg = '您确定要将这订单添加到矿池吗?';
        $.confirm(msg, function () {
            $.post({
                url: 'userHoldProduct/modifyMiningPool',
                data: {
                    userHoldProductIds: userHoldProductIds.join(","),
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

//保存变更矿池
grid.saveChangeMiningPool = function (obj) {
    if ($("#changePoolForm").validate()) {
        var userHoldProductIds = $.getSelectId(true);
        var data = $("#changePoolForm").toJson();
        data.userHoldProductIds = userHoldProductIds.join(",");

        var msg = '您确定要变更矿池吗?';
        $.confirm(msg, function () {
            $.post({
                url: 'userHoldProduct/changeMiningPool',
                data: data,
                success: function () {
                    query(1);
                    //关闭弹框
                    $.closeDialog($('#dialog_ChangePool'));
                    $.success('操作成功');
                },
                error: function (resultErr) {
                    $.errorMsg(resultErr.responseText);
                }
            });
        });
    }
};

//保存变更设备
grid.saveChangeDevice = function (obj) {
    if ($("#changeDeviceForm").validate()) {
        var userHoldProductId = $.getSelectId();
        var data = $("#changeDeviceForm").toJson();
        data.targetId = userHoldProductId;
        data.type = 1;

        var msg = '您确定要变更设备吗?';
        $.confirm(msg, function () {
            $.post({
                url: 'product/deviceChange',
                data: data,
                success: function () {
                    query(1);
                    //关闭弹框
                    $.closeDialog($('#dialog_ChangeDevice'));
                    $.success('操作成功');
                },
                error: function (resultErr) {
                    $.errorMsg(resultErr.responseText);
                }
            });
        });
    }
};

//保存变更收益时间
grid.saveChangeTime = function (obj) {
    if ($("#changeTimeForm").validate()) {
        var userHoldProductIds = $.getSelectId(true);
        var data = $("#changeTimeForm").toJson();
        data.userHoldProductIds = userHoldProductIds.join(",");

        var msg = '您确定要变更收益时间吗?';
        $.confirm(msg, function () {
            $.post({
                url: 'userHoldProduct/changeTime',
                data: data,
                success: function () {
                    query(1);
                    //关闭弹框
                    $.closeDialog($('#dialog_ChangeTime'));
                    $.success('操作成功');
                },
                error: function (resultErr) {
                    $.errorMsg(resultErr.responseText);
                }
            });
        });
    }
};

//保存销售提成
grid.saveSaleCommission = function (obj) {
    if ($("#changeSaleCommissionForm").validate()) {
        var data = $("#changeSaleCommissionForm").toJson();
        var userHoldProductIds = $.getSelectId(true);
        data.userHoldProductIds = userHoldProductIds.join(",");
        $.post({
            url: 'userHoldProduct/changeSaleCommission',
            data: data,
            success: function () {
                query(1);
                //关闭弹框
                $.closeDialog($('#dialog_ChangeSaleCommission'));
                $.success('操作成功');
            },
            error: function (resultErr) {
                $.errorMsg(resultErr.responseText);
            }
        });
    }
};

//查看变更记录
grid.showDeviceChange = function (data) {
    grid.deviceChangeList([]);
    $.openDialog({
        title: '变更记录',
        jqObj: $('#deviceChangeList'),
        width: '1000'
    });

    if (data.id()) {
        //获取设备变更记录列表
        $.get({
            url: 'product/deviceChange',
            data: {
                targetId: data.id()
            },
            success: function (result) {
                $(result.data).each(function (index, item) {
                    grid.deviceChangeList.push(item);
                });
            }
        });
    }
};

//持有列表页视图控制模型
function HoldProductViewModel() {

    var self = this;

    //列表数据
    self.data = ko.observableArray([]);

    self.init = function () {

        $.Data.bindMiningPool({
            selId: "selMiningPool"
        });

        $.Data.bindMiningPool({
            selId: "selChangeToMiningPool"
        });

        $.Data.bindMiningPool({
            selId: "selAddToMiningPool"
        });

        $.Data.bindProduct({
            selId: "selProduct"
        });

        //更改开始时间结束时间自动加上
        $("#startTime").change(function () {
            var startTime = $(this).val();
            var end = new Date(startTime);
            end.setFullYear(end.getFullYear() + 3);
            end.setDate(end.getDate() - 1);
            $("#endTime").val(end.Format("yyyy-MM-dd"));
        });
    }
}