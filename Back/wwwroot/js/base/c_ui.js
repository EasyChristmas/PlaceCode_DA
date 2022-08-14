/// 处理页面效果控制js
$(function () {

    //展开盒子
    $(".collapse-link").click(function () {
        var o = $(this).closest("div.ibox"),
            e = $(this).find("i"),
            i = o.find("div.ibox-content"),
            span = $(this).find("span");
        i.slideToggle(200),
            e.toggleClass("icon-angle-up").toggleClass("icon-angle-down"),
            o.toggleClass("").toggleClass("border-bottom"),
            setTimeout(function () {
                o.resize(), o.find("[id^=map-]").resize()
            }, 50);
        if (e.attr("class") == "icon-angle-up") {
            span.text("收起");
        }
        else {
            span.text("展开");
        }

    });
    //折叠盒子
    $(".close-link").click(function () {
        var o = $(this).closest("div.ibox");
        o.remove()
    });
    //时间插件的使用
    $('.datepicker').datepicker({
        autoclose: true,
        format: 'yyyy-mm-dd',
        language: 'zh-CN',
        weekStart: 1,
        orientation: "auto left",
        todayHighlight: true
    });

    //初始化日期月份选择
    $('.datepicker-month').datepicker({
        autoclose: true,
        format: "mm",
        startView: 1,
        minViewMode: 1,
        maxViewMode: 1
    });

    //时间插件的使用-时分秒
    $('.datepicker-his').datetimepicker({
        format: 'yyyy-mm-dd hh:ii',
        language: 'zh-CN',
        weekStart: 1,
        todayBtn: 1,
        autoclose: 1,
        todayHighlight: 1,
        startView: 2,
        forceParse: 0
    });
    //时间插件-年
    $('.datepicker-years').datepicker({
        format: 'yyyy',
        language: "zh-CN",
        autoclose: true,
        startView: 2,
        minViewMode: 2,
        maxViewMode: 2
    });

    //bootstrap-select
    $('.selectpicker').select2();

    //修改file提示
    $("input[type='file']").each(function () {
        $(this).attr('title', ' ')
    });

    ////气泡tooltip
    ////使用方法：data-toggle="tooltip" title="要显示的文字" data-placement="right/left/bottom"
    $("[data-toggle='tooltip']").tooltip();

    //【表格】选中效果
    $("#PagerGird table").delegate("tr:not(.none_select)", "click", function () {
        var isMulti = $("#PagerGird table").attr("data-multi");
        var index = $(this).index();
        var isSelect = $(this).data("isSelect");
        if (isSelect) {

            $(this).css({ "background-color": "#fff" });
            if (!isMulti || isMulti == 'false') {
                $(".table").data("selectIndex", -1);
            }
            $(this).data("isSelect", false);
            $(this).find(":checkbox").removeAttr("checked");
        } else {
            if (!isMulti || isMulti == 'false') {
                var selectIndex = $(".table").data("selectIndex");
                if (selectIndex > -1) {
                    $(".table tbody tr").eq(selectIndex).css({ "background-color": "#fff" });
                    $(".table tbody tr").eq(selectIndex).data("isSelect", false);
                }
            }
            $(this).data("isSelect", true);
            $(".table").data("selectIndex", index);
            $(this).addClass('ac').siblings().removeClass('ac');
            $(this).css({ "background-color": "#ffca5f" });
            $(this).find(":checkbox").attr("checked", "checked");
        }
    });

    //圆形进度条
    $('.pie_circle').each(function (index, el) {
        var num = $(this).find('span').text() * 3.6;
        if (num <= 180) {
            $(this).find('.right').css('transform', "rotate(" + num + "deg)");
        } else {
            $(this).find('.right').css('transform', "rotate(180deg)");
            $(this).find('.left').css('transform', "rotate(" + (num - 180) + "deg)");
        };
    });

    //input check 
    $(".i-checks input").iCheck({
        checkboxClass: 'icheckbox_flat-green',
        radioClass: 'iradio_flat-green'
    });

    //初始化编辑器
    $('#summernote').summernote({
        lang: 'zh-CN',//中文配置 
        height: '400', // set editor height 
        minHeight: null, // set minimum height of editor 
        maxHeight: null, // set maximum height of editor 
        focus: true,
        airPopover: [
            ['color', ['color']],
            ['font', ['bold', 'underline', 'clear']],
            ['para', ['ul', 'paragraph']],
            ['table', ['table']],
            ['insert', ['link', 'picture']]
        ]
    });

    //TODO:rongrong 锚点滚动效果
    $("#navbar-example .nav-tabs li").first().find("a").addClass("active");
    $("#navbar-example .nav-tabs li a").on("click", function () {
        var top = $($(this).attr("href")).position().top;
        $(this).addClass("active").parent().siblings().children("a").removeClass("active");
        $(".ibox-tab-content").animate({
            scrollTop: top + "px"
        }, {
            duration: 500,
            easing: "swing"
        });
        return false;
    });

    //图标logo选中
    $(".hasoperater a").on("click", function () {
        $(this).toggleClass("active");
    });

    //关闭富文本框的弹框
    $('div[data-group="modalObj"] button[aria-label="Close"]').on('click', function () {
        //关闭当前弹框
        $.closeDialog($(this).parent().parent().parent().parent());
    });

    //禁用返回键  
    $(document).keydown(function (e) {
        var keyEvent;
        if (e.keyCode == 8) {
            var d = e.srcElement || e.target;
            if (d.tagName.toUpperCase() == 'INPUT' || d.tagName.toUpperCase() == 'TEXTAREA' || d.getAttribute("contenteditable") == "true") {
                keyEvent = d.readOnly || d.disabled;
            } else {
                keyEvent = true;
            }
        } else if (e.keyCode == 17 && $("#PagerGird table").length > 0 && $("#PagerGird table").attr('data-multi') == 'false') {
            $("#PagerGird table").attr('data-multi', 'true');
        }
        else {
            keyEvent = false;
        }
        if (keyEvent) {
            e.preventDefault();
        }
    });
    //释放键盘的时候
    $(document).keyup(function () {
        if ($("#PagerGird table").length > 0 && $("#PagerGird table").attr('data-multi') == 'true') {
            $("#PagerGird table").attr('data-multi', 'false');
        }
    });

    //广告ibox-content里面-展开收缩
    $(".ibox-content").delegate(".ad_title_fr", "click", function () {
        var $this = $(this);
        var $con = $this.parent().next();
        var $e = $(this).find("i");
        var $span = $(this).find("span");
        $con.slideToggle(200);
        $e.toggleClass("icon-angle-up").toggleClass("icon-angle-down");
        if ($e.attr("class") == "icon-angle-up") {
            $span.text("收起");
        }
        else {
            $span.text("展开");
        }
    });

    //发送对象切换
    $("#myTab li").on("click", function () {
        var $this = $(this);
        var index = $(this).index();
        $this.addClass("active").siblings().removeClass("active");
        $("#myTabContent").children(".tab-pane").eq(index).addClass("active in").siblings().removeClass("active in");
        $("#myTabContent").find('input[validate="requried"]').val("");
    });
    //updateCss
    //var number = Math.round(Math.random() * 100000);
    //$('[rel="stylesheet"]').each(function () {
    //    var href = $(this).attr('href');
    //    $(this).attr('href', href + '?v=' + number);
    //});
    //updateJs
    //$('script[src]').each(function () {
    //    var src = $(this).attr('src');
    //    $(this).attr('src', src + '?v=' + number);
    //});
}); 

