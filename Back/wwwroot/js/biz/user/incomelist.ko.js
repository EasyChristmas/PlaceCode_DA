//选中行的id
grid.selId = 0;

//全选
grid.selectAll = function (obj) {
    $(obj).children("i").toggleClass("icon-check").toggleClass("icon-check-empty");
    if ($(obj).children("i").hasClass("icon-check")) {
        $("#PagerGird tr:not(.none_select)").each(function (index, item) {
            $(item).data("isSelect", true);
            $(item).attr("style", "background-color: rgb(253, 235, 133);");
        });
    } else {
        $("#PagerGird tr:not(.none_select)").each(function (index, item) {
            $(item).data("isSelect", false);
            $(item).attr("style", "background-color: rgb(255, 255, 255);");
        })
    }
};

grid.changeMiningPool = function () {
    query();
};

//总收益
grid.totalCoins = ko.observable();

//回调函数
var callback = function (data) {
    if (data != undefined && grid.pageIndex() == 1) {
        grid.totalCoins($.Data.outputmoney(data.totalCoins || 0));
    }
};
