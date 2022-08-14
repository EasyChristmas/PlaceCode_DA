//请求列表的api
var api = "mall/order";

$(function () {
    $.tableHeight(80);
    //拨打电话
    $("#PagerGird").delegate("a.colgreen", "click", function () {
        var id = $(this).parent().attr("uid");
        if ($("#currentRoleIds").val().indexOf('37') == -1)
            return $.tips("您没有权限拨打此电话！", $(this), 1000);
        callcenter.dialing(id);
    });
})