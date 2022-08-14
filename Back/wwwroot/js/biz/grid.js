
//初始化GridPagerModel
var grid = new GridPagerModel();

var query = function (pageIndex) {
    grid.pageIndex(pageIndex || 1);
    if (grid.pageIndex() == 1 || grid.pageIndex() <= grid.size()) {
        $.getList({
            async: true,
            url: api,
            data: {
                pageIndex: grid.pageIndex(),
                pageSize: grid.pageSize(),
                operAdminId: $("input[name='operAdminId']").val()
            },
            success: function (result) {

                //自定义ko对象
                if ("function" == typeof initKoData) {
                    initKoData();
                }
                $('#list_loading').remove();
                if (grid.pageIndex() == 1){
                    grid.data(result.data);
                }
                else {
                    $(result.data).each(function (index, item) {
                        grid.data.push(item);
                    });
                }
                grid.total(result.totalCount);

                //成功的回调方法
                if ("function" == typeof callback) {
                        callback(result);
                }

                //排除第一页数据加载数据行样式
                if (grid.pageIndex() != 1)
                    $.renderDataRow("#PagerGird table tbody tr[data-rowType='tr']:gt(" + ((grid.pageIndex() - 1) * grid.pageSize() - 1) + ")");
            }
        });
    }
    else {
        $("#PagerGird").append("<p class='no_data'>亲，没有更多数据了</p>");
        setTimeout(function () {
            $("#PagerGird .no_data").fadeOut();
        }, 1000)
    }
};

$(function () {

    ko.applyBindings(grid);
    //加载和查询
    query(1);
    var pageDom = $("#PagerGird");
    pageDom.append('<div id="list_loading" class="tc">正在加载中...</div>')
    var queryFun = function () {
        pageDom.scrollTop(0);
        pageDom.scrollLeft(0);
        query(1);
    };

    var timer = null;
    //TODO 输入框点击enter时进行搜索
    //如果键盘敲击速度太快，小于100毫秒的话就不会向后台发请求，但是最后总会进行一次请求的。
    //隐藏在右侧弹框里面的搜索
    $(".ibox-search input,#divParams input,#moreSearch input").keyup(function (event) {
        var $this = $(this);
        clearTimeout(timer);
        timer = setTimeout(function () {
            if (event.keyCode == 13) {
                queryFun();
                $this.blur();
            }
        }, 500);
    }); 

    //下拉框切换
    $("#divParams select,#moreSearch select").change(function () {
        clearTimeout(timer);
        timer = setTimeout(function(){
            $("#PagerGird").scrollTop(0);
            $("#PagerGird").scrollLeft(0);
            query(1);
        },500)
    });
  
    //时间控件 
    $("#divParams,#moreSearch").find(".datepicker,.datepicker-his").find("input").each(function () {
        var $this = $(this);
        $this.on('changeDate', function (ev) {
            $("#PagerGird").scrollTop(0);
            $("#PagerGird").scrollLeft(0);
            query(1);
        });
        $this.on('keyup', function (ev) {
            if (ev.keyCode == 8 || ev.keyCode == 12) {
                $("#PagerGird").scrollTop(0);
                $("#PagerGird").scrollLeft(0);
                query(1);
            }
        });
    });
    $("#divParams,#moreSearch").find("input.datepicker,input.datepicker-his").each(function () {
        var $this = $(this);
        $this.on('changeDate', function (ev) {
            $("#PagerGird").scrollTop(0);
            $("#PagerGird").scrollLeft(0);
            query(1);
        });

        $this.on('keyup', function (ev) {
            if(ev.keyCode==8 || ev.keyCode==12){
                $("#PagerGird").scrollTop(0);
                $("#PagerGird").scrollLeft(0);
                query(1);
            }
        });
    });

    //下拉列表加载更多
    $("#PagerGird").scrollGrid();
});


