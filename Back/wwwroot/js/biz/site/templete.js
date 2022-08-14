
//初始化GridPagerModel
var grid = new GridPagerModel();
var vm = new MessageViewModel();

//查询消息
var query = function (pageIndex) {
    grid.pageIndex(pageIndex || 1);
    if (grid.pageIndex() == 1 || grid.pageIndex() <= grid.size()) {
        $.getList({
            async: true,
            url: 'site/message',
            data: {
                pageIndex: grid.pageIndex(),
                pageSize: grid.pageSize(),
                messageTempleteId: vm.seltempleteId,
                method: vm.queryMethod,
                status: vm.queryStatus
            },
            success: function (result) {
                if (grid.pageIndex() == 1) {
                    vm.messageList([]);
                    $("#PagerGird").animate({ scrollTop: 0 }, 200);
                }
                $(result.data).each(function (index, item) {
                    vm.messageList.push(new MessageModel(item));
                });
                //页面显示
                vm.total(result.totalCount);
                //为分页使用
                grid.total(result.totalCount);
                //排除第一页数据加载数据行样式
                if (grid.pageIndex() != 1)
                    $.renderDataRow("#PagerGird table tbody tr[data-rowType='tr']:gt(" + ((grid.pageIndex() - 1) * grid.pageSize() - 1) + ")");
            }
        });
    }
    else {
        $("#PagerGird").append("<p class='no_data'>亲，没有更多数据了</p>");
        setTimeout(function() {
                $("#PagerGird .no_data").fadeOut();
            },
            1000);
    }
};

$(function () {
    $.tableHeightTwo(120, ".div-table-content");
    ko.applyBindings(vm);
    //vm.loadTemplete();

    //下拉列表加载更多
    $("#PagerGird").scrollGrid();

    //下拉框切换
    $("#divParams select").change(function () {
        $("#PagerGird").scrollTop(0);
        $("#PagerGird").scrollLeft(0);
        query(1);
    });

    //发送方式切换
    $("#sendMode a").click(function () {
        $(this).toggleClass("active");
        if ($(this).hasClass("messages")) {
            if ($(this).hasClass("active")) {
                $("#sendMode input").css('display', 'inline-block');
            } else {
                $("#sendMode input").css('display', 'none');
                $("#sendMode input").val('');
            }
        }
        else if ($(this).hasClass("jpush")) {
            if ($(this).hasClass("active")) {
                $("#sendMode select").css('display', 'inline-block');
            } else {
                $("#sendMode select").css('display', 'none');
                $("#sendMode select").val("default");
            }
        }
    });

    //延迟加载省市区
    setTimeout(function () {
        //绑定省市区
        $.Data.bindSSQ({
            province: 'selProvince',
            city: 'selCity',
            area: 'selArea'
        });
        //绑定标签
        $.Data.bindTag({ selId: "selTag" });
    }, 500);
});

//获取发消息 实时更新消息剩余字符数
function changeSurplusCount() {
    //剩余字符数=总数-当前模版字符数-占位符输入的字符数
    var sCount = vm.maxCount - vm.currentCount() - getCount();
    vm.surplusCount(sCount);
}

//获取占位符输入的数量
function getCount() {
    var count = 0;
    $('input[data-grorp="placeholder"]').each(function () {
        var $this = $(this);
        count += $this.val().trim().length;
    });
    return count;
}