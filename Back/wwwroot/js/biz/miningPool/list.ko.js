


function MiningPoolViewModel() {

    var self = this;

    self.init = function () {

        $.Data.bindCoin({
            selId: "selCoin"
        });

        $.Data.bindProject({
            selId: "selQueryProject"
        });

        $.Data.bindProject({
            selId: "selProject"
        });

        $("#add").click(function () {
            self.add();
        });

        $("#delete").click(function () {
            if (!$.getSelectId()) {
                $.tips("请先选择矿池", $(this), 1000);
                return;
            }

            self.delete();
        });

        $("#calculate").click(function () {
            if (!$.getSelectId()) {
                $.tips("请先选择要计算的矿池", $(this), 1000);
                return;
            }
            self.calculate();
        });

        $("#btnAddMiningPool").click(function () {
            self.save();
        });

        $("#btnUpdateMiningPool").click(function () {
            self.update();
        });
    }

    //删除
    self.delete = function (data) {
        $.confirm('您确定要删除吗?', function () {
            $.delete({
                url: "miningPool/" + data.id,
                success: function () {
                    $.success('操作成功');
                    query();
                }
            });
        });
    }

    //下架
    self.offline = function (data) {
        $.confirm('您确定要下架吗?', function () {
            $.post({
                url: "miningPool/offline",
                data: {
                    poolId: data.id
                },
                success: function () {
                    $.success('操作成功');
                    query();
                }
            });
        });
    }

    //重新计算矿池收益
    self.calculate = function () {
        $.confirm('您确定要重新计算矿池收益吗?', function () {
            swal.close();
            //loading效果
            layer.load(1, { shade: [0.5, '#fff'] });
            $.post({
                url: "miningPoolIncome/calculate",
                data: {
                    poolId: $.getSelectId()
                },
                success: function (result) {
                    $.success('操作成功');
                    query();
                },
                complete: function () {
                    //关闭loading效果   
                    layer.closeAll('loading');
                },
                error: function (resultErr) {
                    $.errorMsg(resultErr.responseText, 2500);
                }
            });
        });
    }

    //新增
    self.add = function () {
        var dialog = $('#dialog_MiningPool');
        $.openDialog({
            title: '添加矿池',
            jqObj: dialog
        });
    }

    //编辑
    self.edit = function (data) {
        $.get({
            url: "miningPool/" + data.id,
            success: function (result) {
                var dialog = $('#dialog_UpdateMiningPool');
                $.openDialog({
                    title: '编辑矿池',
                    jqObj: dialog
                });

                $("#updateMiningPoolForm").loadForm(result);
            },
            error: function (resultErr) {
                $.errorMsg(resultErr.responseText);
            }
        });
    }

    //保存
    self.save = function () {
        var dialog = $('#dialog_MiningPool');
        var data = $("#miningPoolForm").toJson();
        if ($("#miningPoolForm").validate()) {
            $.post({
                url: "miningPool",
                data: data,
                success: function () {
                    //关闭弹框
                    $.closeDialog($('#dialog_MiningPool'));
                    $.success('操作成功');
                    query();
                },
                error: function (resultErr) {
                    $.tips(resultErr.responseText, $("#btnAddMiningPool", dialog), 2000);
                }
            });
        }
    }

    //更新
    self.update = function () {
        var data = $("#updateMiningPoolForm").toJson();
        if ($("#updateMiningPoolForm").validate()) {
            $.put({
                url: "miningPool/"+data.id,
                data: data,
                success: function () {
                    //关闭弹框
                    $.closeDialog($('#dialog_UpdateMiningPool'));
                    $.success('操作成功');
                    query();
                },
                error: function (resultErr) {
                    $.tips(resultErr.responseText, $("#btnUpdateMiningPool"), 2000);
                }
            });
        }
    }
}