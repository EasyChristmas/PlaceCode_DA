grid.downloadExcel = function () {
    window.location.href = "/ExcelTemplet/Crust账户导入模版.xlsx";
};

//导入
grid.importAccount = function () {
    $.openDialog({
        title: 'Crust账户导入',
        jqObj: $('#import')
    });
};

//开始导入
grid.startImport = function () {
    var filePath = $("#importForm").find("img").parent().attr("href");
    if (!filePath) {
        $.tips("请先选择导入文件", $("#btnAdd"), 1500);
        return;
    }

    $("#btnAdd").attr("disabled", "disabled");
    $("#btnAdd").html('<i class="icon-spinner icon-spin mr10"></i>导入中...');
    $("#progressTab").html("").hide();
    //清空进度
    setProgressValue(0, 0);
    progressInterval = self.setInterval("queryProgress()", 3000);
    $.post({
        url: "crust/accountImport/import",
        data: {
            url: $("#importForm").find("input[name='url']").val(),
            isCustomer: $("input[name=isCustomer]").val()
            //fileName: fileName.val()
        },
        success: function (res) {
            setProgressValue(100, 100);
            $("#btnAdd").removeAttr("disabled");
            $("#btnAdd").html('导入');
            var msgFormat = "导入结束，本次导入成功:<span class='colgreen'> " + res.data.successCount + " </span>条<br/>" +
                //"手机格式错误:<span class='colred'> " + res.data.formatErrorCount + " </span>条<br/>" +
                "已存在被忽略:<span class='colblue'> " + res.data.existingCount + " </span>条<br/>" +
                "导入出现异常:<span class='colred'> " + res.data.errorCount + " </span>条<br/>";
            //导入记录查询:<a href='/user/UserExportDetail?UserExportId=" + res.data.userExportId + "'>导入记录查询</a> <br/>
            $("#progressTab").html(msgFormat + "（重新选择文件点击导入可以继续进行导入操作）").show();
            self.clearInterval(progressInterval);
            query(1);
        },
        error: function (resultErr) {
            $("#btnAdd").html("导入");
            $("#btnAdd").removeAttr("disabled");
            $(".icon-remove").parent().click();
            $.errorMsg(resultErr.responseText, 5000);
            setProgressValue(100, 100);
            self.clearInterval(progressInterval);
        }
    });
};

////设备入库
//grid.addDevice = function () {
//    var dialog = $('#dialog_AddDevice');
//    $.openDialog({
//        title: '设备入库',
//        jqObj: dialog
//    });

//    $("#tagList").html("");
//}

////设备入库
//grid.updateDevice = function () {
//    if ($("#updateDeviceForm").validate()) {
//        var passWord = md5($("input[name='passWord']").val());
//        $("#updateDeviceForm").submitForm({
//            type: 'put',
//            url: "product/device",
//            data: {
//                passWord: passWord
//            },
//            beforeSend: function () {
//                $("#btnUpdateDevice").attr("disabled", true);
//            },
//            success: function (result) {
//                $("#btnUpdateDevice").removeAttr("disabled");
//                $.closeDialog($('#dialog_UpdateDevice'));
//                $.success('操作成功');
//                query(1);
//            },
//            error: function (resultErr) {
//                $("#btnUpdateDevice").removeAttr("disabled");
//                $.errorMsg(resultErr.responseText);
//            }
//        });
//    }
//}

////添加设备
//grid.saveDevice = function () {
//    if ($("#addDeviceForm").validate()) {
//        var codeList = [];
//        $("#tagList").children(".video_tag").each(function (index, item) {
//            codeList.push($(item).text());
//        });

//        $("#addDeviceForm").submitForm({
//            type: 'post',
//            url: "product/device",
//            data: {
//                codeList: codeList
//            },
//            beforeSend: function () {
//                $("#btnSaveDevice").attr("disabled", true);
//            },
//            success: function (result) {
//                $("#btnSaveDevice").removeAttr("disabled");
//                $.closeDialog($('#dialog_AddDevice'));
//                $.success('操作成功');
//                query(1);
//            },
//            error: function (resultErr) {
//                $("#btnSaveDevice").removeAttr("disabled");
//                $.errorMsg(resultErr.responseText);
//            }
//        });
//    }
//}

////查看设备
//grid.show = function (data) {
//    $.get({
//        url: "product/Device/" + data,
//        success: function (result) {
//            var dialog = $('#dialog_Device');
//            $.openDialog({
//                title: '设备信息',
//                jqObj: dialog
//            });

//            $("#deviceForm").loadForm(result);
//        },
//        error: function (resultErr) {
//            $.errorMsg(resultErr.responseText);
//        }
//    });
//}

////查看跳板机
//grid.showBoardMachine = function (data) {
//    $.get({
//        url: "product/BoardMachine/" + data,
//        success: function (result) {
//            var dialog = $('#dialog_BoardMachine');
//            $.openDialog({
//                title: '跳板机信息',
//                jqObj: dialog
//            });

//            $("#boardMachineForm").find("span[id='password']").text(result.password);
//            $("#boardMachineForm").loadForm(result);
//        },
//        error: function (resultErr) {
//            $.errorMsg(resultErr.responseText);
//        }
//    });
//}

////复制
//grid.copyText = function (ele) {
//    var data = $("#boardMachineForm").toJson();
//    $.get({
//        url: "product/boardMachine/getPassword/" + data.id,
//        success: function (result) {
//            $.closeDialog($('#dialog_BoardMachine'));
//            $.copyText(result);
//            $.tips("复制成功", $(ele));
//        },
//        error: function (resultErr) {
//            $.errorMsg(resultErr.responseText);
//        }
//    });
//    console.log(data);
//}

////删除设备
//grid.delete = function (data) {
//    $.confirm("您确定要删除该设备吗？", function () {
//        $.delete({
//            url: "product/device/" + data.id(),
//            success: function () {
//                $.success('操作成功');
//                query();
//            },
//            error: function (resultErr) {
//                $.errorMsg(resultErr.responseText);
//            }
//        });
//    });
//}
