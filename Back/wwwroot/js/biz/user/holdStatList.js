//请求列表的api
var api = "userHoldProduct/getStatList";

var holdStatViewModel = new HoldStatViewModel();

//回调函数
var callback = function (data) {
    //重构产品列表数据
    var result = data;
    //将js对象转换成ko对象
    var list = ko.mapping.fromJS(result);

    //如果是第一页则直接赋值，否则追加列表数据
    if (grid.pageIndex() == 1) {
        holdStatViewModel.data(list.data());
            grid.totalPower($.Data.outputmoney(data.totalPower || 0));
    }
    else {
        $(list.data()).each(function (index, item) {
            holdStatViewModel.data.push(item);
        });
    }
}

$(function () {
    holdStatViewModel.init();
});