//选中行的id
grid.selId = 0;

//身份证（正面）
grid.totalCoinsToCny = ko.observable(0);

//用户钱包
grid.walletList = ko.observableArray([]);

//身份证（正面）
grid.card = ko.observable(null);
//身份证（反面）
grid.backCard = ko.observable(null);

//用户ko对象
grid.userItem = ko.observable([]);

//全选
grid.selectAll = function (obj) {
    $(obj).children("i").toggleClass("icon-check").toggleClass("icon-check-empty");
    if ($(obj).children("i").hasClass("icon-check")) {
        $("#PagerGird tr:not(.none_select)").each(function (index, item) {
            $(item).data("isSelect", true);
            $(item).attr("style", "background-color: rgb(253, 235, 133);");
        });
    } else {
        $("#PagerGird tr:not(.none_select)").each(function (index, item) {
            $(item).data("isSelect", false);
            $(item).attr("style", "background-color: rgb(255, 255, 255);");
        })
    }
};

//用户添加
grid.addUser = function () {
    $.openDialog({
        title: '新增用户',
        jqObj: $('#divUserAdd')
    });
};

//变更手机号
grid.changeMobile = function (ele) {
    if (!$.getSelectId()) {
        $.tips("请先选择用户", ele, 1000);
        return;
    }
    $.openDialog({
        title: '变更手机',
        jqObj: $('#divChangeMobile')
    });
};

//用户编辑
grid.editUser = function () {
    if (!$.getSelectId()) {
        $.tips("请选择用户", $(event.toElement), 1000);
        return;
    }

    if ($.getSelectId(true).length > 1) {
        $.tips("不能选中多个，请选择一个用户", $(event.toElement), 1000);
        return;
    }
    var useradminId = 0;
    $(".table tr").each(function (index, item) {
        if ($(item).data("isSelect") == true) {
            useradminId = $(item).attr("data-adminId");
            return false;
        }
    });

    if ($.getSelectId(true).length == 1 && $("#currentUserId").val() != useradminId && $("currentRole").val() < 99) {
        $.tips("只能编辑自己名下用户", $(event.toElement), 1000);
        return;
    }
    $.openTab({
        url: '/user/edit?id=' + $.getSelectId(),
        title: "用户详情 - " + $.getSelectId()
    });
};

//用户保存
grid.saveUser = function () {
    $("#userAddForm").submitForm({
        type: 'post',
        url: "user",
        beforeSend: function () {
            $("#btnAddUser").attr("disabled", true);
        },
        success: function (result) {
            $("#btnAddUser").removeAttr("disabled");
            query(1);
            $.closeDialog($('#divUserAdd'));
        },
        error: function (resultErr) {
            $("#btnAddUser").removeAttr("disabled");
            $.errorMsg(resultErr.responseText);
        }
    });
};

//用户删除
grid.delUser = function () {
    grid.selId = $.getSelectId();
    if (!grid.selId) {
        $.tips('请选择用户', $(event.toElement));
        return;
    }
    if (typeof (grid.selId) == 'string') {
        grid.selId = [];
        grid.selId.push($.getSelectId());
    }
    var msg = typeof (grid.selId) == 'string' ? '您确定要删除这1个用户吗?' : '您确定要删除这' + grid.selId.length + '个用户吗?';
    $.confirm(msg, function () {
        $.put({
            url: 'user/userDelete',
            data: { ids: grid.selId },
            success: function () {
                query(1);
                $.success('操作成功');
            },
            error: function (resultErr) {
                $.errorMsg(resultErr.responseText);
            }
        });
    });
};

//重置密码
grid.resetPassWord = function () {
    grid.selId = $.getSelectId();
    if (!grid.selId) {
        $.tips('请选择用户', $(event.toElement));
        return;
    }
    if (typeof (grid.selId) == 'string') {
        grid.selId = [];
        grid.selId.push($.getSelectId());
    }
    var msg = typeof (grid.selId) == 'string' ? '您确定要重置这1个用户的密码?' : '您确定要重置这' + grid.selId.length + '个用户的密码?';
    $.confirm(msg, function () {
        $.put({
            url: 'user/resetPassWord',
            data: { ids: grid.selId },
            success: function () {
                query(1);
                $.success('操作成功');
            },
            error: function (resultErr) {
                $.errorMsg(resultErr.responseText);
            }
        });
    });
};

