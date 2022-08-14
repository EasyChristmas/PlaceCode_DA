//请求列表的api
var api = "product/device";

var deviceViewModel = new deviceViewModel();

//回调函数
var callback = function (data) {
    //重构产品列表数据
    var result = data;
    //将js对象转换成ko对象
    var list = ko.mapping.fromJS(result);

    //如果是第一页则直接赋值，否则追加列表数据
    if (grid.pageIndex() == 1)
        deviceViewModel.data(list.data());
    else {
        $(list.data()).each(function (index, item) {
            deviceViewModel.data.push(item);
        });
    }
}

//清空数值
function clear() {
    $("input[name='ex']").val('');
    $("input[name='code1']").val('');
    $("input[name='code2']").val('');
}

$(function () {
    deviceViewModel.init();

    //删除设备
    $(".tagList").delegate(".icon-remove", "click", function () {
        $(this).parent().remove();
    });

    //添加设备-批量
    $("#addLine").on("click", function () {
        var input = $(this).parent().find("input");
        var ex = $.trim($("input[name='ex']").val());
        var start = $.trim($("input[name = 'code1']").val());
        var end = $.trim($("input[name = 'code2']").val());

        if (start != '' && end != '') {
            start = start * 1;
            end = end * 1;
            //批量生成合同
            while (true) {
                if (start > end) {
                    var flag = true;
                    $("#tagList").children(".video_tag").each(function (index, item) {
                        if ((ex.toString() + start) == $(item).text()) {
                            flag = false;
                            return false;
                        }
                    });
                    if (flag)
                        $("#tagList").append("<span class='video_tag'>" + ex.toString() + start + "<i class='icon-remove'></i></span> ");
                    start--;
                }
                else if (start < end) {
                    var flag = true;
                    $("#tagList").children(".video_tag").each(function (index, item) {
                        if ((ex.toString() + start) == $(item).text()) {
                            flag = false;
                            return false;
                        }
                    });
                    if (flag)
                        $("#tagList").append("<span class='video_tag'>" + ex.toString() + start + "<i class='icon-remove'></i></span> ");
                    start++;
                }
                else {
                    var flag = true;
                    $("#tagList").children(".video_tag").each(function (index, item) {
                        if ((ex.toString() + start) == $(item).text()) {
                            flag = false;
                            return false;
                        }
                    });
                    if (flag)
                        $("#tagList").append("<span class='video_tag'>" + ex.toString() + start + "<i class='icon-remove'></i></span> ");
                    break;
                }
            }
        } else if (start != '' && end == '') {
            var flag = true;
            $("#tagList").children(".video_tag").each(function (index, item) {
                if ((ex.toString() + start) == $(item).text()) {
                    flag = false;
                    return false;
                }
            });
            if (flag)
                $("#tagList").append("<span class='video_tag'>" + ex.toString() + start + "<i class='icon-remove'></i></span> ");
        } else if (start == '' && end != '') {
            var flag = true;
            $("#tagList").children(".video_tag").each(function (index, item) {
                if ((ex.toString() + end) == $(item).text()) {
                    flag = false;
                    return false;
                }
            });
            if (flag)
                $("#tagList").append("<span class='video_tag'>" + ex.toString() + end + "<i class='icon-remove'></i></span> ");
        }

        clear();
    });

    //添加设备-单个
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