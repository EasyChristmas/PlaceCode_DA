
$(function () {
    var switchAdminList = $.parseJSON($("#switchAdminList").val());
    if (switchAdminList != null && switchAdminList.length > 0 && $.getCurrentUser().role !="Admin") {
        $("#switchId").empty();
        var currentId = $.getCurrentUser().id;
        var currentName = $.getCurrentUser().name;
        $("#switchId").append("<option value='" + currentId + "' selected='selected'>" + currentName + "</option>");
        switchAdminList.forEach(function (item) {
            $("#switchId").append("<option value='" + item.adminId + "'>" + item.adminName + "</option>");
        });
    } else {
        $.Data.bindAdmin({ selId: "switchId" });
    }

    //顶部公告初始化
    //$.loadpopup();
    //$('.sysAnnouncement').on("click", function () {
    //    $(this).hide();
    //    $('#menuCh,#sidebar').css('top', '45px');
    //});
    
    //top search
    $('#top-search').click(function () {
        $('#top-search-wrap').css('display', 'block');
        $('#top-search-wrap input').focus();
        return false;
    });
    $('#top-search-close').click(function () {
        $('#top-search-wrap').css('display', 'none');
    });

    //初始化内容区域的容器
    initContainer();

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

    //关闭自适应高度
    $(".close_dialog").css("lineHeight", $(".close_dialog").height() + 'px');
    window.onresize = function () {
        $(".close_dialog").css("lineHeight", $(".close_dialog").height() + 'px');
    };

    //点击退出更改状态
    $("#quit").on("click", function () {
        callcenter.checkOut();
    }); 

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
    $("#switchId,#switchOrgAdminId").change(function () {
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
            || ("," + $("#currentRoleIds").val() + ",").indexOf(",75,") >= 0
            || ("," + $("#currentRoleIds").val() + ",").indexOf(",78,") >= 0
            || ("," + $("#currentRoleIds").val() + ",").indexOf(",81,") >= 0
            || ("," + $("#currentRoleIds").val() + ",").indexOf(",84,") >= 0
            || ("," + $("#currentRoleIds").val() + ",").indexOf(",87,") >= 0
            || ("," + $("#currentRoleIds").val() + ",").indexOf(",93,") >= 0
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
            }, 10000);
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

    //加载IM
    //if ($(".J_iframe[data-type='im']")[0] != undefined) {
    //    //延迟加载IM
    //    setTimeout(function () {
    //        var iframeSrc = imUrl;
    //        var iframe1 = $(".J_iframe[data-type='im']")[0];
    //        if (-1 == navigator.userAgent.indexOf("MSIE")) {
    //            iframe1.src = iframeSrc;
    //        } else {
    //            iframe1.location = iframeSrc;
    //        }
    //    }, 10000);
    //};

    //打开IM窗口
    $("#IM").on("click", function () {
        $.openTab({
            url: imUrl,
            title: "IM"
        });
        //点击右上角IM，去掉小红点
        $('.top_im').find('div[class="countServer shaked"]').remove();
    });

    //长时间未操作页面，提示到登录页面
    $.pageDelay();
});

