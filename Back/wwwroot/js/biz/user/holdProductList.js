//请求列表的api
var api = "userHoldProduct";

var holdProductViewModel = new HoldProductViewModel();

//回调函数
var callback = function (data) {
    //重构产品列表数据
    var result = data;
    //将js对象转换成ko对象
    var list = ko.mapping.fromJS(result);

    //如果是第一页则直接赋值，否则追加列表数据
    if (grid.pageIndex() == 1)
        holdProductViewModel.data(list.data());
    else {
        $(list.data()).each(function (index, item) {
            holdProductViewModel.data.push(item);
        });
    }
}

$(function () {
    holdProductViewModel.init();
});