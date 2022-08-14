//初始化GridPagerModel
var grid = new GridPagerModel();
var viewData = {};
var query = function (pageIndex) {
    grid.pageIndex(pageIndex || 1);
    if (grid.pageIndex() === 1 || grid.pageIndex() <= grid.size()) {
        $.getList({
            async: true,
            url: "sys/AppUpdate",
            data: {
                pageIndex: grid.pageIndex(),
                pageSize: grid.pageSize(),
                name: viewData.name(),
                appId: viewData.appId()
            },
            success: function (result) {
                if (grid.pageIndex() === 1) {
                    viewData.datadicList([]);
                    $("#PagerGird").animate({ scrollTop: 0 }, 200);
                }
                $(result.data).each(function (i, item) {
                    viewData.datadicList.push(item);
                });
                //console.log(result.data);
                //页面显示
                viewData.total(result.totalCount);
                //为分页使用
                grid.total(result.totalCount);
                //排除第一页数据加载数据行样式
                if (grid.pageIndex() !== 1)
                    $.renderDataRow("#PagerGird table tbody tr[data-rowType='tr']:gt(" +
                        ((grid.pageIndex() - 1) * grid.pageSize() - 1) + ")");
            }
        });
    } else {
        $("#PagerGird").append("<p class='no_data'>亲，没有更多数据了</p>");
        setTimeout(function () {
            $("#PagerGird .no_data").fadeOut();
        }, 1000);
    }
};
$(function () {
    $.tableHeight(36, ".div-table-content");
    $("#PagerGird").scrollGrid();
    //初始化Ko
    var initKo = function () {
        //是否编辑数据
        viewData.isEditData = false;
        //数据总条数
        viewData.total = 0;
        //列表数据源
        viewData.datadicList = [];
        //APP分类
        viewData.menuTypeList = [];
        //======列表查询条件开始=====================
        //更新数据的主键ID
        viewData.appUpdateId = null;
        //版本号
        viewData.name = null;
        //AppId
        viewData.appId = 1;
        //APP名称
        viewData.appName = "壹财富官网";
        //渠道 来至APPInfo中
        viewData.channel = 4;

        //编辑AppId
        viewData.eappId = null;
        //编辑渠道 来至APPInfo中
        viewData.echannel = null;
        //======列表查询条件结束=====================
        //选中列表事件 赋值当前Id给变量
        viewData.selDataType = function () {
            //console.log(this);
            viewData.appId(this.id());
            viewData.appName(this.name());
            viewData.channel(this.channel());
            //console.log(this.id());
            //console.log(this.channel());
            ////清空列表数据
            viewData.datadicList.remove();
         
            query(1);
        };
        //数据管理开始===================================
        //添加数据弹出框
        viewData.addData = function () {
            $.openDialog({
                title: "新增App更新",
                jqObj: $("#divData"),
                width: "600"
            });
            viewData.isEditData(false);
            viewData.appUpdateId(null);
            viewData.eappId(viewData.appId());
            //console.log(viewData.eappId());
            showSwitchery();
        };
        //编辑
        viewData.editData = function (id) {
            viewData.appUpdateId(null);
            //判断是否选中
            if (!!!id) {
                $.tips("请先要编辑的数据", $(event.toElement));
                return;
            }
            $.get({
                url: "sys/AppUpdate/" + id,
                success: function (result) {
                    //console.log(result);
                    $.openDialog({
                        title: "编辑App更新",
                        jqObj: $("#divData"),
                        width: "600"
                    });
                    $("#dataForm").loadForm(result);
                    //console.log(result.url);
                    if (result.url.indexOf("guid") >= 0) {
                        var file = $.parseJSON(result.url);
                        ////console.log(file);$.hostFileUrl() + 
                        $("#url").val($.getFileUrl(file[0].file));
                        //console.log(result.url);
                       
                        //var tempUrl = result.url.replace($.hostFileUrl(), "");
                        //console.log(tempUrl);
                        //var jsonObj = [{ "guid": "", "name": "", "file": "Upload/App/20170321/322af13efed2484485bfebcad856c0e5_76.png", "postfix": "" }];
                        
                        //////var t = jQuery.parseJSON(jsonObj);
                        //////console.log(t);
                        //result.url = jsonObj;
                        ////$("#url").val(tempUrl);
                        //$("#url").val(result.url);
                    }
                    

                    viewData.appUpdateId(id);
                    viewData.eappId(null);
                    viewData.echannel(null);
                    //console.log("result.channel" + result.channel);
                    viewData.eappId(result.appId);
                    viewData.echannel(result.channel);
                    //console.log("eappId" + viewData.eappId());
                    //console.log("echannel" + viewData.echannel());
                    viewData.isEditData(true);
                    showSwitchery();
                }
            });
        };
        //删除
        viewData.delData = function (id) {
            //var id = $.getSelectId();
            //判断当前是否选中
            if (!!!id) {
                $.tips("请要删除的数据", $(event.toElement));
                return;
            }
            $.confirm("您确定要删除吗?",function () {
                $.delete({
                    url: "sys/AppUpdate/" + id,
                    success: function () {
                        $.success("操作成功",2000);
                        query(1);
                    },
                    error: function (resultErr) {
                        $.errorMsg(resultErr.responseText);
                    }
                });
            });
        };
        //保存(新增和编辑)
        viewData.saveData = function () {
            if ($("#dataForm").validate()) {
                //var url = $('div[name="url"]').attr('data-upload-value');
                $("#dataForm").submitForm({
                    type: "post",
                    url: "sys/AppUpdate",
                    data: {
                        id: viewData.isEditData() ? viewData.appUpdateId() : null,
                        appId: viewData.eappId(),
                        channel: viewData.echannel()
                    },
                    success: function (result) {
                        //console.log(result);
                        if (result > 0) {
                            viewData.eappId(null);
                            viewData.echannel(null);
                            query(1);
                        }
                        $.closeDialog($("#divData"));
                    },
                    error: function (resultErr) {
                        $.errorMsg(resultErr.responseText);
                    }
                });
            }
        };
        //数据管理结束===================================
       
        //绑定Ko对象
        viewData = ko.mapping.fromJS(viewData);
        //选中下拉框中类型
        ko.applyBindings(viewData);
        //选择APP名称下拉框事件
        viewData.eappId.subscribe(function (id) {
            viewData.menuTypeList().forEach(function (item) {
                if (id === item.id()) {
                    viewData.eappId(item.id());
                    viewData.echannel(item.channel());
                }
            });
        });
        //按回车查询数据
        $("#divParams input").keyup(function (event) {
            if (event.keyCode == 13) {
                var val = $("#appNameId").val();
                viewData.name(val);
                $("#PagerGird").scrollTop(0);
                $("#PagerGird").scrollLeft(0);
                query(1);
            } 
        });

    }();
    //初始化数据加载
    var initData = function () {
        //加载APP分来数据
        var initAppType = function () {
            $.get({
                url: "sys/AppUpdate/GetListAppInfo",
                success: function (result) {
                    ko.mapping.fromJS(result, {}, viewData.menuTypeList);
                    //swiper拖动
                    Swiper("#header", {
                        freeMode: false,
                        slidesPerView: "auto"
                    });
                },
                error: function (resultErr) {
                    $.errorMsg(resultErr.responseText);
                }
            });
        }();
    }();
    query(1);
});
//上传成功回调函数
function uploadAutomaticSuccess(res) {
    $("#url").val($.getFileUrl(res.data));
}