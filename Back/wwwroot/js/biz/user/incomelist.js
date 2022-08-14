//请求列表的api
var api = "userIncome";

$(function () {
    //格式化table高度
    $.tableHeight(82);

    $.Data.bindMiningPool({
        selId: "selMiningPool"
    });

    //正序反序排序
    $(".btn_up_down .icon-caret-up").on("click", function () {
        $(this).parent().parent().parent().find(".btn_up_down i").each(function (index, item) {
            $(this).css("color", "#fff");
        });
        $(this).css("color", "#324160");
        //$(this).next().css("color", "#ddd");
        $("#sort").val($(this).attr("data-sort"));
        query();
    });
    $(".btn_up_down .icon-caret-down").on("click", function () {
        $(this).parent().parent().parent().find(".btn_up_down i").each(function (index, item) {
            $(this).css("color", "#fff");
        });
        $(this).css("color", "#324160");
        //$(this).prev().css("color", "#ddd");
        $("#sort").val($(this).attr("data-sort"));
        query();
    });

    $("#sort").change(function () {
        var sort = $("#sort").val();
        $("#thead-erp").find(".btn_up_down i").each(function (index, item) {
            if ($(item).attr("data-sort") == 0 - sort) {
                $(item).css("color", "#324160");
            } else {
                $(item).css("color", "#fff");
            }
        });
    });
});


