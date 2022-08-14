
//初始化GridPagerModel
var grid = new GridPagerModel();
var vm = new NewsViewModel();

//查询新闻
var query = function (pageIndex) {
    grid.pageIndex(pageIndex || 1);
    if (grid.pageIndex() == 1 || grid.pageIndex() <= grid.size()) {
        $.getList({
            async: true,
            url: 'site/news',
            data: {
                pageIndex: grid.pageIndex(),
                pageSize: grid.pageSize(),
                newsTypeIds: vm.selNewsTypeId,
                title: vm.queryNewsTitle
            },
            success: function (result) {
                if (grid.pageIndex() == 1) {
                    vm.newsList([]);
                    $("#PagerGird").animate({ scrollTop: 0 }, 200);
                }
                $(result.data).each(function (index, item) {
                    vm.newsList.push(new NewsModel(item));
                });
                //页面显示
                vm.total(result.totalCount);
                //为分页使用
                grid.total(result.totalCount);
                //排除第一页数据加载数据行样式
                if (grid.pageIndex() != 1)
                    $.renderDataRow("#PagerGird table tbody tr[data-rowType='tr']:gt(" + ((grid.pageIndex() - 1) * grid.pageSize() - 1) + ")");
                //swiper拖动
                //var swiper = new Swiper("#threeMenu", {
                //    freeMode: false,
                //    slidesPerView: "auto"
                //});
                //默认加载第一个分类下的第一个菜单
                //$('.menuNewsLeft').children(':first').find('.news_type_children').children(':first').addClass('active');
            }
        });
    }
    else {
        $("#PagerGird").append("<p class='no_data'>亲，没有更多数据了</p>");
        setTimeout(function () {
            $("#PagerGird .no_data").fadeOut();
        }, 1000);
    }
};

$(function () {  
    //格式化左右两侧div的高度
    //$.tableHeightDivLeftRight(".list_content", ".menuNewsLeft", 104, 100);//存在三级菜单的时候
    $.tableHeightDivLeftRight(".list_content", ".menuNewsLeft", 40, 100);
    //vm.init();
    ko.applyBindings(vm);
    vm.init();

    //加载产品下拉框
    //$.Data.bindOnlineProduct({ selId: 'selProduct', isOnline: false, project: $("#selAdmin").val() });

    //$("#selAdmin").change(function () {
    //    //加载产品下拉框
    //    $.Data.bindOnlineProduct({ selId: 'selProduct', isOnline: false, project: $("#selAdmin").val() });
    //});

    //下拉列表加载更多
    $("#PagerGird").scrollGrid();

    //拖拽排序
    $(".sortable").sortable({
        placeholder: "ui-state-highlight"
    });

    //按回车查询
    $("#divParams").keyup(function (event) {
        if (event.keyCode == 13) {
            $("#PagerGird").scrollTop(0);
            $("#PagerGird").scrollLeft(0);
            query(1);
        }
    });

    $("#divParams select").change(function () {
        query(1);
    })

    //拖拽排序成功，数据库进行排序
    $("#container").delegate(".sortable", "sortupdate", function (event, ui) {
        var list = [];
        $(this).find("li").each(function (index, item) {
            $(item).attr("data-sort", index + 1);
            list.push($(item).attr("data-id"));
        });

        $.put({
            url: 'site/NewsType/Sort',
            data: { newsTypeList: list }
        });
    });

    //操作文档
    $("#action-document").on("click", function () {
        $.openWin({
            title: "操作手册",
            url: "/docs/site/news.html",
            width: "1000",
            height: "600"
        });
    });
    //选择新闻特性效果
    $(".quality a").click(function () {
        $(this).toggleClass("active");
    });

    //默认加载第一个分类下的第一个菜单
    
    
});

