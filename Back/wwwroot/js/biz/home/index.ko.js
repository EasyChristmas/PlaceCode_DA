var HomeIndexViewModel = function () {
    var that = this;
    that.data = {
        currentUserId: $('#currentUserId').val(),
        menuList: ko.observableArray([]),
        msgCount: ko.observable(0),
        newsList: ko.observableArray([]),//消息实体
        oldPwd: ko.observable(null),
        newPwd: ko.observable(null),
        confirmPwd: ko.observable(null),
        isCloseMenu: ko.observable(false)
    };
    that.init = function () {
        //初始化左侧菜单
        that.initMenu();
        that.loadNewsList();
    };
    //页面中的其他方法
    that.initMenu = function () {
        //获取所在角色的所有菜单
        $.get({
            url: "sys/adminrole/get",
            data: { adminId: that.data.currentUserId },
            async: false,
            success: function (result) {
                var str = ",";
                for (i = 0; i < result.length; i++) {
                    str += (result[i].roleId + ",");
                }

                //根据角色集获取菜单
                $.get({
                    url: "sys/rolepower/get",
                    data: { roleString: str },
                    async: false,
                    success: function (result) {
                        for (i = 0; i < result.length; i++) {
                            if (result[i].function.isShow) {
                                var flag = true;
                                for (j = 0; j < that.data.menuList().length; j++) {
                                    if (result[i].functionId == that.data.menuList()[j].id) {
                                        flag = false;
                                        break;
                                    };
                                }
                                if (flag) {
                                    that.data.menuList().push(result[i].function);
                                }
                            }
                        }
                    }
                });

                //获取用户菜单
                $.get({
                    url: "sys/adminpower/get",
                    data: { adminId: that.data.currentUserId },
                    async: false,
                    success: function (result) {
                        for (i = 0; i < result.length; i++) {
                            if (result[i].function.isShow && result[i].operateType) {
                                var flag = true;
                                for (j = 0; j < that.data.menuList().length; j++) {
                                    if (result[i].functionId == that.data.menuList()[j].id) {
                                        flag = false;
                                        break;
                                    };
                                }
                                if (flag) {
                                    that.data.menuList().push(result[i].function);
                                }

                            } else if (!result[i].operateType) {
                                for (j = 0; j < that.data.menuList().length; j++) {
                                    if (result[i].functionId == that.data.menuList()[j].id) {
                                        that.data.menuList().splice(j, 1);
                                        break;
                                    };
                                }
                            }
                        }
                    }
                });
            }
        });

        //排序
        that.data.menuList().sort(function (a, b) {
            return a.sort - b.sort;
        });

        //子系统的菜单添加token,timestamp处理
        that.data.menuList().filter(x => x.project > 2).forEach(function (item) {
            item.code = item.code + (item.code.indexOf('?') > 0 ? "&" : "?") + "adminId=" + currentUserId + "&timeStamp=" + timeStamp + "&token=" + token;
        });

        //重置一级二级菜单
        $.toTreeList(that.data.menuList(), function (res) {
            that.data.menuList(res);
        });
    };
    //加载消息实体
    that.loadNewsList = function () {
        $.get({
            url: "message/sysmessage",
            success: function (result) {
                if (result.data.length == 0)
                    $(".right_dialog").html("<p class='tc col999' style='margin-top:100px;'>当前您没有消息提醒哦！</p>");
                that.data.newsList(result.data);
                var cout = 0;
                for (i = 0; i < result.data.length; i++) {
                    if (result.data[i].status < 2) {
                        cout++;
                    }
                }
                that.data.msgCount(cout);
            }
        });
    };
    //点击消息弹出tab框
    that.openTable = function (obj) {
        var id = $(obj).attr("data-id");
        var targetType = $(obj).attr("data-targetType");
        var status = $(obj).attr("data-status");
        var targetId = $(obj).attr("data-targetId");
        var message = $(obj).attr("data-message");
        var ids = null;
        if (targetType == 5 || targetType == 6) {
            if (message) {
                var spl1 = message.split("】");
                var idx = spl1.length - 2 >= 0 ? spl1.length - 2 : 0;
                var spl2 = spl1[idx].split("【");
                ids = spl2[spl2.length - 1];
                //var spl1 = message.split("】");
                //if (spl1.length >= 1) {
                //    var spl2 = spl1[0].split("【");
                //    if (spl2.length >= 2) {
                //        ids = spl2[1];
                //    }
                //}
            }
        }
        if (status != 2) {
            $.put({
                url: "message/sysmessage/updatestatus/" + id,
                data: { status: 2 },
                success: function (data) {
                    //if (status == 0) {
                    //    that.loadNewsList();
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
    };
    //修改密码
    that.changePwd = function () {
        $(this).parent().parent('.user-menu').hide();
        $(this).parent().parent('.user-menu').prev().removeClass('on');
        $.openDialog({
            title: '修改密码',
            jqObj: $('#divPassWord')
        });
    };
    //提交修改密码
    that.submitPwd = function () {
        if ($("#passwordForm").validate()) {
            if (that.data.newPwd() !== that.data.confirmPwd()) {
                $.tips("确认密码不一致！", $("#confirmPwd"));
                return;
            }
            $.put({
                url: "sys/admin/ResetPwd/0",
                data: { oldPassWord: that.data.oldPwd(), newPassWord: that.data.newPwd() },
                success: function (result) {
                    if (result != null && parseInt(result) > 0) {
                        $("#passwordForm").resetForm();
                        $("#divPassWord").modal("hide");
                        that.data.oldPwd(null);
                        that.data.newPwd(null);
                        $.success("密码修改成功！", 2000);
                    }
                },
                error: function (resultErr) {
                    $.tips(resultErr.responseText, $('#btnaddType'), 2000);
                }
            });

        }
    };
    //ERP1.0正式上线
    that.newFunction = function () {
        $(".dialog_index_bg").toggleClass("min");
    };
    //左侧菜单折叠 展开
    that.toggleMenu = function () {
        var state = that.data.isCloseMenu();
        that.data.isCloseMenu(!state);
    };
};
var vm = new HomeIndexViewModel();
ko.applyBindings(vm, document.getElementById("homeIndex"));
ko.applyBindings(vm, document.getElementById("divPassWord"));
ko.applyBindings(vm, document.getElementById("newFunction"));
vm.init();
//封装的其他方法
//打开tab详情框
function msgOpenTab(targetType, targetId, ids) {
    switch (parseInt(targetType)) {
        //会员、认证、专属理财师
        case 1: case 10001: case 11003: case 11004:
            $.openTab({
                url: '/user/edit?id=' + targetId,
                title: "用户详情 - " + targetId
            });
            break;
        //用户签约(结佣账号用户凭证审核)
        case 17:
            $.openTab({
                url: '/user/edit?id=' + targetId + "&tag=bankCard",
                title: "用户详情 - " + targetId
            });
            break;
        //咨询
        case 11001:
        case 11002:
            $.openTab({
                url: '/user/userappointment?id=' + targetId,
                title: '咨询管理 - ' + targetId
            });
            break;
        case 11005:
            $.openTab({
                url: '/user/useraudit',
                title: '会员审核'
            });
            break;
        //产品
        case 2: case 25001:
            $.get({
                url: '/product/getproductinfo/' + targetId,
                success: function (product) {
                    if (product.productTypeId <= 2) {
                        $.openTab({
                            url: '/product/detail?id=' + targetId,
                            title: "产品详情 - " + targetId
                        });
                    }
                    else if (product.productTypeId == 3) {
                        $.openTab({
                            url: '/product/creditdetail?id=' + targetId,
                            title: "产品详情 - " + targetId
                        });
                    }
                    else if (product.productTypeId == 4) {
                        $.openTab({
                            url: '/product/privatedetail?id=' + targetId,
                            title: "产品详情 - " + targetId
                        });
                    }
                    else {
                        $.openTab({
                            url: '/product/pevcdetail?id=' + targetId,
                            title: "产品详情 - " + targetId
                        });
                    }
                }
            });
            break;
        //交易-预约、报单、结佣
        case 30001:
        case 30002:
        case 30003:
        case 30004:
        case 30005:
        case 30006:
        case 30008:
        case 31001:
        case 31005:
        case 31006:
        case 32005:
        case 32006:
            $.openTab({
                url: '/trade/orderapprove?orderId=' + targetId,
                title: '交易详情 - ' + targetId
            });
            break;
        //交易-快捷报单
        case 31007:
            $.openTab({
                url: '/trade/quickorder?id=' + targetId,
                title: '快捷报单 - ' + targetId
            });
            break;
        //报单分配服务经理、报单修改结佣账户、报单修改打款时间
        case 33001: case 33002: case 33003:
            $.openTab({
                url: '/trade/order?id=' + targetId,
                title: '报单列表 - ' + targetId
            });
            break;
        //  呼入呼出 --弃用
        case 4:
            $.openTab({
                url: '/user/edit?trackingid=' + targetId,
                title: "跟进详情 - " + targetId
            });
            break;
        //跟进呼入
        case 41001:
            partial_ut_callin_VM.partial_ut_callin_callTracking(targetId);
            $.openTab({
                url: '/user/edit?trackingid=' + targetId,
                title: "跟进详情 - " + targetId
            });
            break;
        //跟进呼出
        case 42001:
            partial_ut_callout_VM.partial_ut_callout_callTracking(targetId);
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
        //申请分配合同
        case 9:
            $.openTab({
                url: '/trade/contract?productId=' + targetId,
                title: "合同管理 - " + targetId
            });
            break;
        //发送合同
        case 90001:
            $.openTab({
                url: '/trade/contractApply?Id=' + targetId,
                title: "合同申请 - " + targetId
            });
            break;
        //合同已发总部
        case 90002:
            $.openTab({
                url: '/trade/contract?productId=' + targetId,
                title: "合同管理 - " + targetId
            });
            break;
        //确认书（合同岗收到服务经理的确认通知）
        case 10:
            $.openTab({
                url: '/trade/confirmation?id=' + targetId,
                title: "确认书管理 - " + targetId
            });
            break;
        //会员确认书（服务经理查看合同岗入库和寄出通知）
        case 100001: case 100003:
            $.openTab({
                url: '/user/userConfirmation?id=' + targetId,
                title: "会员确认书 - " + targetId
            });
            break;
        //喜报
        case 11:
            happyPaper(targetId);
            break;
        case 12: case 120001:
            $.openTab({
                url: '/sys/feedbacklist?id=' + targetId,
                title: "意见反馈 - " + targetId
            });
            break;
        //系统工单
        case 13:
            $.openTab({
                url: "/Sys/SysJobLog?id=" + targetId,
                title: "工单记录 - " + targetId
            });
            break;
        //系统升级
        case 130001:
            break;
        //会员存续
        case 14:
            $.openTab({
                url: "/User/UserExistence?id=" + targetId,
                title: "会员存续 - " + targetId
            });
            break;
        //供应商认证
        case 16:
            $.openTab({
                url: "/up/supplier?supplierId=" + targetId,
                title: "供应商管理 - " + targetId
            });
            break;
        //发行易推荐项目
        case 200001:
            $.openTab({
                url: "/product/ProductRecommend?id=" + targetId,
                title: "提交项目 - " + targetId
            });
    }
    //点击喜报消息不需要刷新右侧消息列表（喜报消息不展示在右侧列表了）
    if (parseInt(targetType) != 11) {
        vm.loadNewsList();
    }
}

//初始化内容区域的容器 
function initContainer() {

    function t(t) {
        var e = 0;
        return $(t).each(function () {
            e += $(this).outerWidth(!0);
        }), e;
    }

    function e(e) {
        var a = t($(e).prevAll()), i = t($(e).nextAll()), n = t($(".content-tabs").children().not(".J_menuTabs")), s = $(".content-tabs").outerWidth(!0) - n, r = 0;
        if ($(".page-tabs-content").outerWidth() < s) r = 0; else if (i <= s - $(e).outerWidth(!0) - $(e).next().outerWidth(!0)) {
            if (s - $(e).next().outerWidth(!0) > i) {
                r = a;
                for (var o = e; r - $(o).outerWidth() > $(".page-tabs-content").outerWidth() - s;) r -= $(o).prev().outerWidth(), o = $(o).prev();
            }
        } else a > s - $(e).outerWidth(!0) - $(e).prev().outerWidth(!0) && (r = a - $(e).prev().outerWidth(!0));
        $(".page-tabs-content").animate({ marginLeft: 0 - r + "px" }, "fast");
    }

    function a() {
        var e = Math.abs(parseInt($(".page-tabs-content").css("margin-left"))), a = t($(".content-tabs").children().not(".J_menuTabs")),
            i = $(".content-tabs").outerWidth(!0) - a, n = 0;
        if ($(".page-tabs-content").width() < i) {
            $(".page-tabs-content").animate({ marginLeft: 0 + "px" }, "fast");
        } else {
            for (var s = $(".J_menuTab:first"), r = 0; r + $(s).outerWidth(!0) <= e;) r += $(s).outerWidth(!0), s = $(s).next();
            if (r = 0, t($(s).prevAll()) > i) {
                for (; r + $(s).outerWidth(!0) < i && s.length > 0;) r += $(s).outerWidth(!0), s = $(s).prev();
                n = t($(s).prevAll());
            }
            $(".page-tabs-content").animate({ marginLeft: 0 - n + "px" }, "fast");
        }
    }

    function i() {
        var e = Math.abs(parseInt($(".page-tabs-content").css("margin-left"))), a = t($(".content-tabs").children().not(".J_menuTabs")),
            i = $(".content-tabs").outerWidth(!0) - a, n = 0;
        if ($(".page-tabs-content").width() < i) {
            $(".page-tabs-content").animate({ marginRight: 0 + "px" }, "fast");
        } else {
            for (var s = $(".J_menuTab:first"), r = 0; r + $(s).outerWidth(!0) <= e;) r += $(s).outerWidth(!0), s = $(s).next();
            for (r = 0; r + $(s).outerWidth(!0) < i && s.length > 0;) r += $(s).outerWidth(!0), s = $(s).next();
            n = t($(s).prevAll()), n > 0 && $(".page-tabs-content").animate({ marginLeft: 0 - n + 400 + "px" }, "fast");
        }

    }

    //刷新Im窗口
    function refreshIm() {
        var imsrc = $(".J_iframe[data-type='im']").attr("src");
        if (imsrc != undefined && imsrc.length != 0) {
            window.frames[0].postMessage('closeWin', imUrl);
        }
    }

    //点击二级菜单
    function n() {
        refreshIm();
        var that = $(this);
        var t = $(this).attr("href"),
            a = $(this).data("index"),
            i = $.trim($(this).text()),
            n = !0;
        //增加选中效果 
        that.parent().parent().parent().find('.J_menuItem,.saas-nav-li-one').removeClass('active');
        that.parent().prev().addClass('active');
        that.addClass('active');
        if (void 0 == t || 0 == $.trim(t).length) return !1;
        if ($(".J_menuTab").each(function () {
            return $(this).data("id") == t
                ? ($(this).hasClass("active") ||
                    ($(this).addClass("active").siblings(".J_menuTab").removeClass("active"),
                        e(this),
                        $(".J_mainContent .J_iframe").each(function () {
                            return $(this).data("id") == t ? ($(this).show().siblings(".J_iframe").hide(), !1) : void 0;
                        })), n = !1, !1)
                : void 0;
        }), n) {
            if (window.parent.$("iframe.J_iframe").length >= 15) {
                window.parent.$.alert("亲，打开窗口太多，赶紧清理一下吧 O(∩_∩)O~ ");
                return !1;
            } else {
                var s = '<a href="javascript:;" class="active J_menuTab" data-id="' + t + '">' + i + ' <i class="icon-remove-sign"></i></a>';
                $(".J_menuTab").removeClass("active");
                var r = '<iframe class="J_iframe" name="iframe' + a + '" width="100%" height="100%" src="' + t + '" frameborder="0" data-id="' + t + '" seamless></iframe>';
                $(".J_mainContent").find("iframe.J_iframe").hide().parents(".J_mainContent").append(r);
                var o = layer.load(2);
                $(".J_mainContent iframe:visible").load(function () {
                    layer.close(o);
                }), $(".J_menuTabs .page-tabs-content").append(s), e($(".J_menuTab.active"));
            }
        }
        //每打开一个新的选项卡重新加载IM
        $(".J_iframe[data-type='im']").attr("src", $("J_iframe[data-type='im']").attr("data-id"));
        return !1;

    }

    function s() {
        var t = $(this).parents(".J_menuTab").data("id"), a = $(this).parents(".J_menuTab").width();
        if ($(this).parents(".J_menuTab").hasClass("active")) {
            if ($(this).parents(".J_menuTab").next(".J_menuTab").size()) {
                var i = $(this).parents(".J_menuTab").next(".J_menuTab:eq(0)").data("id");
                $(this).parents(".J_menuTab").next(".J_menuTab:eq(0)").addClass("active"), $(".J_mainContent .J_iframe").each(function () {
                    return $(this).data("id") == i ? ($(this).show().siblings(".J_iframe").hide(), !1) : void 0;
                });
                var n = parseInt($(".page-tabs-content").css("margin-left"));
                0 > n && $(".page-tabs-content").animate({ marginLeft: n + a + "px" }, "fast"), $(this)
                    .parents(".J_menuTab").remove(), $(".J_mainContent .J_iframe").each(function () {
                        return $(this).data("id") == t ? ($(this).remove(), !1) : void 0;
                    });
            }
            if ($(this).parents(".J_menuTab").prev(".J_menuTab").size()) {
                var i = $(this).parents(".J_menuTab").prev(".J_menuTab:last").data("id");
                $(this).parents(".J_menuTab").prev(".J_menuTab:last").addClass("active"), $(".J_mainContent .J_iframe")
                    .each(function () {
                        return $(this).data("id") == i ? ($(this).show().siblings(".J_iframe").hide(), !1) : void 0;
                    }), $(this).parents(".J_menuTab").remove(), $(".J_mainContent .J_iframe").each(function () {
                        return $(this).data("id") == t ? ($(this).remove(), !1) : void 0;
                    });
            }
        } else $(this).parents(".J_menuTab").remove(), $(".J_mainContent .J_iframe").each(function () {
            return $(this).data("id") == t ? ($(this).remove(), !1) : void 0;
        }), e($(".J_menuTab.active"));
        return !1;
    }

    function r() {
        $(".page-tabs-content").children("[data-id]").not(":first").not(".active").each(function () {
            $('.J_iframe[data-id="' + $(this).data("id") + '"]').remove(), $(this).remove();
        }), $(".page-tabs-content").css("margin-left", "0");
    }

    function o() {
        e($(".J_menuTab.active"));
        //切换选项卡时，重新加载IM
        $(".J_iframe[data-type='im']").attr("src", $("J_iframe[data-type='im']").attr("data-id"));
    }
    //切换选显卡
    function d() {
        refreshIm();
        if (!$(this).hasClass("active")) {
            var t = $(this).data("id");
            $(".J_mainContent .J_iframe").each(function () {
                //点击IM选项卡才加载IM页面
                if ($(this).data("id") == t && $(this).attr("src") != $(this).attr("data-id")) $(this).attr("src", $(this).attr("data-id"));
                return $(this).data("id") == t ? ($(this).show().siblings(".J_iframe").hide(), !1) : void 0;
            }), $(this).addClass("active").siblings(".J_menuTab").removeClass("active"), e(this);
            //更改对应的左侧二级菜单选中效果
            $('#menu .J_menuItem').each(function (index, item) {
                if ($(item).attr('href') == t) {
                    $(item).parent().parent('li').siblings().find('.J_menuItem').removeClass('active');
                    $(item).siblings().removeClass('active');
                    $(item).addClass('active');
                }
            });
        }
    }

    function c() {
        var t = $('.J_iframe[data-id="' + $(this).data("id") + '"]'), e = t.attr("src"), a = layer.load(2);
        t.attr("src", e).load(function () {
            layer.close(a);
        });
    }
    $("#menuCh").delegate(".J_menuItem", "click", n);//点击左侧二级菜单

    $(".J_menuTabs").on("click", ".J_menuTab i", s),//关闭单个选项卡
        $(".J_tabCloseOther").on("click", r),
        $(".J_tabShowActive").on("click", o),
        $(".J_menuTabs").on("click", ".J_menuTab", d),//切换选项卡
        $(".J_menuTabs").on("dblclick", ".J_menuTab", c),//双击选项卡
        $(".J_tabLeft").on("click", a),
        $(".J_tabRight").on("click", i),
        $(".J_tabCloseAll").on("click", function () {
            $(".page-tabs-content").children("[data-id]").not(":first").each(function () {
                $('.J_iframe[data-id="' + $(this).data("id") + '"]').remove(), $(this).remove();
            }), $(".page-tabs-content").children("[data-id]:first").each(function () {
                $('.J_iframe[data-id="' + $(this).data("id") + '"]').show(), $(this).addClass("active");
            }), $(".page-tabs-content").css("margin-left", "0");
        });
}

//关闭子选项卡刷新父选项卡
function refreshWin(rid, cid) {

    if (rid && rid.indexOf("'") == 0) rid = rid.replace(/'/ig, "");
    if (cid && cid.indexOf("'") == 0) cid = cid.replace(/'/ig, "");

    if ($("a[data-id=\"" + rid + "\"]").length == 0) {
        $("a[data-id=\"" + cid + "\"]").prev(".J_menuTab:last").addClass("active");
        $("iframe[data-id=\"" + cid + "\"]").prev(".J_iframe:last").show();
    }

    //删除tab选项卡
    $("a[data-id='" + cid + "']").remove();
    //删除iframe框架页面
    $("iframe[data-id='" + cid + "']").remove();

    if ($("a[data-id=\"" + rid + "\"]").length > 0) {
        //单击切换选项卡
        $("a[data-id='" + rid + "']").trigger("click");
        //双击刷新选项卡
        $("a[data-id='" + rid + "']").trigger("dblclick");
    }
}

//关闭子选项卡局部刷新父选项卡
function partRefreshWin(rid, cid) {
    if (rid && rid.indexOf("'") == 0) rid = rid.replace(/'/ig, "");
    if (cid && cid.indexOf("'") == 0) cid = cid.replace(/'/ig, "");

    if ($("a[data-id=\"" + rid + "\"]").length == 0) {
        $("a[data-id=\"" + cid + "\"]").prev(".J_menuTab:last").addClass("active");
        $("iframe[data-id=\"" + cid + "\"]").prev(".J_iframe:last").show();
    }

    //删除tab选项卡
    $("a[data-id=\"" + cid + "\"]").remove();
    //删除iframe框架页面
    $("iframe[data-id=\"" + cid + "\"]").remove();

    if ($("a[data-id=\"" + rid + "\"]").length > 0) {
        //单击切换选项卡
        $("a[data-id=\"" + rid + "\"]").trigger("click");
    }

    //局部刷新
    var iframe = $("iframe[data-id=\"" + rid + "\"]");
    if (iframe.length > 0) {
        var content = iframe[0].contentWindow;
        if (typeof (content.partRefreshData) == "function")
            content.partRefreshData();
    }
}

//页面之间的回调
function pageCallBack(rid, data) {
    if (rid && rid.indexOf("'") == 0) rid = rid.replace(/'/ig, "");

    //if ($("a[data-id=\"" + rid + "\"]").length > 0) {
    //    //单击切换选项卡
    //    $("a[data-id=\"" + rid + "\"]").trigger("click");
    //}
    var iframe = $("iframe[data-id=\"" + rid + "\"]");
    if (iframe.length > 0) {
        var content = iframe[0].contentWindow;
        if (typeof (content.callBack) == "function")
            content.callBack(data);
    }
}

//切换选项卡
function changeWin(rid) {
    if (rid && rid.indexOf("'") == 0) rid = rid.replace(/'/ig, "");
    var iframe = $("iframe[data-id=\"" + rid + "\"]");
    if (iframe.length > 0) {
        //单击切换选项卡
        $("a[data-id='" + rid + "']").trigger("click");
        return false;
    }
    return true;
}

//显示喜报
function happyPaper(targetId) {
    $.get({
        url: 'trade/order/getorderxb',
        data: { id: targetId },
        success: function (result) {
            if (result != null) {
                var departmentName = result.departmentName;
                var adminName = result.adminName;
                var payTimeText = result.payTimeText;
                var productName = result.productName;
                var priceText = result.priceText;
                $('#happyPaper').show();
                $("#happyPaper").append('<div class="xibao_con animated-fast tada"> ' +
                    '<div class="text_normal" >' +
                    '<p class="f12 department">' + departmentName + '</p>' +
                    '<b class="f20 db padding_top">恭喜<span class="ml10">' + adminName + '</span></b>' +
                    '<p class="f14" style="padding:5px 30px 0;">于' + payTimeText + '进款' + productName + '项目</p>' +
                    '<b class="f26 money">' +
                    '<span>' + priceText + '</span>万' +
                    '</b>' +
                    '</div >' +
                    '<a href= "javascript:;" title= "关闭" class="xb_close"> X </a>' +
                    '</div >');

                if (departmentName === '营业一部') {
                    $('.xibao_con').css({
                        "background": "url(/images/xibao/bg01.jpg) no-repeat",
                        "background-size": "100% 100%"
                    });
                    $(".text_normal").removeClass('text_normal').addClass('text_01');
                }
                else if (departmentName === '营业二部') {
                    $('.xibao_con').css({
                        "background": "url(/images/xibao/bg02.jpg) no-repeat",
                        "background-size": "100% 100%"
                    });
                    $(".text_normal").removeClass('text_normal').addClass('text_02');
                }
                else if (departmentName === '营业三部') {
                    $('.xibao_con').css({
                        "background": "url(/images/xibao/bg03.jpg) no-repeat",
                        "background-size": "100% 100%"
                    });
                    $(".text_normal").removeClass('text_normal').addClass('text_03');
                }
                else {
                    $('.xibao_con').css({
                        "background": "url(/images/xibao/bg.jpg) no-repeat",
                        "background-size": "100% 100%"
                    });
                };

                //撒花效果
                for (var i = 0; i < parseInt(Math.random() * 50) + 30; i++) {
                    var b = new Boom(200, 300);
                    b.mDrop();
                }
                //关掉喜报
                $('.xb_close').on('click', function () {
                    $('.xibao').empty().hide();
                });
                setTimeout(() => {
                    $('.xibao').empty().hide();
                }, 3000);
            }
        }
    });
}