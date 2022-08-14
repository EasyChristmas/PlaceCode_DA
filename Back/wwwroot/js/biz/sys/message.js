//请求列表的api
var api = "message/sysmessage";
 
$(function () { 
    //格式化table高度
    $.tableHeight(50, '.div-table-content');

    //绑定员工
    $.Data.bindAdmin({ selId: "adminId" });
});