//请求列表的api
var api = "site/adresource";

//初始化操作
$(function () {

    $.tableHeight(80);

    //加载类型模型数据
    grid.loadTypeList();

    //选择所属项目
    $(".logoto a").click(function () {
        $(this).toggleClass("active");
    });
})
