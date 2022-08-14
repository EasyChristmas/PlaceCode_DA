//请求列表的api
var api = "miningPoolIncome";

var miningPoolIncomeViewModel = new MiningPoolIncomeViewModel();


//清空数值
function clear() {
    $("input[name='ex']").val('');
    $("input[name='code1']").val('');
    $("input[name='code2']").val('');
}

$(function () {
    miningPoolIncomeViewModel.init();

    //格式化列表table高度
    $.tableHeight(80);

    //删除交易编号
    $(".tagList").delegate(".icon-remove", "click", function () {
        $(this).parent().remove();
    });

    //添加交易编号-单个
    $("#addSingle").on("click", function () {
        var val = $("input[name='code3']").val();
        if (val != '') {
            var flag = true;
            $("#tagList").children(".video_tag").each(function (index, item) {
                if (val == $(item).text()) {
                    flag = false;
                    return false;
                }
            });
            if (flag)
                $("#tagList").append("<span class='video_tag'>" + val.toString() + "<i class='icon-remove'></i></span> ");
            $("input[name='code3']").val('');
        }
    });
});

