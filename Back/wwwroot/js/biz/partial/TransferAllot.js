
$(function () {

    if ($.getCurrentUser().project == "PlatForm") {
        //绑定机构信息(过滤平台,只展示机构企业)
        $.Data.bindEnterprise({ selId: "targetEnterpriseId", filter: "1" });
        $("#divSelAdmin").hide();
    } else {
        //绑定分配服务经理
        $.Data.bindAdmin({ selId: "targetAdminId" });
        $("#divSelEnterprise").hide();
    }

    //格式化table高度
    $.tableHeight(46);

    $(".iCheck-helper").click(function () {
        var obj = $(this);
        ChangeType(obj);
    });

    $(".checkbox").click(function () {
        var obj = $(this);
        ChangeType(obj);
    });

    function ChangeType(obj) {
        var id = obj.siblings().attr("id");
        $(".icheckbox_flat-green").removeClass("checked");
        obj.parent().addClass("checked");
        selectType = id;
        //当前执行选中此类型
        //switch (id) {
        //    case "common":
        //        $("#selectCommon").find("input").removeAttr("disabled").css("background-color", "white");
        //        $("#selectLevel").find("input").attr("disabled", "disabled").css("background-color", "rgb(245, 248, 249)");
        //        $("#selectKind").find("input").attr("disabled", "disabled").css("background-color", "rgb(245, 248, 249)");

        //        break;
        //    case "level":
        //        $("#selectLevel").find("input").removeAttr("disabled").css("background-color", "white");
        //        $("#selectCommon").find("input").attr("disabled", "disabled").css("background-color", "rgb(245, 248, 249)");
        //        $("#selectKind").find("input").attr("disabled", "disabled").css("background-color", "#d0cbcb");

        //        break;
        //    case "kind":
        //        $("#selectKind").find("input").removeAttr("disabled").css("background-color", "white");
        //        $("#selectCommon").find("input").attr("disabled", "disabled").css("background-color", "rgb(245, 248, 249)");
        //        $("#selectLevel").find("input").attr("disabled", "disabled").css("background-color", "rgb(245, 248, 249)");
        //        break;
        //}
    }
})