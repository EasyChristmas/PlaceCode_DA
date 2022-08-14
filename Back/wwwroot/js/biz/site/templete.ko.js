//模版实体
var TempleteModel = function (messageTemplete) {
    var self = this;
    self.id = messageTemplete.id; //模版编号
    self.name = ko.observable(messageTemplete.name); //模版标题
    self.content = ko.observable(messageTemplete.content); //模版内容
    self.method = ko.observable(messageTemplete.method); //模版的发送消息方式
    self.source = ko.observable(messageTemplete.source); //模版发送极光的来源
    self.sourceName = ko.observable(getSourceName(messageTemplete.source)); //模版发送极光的来源
};

//获取极光推送来源
function getSourceName(source) {
    var result = "";
    switch (source) {
        case $.Enum.EnumJPushSource.default:
            result = "默认通知";
            break;
        case $.Enum.EnumJPushSource.message:
            result = "系统通知";
            break;
        case $.Enum.EnumJPushSource.news:
            result = "公告通知";
            break;
        case $.Enum.EnumJPushSource.product:
            result = "产品通知";
            break;
        case $.Enum.EnumJPushSource.marketing:
            result = "营销通知";
            break;
        case $.Enum.EnumJPushSource.productcollect:
            result = "收藏通知";
            break;
    }
    return result;
}

//消息实体
var MessageModel = function (message) {
    var self = this;
    self.id = message.id; //新闻编号
    self.method = ko.observable(message.method); //发送方式
    self.title = ko.observable(message.title); //发送标题
    self.message = ko.observable(message.message); //发送内容
    self.sendGroup = ko.observable(message.sendGroup); //发送对象
    self.status = ko.observable(message.status); //发送状态
    self.remark = ko.observable(message.remark); //备注
    self.sendTime = ko.observable(message.sendTime); //发送时间
    self.count = ko.observable(message.count); //数量
    self.isDelete = ko.observable(message.isDelete); //数量
};