//设置状态
grid.changeStatus = function (obj) {
    if (event.type != 'change')
        return;

    var enumUserStatus = $(obj).val();
    $(obj).val("");

    grid.selId = $.getSelectId();
    if (!grid.selId) {
        $.tips('请选择用户', $(obj));
        return;
    }
    if (typeof (grid.selId) == 'string') {
        grid.selId = [];
        grid.selId.push($.getSelectId());
    }

    var msg = typeof (grid.selId) == 'string' ? '您确定要设置这1个用户的状态吗?' : '您确定要设置这' + grid.selId.length + '个用户的状态吗?';
    $.confirm(msg, function () {
        $.put({
            url: 'user/updateStatus',
            data: { ids: grid.selId, enumUserStatus: enumUserStatus },
            success: function () {
                query(1);
                $.success('操作成功');
            },
            error: function (resultErr) {
                $.errorMsg(resultErr.responseText);
            }
        });
    });
};

//查看基本信息
grid.infor = function (obj) {
    var userId = $(obj).attr('dataid');
    $.get({
        url: 'user/' + userId,
        success: function (result) {
            $(obj).parent().parent().parent().find("div[id='infor" + userId + "']").loadForm(result);
        }
    });
}

//打开用户详情
grid.openUserDetail = function (id) {
    $.openTab({
        url: "/user/edit?id=" + id,
        title: "用户详情 - " + id
    });
};

//用户认证
grid.userAuth = function (obj) {
    if (event.type != 'change')
        return;
    var userId = $.getSelectId();
    if (!userId) {
        $.tips("请选择用户", $("#authed"));
        return;
    }
    //判断是否为数组
    if (Object.prototype.toString.call(userId) === "[object Array]") {
        $.tips("不能选中多个用户！", $("#authed"));
        return;
    }

    var authType = $(obj).val();
    var authTypeName = $(obj).find("option:selected").text();
    $(obj).val("");

    var msg = '您确定要将此用户,' + authTypeName + '认证通过吗?';
    $.confirm(msg, function () {
        $.put({
            url: 'user/auth?id=' + userId,
            data: { authType: authType },
            success: function () {
                query(1);
                $.success('操作成功');
            },
            error: function (resultErr) {
                $.errorMsg(resultErr.responseText);
            }
        });
    });
};

//显示认证审核
grid.userAuthShow = function () {
    var userId = $.getSelectId();
    if (!userId) {
        $.tips("请选择用户", $("#authed"));
        return;
    }
    //判断是否为数组
    if (Object.prototype.toString.call(userId) === "[object Array]") {
        $.tips("不能选中多个用户！", $("#authed"));
        return;
    }

    grid.card(null);
    grid.backCard(null);
    $.get({
        url: "user/getAuthInfo/" + userId,
        async: false,
        success: function (result) {
            if (result.authStatus == "3") {
                $.openDialog({
                    title: "用户认证",
                    jqObj: $("#divUserAuth"),
                    width: "400"
                });
                //去除选中 认证成功
                $("#authStatusDiv .iradio_flat-green").each(function (index, item) {
                    $(item).removeClass("checked");
                });
                if (result.card !== "") {
                    grid.card($.getFileUrl(result.card));
                } else {
                    grid.card("/images/avatars/people.png");
                }
                if (result.backCard !== "") {
                    grid.backCard($.getFileUrl(result.backCard));
                } else {
                    grid.backCard("/images/avatars/people.png");
                }
                $("#userRealName").text(result.realName);
                $("#userMobile").text(result.mobile);
            } else {
                $.tips("当前用户不能认证，状态不是“待审核”！", $("#authed"));
            }
        },
        error: function (resultErr) {
            $.errorMsg(resultErr.responseText);
            return;
        }
    });
};

//保存认证审核
grid.userAuthSave = function () {
    var userId = $.getSelectId();
    if (!userId) {
        $.tips("请选择用户", $("#authed"));
        return;
    }
    if (Object.prototype.toString.call(userId) === "[object Array]") {
        $.tips("不能选中多个用户！", $("#authed"));
        return;
    }
    var authStatus = $('input:radio[name="authStatus"]:checked').val();
    if (authStatus == typeof (undefined) || authStatus == null) {
        $.tips("请选择认证状态！", $("#btnUserAuth"));
        return;
    }

    $("#userAuthForm").submitForm({
        url: "user/authByCard",
        type: "put",
        data: { id: userId, authStatus: authStatus },
        success: function (result) {
            query(1);
            $.closeDialog($("#divUserAuth"));
            $.success("操作成功", 3000);
        },
        error: function (resultErr) {
            $.errorMsg(resultErr.responseText);
            return;
        }
    });
};


