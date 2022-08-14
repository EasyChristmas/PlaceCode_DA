//提交工单
grid.openTable = function (obj) {
    var id = $(obj).attr("data-id");
    var targetType = $(obj).attr("data-targetType");
    var status = $(obj).attr("data-status");
    var targetId = $(obj).attr("data-targetId");
    var message = $(obj).attr("data-message");
    var ids = null;
    if (targetType == 5 || targetType == 6) {
        if (message) {
            var spl1 = message.split("】");
            if (spl1.length >= 1) {
                var spl2 = spl1[0].split("【");
                if (spl2.length >= 2) {
                    ids = spl2[1];
                }
            }
        }
    }
    if (status != 2) {
        $.put({
            url: "message/sysmessage/updatestatus/" + id,
            data: { status: 2 },
            success: function (data) {
                //if (status == 0) {
                //    self.loadNewsList();
                //}
                msgOpenTab(targetType, targetId, ids);
            },
            error: function (error) {
                console.log(error.responseText);
            }
        });
    } else {
        msgOpenTab(targetType, targetId, ids);
    }
}
//打开tab详情框
function msgOpenTab(targetType, targetId, ids) {
    switch (parseInt(targetType)) {
        case 1:
            $.openTab({
                url: '/user/edit?id=' + targetId,
                title: "用户详情 - " + targetId
            });
            break;
        case 2:
            $.openTab({
                url: '/product/detail?id=' + targetId,
                title: "产品详情 - " + targetId
            });
            break;
            //呼入呼出
        case 4:
            $.openTab({
                url: '/user/edit?trackingid=' + targetId,
                title: "跟进详情 - " + targetId
            });
            break;
        case 5:
            $.openTab({
                url: '/user/index?ids=' + ids,
                title: "分配会员列表"
            });
            break;
        case 6:
            if (("," + $("#currentRoleIds").val() + ",").indexOf(",26,") >= 0 || ("," + $("#currentRoleIds").val() + ",").indexOf(",56,") >= 0) {
                $.openTab({
                    url: '/user/allotuser?allotUserId=' + targetId,
                    title: "会员下发"
                });
            } else if (("," + $("#currentRoleIds").val() + ",").indexOf(",27,") >= 0) {
                $.openTab({
                    url: '/user/index?ids=' + ids,
                    title: "下发会员列表"
                });
            }
            break;
        case 7:
            $.openTab({
                url: '/user/userapply?userApplyId=' + targetId,
                title: "会员申请"
            });
            break;
            //跟进记录里新增跟进下次跟进到时间提醒
        case 8:
            $.openTab({
                url: '/user/edit?id=' + targetId,
                title: "跟进详情 - " + targetId
            });
            break;
        case 9:
            $.openTab({
                url: '/trade/contract?productId=' + targetId,
                title: "合同管理 - " + targetId
            });
            break;
            //喜报
        case 11:
            $.get({
                url: 'trade/order/getorderxb',
                data: { id: targetId },
                success: function (result) {
                    if (result != null) {
                        $("#pName").html(result.departmentName + " " + result.adminName);
                        $("#pProductName").html(result.productName);
                        $("#pTime").html("于" + result.payTimeText + "进款");
                        $("#pMoney").html(result.priceText + "万");
                        //壹财富的报单
                        if (result.platform == 1) {
                            $("#imgXbLogo").attr("src", "/images/xibao/1caifu_logo.png");
                        }//九天的报单
                        else if (result.platform == 2) {
                            $("#imgXbLogo").attr("src", "/images/xibao/jt_logo.png");
                        }
                        $('.xibao').show();
                    }
                }
            });
            break;
    }
};