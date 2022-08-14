$(function () {
    //开启回复模式
    $("#open").on("click", function () {
        var self = $(this);
        $.confirm('开启自动回复之后，将立即对所有用户生效。确认开启?', function () {
            $.success('操作成功');
            $(".reply_title").toggleClass("on");
            if ($(".reply_title").hasClass("on")) {
                self.html("停用");
                self.removeClass("btn-green").addClass("btn-red");
                self.parent().prev().find("h2").html("已开启自动回复设置");
                return;
            } else {
                self.html("开启");
                self.removeClass("btn-red").addClass("btn-green");
                self.parent().prev().find("h2").html("未开启自动回复设置")
            }
        });
    });

    //消息类型切换
    $(".mob_tab_title li a").on("click", function () {
        var id = $(this).attr("data-sole");
        $(this).addClass('active').parent("li").siblings().find('a').removeClass('active');
        $(".mob_tab_cont div").hide().siblings("#mobile_tab_c_0" + id).show();
    });

    //添加关键字标签
    $("#js_tag_input").keyup(function () {
        if (event.keyCode == 13) {
            var $this = $(this);
            if ($this.val().length != 0) {
                var tipcon = '<span class="video_tag"> ' + $this.val() +
                '<i class="icon-circle-blank"></i>'+
                '<i class="icon-remove"></i>' +
                '</span>';
                $('#js_tag_box').prepend(tipcon);
                $this.val("");
                //删除标签
                $(".icon-remove").on("click", function () {
                    $(this).parent().fadeOut();
                });
                //是否匹配
                $(".icon-circle-blank").on("click", function () {
                    $(this).toggleClass("icon-circle").toggleClass("icon-circle-blank");
                })
            } else {
                alert("请填写标签");
            }
        }
    });

    //关键字回复添加规则
    $(".w_r_title").on("click", function () {
        $(this).parent().find(".w_r_con").toggle();
        $(this).parent().find(".w_t_foot").toggle();
    });


});