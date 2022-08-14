//请求列表的api
var api = "user";

//绑定用户ko对象
grid.userData = ko.observableArray([]);

$(function () {
    //格式化table高度
    $.tableHeight(82);

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

//查询导入进度
function queryProgress() {
    $.get({
        url: "UserImport/ImportProgress",
        success: function (result) {
            var counting = result.count;
            var countSum = result.sum;
            //更新进度条
            if (counting != -1 && countSum != -1)
                setProgressValue(counting, countSum);
        },
        error: function (resultErr) {
            $.errorMsg(resultErr.responseText);
        }
    });
}

/*设置进度条值*/
function setProgressValue(value, count) {
    var tiao = $(".progressBar .tiao");
    $(".progressBar").show();
    $(tiao).show();
    if (value == 0 && count == 0)
        tiao.css("width", "100%").html("正在上传...");
    else
        tiao.css("width", ((value / count) * 100).toFixed(0) + "%").html(((value / count) * 100).toFixed(0) + "%");
};

function uploadAutomaticSuccess(result) {
    if (result.fileName) {
        $("#importForm").find("input[name='fileName']").val(result.fileName.substring(0, result.fileName.lastIndexOf(".")));
        $("#importForm").find("input[name='url']").val($.getFileUrl(result.data));
    }
}

