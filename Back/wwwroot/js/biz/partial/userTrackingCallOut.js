
var partial_ut_callout_ViewModel = function () {
    var self = this;

    //跟进编号
    self.partial_ut_callout_trackingid = 0;

    //跟进用户编号
    self.partial_ut_callout_trackingUserId = 0;

    //用户所在平台
    self.partial_ut_callout_userproject = 0;

    //呼出未跟进的数量
    self.partial_ut_callout_callTrackingCount = ko.observable(0);

    //打电话跟进
    self.partial_ut_callout_callTracking = function (trackingId, count) {
        $.get({
            url: "user/UserTracking/" + trackingId,
            success: function (result) {

                var userTracking = result;
                if (userTracking != null) {
                    //呼出调用-获取呼出未跟进的会员数量，页面展示逻辑由页面控制
                    if (count == null) {
                        self.partial_ut_callout_callTrackingCount(self.partial_ut_callout_getFourTracking().length);
                    }
                    //已知呼出未跟进的会员数量
                    else {
                        self.partial_ut_callout_callTrackingCount(parseInt(count));
                    }
                    //跟进页面显示和刷新逻辑
                    //1:如果是系统初始化加载、保存跟进后如果需要跟进则显示跟进页面并刷新跟进页面
                    //2:如果是呼出时之前没有未跟进记录则显示跟进页面并刷新跟进页面
                    if ((count != null && self.partial_ut_callout_callTrackingCount() > 0) || (count == null && self.partial_ut_callout_callTrackingCount() == 1)) {
                        var userInfo = self.partial_ut_callout_getUser(userTracking.userId);
                        //是否能够发送消息
                        var isSendMessage = self.partial_ut_callout_isFirstCall(userTracking.userId);

                        $("#partial_ut_callout_divUserTracking").show();
                        self.partial_ut_callout_trackingid = userTracking.id;
                        self.partial_ut_callout_trackingUserId = userTracking.userId;
                        //绑定电话状态
                        var mobileStatusOptHtml = "";
                        $(partial_ut_callout_trackingMobileStatus).each(function (index, item) {
                            if (userTracking.mobileStatus != null && userTracking.mobileStatus == item.value) {
                                mobileStatusOptHtml += "<option value='" + item.value + "' selected='selected'>" + item.key + "</option>";
                            } else if (item.value == $.Enum.EnumTrackingMobileStatus.connect) {
                                mobileStatusOptHtml += "<option value='" + item.value + "' selected='selected'>" + item.key + "</option>";
                            }
                            else {
                                mobileStatusOptHtml += '<option value=' + item.value + '>' + item.key + '</option>';
                            }
                        });
                        $("#partial_ut_callout_mobileStatus").html(mobileStatusOptHtml);

                        //绑定身份
                        var roleOptHtml = "";
                        $(partial_ut_callout_userRole).each(function (index, item) {
                            if ((item.value >= -1 && item.value < 10) || (item.value >= 21 && item.value <= 30)) {
                                if ((userInfo != null && userInfo.role != null) && userInfo.role == item.value) {
                                    roleOptHtml += "<option value='" + item.value + "' selected='selected'>" + item.key + "</option>";
                                }
                                else {
                                    roleOptHtml += '<option value=' + item.value + '>' + item.key + '</option>';
                                }
                            }
                        });
                        $("#partial_ut_callout_role").html(roleOptHtml);

                        //绑定购买意愿
                        var intentionLevelHtml = "";
                        $(partial_ut_callout_intentionLevel).each(function (index, item) {
                            if (userInfo.purchaseIntentionLevel != null && userInfo.purchaseIntentionLevel == item.value) {
                                intentionLevelHtml += "<option value='" + item.value + "' selected='selected'>" + item.key + "</option>";
                            } else {
                                if (userInfo.purchaseIntentionLevel==null && index == 0) {
                                    intentionLevelHtml += "<option value='" + item.value + "' selected='selected'>" + item.key + "</option>";
                                } else {
                                    intentionLevelHtml += '<option value=' + item.value + '>' + item.key + '</option>';
                                }
                               
                            }
                        });
                        $("#partial_ut_callout_intentionLevel").html(intentionLevelHtml);

                        //绑定分类
                        var userkindOptHtml = "";
                        if ((userInfo != null && userInfo.kind != null) && userInfo.kind == 1) {
                            userkindOptHtml += "<option value='1' selected='selected'>甲</option>";
                            userkindOptHtml += "<option value='2' >乙</option>";
                        }
                        else if ((userInfo != null && userInfo.kind != null) && userInfo.kind == 2) {
                            userkindOptHtml += "<option value='2' selected='selected'>乙</option>";
                            userkindOptHtml += "<option value='1' >甲</option>";
                        }
                        else {
                            $(partial_ut_callout_kind).each(function (index, item) {
                                if ((userInfo != null && userInfo.kind != null) && item.value == userInfo.kind) {
                                    userkindOptHtml += "<option value='" + item.value + "' selected='selected'>" + item.key + "</option>";
                                }
                                else {
                                    if (userInfo.kind == null && index == 0) {
                                        userkindOptHtml += "<option value='" + item.value + "' selected='selected'>" + item.key + "</option>";
                                    } else {
                                        userkindOptHtml += '<option value=' + item.value + '>' + item.key + '</option>';
                                    }
                                }
                            });
                        }
                        $("#partial_ut_callout_userkind").html(userkindOptHtml);
                        //甲类会员已经审核通过，不可修改！
                        if (userInfo != null && userInfo.tag != null && userInfo.tag.indexOf("甲类已审核") != -1) {
                            $("#partial_ut_callout_userkind").attr("disabled", "disabled");
                        }
                        else {
                            $("#partial_ut_callout_userkind").removeAttr("disabled");
                        }

                        if (userInfo != null) {
                            self.partial_ut_callout_userproject = userInfo.project;
                        }
                        //只有当用户是壹财富平台，跟进时才需要编辑身份和分类
                        if (self.partial_ut_callout_userproject == $.Enum.EnumProject.ycf) {
                            $("#partial_ut_callout_divUserRole").show();
                        }
                        else {
                            $("#partial_ut_callout_divUserRole").hide();
                        }

                        //绑定跟进内容
                        $("#partial_ut_callout_content").val(userTracking.content);
                        //绑定微信
                        $("#partial_ut_callout_weChat").val(userInfo != null ? userInfo.weChat : "");

                        ////绑定下次跟进日期
                        //$("#partial_ut_callout_appointmentTime").val(userTracking.appointmentTime != null ? $.showDate(userTracking.appointmentTime, 'yyyy-MM-dd') : "");
                        ////绑定下次跟进小时
                        //var hourOptHtml = "<option value='09'>请选择</option>";
                        //if ((userTracking.appointmentTime != null && $.showDate(userTracking.appointmentTime, 'hh') == 9) || (userTracking.appointmentTime == null && new Date().getHours() == 9)) {
                        //    hourOptHtml += "<option value='09' selected='selected'>9时</option>";
                        //}
                        //else {
                        //    hourOptHtml += "<option value='09'>9时</option>";
                        //}

                        //for (var i = 10; i < 21; i++) {
                        //    if ((userTracking.appointmentTime != null && $.showDate(userTracking.appointmentTime, 'hh') == i) || ((userTracking.appointmentTime == null) && new Date().getHours() == i)) {
                        //        hourOptHtml += "<option value='" + i + "' selected='selected'>" + i + "时</option>";
                        //    }
                        //    else {
                        //        hourOptHtml += '<option value=' + i + '>' + i + '时</option>';
                        //    }
                        //}
                        //$("#partial_ut_callout_hour").html(hourOptHtml);

                        ////绑定下次跟进分钟
                        //var minuteOptHtml = "<option value='0'>请选择</option>";
                        //if ((userTracking.appointmentTime != null && $.showDate(userTracking.appointmentTime, 'mm') == 0) || (userTracking.appointmentTime == null && new Date().getMinutes() < 30)) {
                        //    minuteOptHtml += "<option value='0' selected='selected'>整点</option>";
                        //}
                        //else {
                        //    minuteOptHtml += "<option value='0' >整点</option>";
                        //}
                        //if ((userTracking.appointmentTime != null && $.showDate(userTracking.appointmentTime, 'mm') == 30) || (userTracking.appointmentTime == null && new Date().getMinutes() >= 30)) {
                        //    minuteOptHtml += "<option value='30' selected='selected'>半时</option>";
                        //}
                        //else {
                        //    minuteOptHtml += "<option value='30' >半时</option>";
                        //}
                        //$("#partial_ut_callout_minute").html(minuteOptHtml);

                        //绑定下次跟进时间
                        var appointmentTime = localStorage.getItem("lastTrackingTime");
                        if (appointmentTime) {
                            $("#partial_ut_callout_appointmentTime").val(appointmentTime.substr(0, 10));
                            $("#partial_ut_callout_hour").val(appointmentTime.substr(appointmentTime.indexOf(" ") + 1, 2));
                            $("#partial_ut_callout_minute").val(appointmentTime.substr(appointmentTime.indexOf(":") + 1));
                        }

                        //绑定是否发送短信
                        if (isSendMessage) {
                            $("#partial_ut_callout_smsContent").attr("title", "您好！我是刚才与您联系的您在壹财富的专属服务经理 " + $.getCurrentUser().name + "，工号 " + $.getCurrentUser().jobNum + ",接下来由我服务您。您在使用我们平台过程中或对产品有任何需求疑问，可随时与我联系，400-921-3939！您可以点击http://t.cn/Rllzwpx 进一步了解我们。祝您工作生活愉快！");
                            $("#partial_ut_callout_smsContent").tooltip();
                            $("#partial_ut_callout_divIsSendMessage").show();
                            showSwitchery();//ios
                        }
                        else {
                            $("#partial_ut_callout_divIsSendMessage").hide();
                        }
                        
                        if ($("#currentRole").val() != 'Cs' && userInfo.adminId != parseInt($("#currentUserId").val())) {
                            $("#partial_ut_callout_userTrackingForm select").attr("disabled", "disabled");
                            $("#partial_ut_callout_userTrackingForm input").attr("disabled", "disabled");
                            //$("#partial_ut_callout_content").removeAttr("disabled");
                            //$("#callOutSubmit").removeAttr("disabled");
                        }
                        else {
                            $("#partial_ut_callout_userTrackingForm select").removeAttr("disabled");
                            $("#partial_ut_callout_userTrackingForm input").removeAttr("disabled");
                            $("#partial_ut_callout_intentionLevel").prop("disabled", "disabled");
                        }

                        $.Data.showUserRole(userInfo.role, userInfo.adminId);
                    }
                    //打开呼出跟进页面
                    self.partial_ut_callout_trackingOpen();
                }
            }
        });
    }

    //跟进记录保存
    self.partial_ut_callout_updateTracking = function () {

        ////验证分类
        //if ($("#partial_ut_callout_userkind").val() <= 0) {
        //    $.tips("分类为必填项！", $("#partial_ut_callout_userkind"));
        //    return;
        //}
        //验证内容
        if ($("#partial_ut_callout_mobileStatus").val() == 3 && $("#partial_ut_callout_content").val().trim() == '') {
            $.tips("电话接通，跟进内容为必填！", $("#partial_ut_callout_content"));
            return;
        }
        //日期
        var dateTime = $("#partial_ut_callout_appointmentTime").val();
        //时
        var hour = $("#partial_ut_callout_hour").val();
        //分
        var minute = $("#partial_ut_callout_minute").val();
        var appointmenttime = "";
        if (dateTime.length != 0)
            appointmenttime = dateTime + " " + hour + ":" + minute;


        $("#callOutSubmit").attr("disabled", "false");
        $("#callOutSubmit").text("提交中");
        //开始保存
        $("#partial_ut_callout_userTrackingForm").submitForm({
            type: "put",
            isCheck: true,
            url: "user/userTracking",
            data: {
                id: parseInt(self.partial_ut_callout_trackingid), appointmentTime: appointmenttime
            },
            success: function () {
                //上次跟进时间保存到本地缓存
                localStorage.setItem("lastTrackingTime", appointmenttime);

                $("#callOutSubmit").removeAttr("disabled");
                $("#callOutSubmit").text("提交");
                $("#partial_ut_callout_userTrackingForm").resetForm();

                //保存成功后，再次获取有没有要跟进的会员，如果存在要跟进的则继续跟进，否则关闭当前页面
                var result = self.partial_ut_callout_getFourTracking();
                if (result != null && result.length > 0) {
                    self.partial_ut_callout_callTracking(result[0].id, result.length);
                }
                else {
                    //跟进完成之后隐藏当前跟进信息
                    $("#partial_ut_callout_divUserTracking").hide();
                    self.partial_ut_callout_trackingClose();
                }

                //刷新数据
                $("#content-main iframe.J_iframe", window.parent.document).each(function (index, item) {
                    if ($(item).attr("data-id").indexOf("/user/index?isCustomer")!=-1) {//刷新列表分类
                        var content = $(item)[0].contentWindow;
                        if (typeof (content.partRefreshKind) == "function")
                            content.partRefreshKind(self.partial_ut_callout_trackingUserId);
                    }
                    if ($(item).attr("data-id") == ("/user/edit?id=" + self.partial_ut_callout_trackingUserId)) {//刷新详情页role，kind,wechat
                        var content = $(item)[0].contentWindow;
                        if (typeof (content.partRefreshTracking) == "function")
                            content.partRefreshTracking(self.partial_ut_callout_trackingUserId);
                    }
                    if ($(item).attr("data-id").indexOf("/user/firstcall?isCustomer")!=-1) {//刷新首拨名单
                        var content = $(item)[0].contentWindow;
                        if (typeof (content.partRefreshData) == "function")
                            content.partRefreshData(self.partial_ut_callout_trackingUserId);
                    }
                });
                //刷新预约任务页面数据,同时关闭当前跟进页面    
                $.partRefreshWin('/user/appointmentTask?isCustomer=false', "/user/edit?trackingid=" + self.partial_ut_callout_trackingid);
            },
            error: function (resultErr) {
                $("#callOutSubmit").removeAttr("disabled");
                $("#callOutSubmit").text("提交");
                $.errorMsg(resultErr.responseText);
            }
        });
    }

    //打开跟进详情
    self.partial_ut_callout_openUserEdit = function () {
        $.openTab({
            url: "/user/edit?trackingid=" + self.partial_ut_callout_trackingid,
            title: "跟进详情 - " + self.partial_ut_callout_trackingid
        });
    }

    //跟进记录打开或关闭 
    self.partial_ut_callout_trackingOpenOrClose = function () {
        $(".partial_ut_callout_userTracking_d_f").toggle();
    }

    //跟进记录打开
    self.partial_ut_callout_trackingOpen = function () {
        //如果元素为隐藏,则将它显现
        if ($(".partial_ut_callout_userTracking_d_f").is(":hidden")) {
            $(".partial_ut_callout_userTracking_d_f").show();
        }
    }
    //跟进记录关闭 
    self.partial_ut_callout_trackingClose = function () {
        //如果元素为显现,则将其隐藏
        if (!$(".partial_ut_callout_userTracking_d_f").is(":hidden")) {
            $(".partial_ut_callout_userTracking_d_f").hide();
        }
    }

    //获取用户信息
    self.partial_ut_callout_getUser = function (userId) {
        var res = null;
        $.get({
            url: "user/" + userId,
            async: false,
            success: function (result) {
                res = result;
            }
        });
        return res;
    }

    //这个会员是否首播
    self.partial_ut_callout_isFirstCall = function (userId) {
        var res = null;
        $.get({
            url: "user/usertracking/getFourTracking?userId=" + userId,
            async: false,
            success: function (result) {
                res = result.totalCount == 1;
            }
        });
        return res;
    }

    //获取用户呼出待跟进的记录
    self.partial_ut_callout_getFourTracking = function () {
        var res = null;
        $.get({
            url: "user/usertracking/getFourTracking?adminId=" + $.getCurrentUser().id + "&where=and isinbound=0 and dealTime is null and CreateTime>'2017-9-14 12:30:00.000'",
            async: false,
            success: function (result) {
                res = result.data;
            }
        });
        return res;
    }

    //是否需要跟进
    self.partial_ut_callout_isNeedTracking = function () {
        var result = self.partial_ut_callout_getFourTracking();
        if (result != null && result.length > 0) {
            self.partial_ut_callout_callTracking(result[0].id, result.length);
            $.openTab({
                url: '/user/edit?trackingid=' + result[0].id,
                title: "跟进详情 - " + result[0].id
            });
        }
    }
}

var partial_ut_callout_VM = new partial_ut_callout_ViewModel();

$(function () {
    ko.applyBindings(partial_ut_callout_VM, document.getElementById("partial_ut_callout_divUserTracking"));
    partial_ut_callout_VM.partial_ut_callout_isNeedTracking();
});

//话机状态中错空停和分类 戊 同步
$("#partial_ut_callout_mobileStatus").change(function () {
    if ($("#partial_ut_callout_mobileStatus").val() == 1) {
        if ($("#partial_ut_callout_userkind").val() != 1 && $("#partial_ut_callout_userkind").val() != 2) {
            $("#partial_ut_callout_userkind").val(5);
        }
    }
});
$("#partial_ut_callout_userkind").change(function () {
    if ($("#partial_ut_callout_userkind").val() == 5) {
        $("#partial_ut_callout_mobileStatus").val(1);
    }
});
