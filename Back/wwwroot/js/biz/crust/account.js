//请求列表的api
var api = "crust/account";



$(function () {
});

//查询导入进度
function queryProgress() {
    $.get({
        url: "crust/accountImport/importProgress",
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