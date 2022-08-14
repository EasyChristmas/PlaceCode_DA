
$(function () {
    if (currentUserId == 71 || currentUserId == 86 || currentUserId == 42 || currentUserId == 524 || currentUserId == 442 || currentUserId == 740 || currentUserId == 89 || currentUserId == 576 || currentUserId == 298) {
        $("#switchId").empty();
        if (currentUserId == 71)
            $("#switchId").append("<option value='71' selected='selected'>万季明</option>").append("<option value='86'>会计</option>");
        else if (currentUserId == 86)
            $("#switchId").append("<option value='86' selected='selected'>会计</option>").append("<option value='71'>万季明</option>");
        else if (currentUserId == 42)
            $("#switchId").append("<option value='42' selected='selected'>黄友娟</option>").append("<option value='524'>小壹</option>");
        else if (currentUserId == 524)
            $("#switchId").append("<option value='524' selected='selected'>小壹</option>").append("<option value='42'>黄友娟</option>");
        else if (currentUserId == 442)
            $("#switchId").append("<option value='442' selected='selected'>金彩云</option>").append("<option value='740'>腾云客服(金彩云)</option>");
        else if (currentUserId == 740)
            $("#switchId").append("<option value='740' selected='selected'>腾云客服(金彩云)</option>").append("<option value='442'>金彩云</option>");
        else if (currentUserId == 89)
            $("#switchId").append("<option value='89' selected='selected'>徐婷</option>").append("<option value='576'>马文龙</option>");
        else if (currentUserId == 576)
            $("#switchId").append("<option value='576' selected='selected'>马文龙</option>").append("<option value='89'>徐婷</option>");
        else if (currentUserId == 298)
            $("#switchId").append("<option value='298' selected='selected'>李星星</option>").append("<option value='98'>刘晓焕</option>");
    } else {
        $.Data.bindAdmin({ selId: "switchId" });
    }
    //顶部公告初始化
    $.loadpopup();
    $('.sysAnnouncement').on("click", function () {
        $(this).hide();
        $('#menuCh,#sidebar').css('top', '45px');
    });
    //左侧二级菜单 js
    var subRight = function () {
        $('#sun_menu').fadeIn('fast');
        $('.icon-chevron-left').css('display', 'block');
        $('.icon-chevron-right').css('display', 'none');
    };
    var subLeft = function () {
        $('#sun_menu').fadeOut('fast');
        $('.icon-chevron-left').css('display', 'none');
        $('.icon-chevron-right').css('display', 'block');
    };
    $('#sun_menu').mouseleave(function () {
        subLeft();
    });
    $(".icon-chevron-right").on("click", function () {
        subRight();
    });
    $(".icon-chevron-left").on("click", function () {
        subLeft();
    });
    //左侧一级菜单
    $('#sidebar-collapse').click(function () {
        $('#sidebar').toggleClass('menu-min');
    });
    //top search
    $('#top-search').click(function () {
        $('#top-search-wrap').css('display', 'block');
        $('#top-search-wrap input').focus();
        return false;
    });
    $('#top-search-close').click(function () {
        $('#top-search-wrap').css('display', 'none');
    });
    //$(document).click(function () {
    //    $('#top-search-wrap').hide();
    //}); 
    //初始化内容区域的容器
    initContainer();
    var list = [];

    //获取用户角色
    $.get({
        url: "sys/adminrole/get",
        data: { adminId: currentUserId },
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
                            for (j = 0; j < list.length; j++) {
                                if (result[i].functionId == list[j].id) {
                                    flag = false;
                                    break;
                                };
                            }
                            if (flag) {
                                list.push(result[i].function);
                            }
                        }
                    }
                }
            });

            //获取用户菜单
            $.get({
                url: "sys/adminpower/get",
                data: { adminId: currentUserId },
                async: false,
                success: function (result) {
                    for (i = 0; i < result.length; i++) {
                        if (result[i].function.isShow && result[i].operateType) {
                            var flag = true;
                            for (j = 0; j < list.length; j++) {
                                if (result[i].functionId == list[j].id) {
                                    flag = false;
                                    break;
                                };
                            }
                            if (flag) {
                                list.push(result[i].function);
                            }

                        } else if (!result[i].operateType) {
                            for (j = 0; j < list.length; j++) {
                                if (result[i].functionId == list[j].id) {
                                    list.splice(j, 1);
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
    list.sort(function (a, b) {
        return a.sort - b.sort;
    });
    console.log('rrrrr', list);
    ko.applyBindings(list, document.getElementById("menu"));
    //二级菜单
    var ViewModel = function () {
        var self = this;
        self.msgCount = ko.observable(0);
        self.listData = ko.observableArray([]);
        self.newsList = ko.observableArray([]);//消息实体
        //加载二级菜单数据
        self.loadData = function () {
            self.listData([]);
            $("#menuName").text($("#menu").children("li.active").eq(0).attr("fun-name"));
            var pId = $("#menu").children("li.active").eq(0).attr("fun-id");
            for (i = 0; i < list.length; i++) {
                if (list[i].parentId == pId) {
                    //如果是不是Erp和Crm
                    if (list[i].project > 2 && list[i].code.indexOf('adminId=') < 0) {
                        if (list[i].code.indexOf('?') < 0)
                            list[i].code = list[i].code + "?adminId=" + currentUserId + "&timeStamp=" + timeStamp + "&token=" + token;
                        else
                            list[i].code = list[i].code + "&adminId=" + currentUserId + "&timeStamp=" + timeStamp + "&token=" + token;

                        //var codeArray = list[i].code.split('?');
                        //if (codeArray.length == 2) {
                        //    list[i].code = list[i].code.replace("&adminId=" + currentUserId,"") + "&adminId=" + currentUserId;
                        //} else {
                        //    list[i].code = list[i].code.replace("?adminId=" + currentUserId, "") + "?adminId=" + currentUserId;
                        //}
                    }
                    self.listData.push(list[i]);
                }
            }
            //排序
            self.listData.sort(function (a, b) {
                return a.sort - b.sort;
            });
        };
        //加载消息实体
        self.loadNewsList = function () {
            $.get({
                url: "message/sysmessage",
                success: function (result) {
                    if (result.data.length == 0)
                        $(".right_dialog").html("<p class='tc col999' style='margin-top:100px;'>当前您没有消息提醒哦！</p>");
                    self.newsList(result.data);
                    var cout = 0;
                    for (i = 0; i < result.data.length; i++) {
                        if (result.data[i].status < 2) {
                            cout++;
                        }
                    }
                    self.msgCount(cout);
                }
            });
        };
        //点击消息弹出tab框
        self.openTable = function (obj) {
            var id = $(obj).attr("data-id");
            var targetType = $(obj).attr("data-targetType");
            var status = $(obj).attr("data-status");
            var targetId = $(obj).attr("data-targetId");
            var message = $(obj).attr("data-message");
            var ids = null;
            if (targetType == 5 || targetType == 6 || targetType==7) {
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
        };
        self.oldPwd = ko.observable(null);
        self.newPwd = ko.observable(null);
        self.confirmPwd = ko.observable(null);
        self.submitPwd = function () {
            if ($("#passwordForm").validate()) {
                if (self.newPwd() !== self.confirmPwd()) {
                    $.tips("确认密码不一致！", $("#confirmPwd"));
                    return;
                }
                $.put({
                    url: "sys/admin/ResetPwd/0",
                    data: { oldPassWord: self.oldPwd(), newPassWord: self.newPwd() },
                    success: function (result) {
                        if (result != null && parseInt(result) > 0) {
                            $("#passwordForm").resetForm();
                            $("#divPassWord").modal("hide");
                            self.oldPwd(null);
                            self.newPwd(null);
                            $.success("密码修改成功！", 2000);
                        }
                    },
                    error: function (resultErr) {
                        $.tips(resultErr.responseText, $('#btnaddType'), 2000);
                    }
                });

            }
        };
        //保存意见反馈 
        self.saveFeed = function () {
            var feedContent = $("#feedContent").val();
            if (!feedContent) {
                $.tips("请填写反馈内容！", $("#btnFeed"));
                return;
            }

            if ($("#addFeed").validate()) {
                $("#addFeed").submitForm({
                    type: 'post',
                    url: 'sys/feedback',
                    data: $("#addFeed").toJson(),
                    success: function (result) {
                        $("#addFeed").resetForm();
                        $.success("您的反馈我们收到啦！");
                        self.closeFeed();
                    },
                    error: function (resultErr) {
                        $.errorMsg(resultErr.responseText);
                    }
                });
            }
        };
        //清除意见反馈
        self.clearFeed = function () {
            $("#addFeed textarea").val("");
            self.closeFeed();
        };
        //关闭意见反馈
        self.closeFeed = function () {
            //$(".feed_dialog").animate({
            //    right: parseInt($(".feed_dialog").css("right"), 10) == 0 ? -420 : 0,
            //});
            $(".feed_d_f").toggle();
        };
        //ERP1.0正式上线
        self.newFunction = function () {
            $(".dialog_index_bg").toggleClass("min");
        };
    };
    //绑定二级菜单
    var vm = new ViewModel();
    ko.applyBindings(vm, document.getElementById("menuCh"));
    ko.applyBindings(vm, document.getElementById("news_record"));
    ko.applyBindings(vm, document.getElementById("divPassWord"));
    ko.applyBindings(vm, document.getElementById("divFeed"));
    ko.applyBindings(vm, document.getElementById("newFunction"));
    vm.loadData();
    vm.loadNewsList();
    //点击一级菜单切换二级菜单数据
    $("#menu").delegate("li", "click", function () {
        subRight();
        $(this).addClass("active").siblings().removeClass("active");
        vm.loadData();
    });
    //右侧消息弹框消失
    function hideRightDia() {
        $("#news_record").removeClass("on");
        $(".right_dialog").fadeOut('fast');
        $(".close_dialog").fadeOut('fast');
    };
    //打开消息记录
    $("#news_record").on("click", function () {
        $(this).toggleClass("on");
        if ($(this).hasClass("on")) {
            $(".right_dialog").fadeIn('fast');
            $(".close_dialog").fadeIn('fast');
        } else {
            $(".right_dialog").fadeOut('fast');
            $(".close_dialog").fadeOut('fast');
        }
    });
    //关闭消息记录,移出弹框自动消失
    $(".close_dialog").on("click", function () {
        hideRightDia();
    });
    $(".right_dialog").mouseleave(function () {
        hideRightDia();
    });
    //意见反馈移出自动关闭
    $('#divFeed').mouseleave(function () {
        $('.feed_d_f').hide();
    });
    ////移出EC聊天窗口自动关闭 
    //$('body').delegate('.layui-layim', 'mouseleave', function () {
    //    $(this).find("a[class*='layui-layer-close']").click();
    //});
    //关闭自适应高度
    $(".close_dialog").css("lineHeight", $(".close_dialog").height() + 'px');
    window.onresize = function () {
        $(".close_dialog").css("lineHeight", $(".close_dialog").height() + 'px');
    };
    //点击退出更改状态
    $("#quit").on("click", function () {
        callcenter.checkOut();
    });

    $('#changePassWord').on('click', function () {
        $(this).parent().parent('.user-menu').hide();
        $(this).parent().parent('.user-menu').prev().removeClass('on');
        $.openDialog({
            title: '修改密码',
            jqObj: $('#divPassWord')
        });
    });
    //打开tab详情框
    function msgOpenTab(targetType, targetId, ids) {
        switch (parseInt(targetType)) {
            //会员、认证、专属理财师、会员申请
            case 1: case 7: case 10001: case 11003: case 11004:
                $.openTab({
                    url: '/user/edit?id=' + targetId,
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
            //case 7:
            //    $.openTab({
            //        url: '/user/userapply?userApplyId=' + targetId,
            //        title: "会员申请"
            //    });
            //    break;
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
    };

    

    //点击用户名下拉窗口
    $('ul.nav.ace-nav').delegate('li #top_user_name', 'click', function (e) {
        $(this).toggleClass('on');
        if ($(this).hasClass('on')) {
            $(this).next('.user-menu').show();
        } else {
            $(this).next('.user-menu').hide();
        };
        //e.stopPropagation();
        $('.user-menu').delegate('.select2-container', 'click', function () {
            if ($(this).hasClass('select2-container--open')) {
                $('.user-menu').mouseleave(function () {
                    $('.user-menu').show().removeClass('animated-fast');
                    $('.user-menu').prev().addClass('on');
                })
            } else if ($(this).hasClass('select2-container--focus')) {
                $('.user-menu').mouseleave(function () {
                    $('.user-menu').hide();
                    $('.user-menu').prev().removeClass('on');
                })
            }
        });
        //鼠标移出用户名下拉窗口，自动消失
        $('.user-menu').mouseleave(function () {
            $('.user-menu').hide();
            $('.user-menu').prev().removeClass('on');
        })
    });

    //系统管理员切换登陆用户
    $("#switchId").change(function () {
        var id = $(this).val();
        $.ajax({
            url: "/account/switch",
            type: "post",
            data: { id: id },
            success: function (result) {
                location.href = "/home/index";
            },
            error: function (xhr) {
                $.errorMsg(xhr.responseText);
            }
        });
    });
    //只有正网才能打电话
    if ($("#environmentName").val() == $.Enum.Environment.production) {
        //登录呼叫中心
        if (
            ("," + $("#currentRoleIds").val() + ",").indexOf(",26,") >= 0
            || ("," + $("#currentRoleIds").val() + ",").indexOf(",27,") >= 0
            || ("," + $("#currentRoleIds").val() + ",").indexOf(",37,") >= 0
            || ("," + $("#currentRoleIds").val() + ",").indexOf(",58,") >= 0
            || ("," + $("#currentRoleIds").val() + ",").indexOf(",49,") >= 0
            || ("," + $("#currentRoleIds").val() + ",").indexOf(",47,") >= 0
        ) {
            //延迟登录合力亿捷呼叫中心
            setTimeout(function () {
                if (isPrivateCloud == "True") {
                    callcenter.onloadPrivateCloud();
                }
                else {
                    callcenter.onloadPublicCloud();
                }
                callcenter.login();
            }, 20000);
        }
        else {
            //清空呼叫系统的控件
            $("#softphone-bar").empty();
        }
    }
    else {
        //清空呼叫系统的控件
        $("#softphone-bar").empty();
    }

    ////测试打电话用
    //setTimeout(function () {
    //    partial_ut_callout_VM.partial_ut_callout_callTracking(220185);
    //  //partial_ut_callin_VM.partial_ut_callin_callTracking(220185);
    //    $.openTab({
    //        url: '/user/edit?trackingid=' + 220185,
    //        title: "跟进详情 - " + 220185
    //    });
    //}, 10000);

    //加载IM
    if ($(".J_iframe[data-type='im']")[0] != undefined) {
        //延迟加载IM
        setTimeout(function () {
            var iframeSrc = imUrl;
            var iframe1 = $(".J_iframe[data-type='im']")[0];
            if (-1 == navigator.userAgent.indexOf("MSIE")) {
                iframe1.src = iframeSrc;
            } else {
                iframe1.location = iframeSrc;
            }
        }, 10000);
    }
    //弹出跟进记录
    //$(".icon-xiaohu").on("click", function () {
    //    $.openDialog({
    //        width: '550',
    //        title: '更新跟进记录',
    //        jqObj: $('#userTracking')
    //    });
    //});


    //在线人数
    signalR.chat.client.getConnectionCount = function (count) {
        $('#userCount').html(count);
    };


    //长连接获取新的站内消息
    signalR.chat.client.getMessage = function (sysMessage) {
        console.log(sysMessage);
        result = eval("(" + sysMessage + ")");
        //弹框处理
        //如果是喜报或者电话消息直接变为已查看，其他消息只变更为已显示
        var status = (result.targetType == 11 || result.targetType == 4 || result.targetType == 41001 || result.targetType == 42001 || result.targetType == 130001 || result.targetType == 15) ? 2 : 1;
        $.put({
            url: "message/sysmessage/updatestatus/" + result.id,
            async: false,
            data: { status: status },
            success: function () { },
            error: function (error) {
                console.log(error.responseText);
            }
        });
        //喜报消息效果
        if (result.targetType == 11) {
            msgOpenTab(result.targetType, result.targetId);
        } else if (result.targetType == 4 || result.targetType == 41001 || result.targetType == 42001) {//打电话直接跳到跟进页面
            msgOpenTab(result.targetType, result.targetId);
        } else if (result.targetType == 8) {//跟进记录里新增跟进下次跟进到时间提醒

        }
        //系统消息提醒
        else if (result.targetType == 130001) {
            var sysMessage = result.message;
            if ($("#notesys").length == 1) {
                $("#notesys").find('span').html(sysMessage);
            } else {
                $("#navbar").append('<div style="height:45px; left: 0; top: 0; right: 0; background: #f7a54a; text-align:center; line-height:45px; color: #fff; " class="pa animated-fast fadeInDown" id="notesys">' +
                    '<span>' + sysMessage + '</span >' +
                    '<a class="fr" style="width:100px; background:#2f4050; color:#fff;">关闭</a>' +
                    '</div >');
            };
            //关闭系统升级
            $('#notesys a').on('click', function () {
                $(this).parent().remove();
            });
        }
        //员工强制退出登录
        else if (result.targetType == 15) {
            callcenter.checkOut();
        }
        //系统右下角弹框效果
        else {
            //$.showMsg({
            //    title: result.title,
            //    text: result.message,
            //    delay: 6000 * (result.weight > 0 ? result.weight : 1),
            //    callback: function () {
            //        $.put({
            //            url: "message/sysmessage/updatestatus/" + result.id,
            //            data: { status: 2 },
            //            success: function () {
            //                var ids = null;
            //                if (result.targetType == 5 || result.targetType == 6) {
            //                    if (result.message) {
            //                        var spl1 = result.message.split("】");
            //                        var idx = spl1.length - 2 >= 0 ? spl1.length - 2 : 0;
            //                        var spl2 = spl1[idx].split("【");
            //                        ids = spl2[spl2.length - 1];
            //                    }
            //                }
            //                msgOpenTab(result.targetType, result.targetId, ids);
            //            },
            //            error: function (error) {
            //                console.log(error.responseText);
            //            }
            //        });
            //    }
            //});
            H5Notification.info(result.title, {
                body: result.message, data: result, click: function (event,result) {
                    $.put({
                        url: "message/sysmessage/updatestatus/" + result.id,
                        data: { status: 2 },
                        success: function () {
                            var ids = null;
                            if (result.targetType == 5 || result.targetType == 6) {
                                if (result.message) {
                                    var spl1 = result.message.split("】");
                                    var idx = spl1.length - 2 >= 0 ? spl1.length - 2 : 0;
                                    var spl2 = spl1[idx].split("【");
                                    ids = spl2[spl2.length - 1];
                                }
                            }
                            msgOpenTab(result.targetType, result.targetId, ids);
                        },
                        error: function (error) {
                            console.log(error.responseText);
                        }
                    });

                }
            });
            vm.loadNewsList();
        }
    };

    //长连接获取跟进完成事件,此时刷新打开的列表相关数据
    signalR.chat.client.userTrackingDone = function (model) {
        var result = eval("(" + model + ")");
        //刷新数据
        $("#content-main iframe.J_iframe", window.parent.document).each(function (index, item) {
            if ($(item).attr("data-id") == "/user/index") {//刷新列表分类
                var content = $(item)[0].contentWindow;
                if (typeof (content.partRefreshKind) == "function")
                    content.partRefreshKind(result.userId);
            }
            if ($(item).attr("data-id") == ("/user/edit?id=" + result.userId)) {//刷新详情页role，kind,wechat
                var content = $(item)[0].contentWindow;
                if (typeof (content.partRefreshTracking) == "function")
                    content.partRefreshTracking(result.userId);
            }
            if ($(item).attr("data-id") == "/user/firstcall") {//刷新首拨名单
                var content = $(item)[0].contentWindow;
                if (typeof (content.partRefreshData) == "function")
                    content.partRefreshData(result.userId);
            }
        });
    };
});

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
        var t = $(this).attr("href"),
            a = $(this).data("index"),
            i = $.trim($(this).text()),
            n = !0;
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
                var o = layer.load();
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

    function d() {
        refreshIm();
        if (!$(this).hasClass("active")) {
            var t = $(this).data("id");
            $(".J_mainContent .J_iframe").each(function () {
                //点击IM选项卡才加载IM页面
                if ($(this).data("id") == t && $(this).attr("src") != $(this).attr("data-id")) $(this).attr("src", $(this).attr("data-id"));
                return $(this).data("id") == t ? ($(this).show().siblings(".J_iframe").hide(), !1) : void 0;
            }), $(this).addClass("active").siblings(".J_menuTab").removeClass("active"), e(this);
        }
    }

    function c() {
        var t = $('.J_iframe[data-id="' + $(this).data("id") + '"]'), e = t.attr("src"), a = layer.load();
        t.attr("src", e).load(function () {
            layer.close(a);
        });
    }

    $(".J_menuItem").each(function (t) {
        $(this).attr("data-index") || $(this).attr("data-index", t);
    }),
        $("#menuCh").delegate(".J_menuItem", "click", n);//点击左侧二级菜单

    //$(".J_menuItem").on("click", n), 
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
    var content = iframe[0].contentWindow;

    if (typeof (content.partRefreshData) == "function")
        content.partRefreshData();
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
};

//关闭刷新浏览器友情提醒
//window.onbeforeunload = function () {
//    var warning = " ";
//    return warning;
//}
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
                        '<b class="f26 money">'+
                            '<span>' + priceText +'</span>万'+
                        '</b>'+
                    '</div >'+
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
};  