//消息模版页面ko对象
var MessageViewModel = function () {
    var self = this;
    self.templeteList = ko.observableArray([]);  //模版集合
    self.messageList = ko.observableArray([]);  //消息集合
    self.total = ko.observable(0); //消息条数
    self.project = 1;//当前选择项目
    self.role = 1;//当前选择发送方式
    self.sendMethod = 1;//当前选择发送方式
    self.templeteName = ko.observable("");;//当前输入的模版标题

    self.seltempleteId = 0;  //当前选中的模版Id
    self.isEditTemplete = true;  //是否编辑类型(用于区分新增/编辑新闻类型)

    //选择平台
    self.selProject = function (obj) {
        self.project = $(obj).val();
        //选择腾云
        if (self.project == 4) {
            var option = ' <option value="null">全部</option>"';
            $("#selRole").html(option);
            self.role = null;
        }
        else {
            var option = ' <option value="' + 1 + '">理财师</option>"';
            option += ' <option value="' + 2 + '">直客</option>"';
            $("#selRole").html(option);
            self.role = 1;
        }
        self.loadTemplete();
    }

    //选择平台子项目
    self.selRole = function (obj) {
        if (event.type != 'change')
            return;
        self.role = $(obj).val();
        self.loadTemplete();
    }

    //选择模版发送方式
    self.selSendMethod = function (obj) {
        if (event.type != 'change')
            return;
        self.sendMethod = $(obj).val();
        self.loadTemplete();
    }

    //模版管理输入回车查询
    self.searchTemplete = function (event) {
        if (event.keyCode == 13) {
            self.loadTemplete();
        }
    }

    //加载模版
    self.loadTemplete = function () {
        //清空数据
        self.templeteList([]);
        self.seltempleteId = 0;
        self.emptyQuery();
        $.get({
            url: 'site/templete',
            data: { project: self.project, role: self.role, sendMethod: self.sendMethod, name: self.templeteName },
            success: function (result) {
                for (var i = 0; i < result.length; i++) {
                    if (i == 0)
                        self.seltempleteId = result[i].id;
                    self.templeteList.push(new TempleteModel(result[i]));
                }
                query(1);
            }
        });
    };

    //模版选中
    self.selTemplete = function (obj) {
        var $this = $(obj);
        var id = $this.attr('dataid');

        if (id && id != self.seltempleteId) {
            self.emptyQuery();
            $("div[dataGroup='messageTempleteGroup']").each(function () {
                if ($(this).hasClass("active"))
                    $(this).removeClass('active');
            });
            if (!$this.hasClass("active"))
                $this.addClass("active");

            self.seltempleteId = id;
            query(1);
        }
    };

    //新增模版
    self.addTemplete = function () {
        var width = 900;
        if (self.sendMethod == 1) {
            $("#divEmail").hide();
            $("#divSms").show();
            width = 700;
        }
        else {
            $("#divSms").hide();
            $("#divEmail").show();
        }
        $.openDialog({
            title: '新增模版',
            jqObj: $('#divTemplete'),
            width: width
        });
        $('#sendMode input').hide();
        $('#sendMode select').hide();
        self.isEditTemplete = false;
    };

    //编辑模版
    self.editTemplete = function (obj) {
        //当前div没选中则不处理
        if (!$(obj).parent().parent().parent().hasClass('active'))
            return;
        $.get({
            url: 'site/templete?id=' + self.seltempleteId,
            success: function (result) {
                //console.log(result);
                var width = 900;
                if (self.sendMethod == 1) {
                    $("#divEmail").hide();
                    $("#divSms").show();
                    width = 700;
                }
                else {
                    $("#divSms").hide();
                    $("#divEmail").show();
                }
                $.openDialog({
                    title: '编辑模版',
                    jqObj: $('#divTemplete'),
                    width: width
                });

                $('#templeteForm').loadForm(result);
                if ($('#sendMode a').eq(0).hasClass("active"))
                    $('#sendMode input').show();
                else
                    $('#sendMode input').hide();

                if ($('#sendMode a').eq(1).hasClass("active"))
                    $('#sendMode select').show();
                else
                    $('#sendMode select').hide();
                self.isEditTemplete = true;
            }
        });
    };
    //保存模版
    self.saveTemplete = function () {
        if ($("#txtName").val().trim().length == 0) {
            $.tips('此处内容为必填项', $("#txtName"));
            $('#txtName').focus();
            return;
        }
        //验证短信、极光
        if (self.sendMethod == 1) {
            //验证内容
            if ($("#txtContent").val().trim().length == 0) {
                $.tips('此处内容为必填项', $("#txtContent"));
                $('#txtContent').focus();
                return;
            }
            else {
                var templeteContent = $("#txtContent").val().trim();
                var placeholderArray = self.getPlaceholder($("#txtContent").val().trim());
                for (var j = 0; j < placeholderArray.length; j++)
                    templeteContent = templeteContent.replace(placeholderArray[j], '');

                if (templeteContent.length > self.maxCount) {
                    $.tips('模版内容超出', $("#txtContent"));
                    $('#txtContent').focus();
                    return;
                }
            }
            //验证发送方式
            var selMethod = 0;
            $('#sendMode').find(".active[name='method']").each(function (index, cboItem) {
                var val = $(cboItem).attr("data-value");
                selMethod += parseInt(val);
            });
            if (selMethod == 0) {
                $.tips('请选择发送方式', $('#sendMode'));
                $('#sendMode').focus();
                return;
            }
            if (selMethod & 1) {
                if ($("#txtCode").val().trim().length == 0) {
                    $.tips('此处内容为必填项', $("#txtCode"));
                    $('#txtCode').focus();
                    return;
                }
                if ($("#txtExtend").val().trim().length == 0) {
                    $.tips('此处内容为必填项', $("#txtExtend"));
                    $('#txtExtend').focus();
                    return;
                }
            }
        }
        //验证邮件
        else {
            if ($('#summernote').summernote('code').trim().length == 0) {
                $.alert("请输入邮件内容");
                return;
            }
        }
        var content = self.sendMethod == 1 ? $("#txtContent").val().trim() : $('#summernote').summernote('code').trim();
        $("#templeteForm").submitForm({
            type: self.isEditTemplete ? 'put' : 'post',
            url: 'site/templete',
            isCheck: false,
            data: self.isEditTemplete ? { id: self.seltempleteId, project: self.project, content: content } : { project: self.project, role: self.role, content: content },
            success: function (result) {
                //编辑
                if (self.isEditTemplete) {
                    for (var i = 0; i < self.templeteList().length; i++) {
                        if (self.templeteList()[i].id == result.id) {
                            self.templeteList()[i].name(result.name);
                            self.templeteList()[i].content(result.content);
                            self.templeteList()[i].method(result.method);
                            self.templeteList()[i].source(result.source);
                            self.templeteList()[i].sourceName(getSourceName(result.source));
                            break;
                        }
                    }
                }
                //添加
                else {
                    if (self.templeteList().length == 0)
                        self.seltempleteId = result.id;

                    self.templeteList.push(new TempleteModel(result));
                }
                $.closeDialog($('#divTemplete'));
            },
            error: function (resultErr) {
                $.errorMsg(resultErr.responseText);
            }
        });
    };

    //删除模版
    self.delTemplete = function (obj) {
        //当前div没选中则不处理
        if (!$(obj).parent().parent().parent().hasClass('active'))
            return;
        $.confirm('您确定要删除吗?', function () {
            $.delete({
                url: "site/templete/" + self.seltempleteId,
                success: function () {
                    $.success('操作成功');
                    self.loadTemplete();
                },
                error: function (resultErr) {
                    $.errorMsg(resultErr.responseText);
                }
            });
        });
    };

    //********************************消息模块********************************

    self.queryMethod = ko.observable("");  //查询条件-发送方式
    self.queryStatus = ko.observable("");  //查询条件-发送状态

    self.maxCount = 100; //提示信息-最大数量
    self.currentCount = ko.observable(0); //提示信息-当前数量
    self.surplusCount = ko.observable(0); //提示信息-剩余数量

    //清空消息查询条件
    self.emptyQuery = function () {
        self.queryMethod("");
        self.queryStatus("");
    };

    //发送消息
    self.sendMessage = function () {
        if (self.seltempleteId == 0) {
            $.tips('请先选择模版', $(event.toElement));
            return;
        }
        //壹财富用户才有条件用户
        if (self.project == 1)
            $("#liLevelUser").show();
        else
            $("#liLevelUser").hide();

        //邮件不需要限制字数
        if (self.sendMethod == 1)
            $("#divTips").show();
        else
            $("#divTips").hide();

        //清空产品下拉框的值
        $("#selProduct").html('<option value="">-</option>');
        //清空公告下拉框的值
        $("#selNews").html('<option value="">-</option>');


        //模版内容
        for (var i = 0; i < self.templeteList().length; i++) {
            if (self.templeteList()[i].id == self.seltempleteId) {
                $("#pTempleteTitle").html(self.templeteList()[i].name());
                $("#pTempleteContent").html(self.templeteList()[i].content());

                var source = self.templeteList()[i].source();
                $("#divUrl").hide();
                $("#divProduct").hide();
                $("#divNews").hide();

                //是否显示跳转链接
                if (source && source == $.Enum.EnumJPushSource.marketing)
                    $("#divUrl").show();
                else if (source && source == $.Enum.EnumJPushSource.product
                    || source && source == $.Enum.EnumJPushSource.productcollect) {
                    $.Data.bindOnlineProduct({ selId: "selProduct", isOnline: true, project: self.project });
                    $("#divProduct").show();
                }
                else if (source && source == $.Enum.EnumJPushSource.news) {
                    //壹财富
                    if (self.project == 1) {
                        //暂未处理
                        $.Data.bindNews({ selId: "selNews", newsTypeIds: "36,41,80" });
                    }
                    //九天--运营公告、产品动态、九天快讯
                    else if (self.project == 2) {
                        $.Data.bindNews({ selId: "selNews", newsTypeIds: "38,39,40,42,43,44,45,46,47,47,48" });
                    }
                    $("#divNews").show();
                }

                //根据模版发送方式，控制显示发送框
                var method = self.templeteList()[i].method();
                $("#txtMobile").hide();
                $("#txtEmail").hide();
                $("#txtRegistrationId").hide();
                //模版发送方式包含短信
                if (method & 1)
                    $("#txtMobile").show();
                //模版发送方式包含邮箱
                if (method & 2)
                    $("#txtEmail").show();
                //模版发送方式包含极光
                if (method & 8)
                    $("#txtRegistrationId").show();
                break;
            }
        }

        //占位符html
        var placeholderArray = self.getPlaceholder($("#pTempleteContent").html());
        var placeholderHtml = '';
        var templeteContent = $("#pTempleteContent").html();
        for (var j = 0; j < placeholderArray.length; j++) {
            placeholderHtml += '<div class="form-group"><label for="inputEmail3" class="col-sm-3 control-label colred">占位符' + placeholderArray[j] + '</label><div class="col-sm-8"><input type="text" onkeyup="changeSurplusCount();" class="form-control" data-val="' + placeholderArray[j] + '"  data-grorp="placeholder" placeholder=""></div></div>';

            templeteContent = templeteContent.replace(placeholderArray[j], '');
        }

        $('#divPlaceholder').html(placeholderHtml);
        //当前模版内容字符数量
        self.currentCount(templeteContent.length);
        //当前模版剩余字符数量
        self.surplusCount(self.maxCount - self.currentCount());

        $("#myTab li").first().addClass("active").siblings().removeClass("active");
        $("#myTabContent .tab-pane").first().addClass("active in").siblings().removeClass("active in");

        $.openDialog({
            title: '发送消息',
            jqObj: $('#divMessage')
        });

        //初始化开关按钮
        showSwitchery();

        //初始化地区
        $.Data.loadSSH({
            province: 'selProvince',
            city: 'selCity',
            area: 'selArea'
        });
        //选择标签placeholder重绘
        $('#selTag').select2({
            placeholder: "请选择标签"
        });
    };

    //保存消息
    self.saveMessage = function () {
        //消息的目标Id
        var targetId = "";
        //重新计算发送内容剩余文字
        changeSurplusCount();
        //验证占位符
        var extendDic = {};
        var isBreack = false;
        $('input[data-grorp="placeholder"]').each(function () {
            var $this = $(this);
            if ($this.val().trim().length == 0) {
                $.tips('请填写占位符', $this);
                $this.focus();
                isBreack = true;
                return false;
            }
            var dataVal = $this.attr('data-val').replace('${', '').replace('}', '');
            extendDic[dataVal] = $this.val().trim();
        });
        if (isBreack)
            return false;
        var extend = JSON.stringify(extendDic).replace('{}', '');

        //只有短信、极光才提示字数长度
        if (self.sendMethod == 1) {
            //验证消息长度
            if (self.surplusCount() < 0) {
                $.tips('消息内容超出', $("#pTempleteContent"));
                return false;
            }
        }
        //验证发送对象
        var sendGroup = '';
        $("#myTab li").each(function () {
            var $this = $(this);
            if ($this.attr('class') == 'active') {
                sendGroup = $this.find("a").html().trim();
                return true;
            }
        });
        //跳转地址
        if ($("#divUrl").is(":visible")) {
            if ($("#txtUrl").val().length == 0) {
                $.tips('请输入跳转地址', $("#txtUrl"));
                $('#txtUrl').focus();
                return false;
            }
        }
        //选择产品
        if ($("#divProduct").is(":visible")) {
            var selProductVal = $("#selProduct").val();
            if (selProductVal == null || selProductVal.length == 0) {
                $.tips("请选择产品", $("#selProduct"));
                $("#selProduct").focus();
                return false;
            } else
                targetId = selProductVal;
        }

        //选择公告
        if ($("#divNews").is(":visible")) {
            var selNewsVal = $("#selNews").val();
            if (selNewsVal == null || selNewsVal.length == 0) {
                $.tips("请选择公告", $("#selNews"));
                $("#selNews").focus();
                return false;
            }
            else
                targetId = selNewsVal;
        }

        if (sendGroup == "单个用户") {
            var mobile = $("#txtMobile").val().trim();
            var email = $("#txtEmail").val().trim();
            var regId = $("#txtRegistrationId").val().trim();

            for (var i = 0; i < self.templeteList().length; i++) {
                if (self.templeteList()[i].id == self.seltempleteId) {
                    var method = self.templeteList()[i].method();
                    //验证短信
                    if (method & 1) {
                        if (mobile.length == 0) {
                            $.tips('请填写手机号码', $("#txtMobile"));
                            $("#txtMobile").focus();
                            return false;
                        }
                        else {
                            var zzMobile = /^1[3|4|5|7|8]\d{9}$/;
                            if (!zzMobile.test(mobile)) {
                                $.tips('手机格式不正确', $("#txtMobile"));
                                $("#txtMobile").focus();
                                return false;
                            }
                        }
                    }
                    //验证邮箱
                    if (method & 2) {
                        if (email.length == 0) {
                            $.tips('请填写邮箱号码', $("#txtEmail"));
                            $("#txtEmail").focus();
                            return false;
                        } else {
                            var zzEmail = /\w@\w*\.\w/;
                            if (!zzEmail.test(email)) {
                                $.tips('邮箱格式不正确', $("#txtEmail"));
                                $("#txtEmail").focus();
                                return false;
                            }
                        }
                    }
                    //验证极光
                    if (method & 8) {
                        if (regId.length == 0) {
                            $.tips('请填写极光号码', $("#txtRegistrationId"));
                            $("#txtRegistrationId").focus();
                            return false;
                        }
                    }
                    break;
                }
            }
        }

        $("#messageForm").submitForm({
            type: 'post',
            url: 'site/message',
            isCheck: false,
            data: { messageTempleteId: self.seltempleteId, extend: extend, sendGroup: sendGroup, targetId: targetId },
            success: function () {
                self.emptyQuery();
                query(1);
                $.closeDialog($('#divMessage'));
            },
            error: function (resultErr) {
                $.errorMsg(resultErr.responseText);
            }
        });
    };
    //撤销消息
    self.deleteMessage = function (id) {
        $.confirm('您确定要撤销吗？', function () {
            $.delete({
                url: "site/message/" + id,
                success: function (result) {
                    query(1);
                    $.success("操作成功！");
                },
                error: function (resultErr) {
                    $.errorMsg(resultErr.responseText);
                }
            });
        });
    };

    //获取占位符
    self.getPlaceholder = function (content) {
        var placeholderArray = [];
        //占位符
        var count = (content.split('$')).length - 1;
        for (var j = 0; j < count; j++) {
            content = content.replace(content.substr(0, content.indexOf("$")), '');
            var end = content.indexOf("}") + 1;
            placeholderArray.push(content.substr(0, end));
            content = content.replace(content.substr(0, end), '');
        }
        return placeholderArray;
    }
};

