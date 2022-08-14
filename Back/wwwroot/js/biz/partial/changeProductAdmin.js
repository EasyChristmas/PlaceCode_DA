$(function () {

    //绑定壹财富产品经理 
    $.Data.bindAdmin({ selId: "newYCFPm", role: "pm", project: $.Enum.EnumProject.ycf, onlyDepartmentIds: true });
    //绑定九天产品经理
    $.Data.bindAdmin({ selId: "newJTPm", role: "pm", project: $.Enum.EnumProject.jt, onlyDepartmentIds: true });
    //绑定腾云产品经理
    $.Data.bindAdmin({ selId: "newTYPm", role: "pm", project: $.Enum.EnumProject.ty, onlyDepartmentIds: false });
    //绑定维护人
    $.Data.bindAdmin({ selId: "newManage", roleIds:"24,25,57"});

    //选择的产品编号
    var cpa_productId = 0;

    //壹财富的所属项目点击效果
    $("[data-name='ycfproject']").each(function () {
        if (parseInt($(this).val()) == 1) {
            $(this).parent().click(function () {
                $(this).toggleClass("active");
            });
        }
    });

    //壹财富点击变更产品经理按钮
    $("#changeYCFPm").click(function () {
        cpa_productId = $.getSelectId();
        if (!cpa_productId) {
            $.tips("请先选择产品", $(this), 1000);
            return;
        }
        $.openDialog({
            title: "变更产品经理",
            jqObj: $('#divChangeYCFPm')
        });

        //产品名称
        $("#spYCFsTitle").html($.delHtmlBr($("tr[data-id=" + cpa_productId + "] td[data-name='sTitle']").html()));

        //所属项目
        var ycfProjectValue = 0;
        //变更前所属
        var adminId = 0;
        for (var i = 0; i < productViewModel.data().length; i++) {
            if (productViewModel.data()[i].id() == cpa_productId) {
                ycfProjectValue = productViewModel.data()[i].project();
                adminId = productViewModel.data()[i].adminId();
                break;
            }
        }
        $("[data-name='ycfproject']").each(function () {
            $(this).parent().removeClass("active");
            if ((parseInt(ycfProjectValue) & parseInt($(this).val())) == parseInt($(this).val())) {
                $(this).parent().addClass("active");
            }
        });
        if (adminId == 0 || adminId == null) {
            $("#newYCFPm").val(null);
        }
        else {
            $("#newYCFPm").val(adminId);
        }
        //select2插件显示文字的span控件
        var spanElem = $("#newYCFPm").parent().find("span[class='select2-selection__rendered']");
        var defaultVal = $("#newYCFPm").find("option:selected").text();
        spanElem.html(defaultVal);
    });

    //壹财富保存变更产品经理
    $("#btnChangeYCFPm").click(function () {
        var newYCFPm = $("#newYCFPm").val();
        //获取所属项目
        var ycfProjectValue = 0;
        $("[data-name='ycfproject']").each(function () {
            if ($(this).parent().hasClass("active")) {
                ycfProjectValue += parseInt($(this).val());
            }
        });
        //开始保存
        $("#changeYCFPmForm").submitForm({
            type: 'post',
            url: 'product/changeYCFPm',
            data: { "productId": cpa_productId, "adminId": newYCFPm, "project": ycfProjectValue },
            success: function (result) {
                if (!$("#newYCFPm").val()) {
                    $("#ycfAdminName" + cpa_productId).html("-");
                }
                else {
                    $("#ycfAdminName" + cpa_productId).html($("#newYCFPm option:selected").text());
                }
                for (var i = 0; i < productViewModel.data().length; i++) {
                    if (productViewModel.data()[i].id() == cpa_productId) {
                        productViewModel.data()[i].project(ycfProjectValue);
                        productViewModel.data()[i].adminId(newYCFPm);
                        break;
                    }
                }
                $.success('操作成功');
                //关闭弹框
                $.closeDialog($('#divChangeYCFPm'));
            },
            error: function (resultErr) {
                $.errorMsg(resultErr.responseText);
            }
        });
    });


    //九天的所属项目点击效果
    $("[data-name='jtproject']").each(function () {
        if (parseInt($(this).val()) == 2) {
            $(this).parent().click(function () {
                $(this).toggleClass("active");
            });
        }
    });

    //九天点击变更产品经理按钮
    $("#changeJTPm").click(function () {
        cpa_productId = $.getSelectId();
        if (!cpa_productId) {
            $.tips("请先选择产品", $(this), 1000);
            return;
        }
        $.openDialog({
            title: "变更九天产品经理",
            jqObj: $('#divChangeJTPm')
        });

        //产品名称
        $("#spJTsTitle").html($.delHtmlBr($("tr[data-id=" + cpa_productId + "] td[data-name='sTitle']").html()));

        //所属项目
        var jtProjectValue = 0;
        //变更前所属
        var jtAdminId = 0;
        for (var i = 0; i < productViewModel.data().length; i++) {
            if (productViewModel.data()[i].id() == cpa_productId) {
                jtProjectValue = productViewModel.data()[i].project();
                jtAdminId = productViewModel.data()[i].jtAdminId();
                break;
            }
        }
        $("[data-name='jtproject']").each(function () {
            $(this).parent().removeClass("active");
            if ((parseInt(jtProjectValue) & parseInt($(this).val())) == parseInt($(this).val())) {
                $(this).parent().addClass("active");
            }
        });
        if (jtAdminId == 0 || jtAdminId == null) {
            $("#newJTPm").val(null);
        }
        else {
            $("#newJTPm").val(jtAdminId);
        }
        //select2插件显示文字的span控件
        var spanElem = $("#newJTPm").parent().find("span[class='select2-selection__rendered']");
        var defaultVal = $("#newJTPm").find("option:selected").text();
        spanElem.html(defaultVal);
    });

    //九天保存变更产品经理
    $("#btnChangeJTPm").click(function () {
        var newJTPm = $("#newJTPm").val();
        //获取所属项目
        var jtProjectValue = 0;
        $("[data-name='jtproject']").each(function () {
            if ($(this).parent().hasClass("active")) {
                jtProjectValue += parseInt($(this).val());
            }
        });
        //开始保存
        $("#changeJTPmForm").submitForm({
            type: 'post',
            url: 'product/changeJTPm',
            data: { "productId": cpa_productId, "jtAdminId": newJTPm, "project": jtProjectValue },
            success: function (result) {
                if (!$("#newJTPm").val()) {
                    $("#jtAdminName" + cpa_productId).html("-");
                }
                else {
                    $("#jtAdminName" + cpa_productId).html($("#newJTPm option:selected").text());
                }
                for (var i = 0; i < productViewModel.data().length; i++) {
                    if (productViewModel.data()[i].id() == cpa_productId) {
                        productViewModel.data()[i].project(jtProjectValue);
                        productViewModel.data()[i].jtAdminId(newJTPm);
                        break;
                    }
                }
                $.success('操作成功');
                //关闭弹框
                $.closeDialog($('#divChangeJTPm'));
            },
            error: function (resultErr) {
                $.errorMsg(resultErr.responseText);
            }
        });
    });

    //腾云的所属项目点击效果
    $("[data-name='typroject']").each(function () {
        if (parseInt($(this).val()) == 4) {
            $(this).parent().click(function () {
                $(this).toggleClass("active");
            });
        }
    });

    //腾云点击变更产品经理按钮
    $("#changeTYPm").click(function () {
        cpa_productId = $.getSelectId();
        if (!cpa_productId) {
            $.tips("请先选择产品", $(this), 1000);
            return;
        }
        $.openDialog({
            title: "变更腾云产品经理",
            jqObj: $('#divChangeTYPm')
        });

        //产品名称
        $("#spTYsTitle").html($.delHtmlBr($("tr[data-id=" + cpa_productId + "] td[data-name='sTitle']").html()));

        //所属项目
        var tyProjectValue = 0;
        //变更前所属
        var tyAdminId = 0;
        for (var i = 0; i < productViewModel.data().length; i++) {
            if (productViewModel.data()[i].id() == cpa_productId) {
                tyProjectValue = productViewModel.data()[i].project();
                tyAdminId = productViewModel.data()[i].tyAdminId();
                break;
            }
        }
        $("[data-name='typroject']").each(function () {
            $(this).parent().removeClass("active");
            if ((parseInt(tyProjectValue) & parseInt($(this).val())) == parseInt($(this).val())) {
                $(this).parent().addClass("active");
            }
        });
        if (tyAdminId == 0 || tyAdminId == null) {
            $("#newTYPm").val(null);
        }
        else {
            $("#newTYPm").val(tyAdminId);
        }
        //select2插件显示文字的span控件
        var spanElem = $("#newTYPm").parent().find("span[class='select2-selection__rendered']");
        var defaultVal = $("#newTYPm").find("option:selected").text();
        spanElem.html(defaultVal);
    });

    //腾云保存变更产品经理
    $("#btnChangeTYPm").click(function () {
        var newTYPm = $("#newTYPm").val();
        //获取所属项目
        var tyProjectValue = 0;
        $("[data-name='typroject']").each(function () {
            if ($(this).parent().hasClass("active")) {
                tyProjectValue += parseInt($(this).val());
            }
        });
        //开始保存
        $("#changeTYPmForm").submitForm({
            type: 'post',
            url: 'product/changeTYPm',
            data: { "productId": cpa_productId, "tyAdminId": newTYPm, "project": tyProjectValue },
            success: function (result) {
                if (!$("#newTYPm").val()) {
                    $("#tyAdminName" + cpa_productId).html("-");
                }
                else {                    
                    $("#tyAdminName" + cpa_productId).html($("#newTYPm option:selected").text());
                }
                for (var i = 0; i < productViewModel.data().length; i++) {
                    if (productViewModel.data()[i].id() == cpa_productId) {
                        productViewModel.data()[i].project(tyProjectValue);
                        productViewModel.data()[i].tyAdminId(newTYPm);
                        break;
                    }
                }
                $.success('操作成功');
                //关闭弹框
                $.closeDialog($('#divChangeTYPm'));
            },
            error: function (resultErr) {
                $.errorMsg(resultErr.responseText);
            }
        });
    });

    //点击变更产品维护人按钮
    $("#changeManage").click(function () {
        cpa_productId = $.getSelectId();
        if (!cpa_productId) {
            $.tips("请先选择产品", $(this), 1000);
            return;
        }

        $.openDialog({
            title: "变更产品维护人",
            jqObj: $('#divChangeManage')
        });

        //产品名称
        $("#spManagesTitle").html($.delHtmlBr($("tr[data-id=" + cpa_productId + "] td[data-name='sTitle']").html()));

        //所属项目
        var manageProjectValue = 0;
        //变更前所属
        var manageAdminId = 0;
        for (var i = 0; i < productViewModel.data().length; i++) {
            if (productViewModel.data()[i].id() == cpa_productId) {
                manageProjectValue = productViewModel.data()[i].project();
                manageAdminId = productViewModel.data()[i].manageAdminId();
                break;
            }
        }
        $("[data-name='manageproject']").each(function () {
            $(this).parent().removeClass("active");
            if ((parseInt(manageProjectValue) & parseInt($(this).val())) == parseInt($(this).val())) {
                $(this).parent().addClass("active");
            }
        });
        if (manageAdminId == 0 || manageAdminId == null) {
             $("#newManage").val(null);
            }
            else {
             $("#newManage").val(manageAdminId);
        }
        //select2插件显示文字的span控件
        var spanElem = $("#newManage").parent().find("span[class='select2-selection__rendered']");
        var defaultVal = $("#newManage").find("option:selected").text();
            spanElem.html(defaultVal);
    });

    //保存变更产品维护人
    $("#btnChangeManage").click(function () {
        var newManage = $("#newManage").val();
        if (!newManage) {
            $.tips("请选择新的维护人", $("#newManage"), 1000);
            return;
        }
        //开始保存
        $("#changeJTPmForm").submitForm({
            type: 'post',
            url: 'product/changeManage',
            data: { "productId": cpa_productId, "manageAdminId": newManage, },
            success: function (result) {
                //修改列表的产品维护人字段
                $("tr[data-id=" + cpa_productId + "] td[data-name='manageAdminName']").text($("#newManage option:selected").text());
                for (var i = 0; i < productViewModel.data().length; i++) {
                    if (productViewModel.data()[i].id() == cpa_productId) {
                        productViewModel.data()[i].manageAdminId(newManage);
                        break;
                    }
                }
                $.success('操作成功');
                //关闭弹框
                $.closeDialog($('#divChangeManage'));
            },
            error: function (resultErr) {
                $.errorMsg(resultErr.responseText);
            }
        });
    });
});