jQuery.extend({
    //首页加载
    homeLoading: function () {
        //获取浏览器页面可见高度和宽度
        var _PageHeight = document.documentElement.clientHeight,
            _PageWidth = document.documentElement.clientWidth;
        //计算loading框距离顶部和左部的距离（loading框的宽度为215px，高度为61px）
        var _LoadingTop = _PageHeight > 61 ? (_PageHeight - 61) / 2 : 0,
            _LoadingLeft = _PageWidth > 215 ? (_PageWidth - 215) / 2 : 0;
        //在页面未加载完毕之前显示的loading Html自定义内容
        var _LoadingHtml = '<div id="loadingDiv" class="loading-bg animated" ><image src="../../images/newSkin/logo_loading.png" class="logo_loading"/><p class="title">欢迎进入</p><p class="note">1Miner管理系统</p><image src="../../images/newSkin/icon_enter.png" class="icon_enter"/></div>';
        //呈现loading效果
        document.write(_LoadingHtml);
        //监听加载状态改变
        document.onreadystatechange = completeLoading;
        //加载状态为complete时移除loading效果
        function completeLoading() {
            if (document.readyState == "complete") {
                var loadingMask = document.getElementById('loadingDiv');
                $(loadingMask).addClass("bounceOutUp animated");
            }
        }
    },
    //页面局部加载效果
    partLoad: {
        partLoading: function (obj) {
            var element = $(obj);
            var load_div = '<div class="load-container load7"><div class="loader">Loading...</div></div>';
            element.prepend(load_div);
        },
        partComplete: function (obj) {
            var element = $(obj);
            $(".load-container").remove();
        }
    },
    //渲染数据行显示样式
    renderDataRow: function (box) {
        $(box).css({
            "opacity": "0"
        });
        $(box).stop().animate({
            "opacity": "1"
        }, 300);
    },
    //整体加载
    globalLoad: function () {
        layer.open({ type: 2 });
    },
    //点赞+1
    tipsBox: function (options) {
        options = $.extend({
            obj: null,  //jq对象，要在那个html标签上显示
            str: "+1",  //字符串，要显示的内容;也可以传一段html，如: "<b style='font-family:Microsoft YaHei;'>+1</b>"
            startSize: "12px",  //动画开始的文字大小
            endSize: "30px",    //动画结束的文字大小
            interval: 600,  //动画时间间隔
            color: "red",    //文字颜色
            callback: function () { }    //回调函数
        }, options);
        $("body").append("<span class='num'>" + options.str + "</span>");
        var box = $(".num");
        var left = options.obj.offset().left + options.obj.width() / 2;
        var top = options.obj.offset().top - options.obj.height();
        box.css({
            "position": "absolute",
            "left": left + "px",
            "top": top + "px",
            "z-index": 9999,
            "font-size": options.startSize,
            "line-height": options.endSize,
            "color": options.color
        });
        box.animate({
            "font-size": options.endSize,
            "opacity": "0",
            "top": top - parseInt(options.endSize) + "px"
        }, options.interval, function () {
            box.remove();
            options.callback();
        });
    },
    //格式化列表table高度
    tableHeight: function (height, div) {
        var domClass;
        //求div-table-content的高度
        var tableconHeight = document.body.clientHeight - height - $(".ibox-search").outerHeight() - $(".ibox-title").outerHeight() - $(".div-table-head").outerHeight() + 15;
        if (div == undefined || div == "" || div == null) {
            domClass = ".div-table-content";
        } else {
            domClass = div;
        }
        $(domClass).css({
            "height": tableconHeight,
            "overflow": "auto",
            "overflow-x": "hidden"
        });
        //改变浏览器大小来改变div-table-content的高度
        window.onresize = function () {
            $.tableHeight(height, div);
        };
    },
    //格式化列表table高度new
    tableHeightNew: function (height, div, inDiv) {
        var domClass;
        //求div-table-content的高度
        var tableconHeight = document.body.clientHeight - $(".ibox-title").outerHeight() - 75 - $(".nav-tabs").outerHeight();
        var inHeight = tableconHeight - $(inDiv + " .ibox-search").outerHeight() - $(inDiv + " .div-table-head").outerHeight() - 30;
        if (div == undefined || div == "" || div == null) {
            domClass = ".div-table-content";
        } else {
            domClass = div;
        }
        $(domClass).css({
            "height": tableconHeight,
            "overflow": "auto",
            "overflow-x": "hidden"
        });

        $('.div-table-content').css({
            "height": inHeight,
            "overflow": "auto",
        });
        //改变浏览器大小来改变div-table-content的高度
        window.onresize = function () {
            $.tableHeightNew(height, div, inDiv);
        };
    },
    //格式化列表table高度*2
    tableHeightTwo: function (height, div) {
        //求div-table-content的高度
        var tableconHeight = document.body.clientHeight - height - $(".ibox-search").outerHeight() - $(".ibox-title").outerHeight() * 2;
        var tableconHeightTwo = tableconHeight / 2;
        if (div == undefined || div == "" || div == null) {
            $(".div-table-content").css({
                "height": tableconHeightTwo,
                "overflow": "auto",
            });

            //改变浏览器大小来改变div-table-content的高度
            window.onresize = function () {
                var tableconHeight = document.body.clientHeight - height - $(".ibox-search").outerHeight() - $(".ibox-title").outerHeight() * 2;
                var tableconHeightTwo = tableconHeight / 2;
                $(".div-table-content").css({
                    "height": tableconHeightTwo
                });
            }

        } else {
            $(div).css({
                "height": tableconHeightTwo,
                "overflow": "auto",
            });
            //改变浏览器大小来改变div-table-content的高度
            window.onresize = function () {
                var tableconHeight = document.body.clientHeight - height - $(".ibox-search").outerHeight() - $(".ibox-title").outerHeight() * 2;
                var tableconHeightTwo = tableconHeight / 2;
                $(div).css({
                    "height": tableconHeightTwo
                });
            }

        }



    },
    //格式化列表table高度*不一样的高度
    tableHeightTwoDis: function (div1, div2, height1, heigthx) {
        //求div-table-content的高度
        var tableconHeight = document.body.clientHeight - heigthx - $(".ibox-search").outerHeight() * 2 - $(".ibox-title").outerHeight() * 2;
        $(div1).css({
            "height": height1,
            "overflow": "auto",
        });
        $(div2).css({
            "height": tableconHeight - height1,
            "overflow": "auto",
        });
        //改变浏览器大小来改变div-table-content的高度
        window.onresize = function () {
            var tableconHeight = document.body.clientHeight - heigthx - $(".ibox-search").outerHeight() * 2 - $(".ibox-title").outerHeight() * 2;
            $(div1).css({
                "height": height1,
                "overflow": "auto",
            });
            $(div2).css({
                "height": tableconHeight - height1,
                "overflow": "auto",
            });
        }
    },
    //格式化左右两侧布局的div高度
    tableHeightDivLeftRight: function (div1, div2, height1, height2) {
        //求div-table-content的高度
        var tableconHeight1 = document.body.clientHeight - height1 - $(".ibox-search").outerHeight() - $(".ibox-title").outerHeight() - $(".div-table-head").outerHeight();
        var tableconHeight2 = document.body.clientHeight - height2;
        $(div1).css({
            "height": tableconHeight1,
            "overflow": "auto",
            "overflow-x": "hidden"
        });
        $(div2).css({
            "height": tableconHeight2,
            "overflow": "auto",
            "overflow-x": "hidden"
        });
        window.onresize = function () {
            var tableconHeight1 = document.body.clientHeight - height1 - $(".ibox-search").outerHeight() - $(".ibox-title").outerHeight() - $(".div-table-head").outerHeight();
            var tableconHeight2 = document.body.clientHeight - height2;
            $(div1).css({
                "height": tableconHeight1,
            });
            $(div2).css({
                "height": tableconHeight2,
            });
        }
    },
    //格式化列表table宽度
    tableWidth: function () {
        //格式化table宽度
        var headWidth = $("#thead-erp").width();
        $(".div-table-head").width(headWidth);
        $(".div-table-content").width(headWidth);
    },
    //上传进度条
    processerbar: function (time, callBack) {
        document.getElementById('probar').style.display = "block";
        $("#line").each(function (i, item) {
            var a = parseInt($(item).attr("w"));
            $(item).animate({
                width: a + "%"
            }, time);
        });
        var si = window.setInterval(
            function () {
                a = $("#line").width();
                b = (a / 66 * 100).toFixed(0);
                document.getElementById('percent').innerHTML = b + "%";
                //document.getElementById('percent').style.left = a - 12 + "px";
                //document.getElementById('msg').innerHTML = "上传中";
                if (document.getElementById('percent').innerHTML == "100%") {
                    clearInterval(si);
                    if (typeof (callBack) == "function") {
                        callBack();
                    }
                }
            }, 70);
    },
    //textarea自适应高度 
    textHeightAuto: function () {
        var $text = $("textarea.textarea.form-control");
        $text.css({
            'box-sizing': 'content-box'
        });
        $.each($text, function (i, n) {
            $.autoTextarea($(n)[0]);
        });

    },

    autoTextarea : function (elem, extra, maxHeight) {
        extra = extra || 0;
        var isFirefox = !!document.getBoxObjectFor || 'mozInnerScreenX' in window,
            isOpera = !!window.opera && !!window.opera.toString().indexOf('Opera'),
            addEvent = function (type, callback) {
                elem.addEventListener ?
                    elem.addEventListener(type, callback, false) :
                    elem.attachEvent('on' + type, callback);
            },
            getStyle = elem.currentStyle ?
                function (name) {
                    var val = elem.currentStyle[name];
                    if (name === 'height' && val.search(/px/i) !== 1) {
                        var rect = elem.getBoundingClientRect();
                        return rect.bottom - rect.top -
                            parseFloat(getStyle('paddingTop')) -
                            parseFloat(getStyle('paddingBottom')) + 'px';
                    };
                    return val;
                } : function (name) {
                    return getComputedStyle(elem, null)[name];
                },
            minHeight = parseFloat(getStyle('height'));
        elem.style.resize = 'both';//如果不希望使用者可以自由的伸展textarea的高宽可以设置其他值

        var change = function () {
            var scrollTop, height,
                padding = 0,
                style = elem.style;

            if (elem._length === elem.value.length) return;
            elem._length = elem.value.length;

            if (!isFirefox && !isOpera) {
                padding = parseInt(getStyle('paddingTop')) + parseInt(getStyle('paddingBottom'));
            };
            scrollTop = document.body.scrollTop || document.documentElement.scrollTop;

            elem.style.height = minHeight + 'px';
            if (elem.scrollHeight > minHeight) {
                if (maxHeight && elem.scrollHeight > maxHeight) {
                    height = maxHeight - padding;
                    style.overflowY = 'auto';
                } else {
                    height = elem.scrollHeight - padding;
                    style.overflowY = 'hidden';
                };
                style.height = height + extra + 'px';
                scrollTop += parseInt(style.height) - elem.currHeight;
                document.body.scrollTop = scrollTop;
                document.documentElement.scrollTop = scrollTop;
                elem.currHeight = parseInt(style.height);
            };
        };

        addEvent('propertychange', change);
        addEvent('input', change);
        addEvent('focus', change);
        change();
    },
    //从下往上弹出层
    upDialog: function (jqObj) {
        $('body').append('<div class="show_up_bg animated-erp fadeInUp"></div>' +
            '<div class="show_up_con">' +
            '<div class="form-group row">' +
            '<div class="col-sm-12" id=' + jqObj + '></div>');
        $(".show_up_bg").on("click", function () {
            $(".show_up_bg").remove();
            $(".show_up_con").remove();
        })
    },
    //从右往左弹出层
    leftDialog: function (jqObj) {
        var jqId = '#' + jqObj;
        if ($(jqId).length > 0) {
            $(jqId).show();
            $(jqId).prev().show();
        } else {
            $('body').append('<div class="show_left_bg animated-erp fadeInUp"></div>' +
                '<div class="show_left_con" id=' + jqObj + '></div>');
        }
        $(".show_left_bg").on("click", function () {
            $(".show_left_bg,.show_left_con").hide();
        })
    },
    //tab切换
    selectTagActive: function (currentTag) {
        if (currentTag != undefined && currentTag != '') {

            currentTag = "#" + currentTag;
            $("#othertitle li").each(function () {

                var $this = $(this);
                var $id = $(this).find("a").attr("href");
                if (currentTag == $id) {
                    $this.addClass("active").siblings("li").removeClass("active");
                    $(".nav-content" + $id).show().siblings(".nav-content").hide();
                    return false;
                }
            })
        }
    }
});

