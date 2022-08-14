//请求列表的api
var api = "sys/feedback";

$(function () {
    //格式化table高度
    $.tableHeight(80);
    //绑定员工
    $.Data.bindAdmin({ selId: "adminId" });
});