//初始化GridPagerModel
var grid = new GridPagerModel();
var viewData = {};
var query = function (pageIndex) {
    grid.pageIndex(pageIndex || 1);
    if (grid.pageIndex() === 1 || grid.pageIndex() <= grid.size()) {
        $.getList({
            async: true,
            url: "common/DataDic",
            data: {
                pageIndex: grid.pageIndex(),
                pageSize: grid.pageSize(),
                name: viewData.name(),
                type: viewData.type(),
                intro: viewData.intro()
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
    $.tableHeightTwoDis(".ad_content", ".list_content", 110, 86);
    $("#PagerGird").scrollGrid();
    //初始化Ko
    var initKo = function () {
        //是否编辑数据
        viewData.isEditData = false;
        //数据总条数
        viewData.total = 0;
        //列表数据源
        viewData.datadicList = [];
        //下拉框枚举值
        viewData.drpTypeList = typeEnumList;
        //列表枚举值 默认加载全部
        viewData.tableTypeList = typeEnumList;
        //======列表查询条件开始=====================
        viewData.name = null;
        viewData.selType = null;
        //类型值
        viewData.type = "addr"; //枚举值，默认值 用于选中当前选中的依据
        //描述
        viewData.intro = null;
        //给添加数据的时候提供当前选中的类型名称
        viewData.typeName = "地区";
        //======列表查询条件结束=====================
        //选中列表事件 赋值当前Id给变量
        viewData.selDataType = function () {
            //console.log(this.key());
            viewData.type(this.value());
            viewData.typeName(this.key());
            ////清空列表数据
            viewData.datadicList.remove();
            ko.mapping.fromJS(typeEnumList, {}, viewData.tableTypeList);
            query(1);
        };
        ////显示所有分类
        //viewData.showAllType = function () {
        //    viewData.type("addr");
        //    viewData.typeName("地区");
        //    viewData.tableTypeList.removeAll();
        //    ko.mapping.fromJS(typeEnumList, {}, viewData.tableTypeList);
        //   // console.log(viewData.tableTypeList);
        //};
        //数据管理开始===================================
        //添加数据弹出框
        viewData.addDataDic = function () {
            $.openDialog({
                title: "新增数据字典",
                jqObj: $("#divDataDic")
            });
            viewData.isEditData(false);
            if (!viewData.isEditData()) {
                $("#sort,#parentId").val(0);
            }
        };
        //编辑
        viewData.editDataDic = function () {
            var id = $.getSelectId();
            //判断是否选中
            if (!!!id) {
                $.tips("请先要编辑的数据", $(event.toElement));
                return;
            }
            if (viewData.type() == null) {
                $.tips("请先选择类型", $(event.toElement));
                return;
            }
            //console.log(viewData.dataDicId());
            $.get({
                url: "common/datadic/" + id,
                success: function (result) {
                    $.openDialog({
                        title: "编辑数据字典",
                        jqObj: $("#divDataDic")
                    });
                    $("#dataDicForm").loadForm(result);
                    viewData.isEditData(true);
                }
            });
        };
        //删除
        viewData.delDataDic = function () {
            var id = $.getSelectId();
            //判断当前是否选中
            if (!!!id) {
                $.tips("请要删除的数据", $(event.toElement));
                return;
            }
            $.confirm("您确定要删除吗?",
                function () {
                    $.delete({
                        url: "common/datadic/" + id,
                        success: function () {
                            $.success("操作成功");
                            query(1);
                        },
                        error: function (resultErr) {
                            $.errorMsg(resultErr.responseText);
                        }
                    });
                });
        };
        //保存(新增和编辑)
        viewData.saveDataDic = function () {
            var id = $.getSelectId();
            if ($("#dataDicForm").validate()) {
                $("#dataDicForm").submitForm({
                    type: "post",
                    url: "common/datadic",
                    data: {
                        id: viewData.isEditData() ? id : null,
                        type: viewData.type()
                    },
                    success: function (result) {
                        //console.log(result);
                        if (result > 0) {
                            query(1);
                        }
                        $.closeDialog($("#divDataDic"));
                    },
                    error: function (resultErr) {
                        $.errorMsg(resultErr.responseText);
                    }
                });
            }

        };
        //数据管理结束===================================
        //操作手册
        //viewData.operShow = function() {
        //    //操作文档
        //    $("#action-document").on("click", function () {
        //        $.openWin({
        //            title: "操作手册",
        //            url: "/docs/site/news.html",
        //            width: "1000",
        //            height: "600"
        //        });
        //    });
        //};
        //绑定Ko对象
        viewData = ko.mapping.fromJS(viewData);
        //选中下拉框中类型
        ko.applyBindings(viewData);
        ////选择下拉框事件
        viewData.selType.subscribe(function (obj) {
            viewData.drpTypeList().forEach(function (item) {
                if (obj === item.value()) {
                    if (item.value() === "All") {
                        viewData.type("addr");
                        viewData.typeName("地区");
                        viewData.tableTypeList.removeAll();
                        ko.mapping.fromJS(typeEnumList, {}, viewData.tableTypeList);
                    } else {
                        viewData.type(obj);
                        //console.log(this);
                        viewData.tableTypeList.removeAll();
                        viewData.tableTypeList.unshift(item);
                    }

                }
            });
            query(1);
        });
        //按回车查询数据
        $("#divParams").keyup(function (event) {
            if (event.keyCode == 13) {
                var valName = $("#name").val();
                var valIntro = $("#intro").val();
                viewData.name(valName);
                viewData.intro(valIntro);
                $("#PagerGird").scrollTop(0);
                $("#PagerGird").scrollLeft(0);
                query(1);
            } 
        });
    }();
    //初始化加载列表数据
    query(1);
});
