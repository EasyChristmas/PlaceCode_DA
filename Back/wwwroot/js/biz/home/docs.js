$(function () {
    //操作文档
    $("#czwd").on("click", function () {
        if ($('.top_div#divSearch').length == 1 || $('.top_div.version').length == 1) {
            $('.top_div#divSearch').hide();
            $('.top_div.version').hide();
        }
        topDown($(this), "czwd", "../docs/up/issuer.md");
        menu("/js/biz/docsdata.json", ".czwd");
    });

    //版本更新
    var texts = "v1.2.2";
    $("#version").on("click", function () {
        if ($('.top_div#divSearch').length == 1 || $('.top_div.czwd').length==1) {
            $('.top_div#divSearch').hide();
            $('.top_div.czwd').hide();
        }
        var src = "../version/v1/" + texts + ".md";
        topDown($(this), "version", src);
        menu("/js/biz/versiondata.json", ".version");
    });
    $("#version").text(texts);
});

jQuery.fn.extend({
    jMenuTree: function (options) {
        //设置默认值
        options = $.extend({
            jValue: "",  	//菜单所用json数据
            autoShow: false, //是否全部打开
            show: "",  		//子菜单显示的方法
            click: "",       //点击事件
        }, options);
        //保存主菜单节点
        var _j_main_menu = [];
        //保存子菜单节点
        var _j_sub_menu = [];
        var _this = this;

        //json排序规则，按照id降序,一级菜单
        function sortId(a, b) {
            return a.id - b.id;
        }

        //json排序规则，按照pid降序，二级菜单
        function sortPid(a, b) {
            return a.pid - b.pid;
        }

        //将节点json数据排序分类
        function sortJson(json) {
            var index_m = 0;
            var index_s = 0;
            json = json.sort(sortId);

            for (var i = 0; i < json.length; i++) {
                if (json[i].pid == 0) {
                    //归类主菜单节点
                    _j_main_menu[index_m++] = json[i];
                } else {
                    //归类子菜单节点
                    _j_sub_menu[index_s++] = json[i];
                }
            }

            //排序：按id降序排列
            _j_main_menu.sort(sortId);
            //_j_sub_menu.sort(sortPid);
        }

        //构建html
        function buildMenu(json) {
            //归类排序数据
            sortJson(json);

            //主菜单
            var menu_ul = $("<ul></ul>").addClass('jMenuTree');

            //遍历主菜单节点，生成html
            for (var i = 0; i < _j_main_menu.length; i++) {
                var name = _j_main_menu[i].name;
                var id = _j_main_menu[i].id;
                var pid = _j_main_menu[i].pid;

                var sub_li_1 = $("<li></li>").addClass('sub_li_1 clearfix').attr({ "id": id, "pid": pid });
                var sub_li_1_tile = $("<div></div>").addClass('menu_title').text(name);
                $(sub_li_1).append(sub_li_1_tile);



                var sub_menu_1 = $('<ul></ul>').addClass('sub_menu_1');

                if (options.autoShow) {
                    $(sub_menu_1).css("display", "block");
                }

                //声明一个临时数组，保存剩余的子菜单节点，减少下次的遍历数量，提供效率
                var _jtemp = [];
                var _index_temp = 0;

                //如果主菜单包含二级菜单，构建子菜单html
                for (var j = 0; j < _j_sub_menu.length; j++) {
                    var sname = _j_sub_menu[j].name;
                    var sid = _j_sub_menu[j].id;
                    var spid = _j_sub_menu[j].pid;
                    var html = _j_sub_menu[j].html;

                    if (id == spid) {
                        var sub_li_2 = $('<li></li>').addClass('sub_li_2')
                            .attr({ "id": sid, "pid": spid, "href": html })
                            .text(sname);

                        $(sub_menu_1).append(sub_li_2);

                    } else {
                        _jtemp[_index_temp++] = _j_sub_menu[j];
                    }
                }

                _j_sub_menu = _jtemp;
                _jtemp = null;
                _index_temp = 0;


                if ($(sub_menu_1).find("li").length > 0) {
                    $(sub_li_1).append(sub_menu_1);
                }

                $(menu_ul).append(sub_li_1);
            }

            $(_this).append(menu_ul);
        }


        //注册显示子菜单事件
        var show = function () {
            $(".sub_li_1").find(".menu_title").click(function () {
                $(this).siblings().toggle('slow');
            });

        }

        //点击菜单事件
        var click = function () {
            $(".jMenuTree > li").click(function () {
                //var html = $(this).attr('href');
                //$(iframe).attr('src', html);
            });
        }

        //阻止冒泡事件   
        var stopBubble = function (e) {
            if (e && e.stopPropagation) {//非IE   
                e.stopPropagation();
            }
            else {//IE   
                window.event.cancelBubble = true;
            }
        }

        var init = function () {
            buildMenu(options.jValue);

            $(".sub_li_1").find(".menu_title").click(function (e) {

                var $node = this;
                //检查用户是否自定义了显示方法
                if (typeof options.show == "function") {
                    options.show($node);
                } else {
                    $($node).siblings().toggle('slow');
                }


            });
            $(".jMenuTree").find("li").click(function (e) {
                stopBubble(e);

                var $node = this;

                if (typeof options.click == "function") {
                    options.click($node);
                } else {
                    alert("你点击的id是：" + $($node).attr("id"));
                }
            });
        }
        init();
        return this;
    }
});

