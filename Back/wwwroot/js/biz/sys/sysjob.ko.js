//显示提交工单
grid.showSysJob = function () {
    $.openDialog({
        title: "提交工单",
        jqObj: $("#modalAdd"),
        width: "990"
    }); 
};

//保存工单信息
grid.saveSysJob = function () {
    var content = $("#summernote").summernote("code");
    if ($.trim(content) === "") {
        $.tips("内容不能为空！", $("#submitJob"));
        return;
    }
    if ($("#addForm").validate()) {
        $("#addForm").submitForm({
            type: "post",
            url: "sys/sysJob",
            data: { content: content },
            success: function (result) {
                //编辑
                $.success("提交成功，待处理", 3000);
                $.closeDialog($("#modalAdd"));
                query(1);
            },
            error: function (resultErr) {
                $.errorMsg(resultErr.responseText);
            }
        });
    }
};
//ID
grid.id = ko.observable(null);
//显示提交工单
grid.showRejectSysJob = function (id) {
    grid.id(id);
    $.openDialog({
        title: "驳回工单",
        jqObj: $("#modalReject"),
        width: "600"
    });
};
//驳回工单信息
grid.saveRejectSysJob = function () {
    var id = grid.id();
    if ($("#rejectForm").validate()) {
        $("#rejectForm").submitForm({
            type: "put",
            url: "sys/sysJob",
            data: { id: id, status : -1 },
            success: function (result) {
                $.success("驳回成功", 2000);
                $.closeDialog($("#modalReject"));
                query(1);
            },
            error: function (resultErr) {
                $.errorMsg(resultErr.responseText);
            }
        });
    }
};

//审核通过工单信息
grid.auditSysJob = function (id) {
    $.confirm("您确定要审核通过吗？", function() {
        $.put({
            url: "sys/sysJob/" + id,
            data: { id: id, status: 20 },
            success: function (result) {
                $.success("审核成功", 2000);
                query(1);
            },
            error: function (resultErr) {
                $.errorMsg(resultErr.responseText);
            }
        });
    });
};

//打开工单记录
grid.openSysJobLog = function (id) {
    $.openTab({
        url: "/Sys/SysJobLog?id=" + id,
        title: "工单记录 - " + id
    });
};

