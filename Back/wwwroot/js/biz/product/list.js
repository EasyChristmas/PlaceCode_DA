//请求列表的api
var api = "product";

//重构后的产品列表
var proList = null;

var productViewModel = new productViewModel();


//回调函数
var callback = function (data) {
    //重构产品列表数据
    var result = data;
    //将js对象转换成ko对象
    proList = ko.mapping.fromJS(result);

    //如果是第一页则直接赋值，否则追加列表数据
    if (grid.pageIndex() == 1)
        productViewModel.data(proList.data());
    else {
        $(proList.data()).each(function (index, item) {
            productViewModel.data.push(item);
        });
    }

    //初始化是否上线按钮
    if (data != undefined) {
        showSwitchery();
    }
}


$(function () {
    productViewModel.init();
});