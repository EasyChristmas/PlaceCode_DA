var viewData = {};
$(function () {
    var initKo = function () {
        //修改会员分类会员Id
        viewData.userId = null;
        //修改会员分类kind
        viewData.kind = null;
        //腾云客户身份证
        viewData.idCardNumber = null;
        //修改产品成立时间产品Id
        viewData.productId = null;
        //修改产品成立时间
        viewData.dealTime = null;
        //下线产品ID
        viewData.productOffId = null;
        //修改报单金额编号
        viewData.orderId = null;
        //修改报单金额
        viewData.orderPrice = null;

        //修改报单产品id
        viewData.orderProductId = null;
        //修改报单产品产品Id
        viewData.orderProductProductId = null;

        //修改报单打款时间
        viewData.orderPayTimeId = null;
        //修改报单打款时间
        viewData.orderPayTime = null;

        //删除会员结佣账号ID
        viewData.orderUserId = null;
        //删除结佣账号ID
        viewData.deleteBankCardId = null;
        //删除报单账号集合
        viewData.deleteBankCardList = [];

        //修改报单结佣帐号报单ID
        viewData.updateOrderId = null;

        //修改二次结佣帐号报单ID
        viewData.updateBrokerageId = null;

        //修改结佣账号ID
        viewData.updateBankCardId = null;

        //修改结佣账号ID
        viewData.updateBankCardIdBrokerage = null;

        //修改结佣账户信息集合
        viewData.updateBankCardList = [];

        //修改结佣账户信息集合
        viewData.updateBankCardListBrokerage = [];

        //报单分配服务经理报单ID
        viewData.orderAdminId = null;
        //服务经理ID
        viewData.adminId = null;

        //报单作为报单ID
        viewData.invalidOrderId = null;
        //报单作为备注
        viewData.invalidRemark = null;

        //markdown文件路径
        viewData.markdownPath = null;
        //邮件标题
        viewData.emailTitle = null;

        //复制产品ID编号
        viewData.copyProductId = null;
        //复制产品上九天
        viewData.copyProductForJT = function () {
            if (viewData.copyProductId() === null || $.trim(viewData.copyProductId()) === "") {
                $.tips("请选择产品", $("#selCopyProduct"));
                return;
            }

            $.put({
                async: true,
                url: "product/copyProductForJT/" + viewData.copyProductId(),
                success: function (result) {
                    if (result) {
                        viewData.copyProductId(null);
                        $.success("复制产品成功，新创建的产品编号为：" + result + "，请至产品列表查看", 3000);
                    }
                },
                error: function (resultErr) {
                    $.errorMsg(resultErr.responseText);
                }
            });
        }

        //提交修改报单成立时间
        viewData.submitProduct = function () {
            //console.log(viewData.productId());
            //console.log(viewData.dealTime());
            if (viewData.productId() === null || $.trim(viewData.productId()) === "") {
                $.tips("请选择产品", $("#selProduct"));
                return;
            }
            if (viewData.dealTime() === null) {
                $.tips("请选择日期", $("#dealTime"));
                return;
            }
            $.put({
                async: true,
                url: "product/ToolUpdateProductDealTime/" + viewData.productId(),
                data: { dealTime: viewData.dealTime() },
                success: function (result) {
                    if (result.id > 0) {
                        viewData.productId(null);
                        viewData.dealTime(null);
                        $.success("修改产品成立时间成功！", 3000);
                    }
                },
                error: function (resultErr) {
                    $.errorMsg(resultErr.responseText);
                }
            });
        };
        //产品下线
        viewData.productOffline = function () {
            if (viewData.productOffId() === null || $.trim(viewData.productOffId()) === "") {
                $.tips("请选择产品", $("#selProductOffId"));
                return;
            }
            $.post({
                url: "product/modifyStatus",
                data: { productId: viewData.productOffId(), status: 10 },
                success: function () {
                    viewData.productOffId(null);
                    $.success("产品下线成功！", 3000);
                },
                error: function (resultErr) {
                    $.errorMsg(resultErr.responseText);
                }
            });
        };
        //提交修改报单金额
        viewData.submitOrder = function () {
            if (viewData.orderId() === null || $.trim(viewData.orderId()) === "") {
                $.tips("请填写报单/结佣编号", $("#orderId"));
                return;
            }
            if (viewData.orderPrice() === null || $.trim(viewData.orderPrice()) === "") {
                $.tips("请填写金额", $("#orderPrice"));
                return;
            }
            $.put({
                async: true,
                url: "trade/Order/ToolUpdateOrderPrice/" + viewData.orderId(),
                data: { price: viewData.orderPrice() },
                success: function (result) {
                    viewData.orderId(null);
                    viewData.orderPrice(null);
                    $.success("修改报单价格成功！", 2000);
                },
                error: function (resultErr) {
                    $.errorMsg(resultErr.responseText);
                }
            });

        };
        //提交修改报单产品ID
        viewData.submitOrderProduct = function () {
            if (viewData.orderProductId() === null || $.trim(viewData.orderProductId()) === "") {
                $.tips("请填写报单/结佣编号", $("#orderProductId"));
                return;
            }
            if (viewData.orderProductProductId() === null || $.trim(viewData.orderProductProductId()) === "") {
                $.tips("请选择产品", $("#selOrderProduct"));
                return;
            }
            $.put({
                async: true,
                url: "trade/Order/ToolUpdateOrderProductId?id=" + viewData.orderProductId(),
                data: { productId: viewData.orderProductProductId() },
                success: function (result) {
                    if (result > 0) {
                        viewData.orderProductId(null);
                        viewData.orderProductProductId(null);
                        $.success("修改报单产品成功！", 2000);
                    }
                },
                error: function (resultErr) {
                    $.errorMsg(resultErr.responseText);
                }
            });
        };
        //提交修改报单打款时间
        viewData.submitOrderPayTime = function () {
            if (viewData.orderPayTimeId() === null || $.trim(viewData.orderPayTimeId()) === "") {
                $.tips("请填写报单/结佣编号", $("#orderPayTimeId"));
                return;
            }
            if (viewData.orderPayTime() === null || $.trim(viewData.orderPayTime()) === "") {
                $.tips("请选择日期", $("#orderPayTime"));
                return;
            }
            $.confirm("您确定要修改报单打款时间吗?", function () {
                $.put({
                    async: true,
                    url: "trade/order/toolUpdateOrderPayTime/" + viewData.orderPayTimeId(),
                    data: { id: viewData.orderPayTimeId(), payTime: viewData.orderPayTime() },
                    success: function (result) {
                        viewData.orderPayTimeId(null);
                        viewData.orderPayTime(null);
                        $.success("修改成功");
                    },
                    error: function (resultErr) {
                        $.errorMsg(resultErr.responseText);
                    }
                });
            });
        };
        //删除结佣账号
        viewData.deleteBankCard = function () {
            if (viewData.orderUserId() === null || $.trim(viewData.orderUserId()) === "") {
                $.tips("请填写会员编号", $("#orderUserId"));
                return;
            }
            if (viewData.deleteBankCardId() === null || $.trim(viewData.deleteBankCardId()) === "") {
                $.tips("请选择结佣账号", $("#selBankCard"));
                return;
            }
            $.confirm("您确定要删除吗?", function () {
                $.delete({
                    url: "user/UserBankCard/ToolDelete/" + viewData.deleteBankCardId(),
                    success: function () {
                        viewData.orderUserId(null);
                        viewData.deleteBankCardId(null);
                        viewData.deleteBankCardList.removeAll();
                        $.success("删除成功");
                        //console.log(self.userAddressList());
                    },
                    error: function (resultErr) {
                        $.errorMsg(resultErr.responseText);
                    }
                });
            });

        };


        //修改报单结佣帐号
        viewData.updateBankCard = function () {
            if (viewData.updateOrderId() === null || $.trim(viewData.updateOrderId()) === "") {
                $.tips("请填写报单编号", $("#updateOrderId"));
                return;
            }
            if (viewData.updateBankCardId() === null || $.trim(viewData.updateBankCardId()) === "") {
                $.tips("请选择结佣账号", $("#selUpdateBankCard"));
                return;
            }
            $.confirm("您确定要修改报单结佣账号信息吗?", function () {
                $.put({
                    url: "trade/order/toolUpdateOrderBankCard/" + viewData.updateOrderId(),
                    data: { id: viewData.updateOrderId(), bankCardId: viewData.updateBankCardId() },
                    success: function () {
                        viewData.updateOrderId(null);
                        viewData.updateBankCardId(null);
                        viewData.updateBankCardList.removeAll();
                        $.success("修改成功");
                    },
                    error: function (resultErr) {
                        $.errorMsg(resultErr.responseText);
                    }
                });
            });

        };

        //是否需要填写展示垫付信息
        viewData.showAdvances = ko.observable(false);

        viewData.changeBankCard = function () {
            var showAdvances = viewData.updateBankCardIdBrokerage() == 0;
            viewData.showAdvances(showAdvances);
        };

        //修改二次结佣帐号
        viewData.updateBankCardBrokerage = function () {

            var aa = viewData.updateBrokerageId();
            var bb = viewData.updateBankCardIdBrokerage();

            if (viewData.updateBrokerageId() === null || $.trim(viewData.updateBrokerageId()) === "") {
                $.tips("请填写二次结佣编号", $("#updateBrokerageId"));
                return;
            }
            if (viewData.updateBankCardIdBrokerage() === null || $.trim(viewData.updateBankCardIdBrokerage()) === "") {
                $.tips("请选择结佣账号", $("#selUpdateBankCardBrokerage"));
                return;
            }

            var advancesFile = $('div[name="advancesFile"]').attr('data-upload-value');
            if (viewData.updateBankCardIdBrokerage() == 0 && (advancesFile == undefined || advancesFile == "")) {
                $.tips('必须上传垫付凭证信息！', $('div[name="advancesFile"]'));
                return;
            }

            $.confirm("您确定要修改二次结佣账号信息吗?", function () {
                $.post({
                    url: "trade/secondbrokerage/UpdateSecondBrokerage",
                    data: { brokerageId: viewData.updateBrokerageId(), bankCardId: viewData.updateBankCardIdBrokerage(), advancesFile: advancesFile },
                    success: function () {
                        viewData.updateBrokerageId(null);
                        viewData.updateBankCardIdBrokerage(null);
                        viewData.updateBankCardListBrokerage.removeAll();

                        $('div[name="advancesFile"]').attr('data-upload-value', '');
                        $($('div[name="advancesFile"]').children()).each(function (index, item) {
                            if (index == 0) {
                                $(item).show();
                            }
                            else {
                                $(item).remove();
                            }
                        });

                        $.success("修改成功");
                    },
                    error: function (resultErr) {
                        $.errorMsg(resultErr.responseText);
                    }
                });
            });

        };


        //分配服务经理
        viewData.submitAdminId = function () {
            if (viewData.orderAdminId() === null || $.trim(viewData.orderAdminId()) === "") {
                $.tips("请填写报单/结佣编号", $("#orderAdminId"));
                return;
            }
            if (viewData.adminId() === null || $.trim(viewData.adminId()) === "") {
                $.tips("请选择服务经理", $("#selAdminInfo"));
                return;
            }
            $.confirm("您确定要分配服务经理吗?", function () {
                $.put({
                    async: true,
                    url: "trade/order/toolDistributeAdminId/" + viewData.orderAdminId(),
                    data: { adminId: viewData.adminId() },
                    success: function (result) {
                        $.success("分配成功");
                        viewData.orderAdminId(null);
                        viewData.adminId(null);
                        //console.log(result);
                        //console.log(viewData.bankCardList());
                    },
                    error: function (resultErr) {
                        $.errorMsg(resultErr.responseText);
                    }
                });
            });
        };
        //提交报单作废
        viewData.submitInvalid = function () {
            if (viewData.invalidOrderId() === null || $.trim(viewData.invalidOrderId()) === "") {
                $.tips("请填写报单/结佣编号", $("#invalidOrderId"));
                return;
            }
            if (viewData.invalidRemark() === null || $.trim(viewData.invalidRemark()) === "") {
                $.tips("请填写备注", $("#invalidRemark"));
                return;
            }
            //console.log(viewData.invalidOrderId());
            //console.log(viewData.invalidRemark());
            $.confirm("您确定要作废该报单吗?", function () {
                $.put({
                    async: true,
                    url: "trade/order/toolInvalid/" + viewData.invalidOrderId(),
                    data: { id: viewData.invalidOrderId(), remark: viewData.invalidRemark() },
                    success: function (result) {
                        viewData.invalidOrderId(null);
                        viewData.invalidRemark(null);
                        $.success("作废成功");
                        //console.log(result);
                        //console.log(viewData.bankCardList());
                    },
                    error: function (resultErr) {
                        $.errorMsg(resultErr.responseText);
                    }
                });
            });
        };
        //分配服务经理
        viewData.changeKind = function () {
            if (viewData.userId() === null || $.trim(viewData.userId()) === "") {
                $.tips("请填写会员编号", $("#userId"));
                return;
            }
            if (viewData.kind() === null || $.trim(viewData.kind()) === "") {
                $.tips("请选择会员分类", $("#kind"));
                return;
            }
            $.confirm("您确定要修改会员分类吗?", function () {
                $.put({
                    async: true,
                    url: "user/changeKind/" + viewData.userId(),
                    data: { kind: viewData.kind() },
                    success: function (result) {
                        $.success("修改成功");
                        viewData.userId(null);
                        viewData.kind(null);
                    },
                    error: function (resultErr) {
                        $.errorMsg(resultErr.responseText);
                    }
                });
            });
        }
        //分配服务经理
        viewData.resetTyPassWord = function () {
            if (viewData.idCardNumber() === null || $.trim(viewData.idCardNumber()) === "") {
                $.tips("请填写身份证", $("#idCardNumber"));
                return;
            }

            $.confirm("您确定要重置密码吗?", function () {
                $.put({
                    async: true,
                    url: "ty/project/resetPassWord",
                    data: { idCardNumber: viewData.idCardNumber() },
                    success: function (result) {
                        $.success("置密成功");
                        viewData.idCardNumber(null);
                    },
                    error: function (resultErr) {
                        $.errorMsg(resultErr.responseText);
                    }
                });
            });
        }
        //发送版本更新邮件
        viewData.sendMail = function () {
            if (viewData.markdownPath() === null || $.trim(viewData.markdownPath()) === "") {
                $.tips("请填MarkDown地址", $("#markdownPath"));
                return;
            }
            if (viewData.emailTitle() === null || $.trim(viewData.emailTitle()) === "") {
                $.tips("请填邮件标题", $("#emailTitle"));
                return;
            }
            $.getBack({
                type: "POST",
                url: "/sys/GetMarkDownToHtml",
                data: { markPath: viewData.markdownPath(), emailTitle: viewData.emailTitle() },
                success: function (result) {
                    if (!result.isSuccess) {
                        $.errorMsg(result.msg);
                    } else {
                        viewData.markdownPath(null);
                        viewData.emailTitle(null);
                        $.success("内容发送成功，等待邮件发送！");
                    }
                },
                error: function (resultErr) {
                    $.errorMsg(resultErr.responseText);
                }
            });

        };
        //生成季度结算合并
        viewData.quarterlysettlement_toge = function (element) {
            var org = $("#quarterlysettlement").find("select[name='userId']");
            var val = org.find("option:selected").val();
            $(element).prop("disabled", true);
            if (val === "") {
                $(element).val("正在批量生成...");
            } else {
                $(element).val("正在根据机构生成...");
            };
            $.post({
                url: "trade/secondbrokerage/quarterlysettlement",
                data: { userId: val == '' ? null : val },
                success: function (result) {
                    $.success("季度结算生成成功！");
                    $(element).prop("disabled", false);
                    $(element).val("生成");
                },
                error: function (resultErr) {
                    $.errorMsg(resultErr.responseText);
                    $(element).prop("disabled", false);
                    $(element).val("生成");
                }
            });
        };

        if (true) {
            //生成季度结算
            //viewData.quarterlysettlement = function (element) {
            //    $(element).prop("disabled", true);
            //    $(element).val("正在批量生成...");
            //    $.post({
            //        url: "trade/secondbrokerage/quarterlysettlement",
            //        data: { userId: null },
            //        success: function (result) {
            //            $.success("季度结算生成成功！");
            //            $(element).prop("disabled", false);
            //            $(element).val("生成");
            //        },
            //        error: function (resultErr) {
            //            $.errorMsg(resultErr.responseText);
            //            $(element).prop("disabled", false);
            //            $(element).val("生成");
            //        }
            //    });

            //};
            //根据机构生成季度结算
            //viewData.quarterlysettlementByOrgId = function (element) {
            //    var org = $("#quarterlysettlement").find("select[name='userId']");
            //    var val = org.find("option:selected").val();
            //    if (val === "") {
            //        $.tips("请填要生成季度结算的报单编号", org);
            //        return;
            //    }
            //    $(element).prop("disabled", true);
            //    $(element).val("正在根据机构生成...");
            //    $.post({
            //        url: "trade/secondbrokerage/quarterlysettlement",
            //        data: { userId: val },
            //        success: function (result) {
            //            $.success("季度结算生成成功！");
            //            $(element).prop("disabled", false);
            //            $(element).val("生成");
            //        },
            //        error: function (resultErr) {
            //            $.errorMsg(resultErr.responseText);
            //            $(element).prop("disabled", false);
            //            $(element).val("生成");
            //        }
            //    });
            //};
        }

        //清除Excel数据
        viewData.updateInvalidEmail = function (element) {
            var filePath = $('a[target="view_window"]').attr("href");
            if (!filePath) {
                $.tips("请上传无效邮箱Excel数据名单", $(element), 1500);
                return;
            }
            $(element).prop("disabled", true);
            $(element).val("正在清除...");
            $.getBack({
                type: "POST",
                url: "/sys/InvalidEmailExcel",
                data: { excelUrl: filePath },
                success: function (result) {
                    $(element).val("清除Excel数据名单");
                    $(element).prop("disabled", false);
                    $(".icon-remove").parent().click();
                    $.success("清除成功");
                },
                error: function (resultErr) {
                    $(element).prop("disabled", false);
                    $(element).val("清除Excel数据名单");
                    $.errorMsg(resultErr.responseText);
                }
            });
        };
        //监控
        viewData = ko.mapping.fromJS(viewData);
        //ko绑定
        ko.applyBindings(viewData);
    }();
    //初始化加载数据
    var initData = function () {
        $.tableHeight(30, ".ibox-content");
        $.Data.bindOnlineProduct({ selId: "selProduct", productTypeId: $("select[name='productTypeId'] option:selected").val(), isFounded: 1 });
        $.Data.bindOnlineProduct({ selId: "selProductOffId" });
        $.Data.bindOnlineProduct({ selId: "selCopyProduct" });
        $.Data.bindOnlineProduct({ selId: "selOrderProduct", productTypeId: $("select[name='productTypeId'] option:selected").val() });
        $.Data.bindJTOrg({ selId: "selOrg" });
    }();


    //鼠标移开加载修改报单结佣账户（修改结佣账户功能）
    $("#updateOrderId").focusout(function () {
        //console.log(viewData.updateOrderId());
        if (!!viewData.updateOrderId()) {
            $.get({
                async: true,
                url: "trade/getorderbaseinfo/" + viewData.updateOrderId(),
                success: function (result) {
                    //console.log(result.userId);
                    if (result.userId) {
                        getUpdateBankCardByUserId(result.userId);
                    } else {
                        viewData.updateBankCardId(null);
                        viewData.updateBankCardList.removeAll();
                        $.tips("报单信息错误！", $("#updateOrderId"));
                    }

                },
                error: function (resultErr) {
                    viewData.updateBankCardId(null);
                    viewData.updateBankCardList.removeAll();
                    $.tips(resultErr.responseText, $("#updateOrderId"));
                    //$.errorMsg(resultErr.responseText);
                }
            });
        } else {
            viewData.updateBankCardId(null);
            viewData.updateBankCardList.removeAll();
        }

    });


    //鼠标移开加载修改二次结佣账户（修改结佣账户功能）
    $("#updateBrokerageId").focusout(function () {
        console.log("updateBrokerageId");

        //console.log(viewData.updateOrderId());
        if (!!viewData.updateBrokerageId()) {
            $.get({
                async: true,
                url: "user/UserBankCard/GetByBrokerageId",
                data: { brokerageId: viewData.updateBrokerageId() },
                success: function (result) {
                    //console.log(result);
                    viewData.updateBankCardListBrokerage.removeAll();
                    ko.mapping.fromJS(result, {}, viewData.updateBankCardListBrokerage);
                    if (viewData.updateBankCardListBrokerage().length === 0) {
                        $.tips("该会员没有结佣账户信息", $("#selUpdateBankCardBrokerage"));
                    }
                },
                error: function (resultErr) {
                    viewData.updateBankCardIdBrokerage(null);
                    viewData.updateBankCardListBrokerage.removeAll();
                    $.tips(resultErr.responseText, $("#updateBrokerageId"));
                }
            });
        } else {
            viewData.updateBankCardIdBrokerage(null);
            viewData.updateBankCardListBrokerage.removeAll();
        }

    });


    //鼠标移开加载该会员的结佣账户（删除结佣账户功能）
    $("#orderUserId").focusout(function () {
        getDeleteBankCardByUserId(viewData.orderUserId());
    });


    //鼠标移开加载服务经理
    $("#orderAdminId").focusout(function () {
        jQuery("#selAdminInfo").empty();
        jQuery("#selAdminInfo").prepend("<option value=''>请选择</option>");
        //绑定分配服务经理
        $.Data.bindAdmin({ selId: "selAdminInfo", roleIds: "26,27,37,47,48,49,58,68", status: "" });
    });

});


