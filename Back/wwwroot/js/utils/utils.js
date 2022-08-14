 //加载layer模块
layui.use(['layer'], function () { });

//扩展$方法
$.extend({
    initDate: function () {
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var days = new Date(year, month, 0).getDate();
        month = month < 10 ? '0' + month : month;
        return {
            startTime: year + '-' + month + '-01',
            endTime: year + '-' + month + '-' + days
        };
    },
    //递归数据成树形结构
    toTreeList: function (data, cb) {
        // 删除 所有 children,以防止多次调用
        data.forEach(function (item) {
            delete item.children;
        });

        // 将数据存储为 以 id 为 KEY 的 map 索引数据列
        var map = {};
        data.forEach(function (item) {
            map[item.id] = item;
        });
        //        console.log(map);
        var val = [];
        data.forEach(function (item) {
            // 以当前遍历项，的pid,去map对象中找到索引的id
            var parent = map[item.parentId];
            // 好绕啊，如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到，他对应的父级中
            if (parent) {
                (parent.children || (parent.children = [])).push(item);
            } else {
                //如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 val结果集中，作为顶级
                val.push(item);
            }
        });

        cb(val);
    },
    //隐藏所有页面的操作手册
    hideDocs: function () {
        $('a[title="操作文档"]').hide();
        var domDos = $('a.btn.colgreen.f12');
        //这里不想用for循环，要是有多个domDos的话，页面手动删除吧 
        if (domDos && domDos.length>0 && domDos.html().indexOf('操作手册')) {
            domDos.hide();
        } 
    },
    //页面一段时间之内未操作，提示重新登录
    pageDelay: function ( ) {  
        var intervalId = setInterval(function () {
            $.ajax({
                url: '/account/CheckLoginStatus',
                success: function (res) {
                    if (!res) {
                        $.showModal('您已经长时间未操作页面，请重新登录', function () {
                            callcenter.checkOut();
                        });
                        clearInterval(intervalId);
                    }
                }
            });
        }, 60000);
    },
    //自适应table高度
    selfAdaptionHeight: function () {
        var bodyHeight = Math.ceil(document.body.clientHeight);
        var searchHeight = Math.ceil($(".ibox-search").outerHeight(true));
        var titleHeight = Math.ceil($(".ibox-title").outerHeight(true));
        var tableTitleHeight = Math.ceil($(".div-table-head").outerHeight(true));
        var iboxConPaddingHeight = Math.ceil($('.ibox-content').outerHeight(true) - $('.ibox-content').height());
        var iboxOtherHeight = Math.ceil($('.ibox').outerHeight(true) - $('.ibox').height());
        var boxHeight = Math.ceil($('.wrapper-content').outerHeight(true) - $('.wrapper-content').height());
        var tableconHeight = bodyHeight - searchHeight - titleHeight - tableTitleHeight - iboxConPaddingHeight - iboxOtherHeight - boxHeight -1;
        $(".div-table-content:not(.no)").css({
            "height": tableconHeight,
            "overflow": "auto",
            "overflow-x": "hidden"
        }); 
        //window.parent.onresize = function () {  
        //    $.selfAdaptionHeight();
        //};
    },
    
});

//扩展dom方法
$.fn.extend({
    //从右侧展开更多搜索
    loadSearchDiv: function (n) {
        var that = $(this);
        var dom = that.find('.form-control'); 
        var length = dom.length;  
        if (n >= length)
            return false;
        var new_dom = $('<div></div>');
        for (var i = n; i < length; i++) {   
            //select2自带的span元素也删掉
            if ($(dom[i])[0].className.indexOf('selectpicker') >= 0) {
                $(dom[i]).next().remove();
            } 
            //删除多余的dom
            dom[i].remove();
            new_dom.append(dom[i]);
        } 
        //创建更多按钮
        if (that[0].className.indexOf('ibox-search')) {
            that.children().children().append('<a id="openRight" class="mt10 dib col-orange">更多></a>');
        } else {
            that.append('<a id="openRight" class="mt10 dib col-orange">更多></a>');
        }
        $.leftDialog("moreSearch");
        var jqDialog = $('.show_left_bg,.show_left_con');
        $('#moreSearch').append(new_dom.html());  
        $('.datepicker').datepicker({
            autoclose: true,
            format: 'yyyy-mm-dd',
            language: 'zh-CN',
            weekStart: 1,
            orientation: "auto left",
            todayHighlight: true
        });
        jqDialog.hide();
        //打开右侧窗口
        $('#openRight').on('click', function () {
            jqDialog.show();
        });
    },
    //从下侧展开更多搜索
    toggleSearchDiv: function (n) { 
        var that = $(this); 
        //定位父级元素位置
        var parentBox;
        if (that.find('.ibox-search:not(.no-search)').length > 0) {
            parentBox = that.find('.ibox-search');
        } else {
            return false;
            // parentBox = that;
        }   
        var dom = parentBox.children('.form-control,.datepicker,.selectpicker,#btnCustom,#divCustom');
        var length = dom.length;  
        if (n >= length || length <= 12)
            return false;
        //如果有高级按钮，要修改css
        if (parentBox.find('.btn_show_left').length > 0) {
            parentBox.find('.btn_show_left').css({
                margin:'6px 30px 0 0'
            })
        };
        var new_dom = $('<div id="moreDiv"></div>'); 
        for (var i = n; i < length; i++) {
            //select2自带的span元素也删掉
            if ($(dom[i])[0].className.indexOf('selectpicker') >= 0) {
                $(dom[i]).next().remove();
            }
            //删除多余的dom
            dom[i].remove();
            new_dom.append(dom[i]);
        }
        //创建更多按钮
        parentBox.append(new_dom);
        parentBox.append('<a id="btnToggleSearch" class="mt10 dib"><image src="../../images/icon/arrow-down.png"/></a>');
        $('.datepicker').datepicker({
            autoclose: true,
            format: 'yyyy-mm-dd',
            language: 'zh-CN',
            weekStart: 1,
            orientation: "auto left",
            todayHighlight: true
        }); 
        var dnum = 0;
        //更多展开
        $('#moreDiv').hide()
        $('#btnToggleSearch').on('click', function () { 
            dnum = dnum + 1;
            if (dnum % 2 != 0) {
                $('#moreDiv').show();
                $('#btnToggleSearch').html('<image src="../../images/icon/arrow-up.png"/>');
            } else {
                $('#moreDiv').hide();
                $('#btnToggleSearch').html('<image src="../../images/icon/arrow-down.png"/>'); 
            }
            $.selfAdaptionHeight();
        });
    },
    //tab切换
    tabSwitch: function () {
        var that = $(this);
        var $tab_a = that.find('.tab_box_a');
        var $tab_con = that.next('.tab_con');
        var $tab_con_li = $tab_con.find('.tab_con_li');
        console.log($tab_a.index());
        $tab_a.addClass('active').siblings('a').removeClass('active');

           
    }
});

//公共js,所有页面都会调用
$(function () {  
    //$('#divParams:not(.no)').toggleSearchDiv(7);
    //隐藏页面的操作文档
    $.hideDocs(); 
    $.selfAdaptionHeight();
});

