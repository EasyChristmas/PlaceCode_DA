
grid.changeMiningPool = function () {
    query();
};

//设备列表页视图控制模型
function deviceViewModel() {

    var self = this;

    //列表数据
    self.data = ko.observableArray([]);

    self.init = function () {

        //$.Data.bindMiningPool({
        //    selId: "selMiningPool"
        //});

        $.Data.bindProduct({
            selId: "selProduct"
        });

        $.Data.bindSupplier({
            selId: "selSupplier"
        });

        $.Data.bindBoardMachine({
            selId: "selBoardMachine"
        });


        $("#addDevice").click(function () {
            self.addDevice();
        });

        $("#updateDevice").click(function () {
            if (!$.getSelectId()) {
                $.tips("请先选择设备", $(this), 1000);
                return;
            }

            $.get({
                url: "product/Device/" + $.getSelectId(),
                success: function (result) {
                    var dialog = $('#dialog_UpdateDevice');
                    $.openDialog({
                        title: '修改设备信息',
                        jqObj: dialog
                    });

                    $("#updateDeviceForm").loadForm(result);
                },
                error: function (resultErr) {
                    $.errorMsg(resultErr.responseText);
                }
            });
        });

        $("#btnSaveDevice").click(function () {
            self.saveDevice();
        });

        $("#btnUpdateDevice").click(function () {
            self.updateDevice();
        });
    }

    //设备入库
    self.addDevice = function () {
        var dialog = $('#dialog_AddDevice');
        $.openDialog({
            title: '设备入库',
            jqObj: dialog
        });

        $("#tagList").html("");
    }

    //设备入库
    self.updateDevice = function () {
        if ($("#updateDeviceForm").validate()) {
            var passWord = md5($("input[name='passWord']").val());
            $("#updateDeviceForm").submitForm({
                type: 'put',
                url: "product/device",
                data: {
                    passWord: passWord
                },
                beforeSend: function () {
                    $("#btnUpdateDevice").attr("disabled", true);
                },
                success: function (result) {
                    $("#btnUpdateDevice").removeAttr("disabled");
                    $.closeDialog($('#dialog_UpdateDevice'));
                    $.success('操作成功');
                    query(1);
                },
                error: function (resultErr) {
                    $("#btnUpdateDevice").removeAttr("disabled");
                    $.errorMsg(resultErr.responseText);
                }
            });
        }
    }

    //添加设备
    self.saveDevice = function () {
        if ($("#addDeviceForm").validate()) {
            var codeList = [];
            $("#tagList").children(".video_tag").each(function (index, item) {
                codeList.push($(item).text());
            });

            $("#addDeviceForm").submitForm({
                type: 'post',
                url: "product/device",
                data: {
                    codeList: codeList
                },
                beforeSend: function () {
                    $("#btnSaveDevice").attr("disabled", true);
                },
                success: function (result) {
                    $("#btnSaveDevice").removeAttr("disabled");
                    $.closeDialog($('#dialog_AddDevice'));
                    $.success('操作成功');
                    query(1);
                },
                error: function (resultErr) {
                    $("#btnSaveDevice").removeAttr("disabled");
                    $.errorMsg(resultErr.responseText);
                }
            });
        }
    }

    //查看设备
    self.show = function (data) {
        $.get({
            url: "product/Device/" + data,
            success: function (result) {
                var dialog = $('#dialog_Device');
                $.openDialog({
                    title: '设备信息',
                    jqObj: dialog
                });

                $("#deviceForm").loadForm(result);
            },
            error: function (resultErr) {
                $.errorMsg(resultErr.responseText);
            }
        });
    }

    //查看跳板机
    self.showBoardMachine = function (data) {
        $.get({
            url: "product/BoardMachine/" + data,
            success: function (result) {
                var dialog = $('#dialog_BoardMachine');
                $.openDialog({
                    title: '跳板机信息',
                    jqObj: dialog
                });

                $("#boardMachineForm").find("span[id='password']").text(result.password);
                $("#boardMachineForm").loadForm(result);
            },
            error: function (resultErr) {
                $.errorMsg(resultErr.responseText);
            }
        });
    }

    //复制
    self.copyText = function (ele) {
        var data = $("#boardMachineForm").toJson();
        $.get({
            url: "product/boardMachine/getPassword/" + data.id,
            success: function (result) {
                $.closeDialog($('#dialog_BoardMachine'));
                $.copyText(result);
                $.tips("复制成功", $(ele));
            },
            error: function (resultErr) {
                $.errorMsg(resultErr.responseText);
            }
        });
        console.log(data);
    }

    //删除设备
    self.delete = function (data) {
        $.confirm("您确定要删除该设备吗？", function () {
            $.delete({
                url: "product/device/" + data.id(),
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
}