//检查列表数据中tag是否为搜索tag进行高亮处理
grid.setTagHighStyle = function (tag) {
    var queryTag = $('#selTag').val();
    var style = "";
    if (queryTag != null && queryTag.indexOf(tag) > -1) {
        style = "background-color:yellow";
    }
    return style;
};


//下载Excel文件模板
grid.downloadExcel = function () {
    window.location.href = "/ExcelTemplet/用户导入模版.xlsx";
};

//导入用户
grid.importUser = function () {
    $.openDialog({
        title: '用户导入',
        jqObj: $('#import')
    });
};

//开始导入用户
grid.startImportUser = function () {
    var filePath = $("#importForm").find("img").parent().attr("href");
    if (!filePath) {
        $.tips("请先选择导入文件", $("#btnAdd"), 1500);
        return;
    }
    //var fileName = $("#importForm").find("input[name='fileName']");
    //if (fileName.val() == "") {
    //    $.tips("请输入批次名称", fileName, 1500);
    //    return;
    //}
    $("#btnAdd").attr("disabled", "disabled");
    $("#btnAdd").html('<i class="icon-spinner icon-spin mr10"></i>导入中...');
    $("#progressTab").html("").hide();
    //清空进度
    setProgressValue(0, 0);
    progressInterval = self.setInterval("queryProgress()", 3000);
    $.post({
        url: "UserImport/import",
        data: {
            url: $("#importForm").find("input[name='url']").val(),
            isCustomer: $("input[name=isCustomer]").val()
            //fileName: fileName.val()
        },
        success: function (res) {
            setProgressValue(100, 100);
            $("#btnAdd").removeAttr("disabled");
            $("#btnAdd").html('导入');
            var msgFormat = "导入结束，本次导入成功:<span class='colgreen'> " + res.data.successCount + " </span>条<br/>" +
                "手机格式错误:<span class='colred'> " + res.data.formatErrorCount + " </span>条<br/>" +
                "已存在被忽略:<span class='colblue'> " + res.data.existingCount + " </span>条<br/>" +
                "导入出现异常:<span class='colred'> " + res.data.errorCount + " </span>条<br/>";
            //导入记录查询:<a href='/user/UserExportDetail?UserExportId=" + res.data.userExportId + "'>导入记录查询</a> <br/>
            $("#progressTab").html(msgFormat + "（重新选择文件点击导入可以继续进行导入操作）").show();
            self.clearInterval(progressInterval);
            query(1);
        },
        error: function (resultErr) {
            $("#btnAdd").html("导入");
            $("#btnAdd").removeAttr("disabled");
            $(".icon-remove").parent().click();
            $.errorMsg(resultErr.responseText, 5000);
            setProgressValue(100, 100);
            self.clearInterval(progressInterval);
        }
    });
};

//查看钱包
grid.showWallet = function (data) {

    $.openDialog({
        title: '查看钱包',
        jqObj: $('#wallet'),
        width: '1000'
    });

    //获取钱包列表
    $.get({
        url: 'user/wallet',
        data: {
            userId: data.id
        },
        success: function (result) {
            grid.totalCoinsToCny(result.totalCoinsToCny);
            grid.walletList([]);
            $(result.data).each(function (index, item) {
                grid.walletList.push(item);
            });
        }
    });
};

//绑定销售用户
grid.bindAdmin = function (ele) {
    if (!$.getSelectId()) {
        $.tips("请先选择用户", ele, 1000);
        return;
    }
    $.confirm('您确定要操作吗?', function () {
        $.post({
            url: "user/bindAdmin",
            data: {
                userId: $.getSelectId()
            },
            success: function () {
                $.success('操作成功');
                query();
            },
            error: function (resultErr) {
                $.errorMsg(resultErr.responseText, 2500);
            }
        });
    });
}

//保存变更手机号
grid.saveChangeMobile = function (ele) {
    if ($("#changeMobileForm").validate()) {
        var data = $("#changeMobileForm").toJson();
        data.userId = $.getSelectId();

        $.confirm('您确定要操作吗?', function () {
            $.post({
                url: "user/changeMobile",
                data: data,
                success: function () {
                    $.success('操作成功');
                    query();
                    $.closeDialog($('#divChangeMobile'));
                },
                error: function (resultErr) {
                    $.errorMsg(resultErr.responseText, 2500);
                }
            });
        });
    }
    
}