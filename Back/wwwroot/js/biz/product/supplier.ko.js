
//设备列表页视图控制模型
function SupplierViewModel() {

    var self = this;

    //列表数据
    self.data = ko.observableArray([]);

    self.init = function () {

        $("#addSupplier").click(function () {
            self.addSupplier();
        });

        $("#updateSupplier").click(function () {
            if (!$.getSelectId()) {
                $.tips("请先选择供应商", $(this), 1000);
                return;
            }

            $.get({
                url: "product/supplier/" + $.getSelectId(),
                success: function (result) {
                    var dialog = $('#dialog_UpdateSupplier');
                    $.openDialog({
                        title: '修改供应商信息',
                        jqObj: dialog
                    });

                    $("#updateSupplierForm").loadForm(result);
                },
                error: function (resultErr) {
                    $.errorMsg(resultErr.responseText);
                }
            });
        });

        $("#btnSaveSupplier").click(function () {
            self.saveSupplier();
        });

        $("#btnUpdateSupplier").click(function () {
            self.updateSupplier();
        });
    }

    //添加
    self.addSupplier = function () {
        var dialog = $('#dialog_AddSupplier');
        $.openDialog({
            title: '添加供应商',
            jqObj: dialog
        });
    }

    //修改
    self.updateSupplier = function () {
        if ($("#updateSupplierForm").validate()) {
            $("#updateSupplierForm").submitForm({
                type: 'put',
                url: "product/supplier",
                beforeSend: function () {
                    $("#btnUpdateSupplier").attr("disabled", true);
                },
                success: function (result) {
                    $("#btnUpdateSupplier").removeAttr("disabled");
                    $.closeDialog($('#dialog_UpdateSupplier'));
                    $.success('操作成功');
                    query(1);
                },
                error: function (resultErr) {
                    $("#btnUpdateSupplier").removeAttr("disabled");
                    $.errorMsg(resultErr.responseText);
                }
            });
        }
    }

    //保存
    self.saveSupplier = function () {
        if ($("#addSupplierForm").validate()) {
            $("#addSupplierForm").submitForm({
                type: 'post',
                url: "product/supplier",
                beforeSend: function () {
                    $("#btnSaveSupplier").attr("disabled", true);
                },
                success: function (result) {
                    $("#btnSaveSupplier").removeAttr("disabled");
                    $.closeDialog($('#dialog_AddSupplier'));
                    $.success('操作成功');
                    query(1);
                },
                error: function (resultErr) {
                    $("#btnSaveSupplier").removeAttr("disabled");
                    $.errorMsg(resultErr.responseText);
                }
            });
        }
    }
}