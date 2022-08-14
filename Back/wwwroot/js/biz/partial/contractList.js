var kdData = [];
$(function () {
    //绑定服务经理
    $.Data.bindAdmin({ selId: "adminId" });

    var productId = $("#productId").val();
    var vm = new ViewModel();
    ko.applyBindings(vm, document.getElementById("list"));
    ko.applyBindings(vm, document.getElementById("recover"));
    ko.applyBindings(vm, document.getElementById("multiSend"));
    ko.applyBindings(vm, document.getElementById("multiExpressOrder"));
    //ko.applyBindings(vm, document.getElementById("project"));
    vm.loadContractList({ pageIndex: 1 });

    //快递
    $.get({
        url: "common/datadic",
        data: { type: 'kd' },
        success: function (data) {
            kdData = data.data;
            $(data.data).each(function (index, item) {
                if (item.name.trim() == "顺丰速递" || item.name.trim() == "顺丰快递") {
                    $("#kd").append("<option value='" + item.id + "' selected='selected' >" + item.name + "</option>");
                } else {
                    $("#kd").append("<option value='" + item.id + "'>" + item.name + "</option>");
                }
            });
            $("#kd").append("<option value='1 '>自取</option>");
        },
    });
    //合同编号
    $.get({
        url: 'trade/contract/getCodeList',
        data: { productId: productId },
        success: function (result) {
            for (i = 0; i < result.length; i++) {
                $("#code").append("<option value='" + result[i] + "'>" + result[i] + "</option>");
            }
        },
    })

    $("#statusDiv").delegate("a", "click", function () {
        var status = $(this).attr("data-val");
        if (status) {
            $(this).toggleClass("btn-green").toggleClass("btn-orange")
            .siblings().eq(0).removeClass("btn-green").removeClass("btn-orange").addClass("btn-green");;

        } else {
            $(this).removeClass("btn-green").removeClass("btn-orange").addClass("btn-orange")
                .siblings().removeClass("btn-green").removeClass("btn-orange").addClass("btn-green");
        }
        vm.loadContractList({ pageIndex: 1 });
    });

    //下拉列表加载更多
    $("#list").scroll(function () {
        var $this = $(this);
        //数据表格对象
        var $table = $("#list .contract_list_ul");
        //下拉滚动判断是否加载下一页数据 
        if ($this.height() + $this.scrollTop() >= $table.outerHeight(true) + 16) {
            //loading效果
            $.partLoad.partLoading($this);
            setTimeout(function () {
                vm.loadContractList({ pageIndex: vm.pageIndex() + 1 });
                //关闭loading效果
                $.partLoad.partComplete($table);
            }, 1100);
        }
        if ($this.find(".no_data")) {
            $this.find(".no_data").remove();
        }
    });

    //修改合同编号
    $("#list").delegate("input[data-operate='editCode']", "change", function () {
        var $this = $(this);
        var id = $this.attr("data-id");
        var code = $this.val();
        var oldCode = $this.attr("data-oldCode");
        $.put({
            url: "trade/contract/updateCode/" + id,
            data: { productId: productId, code: code },
            success: function () {
                vm.loadContractList({ pageIndex: 1 });
            },
            error: function (resultErr) {
                $.errorMsg(resultErr.responseText);
                $this.val(oldCode);
            }
        });
    });
    //重置
    $("#list").delegate("a i.icon-refresh", "click", function () {
        var $this = $(this);
        var id = $this.attr("data-id");
        var productId = $this.attr("data-productId");
        $.confirm('确定要重置此合同吗？', function () {
            $.post({
                url: 'Trade/Contract/UpdateStatus',
                data: { id: id, status: -2 },
                success: function (result) {
                    vm.loadContractList({ pageIndex: 1 });
                    for (var i = 0; i < grid.contractStatData().length; i++) {
                        if (grid.contractStatData()[i].productId() == productId) {
                            grid.contractStatData()[i].usableCount(grid.contractStatData()[i].usableCount() - 1);
                            grid.contractStatData()[i].discardCount(grid.contractStatData()[i].discardCount() + 1);
                            break;
                        }
                    }
                }
            });
        });
    });
    //废弃
    $("#list").delegate("a i.icon-trash", "click", function () {
        var $this = $(this);
        var id = $this.attr("data-id");
        var productId = $this.attr("data-productId");
        $.confirm('确定要废弃此合同吗？', function () {
            $.post({
                url: 'Trade/Contract/UpdateStatus',
                data: { id: id, status: -1 },
                success: function (result) {
                    vm.loadContractList({ pageIndex: 1 });
                    for (var i = 0; i < grid.contractStatData().length; i++) {
                        if (grid.contractStatData()[i].productId() == productId) {
                            grid.contractStatData()[i].usableCount(grid.contractStatData()[i].usableCount() - 1);
                            grid.contractStatData()[i].discardCount(grid.contractStatData()[i].discardCount() + 1);
                            break;
                        }
                    }
                }
            });
        });
    });
    //发给客户
    $("#list").delegate("a i.icon-reply", "click", function () {
        $("#kd").removeAttr("disabled");
        $("#divkdNo").show();
        $("#isExpressOrder").val(false);
        var $this = $(this);
        var id = $this.attr("data-id");
        $.get({
            url: 'trade/contract/' + id,
            success: function (result) {
                $.openDialog({
                    title: '发送合同',
                    jqObj: $('#send')
                });
                $('#sendForm').loadForm(result);
                $("#kdNo").val(result.userExpressNo);
            }
        });
    });
    //回收合同
    $("#list").delegate("a i.icon-undo", "click", function () {
        $("#kd").removeAttr("disabled");
        $("#divkdNo").show();
        $("#isExpressOrder").val(false);
        var $this = $(this);
        var id = $this.data("id");
        var type = $this.data("type");
        if (type == 1) {
            $("#isToChannel").val(true);
        }
        $.openDialog({
            title: '合同回收',
            jqObj: $('#recover'),
        });
        $("#contractid").val(id);
    });
    //寄回上游
    $("#list").delegate("a i.icon-exchange", "click", function () {
        debugger
        $("#kd").removeAttr("disabled");
        $("#divkdNo").show();
        $("#isExpressOrder").val(false);
        var $this = $(this);
        var id = $this.data("id");
        var type = $this.data("type");
        var status = $this.data("status");
        $.get({
            url: 'trade/contract/' + id,
            success: function (result) {
                var contractToChannel = false;
                if (type == 1) {
                    if (status == 35) {
                        $.openDialog({
                            title: '寄回给平台',
                            jqObj: $('#send')
                        });
                    } else {
                        $.openDialog({
                            title: '寄送给渠道',
                            jqObj: $('#send')
                        });
                        contractToChannel = true;
                    }
                    $("#isToChannel").val(true);
                } else {
                    $.openDialog({
                        title: '寄回上游',
                        jqObj: $('#send')
                    });
                }
              
                $('#sendForm').loadForm(result);
                if (contractToChannel) {
                    $("#kdNo").val(result.enterpriseExpressNo);
                } else {
                    $("#kdNo").val("");
                }
            }
        });
    });
    //打开批量发回上游页面
    $("#multiSendbtn").click(function () {
        var productId = $("#productId").val();
        $.get({
            url: 'trade/contract?productId=' + productId,
            success: function (result) {
                $.openDialog({
                    title: '批量发回上游',
                    jqObj: $('#multiSend')
                });
                $('#multiSendForm').loadForm(result.data[0]);
                //快递
                $.get({
                    url: "common/datadic",
                    data: { type: 'kd' },
                    success: function (data) {
                        $("#supplierExpressType").empty();
                        $(data.data).each(function (index, item) {
                            if (item.name.trim() == "顺丰速递" || item.name.trim() == "顺丰快递") {
                                $("#supplierExpressType").append("<option value='" + item.id + "' selected='selected' >" + item.name + "</option>");
                            } else {
                                $("#supplierExpressType").append("<option value='" + item.id + "'>" + item.name + "</option>");
                            }
                        });
                        $("#supplierExpressType").append("<option value='1 '>自取</option>");
                    }
                });
            }
        });
    });
    //快递下单
    $("#list").delegate("a i.icon-arrow-down", "click", function () {
        var $this = $(this);
        var id = $this.data("id");
        var type = $this.data("type");
        $.get({
            url: 'trade/contract/' + id,
            success: function (result) {
                if (type == 1) {
                    $.openDialog({
                        title: '快递下单给【渠道】',
                        jqObj: $('#send')
                    });
                    $("#isToChannel").val(true);
                } else {
                    $.openDialog({
                        title: '快递下单给【会员】',
                        jqObj: $('#send')
                    });
                }
               
                $('#sendForm').loadForm(result);
                $("#kd").attr("disabled","disabled");
                $("#divkdNo").hide();
                $("#kdNo").val("0");
                $("#isExpressOrder").val(true);
                
            }
        });
    });
    //单个发总部
    $("#list").delegate("a i.icon-circle-arrow-up", "click", function () {
        var $this = $(this);
        var id = $this.attr("data-id");
        //console.log(id);
        $.confirm("您确定要把合同发给总部吗？", function () {
            $.post({
                url: "Trade/Contract/UpdateStatus",
                data: { id: id, status: 55 },
                success: function () {
                    $.success("发送成功", 2000);
                    vm.loadContractList({ pageIndex: 1 });
                },
                error: function (resultErr) {
                    $.errorMsg(resultErr.responseText);
                }
            });
        });
    });
    //批量发总部
    $("#multiSendHeadquarters").click(function () {
        var ids = [];
        $("#list ul li.active").each(function (index, item) {
            var status = $(item).attr("data-status");
            //已回收、可用、废弃
            if (status == "40" || status == "10" || status == "-1") {
                ids.push(parseInt($(item).attr("data-id")));
            }
        });
        if (ids.length == 0) {
            $.tips("请选择可发总部的合同", $("#multiSendHeadquarters"));
            return;
        }
        $("#multiSendHeadquarters").attr("disabled", "disabled").find("a").html("发送中……");
       
        $.confirm("您确定要把合同发给总部吗？", function () {
            $.post({
                url: "Trade/Contract/mutilSendHeadquarters",
                data: {ids: ids},
                success: function () {
                    $.success("发送成功", 2000);
                    vm.loadContractList({ pageIndex: 1 });
                    $("#multiSendHeadquarters").removeAttr("disabled").find("a").html("发总部");
                },
                error: function (resultErr) {
                    $("#multiSendHeadquarters").removeAttr("disabled").find("a").html("发总部");
                    $.errorMsg(resultErr.responseText);
                }
            });
        });
    });

    //打开批量快递下单页面
    $("#multiexpressOrder").click(function () {
        var ids = [];
        $("#list ul li.active").each(function (index, item) {
            var status = $(item).attr("data-status");
            if (status == "15") {
                ids.push(parseInt($(item).attr("data-id")));
            }
        });
        if (ids.length == 0) {
            $.tips("请选择可快递下单的合同", $("#multiexpressOrder"));
            return;
        }
        $("#btnMultiExpressOrder").removeAttr("disabled").html("发送");
        var productId = $("#productId").val();
        $.get({
            url: "trade/contract?productId=" + productId,
            success: function (result) {
                $.openDialog({
                    title: "批量快递下单",
                    jqObj: $("#multiExpressOrder")
                });
                $("#multiExpressOrderForm").loadForm(result.data[0]);
                //console.log(result.data[0]);
                //快递
                $.get({
                    url: "common/datadic",
                    data: { type: 'kd' },
                    success: function (data) {
                        $("#mkd").empty();
                        $(data.data).each(function (index, item) {
                            if (item.name.trim() == "顺丰速递" || item.name.trim() == "顺丰快递") {
                                $("#mkd").append("<option value='" + item.id + "' selected='selected' >" + item.name + "</option>");
                            } else {
                                $("#mkd").append("<option value='" + item.id + "'>" + item.name + "</option>");
                            }
                        });
                        $("#mkd").append("<option value='1'>自取</option>");
                    },
                });
            }
        });
    });
    //打印
    $("#list").delegate("a i.icon-print", "click", function () {
        var $this = $(this);
        var contractId = $this.attr("data-id");
        window.open("/Partial/Print?contractId=" + contractId + "&math=" + Math.random());
    });

    //修改状态
    $("#btnSend").click(function () {
        $("#btnSend").attr("disabled", "disabled").html("发送中……");
        var kd = $("#kd").val();
        var kdNo = $("#kdNo").val();
        var contractStatus = $("#contractStatus").val();
        if ($("#kdNo").val()) {
            var param = {};
            if ($("#isExpressOrder").val() == "true") {
                if ($("#isToChannel").val() == "true") {
                    param = { status: 17, isToChannel: true };
                } else {
                    param = { status: 17 };
                }
            } else if (contractStatus == 15 || contractStatus == 17 || contractStatus == 20) {
                if ($("#isToChannel").val() == "true") {
                    param = { status: 20, enterpriseExpressNo: kdNo, enterpriseExpressType: kd };
                } else {
                    param = { status: 30, userExpressNo: kdNo, userExpressType: kd };
                }
                
            } else if (contractStatus == 35 || contractStatus == 40 || contractStatus == 10 || contractStatus == -1 || contractStatus == 55) {
                if ($("#isToChannel").val() == "true") {
                    param = { status: 36, platformExpressNo: kdNo, platformExpressType: kd,  };
                } else {
                    param = { status: 60, supplierExpressNo: kdNo, supplierExpressType: kd };
                }
            }
            $("#sendForm").submitForm({
                type: 'post',
                url: 'Trade/Contract/UpdateStatus',
                data: param,
                success: function (result) {
                    $("#kd").removeAttr("disabled");
                    $("#divkdNo").show();
                    $("#isExpressOrder").val(false);
                    $.closeDialog($('#send'));
                    vm.loadContractList({ pageIndex: 1 });
                    $("#btnSend").removeAttr("disabled").html("发送");
                },
                error: function (resultErr) {
                    $("#btnSend").removeAttr("disabled").html("发送");
                    $.errorMsg(resultErr.responseText);
                }
            });
        } else {
            $.tips("请输入快递单号", $('#kdNo'), 1500);
            $("#btnSend").removeAttr("disabled").html("发送");
        }
    });
    //查询条件
    $("#divParams select").not("#project").change(function () {
        vm.loadContractList({ pageIndex: 1 });
    });

    var timer = null;
    //TODO 输入框点击enter时进行搜索
    //如果键盘敲击速度太快，小于100毫秒的话就不会向后台发请求，但是最后总会进行一次请求的。
    $(".ibox-search input,#divParams input").keyup(function (event) {
        var $this = $(this);
        clearTimeout(timer);
        timer = setTimeout(function () {
            if (event.keyCode == 13) {
                vm.loadContractList({ pageIndex: 1 });
                $this.blur();
            }
        }, 500);
    });

    //全选
    $("#selectAll").click(function () {
        $(this).children("i").toggleClass("icon-check").toggleClass("icon-check-empty");
        if ($(this).children("i").hasClass("icon-check")) {
            $("#list ul li").each(function (index, item) {
                $(item).addClass("active");
            });
        } else {
            $("#list ul li").each(function (index, item) {
                $(item).removeClass("active");
            });
        }
    });
    //选择
    $("#list ul").delegate('li', 'click', function () {
        $(this).toggleClass("active");
    });
});

function getkd(kdNo) {
    if (kdNo == 1)
        return '自取';
    var str = '';

    for (i = 0; i < kdData.length; i++) {
        if (kdData[i].id == kdNo) {
            str = kdData[i].name;
        }
    }
    return str;
}