//根据UserId获取删除结佣账户信息
function getDeleteBankCardByUserId(userId) {
    //判断是否有值
    if (!!userId) {
        $.get({
            async: true,
            url: "user/UserBankCard/getByUserId",
            data: { userId: userId },
            success: function (result) {
                //console.log(result);
                viewData.deleteBankCardList.removeAll();
                ko.mapping.fromJS(result, {}, viewData.deleteBankCardList);
                if (viewData.deleteBankCardList().length === 0) {
                    $.tips("该会员没有结佣账户信息", $("#selBankCard"));
                }
                //console.log(viewData.bankCardList());
            },
            error: function (resultErr) {
                $.errorMsg(resultErr.responseText);
            }
        });
    } else {
        viewData.deleteBankCardList.removeAll();
    }
}


//根据UserId获取修改结佣账户信息
function getUpdateBankCardByUserId(userId) {
    //判断是否有值
    if (!!userId) {
        $.get({
            async: true,
            url: "user/UserBankCard/getByUserId",
            data: { userId: userId },
            success: function (result) {
                //console.log(result);
                viewData.updateBankCardList.removeAll();
                ko.mapping.fromJS(result, {}, viewData.updateBankCardList);
                if (viewData.updateBankCardList().length === 0) {
                    $.tips("该会员没有结佣账户信息", $("#selUpdateBankCard"));
                }
                //console.log(viewData.bankCardList());
            },
            error: function (resultErr) {
                $.errorMsg(resultErr.responseText);
            }
        });
    } else {
        viewData.updateBankCardList.removeAll();
    }
}