//操作文档
function topDown(item, divClass, src) {
    item.toggleClass('on');
    if (item.hasClass('on')) {
        topDownHtml(divClass, src);
        $('.' + divClass).show().removeClass('fadeOutUp').addClass('fadeInDown');
        var ne_height = $(".top_div."+divClass).height() - 50; 
        $('.ne_le,.ne_ri').height(ne_height);
        window.onresize = function () {
            var ne_height = $('.container').height() - 50;
            $('.ne_le,.ne_ri').height(ne_height);
        }
    } else {
        item.removeClass('on');
        $('.' + divClass).remove();
    };
    $('.new_foot').on('click', function () {
        item.removeClass('on');
        $('.' + divClass).remove();
    });
}

function topDownHtml(divClass, src) {
    $('<div class="top_div ' + divClass + ' animated-fast">' +
        '<div class="container" style="height:100%;">' +
        '<div class="col-sm-3 padding-0" style="border-right:1px solid #D9D9D9;">' +
            '<div class="ne_le" id="menuWrapper"></div>' +
        '</div>' +
        '<div class="col-sm-9 padding-0">' +
            '<div class="ne_ri">' +
                '<iframe src="' + src + '" class="top_iframe"></iframe>' +
            '</div>' +
        '</div>' +
    '</div>' +
    '<div class="new_foot tc pa">' +
        '<i class="icon-chevron-up"></i>' +
    '</div>' +
'</div>').appendTo('body');
}

function menu(url, div) {
    //左侧菜单json
    var j_mJson = '';
    $.ajax({
        url: url + "?v=" + Math.random(),
        type: "GET",
        dataType: "json",
        async: false,
        success: function (result) {
            j_mJson = result;
        }
    });
    $(div + " #menuWrapper").jMenuTree({
        jValue: j_mJson,
        autoShow: false,
        click: function (node) {               //node:点击的菜单对象
            var self = $(node);
            var html = self.attr('href');
            var pid = self.attr('pid');
            var text = self.text();
            $('iframe.top_iframe').attr('src', html);
            if (pid > 0) {
                self.parent().parent().addClass('on').siblings().removeClass('on');
                self.addClass('selected').siblings().removeClass('selected');
            }

        }
    });
    //默认第一个展开
    $(div + ' .jMenuTree>li').eq(0).find('.sub_menu_1').show();
    $(div + ' .jMenuTree>li').eq(0).addClass('on');
    $(div + ' .jMenuTree>li').eq(0).find('.sub_li_2').eq(0).addClass('selected');
}

 