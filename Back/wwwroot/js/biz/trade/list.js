//请求列表的api
var api = "trade";

$(function () {
    //格式化列表table高度
    $.tableHeight(80);
});

var getStatusColor = function (status) {
    var color;
    switch (status) {
        case 0:
        case 10:
        case 20:
            color = "orange";
            break;
        case -20:
        case -10:
        case 5:
            color = "red";
            break;
        case 100:
            color = "green";
            break;
    }
    return color;
};

