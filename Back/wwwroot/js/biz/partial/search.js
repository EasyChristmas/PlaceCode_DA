var searchModel = new searchViewModel();
$(function () {
    //ko.applyBindings(searchModel, document.getElementById("bot_box"));
    ko.applyBindings(searchModel, document.getElementById("divSearch"));

    //选中li
    $("#bot_box ul li").click(function () {
        var item = $(this);

        //赋值给Input搜索框
        $("#searchContent").val(item.text());

        //隐藏下拉框
        searchModel.showDiv(false);
    })

    var cpLock = false;
    $('#searchContent').on('compositionstart', function () {
        cpLock = true;
    });
    $('#searchContent').on('compositionend', function () {
        cpLock = false;
        searchModel.getSearchData($(this).val());

    });
    $('#searchContent').on('input', function () {
        if (!cpLock) {
            searchModel.getSearchData($(this).val());
        }
    });

    $('#searchContent').on('focus', function (e) { 
        e.stopPropagation();
        $(this).css("width", '160px');
        if ($('.top_div.czwd').length == 1 || $('.top_div.version').length == 1) {
            $('.top_div.czwd').hide();
            $('.top_div.version').hide();
        }
        $("#divSearch").show();
        var ne_height = $('#divSearch .container').height() - 50;
        $('#divSearch .ne_le,#divSearch .ne_ri').height(ne_height);
        if (!$(this).val()) {
            searchModel.searchDataDivReset();
            return;
        }
    });
    $('#searchContent').on('click', function (e) {
        e.stopPropagation();
    })

    //关闭搜索结果框
    $('.new_foot').on('click', function () {
        searchModel.closeSearchDiv(); 
    });
    $(document).click(function () {
        $('#searchContent').css("width", '0');
    }); 
    $(".searchContentBox").hover(function () {
        $(this).find("#searchContent").css("width", '160px')
    })
    //分类筛选
    $(".sub_li_1").each(function () {
        var $this = $(this);
        $this.click(function () {
            //控制选中样式
            $(".sub_li_1").each(function () {
                $(this).removeClass("on");
            });
            $(this).addClass("on");

            var typeId = $(this).attr("dataTypeId");
            var dataList = [];
            for (var i = 0; i < searchModel.searchResultData.length; i++) {
                if (searchModel.searchResultData[i].type == typeId) {
                    dataList.push(searchModel.searchResultData[i]);
                }
            }
            searchModel.searchResult(dataList);
        });
    });
})
