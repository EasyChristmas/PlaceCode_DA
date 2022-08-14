//请求列表的api
var api = "miningPool";

var miningPoolViewModel = new MiningPoolViewModel();


$(function () {
    miningPoolViewModel.init();

    //格式化列表table高度
    $.tableHeight(80);
});