jQuery.fn.extend({
    //初始化下拉加载
    scrollGrid: function () {
        //下拉的div对象
        var $this = $(this);
        //下拉滚动事件
        $this.scroll(function () {
            //数据表格对象
            var $table = $this.find("table");
            //下拉滚动判断是否加载下一页数据 
            if ($table.outerHeight(true) > 0 && $this.scrollTop() > 0) {
                if ($this.height() + Math.ceil($this.scrollTop()) >= $table.outerHeight(true)) {
                    //loading效果
                    $.partLoad.partLoading($this);
                    setTimeout(function () {
                        query(grid.pageIndex() + 1);
                        //关闭loading效果
                        $.partLoad.partComplete($table);
                    }, 1100);
                }
                if ($this.find(".no_data")) {
                    $this.find(".no_data").remove();
                }
            }
        });
    },
    //水印
    watermark: function (settings) {
        var $this = $(this);
        //默认设置
        var defaultSettings = {
            watermark_txt: "text",
            watermark_nums: 60,//水印个数
            watermark_color: '#aaa',//水印字体颜色
            watermark_alpha: 0.15,//水印透明度
            watermark_fontsize: '15px',//水印字体大小
            watermark_width: '20%',//水印宽度
            watermark_height: '60px',//水印长度
            watermark_angle: 15//水印倾斜度数
        };
        //采用配置项替换默认值，作用类似jquery.extend
        if (arguments.length === 1 && typeof arguments[0] === "object") {
            var src = arguments[0] || {};
            for (key in src) {
                if (src[key] && defaultSettings[key] && src[key] === defaultSettings[key])
                    continue;
                else if (src[key])
                    defaultSettings[key] = src[key];
            }
        }

        var oTemp = document.createElement('div');
        oTemp.className = 'watermark_box clearfix';
        $this.css({
            'position': 'relative'
        });

        for (var i = 0; i < defaultSettings.watermark_nums; i++) {
            var mask_div = document.createElement('div');
            mask_div.className = 'mask_div fl';
            mask_div.appendChild(document.createTextNode(defaultSettings.watermark_txt));
            //设置水印div倾斜显示
            mask_div.style.webkitTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
            mask_div.style.MozTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
            mask_div.style.msTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
            mask_div.style.OTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
            mask_div.style.transform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
            mask_div.style.opacity = defaultSettings.watermark_alpha;
            mask_div.style.fontSize = defaultSettings.watermark_fontsize;
            mask_div.style.color = defaultSettings.watermark_color;
            mask_div.style.textAlign = "center";
            mask_div.style.width = defaultSettings.watermark_width;
            mask_div.style.height = defaultSettings.watermark_height;
            mask_div.style.display = "block";
            oTemp.appendChild(mask_div);
        };

        $this.append(oTemp);
        var tableconHeight = document.body.clientHeight - $(".ibox-search").outerHeight() - $(".ibox-title").outerHeight() - $(".div-table-head").outerHeight() - 66;
        $('.div-table-content').css({
            "height": tableconHeight
        });
        $('.watermark_box').css({
            "height": tableconHeight
        });
        window.onresize = function () {
            var tableconHeight = document.body.clientHeight - $(".ibox-search").outerHeight() - $(".ibox-title").outerHeight() - $(".div-table-head").outerHeight() - 66;
            $('.div-table-content').css({
                "height": tableconHeight
            });
            $('.watermark_box').css({
                "height": tableconHeight
            });
        };
        $('.watermark_box').css({
            'position': 'absolute',
            'left': '0',
            'right': '0',
            'overflow': 'hidden hidden',
            'pointer-events': 'none',
            'padding': '15px 20px 20px',
            'bottom': '20px',
        });
    },
    //编辑器初始化
    saasSummernote: function (options) {
        var $this = $(this);
        //自定义按钮
        var ClearButton = function (context) {
            var ui = $.summernote.ui;

            // create button
            var button = ui.button({
                contents: '<i class="note-icon-close"/>',  //按钮样式
                tooltip: '清空',
                click: function () {
                    $('#riskRemark').summernote('code', '');
                },
                callback: function () {
                    //这里的回调函数会在加载页面的时候直接执行
                }
            });

            return button.render();    //按钮渲染
        }
        //初始化编辑器
        $this.summernote({
            lang: 'zh-CN',//中文配置 
            height: '400', // set editor height 
            minHeight: null, // set minimum height of editor 
            maxHeight: null, // set maximum height of editor 
            //focus: true,
            airPopover: [
                ['color', ['color']],
                ['font', ['bold', 'underline', 'clear']],
                ['para', ['ul', 'paragraph']],
                ['table', ['table']],
                ['insert', ['link', 'picture']]
            ],
            toolbar: [
                ['style', ['style']],
                ['font', ['bold', 'underline', 'clear']],
                ['fontname', ['fontname']],
                ['color', ['color']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['table', ['table']],
                ['insert', ['link', 'picture', 'video']],
                ['view', ['fullscreen', 'codeview', 'help', 'clearButton']]
            ],
            callbacks: options.callbacks || [],
            buttons: {
                clearButton: ClearButton      //自已定义的按钮函数
            }
        });
    }
});


//ios Switchery 手动初始化，
//显示页面所有包含属性的样式
function showSwitchery() {
    var elems = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));
    elems.forEach(function (html) {
        var $html = $(html);
        if (($html.attr("data-switchery") != undefined
            && $html.attr("data-switchery") == "true")
            && ($html.is(':hidden')))
            return;
        var init = new Switchery(html, {
            color: 'var(--color-blue-light)'
        });
    });
}

