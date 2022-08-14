$(function () {
    //左侧菜单编辑
    $(".mobile_f_ul").delegate(".mobile_f_li_a", "click", function () {
        var $this = $(this);
        $this.parent().toggleClass("on").siblings().removeClass("on");
        if ($this.parent().hasClass("on")) {
            $(".mobile_f_li_sub").hide();
            $this.next().show();
            $this.find("span").attr("style", ""); 
        } else {
            $(".mobile_f_li_sub").hide();
        }
    })

    //左侧菜单排序
    $(".mobile_p_sort a").on("click", function () {
        $(this).parent().toggleClass("on");
        if ($(this).parent().hasClass("on")) {
            $(".mobile_operate").hide();
            $(".mobile_source").hide();
            $(this).after("<p class='tc colgreen lh24'>请拖动菜单进行排序</p>")
            $(this).html("完成");
            //启用拖拽
            $(".mobile_f_ul").sortable();
            $(".mobile_f_ul").disableSelection();
        } else {
            $(".mobile_operate").show();
            $(this).next().hide();
            $(this).html("菜单排序");
            //禁用拖拽
            $(".mobile_f_ul").sortable('destroy');
        }
    });

    //预览
    $("#btn_look").on("click", function () {
        $('#mobile_look').fadeIn();
    })

    //发送消息和网页切换
    $(".input_radio_add:radio").on("click", function () {
        var id = $(this).attr("data-sole");
        $(".mobile_tab").hide().siblings('.radio_table_' + id).show();
    });

    //消息类型切换
    $(".mob_tab_title li a").on("click", function () {
        var id = $(this).attr("data-sole");
        $(this).addClass('active').parent("li").siblings().find('a').removeClass('active');
        $(".mob_tab_cont div").hide().siblings("#mobile_tab_c_0" + id).show(); 
    });

    //不同素材类型切换
    $(".mob_tab_cont div a.mob_tab_c_bg").on("click", function () {
        var $id = $(this).attr("id");
        $(".mobile_source").hide();
        $("#source_" + $id).show();
    })


    var wechatMenuModel = function () {
        var self = this;
        //左侧菜单实体
        self.menulist = ko.observableArray([
             { name: '一级菜0', sort: '0', children: [{ name: '二级菜0', sort: '0' }] },
             { name: '一级菜1', sort: '1', children: [{ name: '二级菜1', sort: '1' }] },
             { name: '一级菜2', sort: '2', children: [{ name: '二级菜2', sort: '2' }] }
        ]);
        self.addSubMenu = function () {
            self.menulist([
              { name: '一级菜0', sort: '0', children: [{ name: '二级菜0', sort: '0' }, { name: '二级单0', sort: '0' }] },
              { name: '一级菜1', sort: '1', children: [{ name: '二级菜1', sort: '1' }, { name: '二级单1', sort: '1' }] },
              { name: '一级菜2', sort: '2', children: [{ name: '二级菜2', sort: '2' }, { name: '二级单2', sort: '2' }] }
            ]);
        };
        //素材实体
        self.sourcelist = ko.observableArray([
             { title: '标题', time: '2012-01-12', content: '详细信息详细信息详细信息详细信息详细信息' },
             { title: '标题1', time: '2012-01-12', content: '1111' },
             { title: '标2', time: '2012-01-12', content: '222' },
             { title: '标题3', time: '2012-01-12', content: '333' },
             { title: '标题4', time: '2012-01-12', content: '44444' },
             { title: '标题5', time: '2012-01-12', content: '555' },
             { title: '标题6', time: '2012-01-12', content: '66' },
             { title: '标题7', time: '2012-01-12', content: '77' },
             { title: '标题8', time: '2012-01-12', content: '88' }
        ]);
    };

    ko.applyBindings(wechatMenuModel);




    

    //voice
    //$('<audio controls="controls" id="chatAudio" class="pa">\
    //    <source src="../../images/wx/voice/nanshannan.mp3" type="audio/mpeg" />\
    //    </audio>').appendTo('body');//载入声音文件 
    //$("#chatAudio").css({ "z-index": "-1", })

    //$(".wx_v_c_a").on("click", function () {
    //    $(this).parents("tr").siblings().children().find(".wx_v_c_a").removeClass("active");
    //    $(this).toggleClass("active");
    //    $("#chatAudio")[0].play();//开始播放
    //    //$("#chatAudio")[0].pause();//停止播放
    //});


});