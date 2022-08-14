//TODO:规范统一
var stack_bottomright = { "dir1": "up", "dir2": "left", "firstpos1": 25, "firstpos2": 25 };
jQuery.extend({
    //获取url参数
    getParam: function (name) {
        debugger;
        console.log('name', name);
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(decodeURI(r[2]));
        return null;
    },
    //加载
    loading: function () {
        parent.layer.load(3, { shade: [0.5, '#fff'] });
    },
    //提示
    alert: function (msg) {
        swal({
            title: msg,
            timer: 2000
        });
    },
    ////模态框
    showModal: function (msg, callback) {
        swal({
            title: msg
        }, function () {
            if (typeof callback == 'function')
                callback();
        });
    },
    //成功
    success: function (msg, time) {
        if (time == undefined || time == "" || time == null) {
            swal({
                title: msg,
                type: "success",
                timer: 1500
            });
        } else {
            swal({
                title: msg,
                type: "success",
                timer: time
            });
        }
    },
    //错误
    errorMsg: function (msg, time) {
        if (time == undefined || time == "" || time == null) {
            swal({
                title: msg,
                type: "error",
                timer: 1500
            });
        } else {
            swal({
                title: msg,
                type: "error",
                timer: time
            });
        }
        //swal({
        //    title: msg,
        //    type: "error",
        //    timer: 3000
        //});
    },
    //confirm 确认
    confirm: function (msg, callback, cancel, opts) {
        var defaults = {
            title: msg,
            type: "warning",
            showCancelButton: true,
            closeOnConfirm: false,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            className: '',
        };

        var params = defaults;

        if (opts != undefined && opts != null) {
            params = $.extend(defaults, opts);
        }

        swal(params, function (isConfirm) {
            if (isConfirm) {
                if (typeof callback == 'function') {
                    callback();
                    //$(".sweet-overlay,.sweet-alert:not(.noHide)").hide();//关闭弹框
                }
            } else {
                if (typeof cancel == 'function')
                    cancel();
            }
        });
    },
    //tips
    tips: function (msg, $obj, time) {
        //$obj.focus();
        if (time == undefined || time == "" || time == null) {
            layer.tips(msg, $obj, {
                tips: [1, '#333'],
                time: 1500
            });
        }
        else {
            layer.tips(msg, $obj, {
                tips: [1, '#333'],
                time: time
            });
        }
    },
    //打开一个div层
    openDiv: function (options) {
        var defaults = {
            title: '',
            content: ''
        };
        options = $.extend(defaults, options);
        options.content = options.content == "" ? "无" : options.content;
        BootstrapDialog.show({
            title: options.title,
            message: options.content
        });

        var e = window.event;
        if (e && e.stopPropagation) {
            e.stopPropagation(); //w3c
        } else e.cancelBubble = true; //IE
    },
    //打开一个模态框div层
    openDialog: function (options) {
        var defaults = {
            title: '',
            jqObj: '',
            width: ''
        };
        options = $.extend(defaults, options);
        options.jqObj.find('form').resetForm();
        options.jqObj.find('#modalLabel,#myModalLabel').html(options.title);
        if (options.width) {
            options.jqObj.find('div').first().css('width', options.width + 'px');
        }
        options.jqObj.modal({
            show: true,
            backdrop: 'static'
        });
    },
    //关闭一个模态框div层
    closeDialog: function (jqObj) {
        jqObj.modal('hide');
    },
    //打开窗体
    openWin: function (options) {
        var defaults =
        {
            title: "",
            url: "",
            data: {},
            width: "700",
            height: "800"
        };
        options = $.extend(defaults, options);
        //存储页面参数
        if (!!window.sessionStorage) {
            //for (var i = 0; i < options.data.length; i++) {
            //    var obj = options.data[i];
            //    for (var p in obj) {
            //        var key = p;
            //        var value = obj[p];
            //        window.sessionStorage.setItem(key, value);
            //    }
            //}
            for (var p in options.data) {
                var key = p;
                var value = options.data[p];
                window.sessionStorage.setItem(key, value);
            }
        }
        $.ajax({
            url: options.url,
            success: function (html) {
                parent.layer.open({
                    type: 1,
                    title: options.title,
                    shadeClose: true,
                    shade: 0.8,
                    area: [options.width + 'px', options.height + 'px'],
                    maxmin: true,
                    content: html,
                });
            }
        });
        var e = window.event;
        if (e && e.stopPropagation) {
            e.stopPropagation();	//w3c
        } else e.cancelBubble = true; //IE
    },
    //关闭窗体
    closeWin: function (e) {
        $(e).parent("div").next("span").find(".layui-layer-close").click();
    },
    //新增dialog class
    addDialogClass: function (divclass) {
        if (!divclass) {
            divclass = "fix-dialog";
        }
        $('body').delegate('.bootstrap-dialog', 'shown.bs.modal', function () {
            $(this).find('.modal-dialog').addClass(divclass);
        });
        var e = window.event;
        if (e && e.stopPropagation) {
            e.stopPropagation(); //w3c
        } else e.cancelBubble = true; //IE
    },
    //设置dialog宽度
    setDialogWidth: function (width) {
        //if (!width) {
        //    width = 600;
        //}
        $('body').delegate('.bootstrap-dialog', 'shown.bs.modal', function () {
            $(this).find('.modal-dialog').animate({ "width": width + "px" }, { speed: "fast" });
        });
        var e = window.event;
        if (e && e.stopPropagation) {
            e.stopPropagation(); //w3c
        } else e.cancelBubble = true; //IE
    },

    //打开tab
    openTab: function (options) {
        var t = options.url.replace(/amp;/g, '');
        var i = options.title;
        //如果存在则选中该选项卡，不存在则重新打开新的选项卡
        if (window.parent.changeWin(t)) {
            if (window.parent.$("iframe.J_iframe").length >= 15) {
                window.parent.$.alert("亲，打开窗口太多，赶紧清理一下吧 O(∩_∩)O~ ");
                return;
            } else {
                var a = parseInt(top.$(".J_mainContent .J_iframe:last").attr("name").replace("iframe", "")) + 1;
                var s = '<a href="javascript:;" class="active J_menuTab" data-id="' + t + '">' + i + ' <i class="icon-remove-sign"></i></a>';
                top.$(".J_menuTab").removeClass("active");
                var r = '<iframe class="J_iframe" name="iframe' + a + '" width="100%" height="100%" src="' + t + '" frameborder="0" data-id="' + t + '" seamless></iframe>';
                top.$(".J_mainContent").find("iframe.J_iframe").hide().parents(".J_mainContent").append(r);
                var o = null, existing = false;
                try {
                    if (layer == undefined || layer) existing = true;
                } catch (e) { }
                if (existing) o = layer.load();
                top.$(".J_mainContent iframe:visible").load(function () {
                    if (o) layer.close(o);
                }), top.$(".J_menuTabs .page-tabs-content").append(s);
            }
        }
    },
    //设置tab
    setTab: function (options) {
        var id = top.$(".J_menuTab.active").attr("data-id");
        var $iframe = top.$(".J_mainContent").find("iframe.J_iframe[src='" + id + "']");
        $iframe.attr("src", options.url).attr("data-id", options.url);
        top.$(".active.J_menuTab").attr("data-id", options.url).html(options.title + ' <i class="icon-remove-sign"></i>');
    },
    //设置tabTitle
    setTabTitle: function (options) {
        top.$(".active.J_menuTab").html(options.title + ' <i class="icon-remove-sign"></i>');
    },
    //弹出系统消息 
    showMsg: function (options) {
        var defaults = {
            title: "系统消息",
            text: "系统内容",
            addclass: "stack-bottomright",
            stack: stack_bottomright,
            delay: 6000,//6秒
            //buttons: {
            //    closer: false,
            //    sticker: false
            //},
            //type: 'success', //包含 info,error,success 
        };
        options = $.extend(defaults, options);
        (new PNotify(options)).get().click(function () {
            options.callback();
            //点击之后弹框消失
            //console.log($(this).find(".ui-pnotify-closer").click());
            $(this).find(".ui-pnotify-closer").click()
        });

    },
    //请求api
    reqApi: function (options) {
        var defaults = {
            async: true,
            contentType: "application/x-www-form-urlencoded",
            dataType: "json",
            data: {}
        };
        var opts = $.extend(defaults, options);
        if (typeof (opts.data.enterPriseId) == "undefined")
            opts.data.enterPriseId = $.getCurrentUser().enterPriseId;
        $.ajax({
            url: "/api/" + opts.url,
            type: opts.type,
            dataType: opts.dataType,
            contentType: opts.contentType,
            data: opts.data,
            async: opts.async,
            beforeSend: opts.beforeSend,
            success: function (result) {
                opts.success(result);
                //给动态添加的DOM元素添加tooltip提示
                $("[data-toggle='tooltip']").tooltip();
            },
            complete: function (rst) {
                //if (rst.status == 250) {
                //    if (typeof (opts.error) == "function")
                //        opts.error(rst);
                //    else
                //        $.errorMsg(rst.responseText);
                //}
                if (typeof (opts.complete) == "function")
                    opts.complete(rst);
            },
            error: function (err) {
                if (err.status == 401) {
                    callcenter.checkOut();
                } else if (err.status == 250) {
                    if (typeof (opts.error) == "function")
                        opts.error(err);
                }
                else {
                    if ("function" == typeof opts.error) {
                        //console.log(err);
                        opts.error(err);
                    }
                    else {
                        if (err.responseText)
                            $.errorMsg(err.responseText);
                    }
                }
            },
        });
    },

    //获取查询的query参数信息
    getListQueryParams: function () {
        var apiParams = {};
        //加载参数
        $("#divParams input[type='text'],#divParams input[type='hidden'],#divParams input[type='number'],#moreSearch input").each(function (index, item) {
            var name = $(item).attr("name");
            var val = $(item).val();
            if ($.trim(val) != "") {
                apiParams[name] = $(item).val();//encodeURIComponent($(item).val());
            }
        });
        $("#divParams select,#moreSearch select").each(function (index, item) {
            var name = $(item).attr("name");
            var val = $(item).val();
            var type = $(item).attr("data-type");
            if ($.trim(val) != "") {
                if (type == "bool") {
                    apiParams[name] = val == "1" ? true : false;
                } else if (type == "Array") { //解决Get请求数组参数，后台解析问题(直接拼接成如：a,b,c)
                    apiParams[name] = val.join(',');
                } else {
                    apiParams[name] = val;
                }
            }
        });
        return apiParams;
    },
    getList: function (options) {
        options.type = "GET";
        //Api 参数
        var apiParams = $.getListQueryParams();
        options.data = $.extend(apiParams, options.data);
        $.reqApi(options);
    },
    //GET 请求
    get: function (options) {
        options.type = "GET";
        $.reqApi(options);
    },
    //POST 请求
    post: function (options) {
        options.type = "POST";
        options.contentType = "application/json",
            options.data = JSON.stringify(options.data);
        $.reqApi(options);
    },
    //PUT 请求
    put: function (options) {
        options.type = "PUT";
        options.contentType = "application/json",
            options.data = JSON.stringify(options.data);
        $.reqApi(options);
    },
    //DELETE 请求
    delete: function (options) {
        options.type = "Delete";
        $.reqApi(options);
    },
    //getJSON 重写
    getJSON: function (url, data, callback) {
        $.ajax({
            url: url,
            data: data,
            dataType: "json",
            success: function (result) {
                if ("function" == typeof callback) {
                    callback(result);
                }
            },
            error: function (xhr) {
                console.log(xhr);
            }
        });
    },
    //GET back里的Controller请求
    getBack: function (options) {
        var defaults = {
            async: true,
            dataType: "json",
            type: "GET"
        };
        var opts = $.extend(defaults, options);
        $.ajax({
            url: opts.url,
            type: opts.type,
            dataType: opts.dataType,
            data: opts.data,
            async: opts.async,
            success: function (result) {
                opts.success(result);
            },
            complete: function (rst) {
                if (rst.status == 250) {
                    if (typeof (opts.error) == "function")
                        opts.error(rst);
                    else
                        $.errorMsg(rst.responseText);
                }
                if (typeof (opts.complete) == "function")
                    opts.complete(rst);
            },
            error: function (err) {
                if (err.status == 401) {
                    callcenter.checkOut();
                } else if (err.status == 250) {
                    if (typeof (opts.error) == "function")
                        opts.error(err);
                }
                else {
                    if ("function" == typeof opts.error) {
                        //console.log(err);
                        opts.error(err);
                    }
                }
            }
        });
    },
    //显示日期
    showDate: function (date, fmt) {
        //if(date)
        //    date = date.replace(/-/g, "/")
        //显示指定格式
        if (fmt) {
            if (!date)
                return "";
            if (date.substr(0, 4) == "0001" || date == "1900-01-01 00:00:00" || date == "1900/01/01 00:00:00" || date == "1970/01/01 00:00:00" || date == "1970-01-01 00:00:00") {
                return "";
            }
            return (new Date(date)).Format(fmt);
        }

        if (!date)
            return "";
        if (date.substr(0, 4) == "0001" || date == "1900-01-01 00:00:00" || date == "1900/01/01 00:00:00" || date == "1970/01/01 00:00:00" || date == "1970-01-01 00:00:00") {
            return "";
        }
        date = date.toString();
        if (date.indexOf(" ") >= 0)
            return date.substr(0, date.indexOf(" "));
        return date;
    },
    //显示省市区的名称
    //param:
    //  id: 省市区主键编号。
    showAreaName: function (id) {
        if (id == "" || id == null)
            return "-";
        var data = _.findWhere($.parseJSON($("#areaData").val()), { id: id });
        if (typeof (data) == "undefined") {
            return "-";
        }
        return data.name;
    },
    //显示布尔的值
    showBool: function (bool) {
        if (bool) {
            return "是";
        }
        return "否";
    },
    //获取表格的编号id
    //param:
    //  hasArr: true,无论是否选中一条，都返回数组。
    getSelectId: function (hasArr) {
        var id = "";
        var arr = [];
        $(".table tr").each(function (index, item) {
            if ($(item).data("isSelect") == true) {
                id = $(item).attr("data-id");
                arr.push(id);
            }
        });
        if (arr.length > 1) {
            return arr;
        } else {
            if (hasArr)
                return arr;
        }
        return id;
    },
    //取消表格的选中
    cancelSelectId: function () {
        $(".table tr").each(function (index, item) {
            if ($(item).data("isSelect") == true) {
                $(item).data("isSelect", false);
                $(item).css({ "background-color": "#fff" });
            }
        });
    },
    //获取当前选中的整个Item
    getSelectItem: function (hasArr) {
        var selectedItem = "";
        var arrItem = [];
        $(".table tr").each(function (index, item) {
            if ($(item).data("isSelect") == true) {
                selectedItem = $(item);
                arrItem.push(selectedItem);
            }
        });
        if (arrItem.length >= 1) {
            return arrItem;
        } else {
            return selectedItem;
        }
    },
    //获取表格的选中的自定义属性的值——单个
    //param:
    //attr: 自定义属性。
    getSelectAttrValue: function (attr) {
        var value = "";
        $(".table tr").each(function (index, item) {
            if ($(item).data("isSelect") == true) {
                value = $(item).attr(attr);
                return false;
            }
        });
        return value;
    },
    //获取表格的选中的自定义属性的值——多个
    getSelectAttrValueList: function (attr) {
        var value = "";
        var arr = [];
        $(".table tr").each(function (index, item) {
            if ($(item).data("isSelect") == true) {
                value = $(item).attr(attr);
                arr.push(value);
            }
        });
        if (arr.length > 1) {
            return arr;
        };
        return value;
    },
    //获取当前操作用户基本信息
    getCurrentUser: function () {
        return {
            id: $("#currentUserId").val(),
            name: $("#currentUserName").val(),
            jobNum: $("#currentJobNum").val(),
            project: $("#currentProject").val(),
            departmentId: $("#departmentId").val(),
            photo: $("#currentUserPhoto").val(),
            deptName: $("#deptName").val(),
            enterPriseId: $("#currentEnterPriseId").val(),
            levelId: $("#currentLevelId").val(),
            role: $("#currentRole").val()
        };
    },
    /*
     * 获取枚举描述
     * key：[枚举名称-枚举值]，如："EnumProductStatus-10"
     */
    getEnumDescription: function (key) {
        var enumDicObj = $.parseJSON($("#enumDic").val());
        return enumDicObj[key];
    },
    //文件服务器
    hostFileUrl: function () {
        //return "http://img.1caifu.com/";
        return "http://rescdn.xiaohu.in/";
    },
    //处理OSS文件路径
    getFileUrl: function (url) {
        if (url && url.substr(0, 4).toLowerCase() == "http")
            return url;
        else
            return $.hostFileUrl() + (url || "");
    },
    showUrl: function (url, text) {
        return "<a href='" + encodeURI(url) + "'>" + text + "</a>";
    },
    showUrls: function (url, text) {
        return "<a href='" + url + "'>" + text + "</a>";
    },
    showUrlss: function (url, text) {
        return "<a href='" + url + "' target='blank'>" + text + "</a>";
    },
    //显示交易类型
    showTradeType: function (status) {
        if (status < 30) {
            return "<span class=\"label label-info mr04\">预约</span>";
        }
        else if (status >= 30 && status < 60) {
            return "<span class=\"label label-warning mr04\">报单</span>";
        }
        else if (status >= 60) {
            return "<span class=\"label label-success mr04\">结佣</span>";
        }
    },
    getPlatform: function (platform) {
        if (platform) {
            if (platform == 1) return "<i class=\"dib icon-1caifu-light\"></i>";
            else if (platform == 2) return "<i class=\"dib icon-jiutian-light\"></i>";
            else if (platform == 4) return "<i class=\"dib icon-tengyun-light\"></i>";
            else if (platform == 3) return "<i class=\"dib icon-1caifu-light\"></i><i class=\"dib icon-jiutian-light\"></i>";
            else if (platform == 5) return "<i class=\"dib icon-1caifu-light\"></i><i class=\"dib icon-tengyun-light\"></i>";
            else if (platform == 6) return "<i class=\"dib icon-jiutian-light\"></i><i class=\"dib icon-tengyun-light\"></i>";
            else if (platform == 7) return "<i class=\"dib icon-1caifu-light\"></i><i class=\"dib icon-jiutian-light\"></i><i class=\"dib icon-tengyun-light\"></i>";
        }
        return "-";
    },
    //秒转为时分秒 00:00:00
    convertMin: function (val) {
        //占位符
        var seat = ":";
        //秒
        var sec = parseInt(val);
        //分
        var min = 0;
        //时
        var hour = 0;
        if (sec > 60) {
            min = parseInt(sec / 60);
            sec = parseInt(sec % 60);
            if (min > 60) {
                hour = parseInt(min / 60);
                min = parseInt(min % 60);
            }
        }
        var hourText = (hour >= 10 ? ("" + hour) : ("0" + hour)) + seat;
        var minText = (min >= 10 ? ("" + min) : ("0" + min)) + seat;
        var secText = (sec >= 10 ? ("" + sec) : ("0" + sec));
        return hourText + minText + secText;
    },
    /*
     * 刷新选项卡页面
     * rid：要刷新页面的选项卡data-id
     * cid：要关闭页面的选项卡data-id
     */
    refreshWin: function (rid, cid) {
        window.parent.refreshWin(rid, cid);
    },
    /*
     * 刷新选项卡页面
     * rid：要刷新页面的选项卡data-id
     * cid：要关闭页面的选项卡data-id
     */
    partRefreshWin: function (rid, cid) {
        window.parent.partRefreshWin(rid, cid);
    },
    /*
     * 页面之间的回调
     * rid：要刷新页面的选项卡data-id
     * data:刷新的数据
     */
    pageCallBack: function (rid, data) {
        window.parent.pageCallBack(rid, data);
    },
    getDate: function () {
        var date = new Date();
        var seperator1 = "-";
        var seperator2 = ":";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        var hour = date.getHours();
        var minute = date.getMinutes();
        var second = date.getSeconds();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        if (hour >= 1 && hour <= 9) {
            hour = "0" + hour;
        }
        if (minute >= 1 && minute <= 9) {
            minute = "0" + minute;
        }
        if (second >= 1 && second <= 9) {
            second = "0" + second;
        }
        var currentdate = year + seperator1 + month + seperator1 + strDate
            + " " + hour + seperator2 + minute
            + seperator2 + second;
        return currentdate;
    },
    //判断cookie是否存在
    get_cookie: function (Name) {
        var search = Name + "="
        var returnvalue = "";
        if (document.cookie.length > 0) {
            offset = document.cookie.indexOf(search)
            // 如果指定的cookie已经存在
            if (offset != -1) {
                // 长度指定到cookie值的位置      
                offset += search.length
                // 判断是否还包括其他cookie值         
                end = document.cookie.indexOf(";", offset);
                //如果不包括
                if (end == -1)
                    //获取cookie的长度
                    end = document.cookie.length;
                //获取cookie的值
                returnvalue = unescape(document.cookie.substring(offset, end))
            }
        }
        return returnvalue;
    },
    loadpopup: function () {
        //判断是否显示过公告
        if ($.get_cookie("popped") == "") {
            //显示公告 
            $('.sysAnnouncement').show();
            $('#menuCh,#sidebar').css('top', '65px');
            //设置cookie值
            document.cookie = "popped=yes"
        };
        //判断右侧广告是否显示过
        //if ($.get_cookie("poppeds") == "") {
        //    //设置右侧广告1.0
        //    $(".dialog_index_bg").removeClass("min");
        //    //设置cookie值
        //    document.cookie = "poppeds=yes"
        //}
    },
    //查看产品详情
    productView: function (productId, productTypeId) {
        switch (productTypeId) {
            case 1: case 2:
                $.openTab({ url: '/product/detail?id=' + productId + "&productTypeId=" + productTypeId, title: "查看产品-" + productId });
                break;
            case 3:
                $.openTab({ url: '/product/creditdetail?id=' + productId + "&productTypeId=" + productTypeId, title: "查看产品-" + productId });
                break;
            case 4:
                $.openTab({ url: '/product/privatedetail?id=' + productId + "&productTypeId=" + productTypeId, title: "查看产品-" + productId });
                break;
            case 5: case 6:
                $.openTab({ url: '/product/pevcdetail?id=' + productId + "&productTypeId=" + productTypeId, title: "查看产品-" + productId });
                break;
        }
    },
    //过滤html中br元素
    delHtmlBr: function (str) {
        return str.replace(/<br>/g, "");//去掉html中的br元素
    },
    delHtml: function (str) {
        return str.replace(/<[^>]*>/g, "");//去掉html元素
    },
    //列表产品名称展示格式统一
    showProductName: function (productName, phase) {
        var tagName = "";
        var productNameHtml = '<span>' + '<a href=\'javascript:;\'>' + productName + '</span> [<b class=\'colblue\'>' + phase + '</b><b>期</b>]';
        return productNameHtml;
    },
    //打开会员详情
    openUserDetail: function (id) {
        $.openTab({
            url: "/user/edit?id=" + id,
            title: "用户详情 - " + id
        });
    },
    //javascript 树形结构
    toTree: function (data) {
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
            // 以当前遍历项，的parentId,去map对象中找到索引的id
            var parent = map[item.parentId];
            // 好绕啊，如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到，他对应的父级中
            if (parent) {
                (parent.children || (parent.children = [])).push(item);
            } else {
                //如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 val结果集中，作为顶级
                //item.children = '';
                val.push(item);
            }
        });
        return val;
    },
    // 获取是什么浏览器
    myBrowser() {
        var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
        var isOpera = userAgent.indexOf("Opera") > -1;
        if (isOpera) {
            return "Opera"
        }; //判断是否Opera浏览器
        if (userAgent.indexOf("Firefox") > -1) {
            return "FF";
        } //判断是否Firefox浏览器
        if (userAgent.indexOf("Edge") > -1) {
            return "Edge";
        } //判断是否Edge浏览器 
        if (userAgent.indexOf("Chrome") > -1) {
            return "Chrome";
        }
        if (userAgent.indexOf("Safari") > -1) {
            return "Safari";
        } //判断是否Safari浏览器
        if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
            return "IE";
        }; //判断是否IE浏览器
    },
    utf16to8(str) {
        var out, i, len, c;
        out = "";
        len = str.length;
        for (i = 0; i < len; i++) {
            c = str.charCodeAt(i);
            if ((c >= 0x0001) && (c <= 0x007F)) {
                out += str.charAt(i);
            } else if (c > 0x07FF) {
                out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
                out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
                out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
            } else {
                out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
                out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
            }
        }
        return out;
    },
    //显示百分比
    showPercentage: function (num) {
        num = num * 100;
        return num <= 0 ? "" : num+ "%";
    },
    //复制文本到粘贴板
    copyText: function (text) {
        let transfer = document.createElement('input');
        document.body.appendChild(transfer);
        transfer.value = text;  // 这里表示想要复制的内容
        //transfer.focus();
        transfer.select();
        if (document.execCommand('copy')) {
            document.execCommand('copy');
        }
        //transfer.blur();
        console.log('复制成功');
        document.body.removeChild(transfer);
    }
});

