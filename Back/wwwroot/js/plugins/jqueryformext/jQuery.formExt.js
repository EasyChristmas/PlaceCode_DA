jQuery.fn.extend({
    //加载form表单
    loadForm: function (data) {
        if (JSON.stringify(data) != "{}" && JSON.stringify(data) != "") {
            this.find("input[name]").each(function (index, item) {
                var name = $(item).attr("name");
                var type = $(item).attr("type");
                var val = data[name];
                //日期转换
                if ($(item).attr("data-type") === "datetime")
                    val = $.showDate(val);

                if (type === "radio") {
                    if (val) {
                        if (val.toString() === $(item).val()) {
                            $(item).prop("checked", "checked");
                        } else {
                            $(item).removeAttr("checked");
                        }
                    }
                }
                else if (type === "checkbox") {
                    var dataType = $(item).attr("data-type");
                    if (dataType == "bool") {
                        if (val != null) {
                            if (val.toString() == "true") {
                                $(item)[0].checked = true
                                $(item).val(true);
                            } else {
                                $(item).removeAttr("checked");
                                $(item).val(false);
                            }
                        }
                    }
                    else if (dataType == "wei") {  //位运算
                        if (val & $(item).val()) {
                            $(item).prop("checked", "checked");
                            $(item).parent().addClass("checked");
                        } else {
                            $(item).parent().removeClass("checked");
                        }
                    }
                    else if (dataType == "switch") {//单选框增加ios拖动样式
                        if (val != null) {
                            if (val.toString() == "true") {
                                $(item).prop("checked", "checked");
                                $(item).val(true);
                            } else {
                                $(item).removeAttr("checked");
                                $(item).val(false);
                            }
                        }
                        //是否启用
                        if (typeof ($(item).attr("disabled")) == "undefined")
                            enabledSingleSwitchery(item);
                        else
                            disabledSingleSwitchery(item);
                    }
                    else {
                        if (val != null) {
                            var s = val.toString(); // '1,2,3,' 
                            if (s.substr(s.length - 1, 1) != ",") s += ",";
                            if (s.indexOf($(item).val() + ",") >= 0) {
                                $(item).prop("checked", "checked");
                                $(item).parent().addClass("checked");
                            } else {
                                $(item).removeAttr("checked");
                                $(item).parent().removeClass("checked");
                            }
                        }
                    }
                } else if (type == "file") {
                } else if (type == "reset") {
                } else if (type == "submit") {
                } else if (type == "button") {
                } else if (type == "hidden") {
                    //图标logo位运算规则
                    if ($(item).attr("data-name")) {
                        val = data[$(item).attr("data-name")];
                        if ((val & parseInt($(this).val())) == parseInt($(this).val())) {
                            $(this).parent().addClass("active");
                        }
                    }
                    else
                        $(item).val(val);
                }
                else if (type == "datetime-local") {
                    $(item).val(val);
                }
                else {
                    $(item).val(val);
                }
            });
            this.find("a[data-type]").each(function (index, item) {
                var name = $(item).attr("name");
                var val = data[name];
                var dataType = $(item).attr("data-type");
                //位运算
                if (dataType == 'wei') {
                    if (val & $(item).attr("data-value")) {
                        $(item).addClass("active");
                    } else {
                        $(item).removeClass("active");
                    }
                }
            });
            this.find("select[name]").each(function (index, item) {
                var name = $(item).attr("name");
                var val = data[name];

                if (val != null && val != undefined) {
                    $(item).children("option").each(function (i, option) {
                        if (val.toString() === $(option).val()) {
                            $(option).prop("selected", "selected");
                        } else {
                            $(option).removeAttr("selected");
                        }
                    });
                    //select2插件赋值
                    var cl = $(item).attr("class");
                    if (cl && cl == 'selectpicker select2-hidden-accessible') {
                        //select2插件显示文字的span控件
                        var spanElem = $(item).parent().find("span[class='select2-selection__rendered']");
                        var defaultVal = $(item).find("option:selected").text();
                        spanElem.html(defaultVal);
                        spanElem.attr("title", defaultVal);
                    }
                }
            });
            this.find("textarea[name]").each(function (index, item) {
                var name = $(item).attr("name");
                var val = data[name];
                $(item).val(val);

            });
            this.find("div[contenteditable='true']").each(function (index, item) {
                var name = $(item).attr("name");
                var val = data[name];
                $(item).html(val);
            });
            this.find("img[data-form='true']").each(function (index, item) {
                var name = $(item).attr("name");
                var val = data[name];
                $(item).attr("data-src", val).attr("src", $.getFileUrl(val));
            });
            this.find("label").each(function (index, item) {
                var name = $(item).attr("name");
                var val = data[name];
                $(item).text(val);
            });
            this.find("span").each(function (index, item) {
                var name = $(item).attr("name");
                var val = data[name];
                $(item).html(val);
            });
            //富文本框
            this.find("div[data-value]").each(function (index, item) {
                var name = $(item).attr("data-value");
                var val = data[name];
                $(item).eq(index).summernote('code', val);
            });
            //自定义插件
            this.find("div[data-plugin-name]").each(function (index, item) {
                var name = $(item).attr('name');
                var val = data[name];
                //多个文件上传div插件
                var pluginName = $(item).attr('data-plugin-name');
                var remove = $(item).attr("data-remove");
                if (pluginName == "multiUpload") {
                    $(item).attr("data-upload-value", val);
                    //文件数量
                    var files = '';
                    try {
                        files = (val == null || val.length == 0) ? "" : eval("(" + val + ")");
                    }
                    catch (e) {
                        files = '';
                    }
                    for (var i = 0; i < files.length; i++) {
                        //追加上传的图片
                        $(item).appendUploadFileHtml({
                            url: files[i].file,
                            guid: files[i].guid,
                            fileName: files[i].name,
                            isSingle: false,
                            isDelete: remove
                        });
                    }
                }
                //单个文件上传div插件
                else if (pluginName == "singleUpload") {
                    if (val) {
                        //追加上传的图片
                        $(item).appendUploadFileHtml({
                            url: val,
                            isSingle: true,
                            isDelete: remove
                        });
                    }
                }
            });
            //步骤条
            this.find("div[data-step]").each(function (index, item) {
                var name = $(item).attr('name');
                var maxSteps = $(item).attr('data-step-maxStep');
                $(item).step({
                    stepCount: maxSteps,// step数，默认3
                    defaultsStep: data[name] ? data[name] : 0,//初始值
                    success: function (i) {
                        $(item).prev('input[hidden]').val(i);

                    }
                });
            });

        }
    },
    //提交form表单
    submitForm: function (options) {
        var $form = $(this);
        var defaults =
        {
            isCheck: true,
            type: "",
            url: "",
            data: {
                enterPriseId: $.getCurrentUser().enterPriseId
            },
            beforeSend: false,
            async: true,
            success: false,
            error: false
        };
        //deep:true 深拷贝对data这种复杂类型
        var opts = $.extend(true, defaults, options);
        var isVia = opts.isCheck ? $form.validate() : true;
        if (isVia) {
            if (typeof opts.beforeSend == "function") {
                var beforeSendResult = opts.beforeSend();
                if (typeof beforeSend != "undefined" && !beforeSendResult) {
                    return false;
                }
            }
            var formParam = $form.toJson();

            $.extend(formParam, opts.data);
            if (opts.type.toUpperCase() == 'POST') {
                $.post({
                    url: opts.url,
                    data: formParam,
                    async: opts.async,
                    beforeSend: opts.beforeSend,
                    success: opts.success,
                    error: opts.error
                });
            } else if (opts.type.toUpperCase() == 'PUT') {
                $.put({
                    url: opts.url + '/' + formParam.id,
                    data: formParam,
                    async: opts.async,
                    beforeSend: opts.beforeSend,
                    success: opts.success,
                    error: opts.error
                });
            }
        }
        return isVia;

    },
    //重置表单
    resetForm: function () {
        //$(this)[0].reset();
        var val = "";
        this.find("input[name]").each(function (index, item) {
            var name = $(item).attr("name");
            var type = $(item).attr("type");

            //日期转换
            if ($(this).parent("div").hasClass("datepicker"))
                val = val;

            if (type === "radio") {
                $(item).removeAttr("checked");
            }
            else if (type === "checkbox") {
                var dataType = $(item).attr("data-type");
                if (dataType == "bool") {
                    $(item).removeAttr("checked");
                    $(item).val(false);
                    //ios按钮插件
                    if ($(item).attr("class") == "js-switch") {
                        $(item).removeAttr("data-switchery");
                        $(item).show();
                        $(item).next().remove();
                    }
                }
                else if (dataType == "wei") {  //位运算
                    $(item).parent().removeClass("checked");
                    $(item).removeAttr("checked");
                }
                else if (dataType == "switch") {//单选框增加ios拖动样式
                    $(item).removeAttr("checked");
                    $(item).val(false);
                    $(item).removeAttr("data-switchery");
                    $(item).nextAll().remove();
                }
                else {
                    $(item).parent().removeClass("checked");
                    $(item).removeAttr("checked");
                }
            } else if (type == "file") {
            } else if (type == "reset") {
            } else if (type == "submit") {
            } else if (type == "button") {
            } else if (type == "datetime-local") {
                $(item).val(val);
            }
            else {
                $(item).val(val);
            }
        });
        this.find("a[data-type]").each(function (index, item) {
            var dataType = $(item).attr("data-type");
            //位运算
            if (dataType == 'wei') {
                $(item).removeClass("active");
            }
        });
        this.find("select[name]").each(function (index, item) {
            //select2插件清空值
            var cl = $(item).attr("class");

            //select2的多选效果
            if (cl && cl.indexOf("selectpicker") >= 0 && $(this).attr("data-type") == 'Array') {
                $(item).children("option").each(function (i, option) {
                    $(option).removeAttr("selected");
                });
                //select2插件显示文字的span控件
                var spanElem = $(item).parent().find("ul[class='select2-selection__rendered']");
                spanElem.html("");
                spanElem.attr("title", "");
            }
            else {
                $(item).children("option").each(function (i, option) {
                    if (i == 0) {
                        $(option).attr("selected", "selected");
                    }
                    else {
                        $(option).removeAttr("selected");
                    }
                });
                //select2单选效果
                if (cl && cl.indexOf("selectpicker") >= 0) {
                    //select2插件显示文字的span控件
                    var spanElem = $(item).parent().find("span[class='select2-selection__rendered']");
                    var defaultVal = $(item).children("option")[0].text;
                    spanElem.html(defaultVal);
                    spanElem.attr("title", defaultVal);
                }
            }
        });
        this.find("textarea[name]").each(function (index, item) {
            var name = $(item).attr("name");
            $(item).val(val);
        });
        this.find("img").each(function (index, item) {
            $(item).attr("src", "");
        });
        this.find("img[data-form='true']").each(function (index, item) {
            $(item).attr("data-src", val).attr("src", val);
        });
        this.find("div[contenteditable='true']").each(function (index, item) {
            $(item).html(val);
        });
        this.find("div[data-plugin-name]").each(function () {
            var uploadType = $(this).attr('data-plugin-name');
            if (uploadType == 'multiUpload' || uploadType == 'singleUpload') {
                //清空多文件div插件的值
                $(this).attr('data-upload-value', '');
                $($(this).children()).each(function (index, item) {
                    if (index == 0) {
                        $(item).show();
                    }
                    else {
                        $(item).remove();
                    }
                });
            }
        });
        this.find("div[data-step]").each(function (index, item) {
            var name = $(item).attr('name');
            var maxSteps = $(item).attr('data-step-maxStep');
            $(item).step({
                stepCount: maxSteps,// step数，默认3
                defaultsStep: 0,//初始值
                success: function (i) {
                    $(item).prev('input[hidden]').val(i);
                }
            });
        })
    },
    //转化为json对象
    toJson: function () {
        var obj = {};
        var $obj = this;
        this.find("input,select,textarea,hidden").each(function (index, item) {
            var name = $(item).attr("name");
            if (name == "" || name == undefined) return;
            var val = $(item).val();
            var type = $(item).attr("type");
            switch (type) {
                //用户处理select多选模式提交数据问题
                case "multipleSelect":
                    if (val) {
                        val = val.join(',');
                        obj[name] = val;
                    }
                    break;
                case "submit":
                case "reset":
                case "button":
                case "file":
                case "image":
                    break;
                case "checkbox":
                    val = $obj.find(":checked[name='" + name + "']").val();
                    var dataType = $(item).attr("data-type");
                    if (dataType == "bool") {
                        val = $obj.find("[name='" + name + "']")[0].checked;
                        obj[name] = val;
                    } else if (dataType == "wei") { //位运算
                        if (!obj[name]) {
                            obj[name] = 0;
                            $obj.find(":checked[name='" + name + "']").each(function (index, cboItem) {
                                var val = $(cboItem).val();
                                obj[name] += parseInt(val);
                            });
                        }
                    } else if (dataType == "split") {
                        if (!obj[name]) {
                            obj[name] = "";
                            $obj.find(":checked[name='" + name + "']").each(function (index, cboItem) {
                                var val = $(cboItem).val();
                                obj[name] += val + ",";
                            });
                        }
                    }
                    else {
                        obj[name] = val;
                    }
                    break;
                case "radio":
                    val = $obj.find("input[name='" + name + "']:checked").val();
                    obj[name] = val;
                    break;
                case "textarea":
                    obj[name] = $(item).html();
                    break;
                default:
                    obj[name] = val;
                    break;
            }
        });
        this.find("a[data-type]").each(function (index, item) {
            var name = $(item).attr("name");
            var dataType = $(item).attr("data-type");
            //位运算
            if (dataType == 'wei') {
                if (!obj[name]) {
                    obj[name] = 0;
                    $obj.find(".active[name='" + name + "']").each(function (index, cboItem) {
                        var val = $(cboItem).attr("data-value");
                        obj[name] += parseInt(val);
                    });
                }
            }
        });
        this.find("img[data-form='true']").each(function () {
            var name = $(this).attr("name");
            obj[name] = $(this).attr("data-src");
        });
        //文件上传插件数据
        this.find("div[data-submit='true']").each(function () {
            var name = $(this).attr("name");
            obj[name] = $(this).attr("data-upload-value");
        });
        return obj;
    },
    //表单字段变更
    changeForm: function (options) {
        var $form = this;
        //if (options.reId)
        //    options.url = options.url.substr(0, options.url.lastIndexOf("/") + 1) + options.reId;
        //data-field：有表明和字段名组成，如adminInfo-id
        //input,textarea,可输入的div变更
        $form.find("input[data-field][readonly!='readonly'][disabled!='disabled'],textarea[data-field][readonly!='readonly'][disabled!='disabled'],div[data-field]").each(function (index, item) {
            var datafield = $(item).attr("data-field") || '';
            var datafields = datafield.split("-");
            //如果data-field不是由表和字段名组成的则跳过本次循环
            if (datafields.length < 2) return true;
            //当前元素对应表名
            var tableName = datafields[0].substr(0, 1).toUpperCase() + datafields[0].substr(1);
            //当前元素对应字段名
            var propName = datafields[1].substr(0, 1).toUpperCase() + datafields[1].substr(1);
            var type = $(item).attr("type");

            if (type === "radio") {
            }
            else if (type === "checkbox") {
                $(this).change(function (e) {
                    //获取checkBox值
                    var obj = $(this);
                    if (!validateData(obj, e)) return;
                    var fieldValue = false;
                    if ($(obj).attr("data-type") == "bool") {
                        if ($(this).parent().attr("class").toString().indexOf("checked") >= 0) {
                            fieldValue = true;
                        }
                    }
                    else if ($(obj).attr("data-type") == "switch") {
                        fieldValue = $(item).prop("checked");
                    }
                    //当前元素对应字段值
                    var propValue = fieldValue;

                    $.put({
                        url: options.url,
                        data: { source: tableName, propName: propName, propValue: propValue },
                        success: function () {
                        },
                        error: function (resultErr) {
                            $.tips(resultErr.responseText, $(obj), 1500);
                            return;
                        }
                    });
                });
            } else if (type == "file") {
            } else if (type == "reset") {
            } else if (type == "submit") {
            } else if (type == "button") {
            } else {
                var classObj = $(item).attr("class");
                var parentClassObj = $(item).parent().attr("class");
                //PUT修改操作
                if ((classObj != undefined && classObj.toString().indexOf("datepicker") >= 0) || (parentClassObj != undefined && parentClassObj.toString().indexOf("datepicker") >= 0)) {
                    $(item).change(function (e) {//会出发三次change事件
                        if (!e.cancelable) {
                            if (!validateData(item, e)) return;
                            //当前元素对应字段值
                            var propValue = $(item).val();
                            $.put({
                                url: options.url,
                                data: { source: tableName, propName: propName, propValue: propValue },
                                success: function () {
                                },
                                error: function (resultErr) {
                                    $.tips(resultErr.responseText, $(item), 1500);
                                    //$(item).focus();
                                    return;
                                }
                            });
                        }
                    });
                }
                else {
                    //默认元素为blur事件触发PUT
                    $(item).blur(function (e) {
                        if (!e.cancelable) {
                            if (!validateData(item, e)) return;
                            //当前元素对应字段值
                            var propValue = "";
                            if ($(item).attr("contenteditable") == "true") {
                                propValue = $(item).html();
                            }
                            else {
                                propValue = $(item).val().trim();
                            }

                            $.put({
                                url: options.url,
                                data: { source: tableName, propName: propName, propValue: propValue },
                                success: function () {
                                },
                                error: function (resultErr) {
                                    $.tips(resultErr.responseText, $(item), 1500);
                                    //$(item).focus();
                                    return;
                                }
                            });
                        }
                    });
                }
            }
        });
        //select标签变更
        $form.find("select[data-field][disabled!='disabled']").each(function (index, item) {
            var datafield = $(item).attr("data-field") || '';
            var datafields = datafield.split("-");
            //如果data-field不是由表和字段名组成的则跳过本次循环
            if (datafields.length < 2) return true;
            //当前元素对应表名
            var tableName = datafields[0].substr(0, 1).toUpperCase() + datafields[0].substr(1);
            //当前元素对应字段名
            var propName = datafields[1].substr(0, 1).toUpperCase() + datafields[1].substr(1);
            // var classObj = $(obj).attr("class");
            //var parentClassObj = $(obj).parent().attr("class");
            //select下拉框以及datapicker日历插件为change事件触发PUT
            $(item).change(function (e) {
                if (!e.cancelable) {
                    if (!validateData(item, e)) return;
                    //当前元素对应字段值
                    var propValue = "";

                    if ($(item).attr("contenteditable") == "true") {
                        propValue = $(item).html();
                    }
                    else {
                        propValue = $(item).val().trim();
                    }

                    $.put({
                        url: options.url,
                        data: { source: tableName, propName: propName, propValue: propValue },
                        success: function () {
                            if (typeof (putCallBack) == "function")
                                putCallBack({ propName: propName, propValue: propValue });
                        },
                        error: function (resultErr) {
                            $.tips(resultErr.responseText, $(item), 1500);
                            $(item).focus();
                            return;
                        }
                    });
                }
            })
        });
        //图标logo选中变更
        $form.find("div[class*='hasoperater'] a[data-name]").each(function (index, item) {
            $(item).click(function () {
                var name = $(item).attr("data-name");
                var propName = name.substr(0, 1).toUpperCase() + name.substr(1);
                var propValue = 0;
                //获取选中logo后的value
                $("input[data-name='" + name + "']").each(function () {
                    if ($(this).parent().hasClass("active")) {
                        propValue += parseInt($(this).val());
                    }
                });
                $("#" + name).val(propValue);
                //put操作修改
                $.put({
                    url: options.url,
                    data: { source: "Product", propName: propName, propValue: propValue },
                    success: function () {
                    },
                    error: function (resultErr) {
                        $.tips(resultErr.responseText, $(item), 1500);
                        return;
                    }
                });
            });
        });
    },
    //禁用表单
    disableForm: function () {
        var formObj = this;
        $("input[allowDisabled != false],select,.switchery,[contenteditable],textarea ", formObj).attr("disabled", "disabled");
        $("a", formObj).unbind("click");
        $(".update_remove").unbind("click");
    },
    //启用表单
    enableForm: function () {
        var formObj = this;
        $("input[allowDisabled != false],select,.switchery,[contenteditable],textarea ", formObj).removeAttr("disabled");
    },
    //删除表单绑定的事件
    unbindForm: function () {
        var $form = this;
        //删除input，textarea标签事件
        $form.find("input[data-field][readonly!='readonly'],textarea[data-field][readonly!='readonly'],div[data-field]").unbind("click change blur");
        //删除select标签事件
        $form.find("select[data-field][disabled!='disabled']").unbind("change");
        //删除图标logo选中事件
        $form.find("div[class*='hasoperater'] a[data-name]").unbind("click");
    }
});

$(function () {
    //校验
    $.metadata.setType("attr", "data-vali");
    jQuery.extend(jQuery.validator.messages, {
        required: "请输入信息",
        remote: "请修正内容",
        email: "请输入正确格式的电子邮件",
        phone: "请输入正确的号码",
        url: "请输入正确的网址",
        date: "请输入正确的日期",
        dateISO: "请输入正确的日期 (ISO).",
        number: "请输入正确的数字",
        digits: "只能输入整数",
        creditcard: "请输入正确的信用卡号",
        equalTo: "请再次输入相同的值",
        accept: "请输入拥有正确后缀名的字符串",
        maxlength: jQuery.validator.format("请输入一个 长度最多是 {0} 的字符串"),
        minlength: jQuery.validator.format("请输入一个 长度最少是 {0} 的字符串"),
        rangelength: jQuery.validator.format("请输入 一个长度介于 {0} 和 {1} 之间的字符串"),
        range: jQuery.validator.format("请输入一个介于 {0} 和 {1} 之间的值"),
        max: jQuery.validator.format("请输入一个最大为{0} 的值"),
        min: jQuery.validator.format("请输入一个最小为{0} 的值")
    });
});