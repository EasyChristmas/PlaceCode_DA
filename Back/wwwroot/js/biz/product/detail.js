//产品详情页面VM控制对象
var productViewModel = new productViewModel();

$(function () {
    //点击上传进度条
    $(".dianji").on("click", function () {
        $.processerbar(3000);
    })
    //格式化列表table高度
    $.tableHeight(120, ".ibox-tab-content");
    //页面数据初始化
    productViewModel.init({ productId: $("#productId").val(), copyId: $("#copyId").val(), recommendId: $("#recommendId").val() });

    //textarea高度自适应
    $.textHeightAuto();


    //选择标签placeholder重绘
    $('#selectDyEx').select2({
        placeholder: "备注抵/质押物"
    });

    //产品详情标签-添加窗口
    $(".tag_add:first").on("click", function () {
        $(".tag_menu,.show_left_bg,.tab_menu_title").show();
    });
    //产品详情标签-添加窗口-关闭
    $(".tag_close,.show_left_bg").on("click", function () {
        $(".tag_menu,.tab_menu_title,.show_left_bg").hide();
    });
    //供应商报价价格切换效果
    $('#myTabs a').click(function (e) {
        e.preventDefault()
        $(this).tab('show')
    });

    ko.applyBindings(productViewModel.productPriceStructList, $("#brokerageDiv")[0]);
    ko.applyBindings(productViewModel.productPriceStructList, $("#followBrokerageDiv")[0]);
    //新增发行
    $('#addRelease').on('click', function () {
        $.openDialog({
            title: '新增发行',
            jqObj: $('#addReleaseDiv')
        });
        $.get({
            url: 'product/company',
            success: function (data) {
                $("#releaseCompany option").remove();
                $("#releaseCompany").append('<option value="">-</option>');
                $(data).each(function (index, item) {
                    $("#releaseCompany").append('<option value=' + item.id + '>' + item.name + '</option>');
                });

                //绑定选择发行机构默认更新机构联系人级联事件
                $("#releaseCompany").change(function () {
                    $.get({
                        url: 'product/supplier',
                        data: { companyId: $("#releaseCompany").val() },
                        success: function (data) {
                            $("#releaseSupplier option").remove();
                            $("#releaseSupplier").append('<option value="">-</option>');
                            $(data).each(function (index, item) {
                                $("#releaseSupplier").append('<option value=' + item.id + '>' + item.name + "-" + item.phone + '</option>');
                            });
                            $("#releaseSupplier").val($("#releaseSupplier option").eq(1).attr("value"));
                            $("#releaseSupplier").change();
                        }
                    });
                });
            }
        });
    });

    $("#selbrokerageDes").change(function () {
        if ($("#selbrokerageDes").val() == 2) {
            $("#followBrokerageDiv").show();
        } else {
            $("#followBrokerageDiv").hide();
        }
    });

    $("#add").click(function () {
        var brokerage = [];
        var followBrokerage = [];
        for (i = 0; i < productViewModel.productPriceStructList().length; i++) {
            brokerage.push({ start: productViewModel.productPriceStructList()[i].start, end: productViewModel.productPriceStructList()[i].end });
            followBrokerage.push({ start: productViewModel.productPriceStructList()[i].start, end: productViewModel.productPriceStructList()[i].end });
        }
        $("#brokerageDiv").find(".brokerageDiv").each(function (index, item) {
            var bro = $(item).find("input[name='brokerage']").val();
            brokerage[index].brokerage = bro;
        });
        $("#followBrokerageDiv").find(".followBrokerageDiv").each(function (index, item) {
            var flbro = $(item).find("input[name='followBrokerage']").val();
            followBrokerage[index].followBrokerage = flbro;
        });
        var isAnonymous = $("#isAnonymous").val() == 'on' ? true : false;
        $("#addReleaseForm").submitForm({
            type: "post",
            url: "up/supplierProduct",
            data: { productId: $("#parentId").val(), brokerage: brokerage, followBrokerage: followBrokerage, isAnonymous: isAnonymous },
            async: false,
            success: function (result) {
                $.closeDialog($("#addReleaseDiv"));
                productViewModel.changePriceStruct();
            },
            error: function (resultErr) {
                $.errorMsg(resultErr.responseText);
            }
        });
    });

    //初始化编辑器
    $('#riskRemark').saasSummernote({
        callbacks: {//回调函数
            onInit: function () {
                if (!$("#productId").val() && !$("#copyId").val()) {
                    var defaultValue = $.ConstData.RiskRemark;
                    $('#riskRemark').summernote('code', defaultValue);
                }
            },
            onBlur: function () {
                if ($("#productId").val()) {
                    productViewModel.put({ source: "product", propName: "riskRemark", propValue: $('#riskRemark').summernote('code') }, $('#riskRemark'));
                }
            }
        }
    });
})