//ios Switchery 手动初始化，
//显示单个属性的样式
function enabledSingleSwitchery(elem) {
    var init = new Switchery(elem, {
        color: 'var(--color-blue-light)'
    });
}

//ios Switchery 手动初始化，
//禁用单个属性的样式
function disabledSingleSwitchery(elem) {
    var init = new Switchery(elem, {
        disabled: true,
        color: 'var(--color-blue-light)'
    });
}
//操作文档
function docs(itema, itemb) {
    $.openWin({
        title: "操作手册",
        url: "/docs/" + itema + "/" + itemb + ".md",
        width: "800",
        height: "600"
    });
};
//视频播放
function PlayVideo(file) {

    //var flashvars = {
    //    f: file,
    //    c: 0,
    //    p: 1
    //};
    //var params = { bgcolor: '#FFF', allowFullScreen: true, allowScriptAccess: 'always', wmode: 'transparent' };
    //var video = ['http://movie.ks.js.cn/flv/other/1_0.mp4->video/mp4'];
    //CKobject.embed('/lib/ckplayer/ckplayer.swf', 'a1', 'ckplayer_a1', '100%', '100%', false, flashvars, video, params);

    var width = $("#a1").css("width");
    var height = $("#a1").css("height");
    $("#a1").html("<video id=\"video1\" width=" + width + " height=" + height + " controls=\"controls\"  autoplay=\"autoplay\">");
    var video = document.getElementById("video1");
    video.src = file;
    video.load();
    video.play();
};