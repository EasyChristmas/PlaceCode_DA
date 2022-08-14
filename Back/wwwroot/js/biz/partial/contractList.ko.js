
var ViewModel = function () {
    var self = this;
    self.total = ko.observable(0);
    self.pageIndex = ko.observable(1);
    self.pageSize = ko.observable(30);
    self.size = ko.dependentObservable(function () {
        return parseInt((self.total() + self.pageSize() - 1) / self.pageSize());
    });


    self.contractListData = ko.observableArray([]);
    //发行机构加载数据
    self.loadContractList = function (obj) {
        var param = {};
        var productId = $("#productId").val();
        self.pageIndex(obj.pageIndex || 1);
        if (self.pageIndex() == 1 || self.pageIndex() <= self.size()) {

            param.productId = productId;
            param.pageIndex = self.pageIndex();
            param.pageSize = self.pageSize();
            param.code = $("#code").val();
            param.adminId = $("#adminId").val();
            param.statusList = "";
            param.orderId = $("#orderId").val();
            $("#statusDiv").children("a.btn-orange").each(function (index, item) {
                param.statusList += ($(item).attr("data-val") + ",");
            });
            if (param.statusList.indexOf(",") >= 0)
                param.statusList = param.statusList.substring(0, param.statusList.length - 1);

            $.get({
                url: 'trade/contract/getlistbyproduct',
                data: param,
                success: function (result) {
                    if (self.pageIndex() == 1) {
                        self.contractListData(result.data);
                    }
                    else {
                        $(result.data).each(function (index, item) {
                            self.contractListData.push(item);
                        });
                    }
                    self.total(result.totalCount);

                    //成功的回调方法
                    if ("function" == typeof callback) {
                        callback(result);
                    }

                    //排除第一页数据加载数据行样式
                    if (self.pageIndex() != 1)
                        $.renderDataRow("#list li:gt(" + ((self.pageIndex() - 1) * self.pageSize() - 1) + ")");
                }
            });
        } else {
            $("#list").append("<p class='no_data'>亲，没有更多数据了</p>");
            setTimeout(function () {
                $("#list .no_data").fadeOut();
            }, 1000)
        }
    };

    //回收合同
    self.recover = function () {
        var param = {};
        if ($("#isToChannel").val() == "true") {
            param = { status:35};
        }
        $("#recoverForm").submitForm({
            type: 'post',
            url: 'Trade/Contract/UpdateStatus',
            data: param,
            success: function (result) {
                $.closeDialog($("#recover"));
                self.loadContractList({ pageIndex: 1 });
            },
            error: function (resultErr) {
                $.errorMsg(resultErr.responseText);
            }
        });
    };

    //批量发回上游
    self.multiSend = function () {
        var list = [];
        $("#list ul li.active").each(function (index, item) {
            list.push($(item).attr("data-id"));
        });
        $("#multiSendForm").submitForm({
            type: 'post',
            url: 'Trade/Contract/multiSend',
            data: { ids: list },
            success: function (result) {
                $.closeDialog($("#multiSend"));
                self.loadContractList({ pageIndex: 1 });
                $("#selectAll").children("i").removeClass("icon-check").addClass("icon-check-empty");
            },
            error: function (resultErr) {
                $.errorMsg(resultErr.responseText);
            }
        });
    };

    //批量快递下单
    self.multiExpressOrder = function () {
        $("#btnMultiExpressOrder").attr("disabled", "disabled").html("下单中……");
        var ids = [];
        $("#list ul li.active").each(function (index, item) {
            var status = $(item).attr("data-status");
            if (status === "15") {
                ids.push(parseInt($(item).attr("data-id")));
            }
        });
        if (ids.length == 0) {
            $.tips("请选择可快递下单的合同", $("#btnMultiExpressOrder"));
            $("#btnMultiExpressOrder").removeAttr("disabled").html("发送");
            return;
        }
        $("#multiExpressOrderForm").submitForm({
            type: "post",
            url: "Trade/Contract/multiExpressOrder",
            data: { ids: ids },
            success: function (result) {
                self.loadContractList({ pageIndex: 1 });
                $.closeDialog($("#multiExpressOrder"));
                $("#selectAll").children("i").removeClass("icon-check").addClass("icon-check-empty");
                $("#btnMultiExpressOrder").removeAttr("disabled").html("发送");
            },
            error: function (resultErr) {
                $("#btnMultiExpressOrder").removeAttr("disabled").html("发送");
                $.errorMsg(resultErr.responseText, 5000);
            }
        });
    };

    //切换平台
    self.updateProject = function () {
        if ($("#list ul li.active").length != 1) {
            $.tips("请选择一个合同！", $("#project"),1000);
            $("#project").val("");
            return;
        }
        var obj = $("#list ul li.active");
        var status = $(obj).attr("data-status");
        if (status != 10) {
            $.tips("请选择可用状态的合同！", $("#project"),1000);
            $("#project").val("");
            return;
        }
        var id = $(obj).attr("data-id");
        var project = $("#project").val();
        if (project) {
            $.put({
                url: 'trade/contract/updateProject/' + id,
                data: { project: project },
                success: function (result) {
                    self.loadContractList({ pageIndex: 1 });
                    //for (i = 0; i < self.contractListData().length; i++) {
                    //    if (self.contractListData()[i].id == id) {
                    //        self.contractListData()[i].project=project;

                    //    }
                    //}
                },
                error: function (resultErr) {
                    $.error(resultErr.responseText);
                }
            });
        }
        $("#project").val("");
    };
};