
grid.changeMiningPool = function () {
    query();
};

grid.changeMiningPoolIncome = function () {
    var poolId = $("#selAddMiningPool").val();
    $.get({
        url: "miningPool/" + poolId,
        success: function (result) {
            $("#miningPoolIncomeForm").loadForm({ poolPower: result.poolPower });
        },
        error: function (resultErr) {
            $.errorMsg(resultErr.responseText);
        }
    });
};

function MiningPoolIncomeViewModel() {

    var self = this;

    self.init = function () {
        $.Data.bindMiningPool({
            selId: "selMiningPool"
        });

        $.Data.bindMiningPool({
            selId: "selAddMiningPool"
        });

        $("#add").click(function () {
            self.add();
        });

        $("#approve").click(function () {
            if (!$.getSelectId()) {
                $.tips("请先选择矿池收益", $(this), 1000);
                return;
            }
            self.approve();
        });

        $("#review").click(function () {
            if (!$.getSelectId()) {
                $.tips("请先选择矿池收益", $(this), 1000);
                return;
            }
            self.review();
        });

        $("#empty").click(function () {
            if (!$.getSelectId()) {
                $.tips("请先选择矿池收益", $(this), 1000);
                return;
            }
            self.empty();
        });

        $("#reject").click(function () {
            if (!$.getSelectId()) {
                $.tips("请先选择矿池收益", $(this), 1000);
                return;
            }
            self.openReject();
        });

        $("#btnRejectMiningPoolIncome").click(function () {
            self.reject();
        });

        $("#btnAddMiningPoolIncome").click(function () {
            self.save();
        });
    }

    //新增
    self.add = function () {
        var dialog = $('#dialog_MiningPoolIncome');
        $.openDialog({
            title: '添加矿池收益',
            jqObj: dialog
        });
    }

    //通过
    self.approve = function () {
        $.confirm('您确定要通过吗?', function () {
            $.post({
                url: "miningPoolIncome/approve",
                data: {
                    poolIncomeId: $.getSelectId()
                },
                success: function () {
                    $.success('操作成功');
                    query();
                },
                error: function (resultErr) {
                    if (swal)
                        swal.close();
                    $.tips(resultErr.responseText, $("#approve"), 2000);
                }
            });
        });
    }

    //重新计算收益
    self.review = function () {
        $.confirm('您确定要重新计算收益吗?', function () {
            $.post({
                url: "miningPoolIncome/review",
                data: {
                    id: $.getSelectId()
                },
                success: function () {
                    $.success('操作成功');
                    query();
                },
                error: function (resultErr) {
                    if (swal)
                        swal.close();
                    $.tips(resultErr.responseText, $("#review"), 2000);
                }
            });
        });
    }

    //清空收益
    self.empty = function () {
        $.confirm('您确定要清空收益吗?', function () {
            $.post({
                url: "miningPoolIncome/empty",
                data: {
                    id: $.getSelectId()
                },
                success: function () {
                    $.success('操作成功');
                    query();
                },
                error: function (resultErr) {
                    if (swal)
                        swal.close();
                    $.tips(resultErr.responseText, $("#empty"), 2000);
                }
            });
        });
    }

    //打开驳回界面
    self.openReject = function () {
        var dialog = $('#dialog_MiningPoolIncomeReject');
        $.openDialog({
            title: '驳回',
            jqObj: dialog
        });
    }

    //驳回
    self.reject = function () {
        var data = $("#miningPoolIncomeRejectForm").toJson();
        data.poolIncomeId = $.getSelectId();
        if ($("#miningPoolIncomeRejectForm").validate()) {
            $.post({
                url: "miningPoolIncome/reject",
                data: data,
                success: function () {
                    //关闭弹框
                    $.closeDialog($('#dialog_MiningPoolIncomeReject'));
                    $.success('操作成功');
                    query();
                },
                error: function (resultErr) {
                    $.tips(resultErr.responseText, $("#btnRejectMiningPoolIncome"), 2000);
                }
            });
        }
    }

    //保存
    self.save = function () {
        var dialog = $('#dialog_MiningPoolIncome');
        var data = $("#miningPoolIncomeForm").toJson();
        var eventIndexList = [];
        $("#tagList").children(".video_tag").each(function (index, item) {
            eventIndexList.push($(item).text());
        });
        data.eventIndexs = eventIndexList.join("，");
        if ($("#miningPoolIncomeForm").validate()) {
            $.post({
                url: "miningPoolIncome",
                data: data,
                success: function () {
                    //关闭弹框
                    $.closeDialog($('#dialog_MiningPoolIncome'));
                    $.success('操作成功');
                    query();
                },
                error: function (resultErr) {
                    $.tips(resultErr.responseText, $("#btnAddMiningPoolIncome", dialog), 2000);
                }
            });
        }
    }
}
