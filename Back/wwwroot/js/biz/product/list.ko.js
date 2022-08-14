
//转到产品详情页
grid.openDetail = function (type, id) {
    var title = "产品详情";
    if (type == 1) title = "集合信托详情";
    else if (type == 2) title = "集合资管详情";
    else if (type == 8) title = "政府债详情";
    $.openTab({
        url: '/product/detail?id=' + id + "&productTypeId=" + type,
        title: title + " - " + id
    });
};
//当前选中的列表项
grid.currentItem;
//选中某行时触发
grid.selectItem = function (item) {
    grid.currentItem = item;
};

//产品列表页视图控制模型
function productViewModel() {

    var self = this;

    //产品列表数据
    self.data = ko.observableArray([]);

    //产品ko对象
    self.productItem = ko.observable([]);

    self.init = function () {

        $.Data.bindUserSelect2({
            selId: "selUserId"
        });

        $.Data.bindProject({
            selId: "selProject"
        });

        $.Data.bindAdmin({
            selId: "selAdmin"
        });

        $("#deleteProduct").click(function () {
            if (!$.getSelectId()) {
                $.tips("请先选择产品", $(this), 1000);
                return;
            }
            self.deleteProduct();
        });

        $("#addProduct").click(function () {
            self.addProduct();
        });

        $("#editProduct").click(function () {
            if (!$.getSelectId()) {
                $.tips("请先选择产品", $(this), 1000);
                return;
            }
            self.editProduct();
        });

        $("#onlineProduct").click(function () {
            if (!$.getSelectId()) {
                $.tips("请先选择产品", $(this), 1000);
                return;
            }
            self.onlineProduct();
        });

        $("#offlineProduct").click(function () {
            if (!$.getSelectId()) {
                $.tips("请先选择产品", $(this), 1000);
                return;
            }
            self.offlineProduct();
        });

        $("#quickOrder").click(function () {
            if (!$.getSelectId()) {
                $.tips("请先选择产品", $(this), 1000);
                return;
            }
            self.quickOrder();
        });

        //保存快捷下单数据
        $("#btnQuickOrder").click(function () {
            self.saveQuickOrder();
        });

        $("#btnSaveProduct").click(function () {
            self.saveProduct();
        });
    }

    //删除产品
    self.deleteProduct = function () {
        $.confirm('您确定要删除吗?', function () {
            $.delete({
                url: "product/" + $.getSelectId(),
                success: function () {
                    $.success('操作成功');
                    query();
                }
            });
        });
    }

    //新增产品
    self.addProduct = function () {
        var dialog = $('#dialog_AddProduct');
        $.openDialog({
            title: '新增产品',
            jqObj: dialog
        });
    }

    //编辑产品
    self.editProduct = function () {
        $.get({
            url: "product/" + $.getSelectId(),
            success: function (result) {
                var dialog = $('#dialog_AddProduct');
                $.openDialog({
                    title: '编辑产品',
                    jqObj: dialog
                });

                $("#addProductForm").loadForm(result);
            },
            error: function (resultErr) {
                $.tips(resultErr.responseText, $("#editProduct"), 2000);
            }
        });
    }

    //添加产品
    self.saveProduct = function () {
        if ($("#addProductForm").validate()) {
            var data = $("#addProductForm").toJson();
            var id = parseInt(data.id || "0");
            if (id > 0) {
                $.put({
                    url: "product/" + id,
                    data: data,
                    success: function () {
                        //关闭弹框
                        $.closeDialog($('#dialog_AddProduct'));
                        $.success('操作成功');
                        query();
                    },
                    error: function (resultErr) {
                        $.tips(resultErr.responseText, $("#btnSaveProduct"), 2000);
                    }
                });
            } else {
                $.post({
                    url: "product",
                    data: data,
                    success: function () {
                        //关闭弹框
                        $.closeDialog($('#dialog_AddProduct'));
                        $.success('操作成功');
                        query();
                    },
                    error: function (resultErr) {
                        $.tips(resultErr.responseText, $("#btnSaveProduct"), 2000);
                    }
                });
            }
        }
    }

    //产品上线
    self.onlineProduct = function (productId) {
        $.confirm("确定上线该产品吗？", function () {
            $.post({
                url: "product/modifyStatus",
                data: { productId: productId, status: 40 },
                success: function () {
                    if ($("#currentRole").val() == "Pm" && $("#currentLevel").val() != "Director" && $("#currentRole").val() != "Admin" && $("#currentRole").val() != "Ceo") {
                        $("tr[data-id=" + productId + "] .js-switch").next().remove();
                        disabledSingleSwitchery($("tr[data-id=" + productId + "] .js-switch")[0]);
                    }
                },
                error: function (resultErr) {
                    $.tips(resultErr.responseText, $(this));
                    return;
                }
            });
            return;
        }, function () {
            $("tr[data-id=" + productId + "] .js-switch").click();
        });
    }

    //产品下线
    self.offlineProduct = function (productId) {
        $.post({
            url: "product/modifyStatus",
            data: { productId: productId, status: 10 },
            success: function () {
            },
            error: function (resultErr) {
                $.tips(resultErr.responseText, $(this));
                return;
            }
        });
    }

    //快捷下单
    self.quickOrder = function () {
        $.get({
            url: "product/" + $.getSelectId(),
            success: function (result) {
                var dialog = $('#dialog_QuickOrder');
                $.openDialog({
                    title: '快捷下单',
                    jqObj: dialog
                });

                $("#title", dialog).val(result.sTitle);
                $("#selProductType", dialog).val(result.type);

                $('.datepicker', dialog).datepicker({
                    autoclose: true,
                    format: 'yyyy-mm-dd',
                    language: 'zh-CN',
                    weekStart: 1,
                    orientation: "auto left",
                    todayHighlight: true
                });
            },
            error: function (resultErr) {
                $.tips(resultErr.responseText, $("#btnQuickOrder"), 2000);
            }
        });
    }

    //保存快捷下单
    self.saveQuickOrder = function () {
        var dialog = $('#dialog_QuickOrder');
        if ($("#selUserId", dialog).val() == "") {
            $.tips("请选择下单用户", $("#selUserId", dialog)[0], 1000);
            return;
        }
        if ($("#number", dialog).val() == "") {
            $.tips("请输入产品数量", $("#number", dialog)[0], 1000);
            return;
        }
        var data = $("#quickOrderForm").toJson();
        data.productId = $.getSelectId();
        data.status = 1; //快捷下单默认状态正常
        $.confirm("确定下单该产品吗？", function () {
            $.post({
                url: "trade/order/submitorder",
                data: data,
                success: function () {
                    //关闭弹框
                    $.closeDialog($('#dialog_QuickOrder'));
                    $.success('操作成功');
                    query();
                },
                error: function (resultErr) {
                    $.tips(resultErr.responseText, $("#btnQuickOrder", dialog), 2000);
                }
            });
        });
    }

    //点击展开产品详情
    self.openDetail = function (item) {
        var id = item.id();
        //展开产品详情内容区域
        var obj = $("tr[data-id=" + id + "]");
        var detail = $(obj).next();
        $("a:first", detail).click();
        detail.toggle();

        if ($("i:first", $(obj)).attr("class") == "icon-chevron-down") {
            $("i:first", $(obj)).attr("class", "icon-chevron-up");
        }
        else if ($("i:first", $(obj)).attr("class") == "icon-chevron-up") {
            $("i:first", $(obj)).attr("class", "icon-chevron-down");
        }

        if (!detail.is(":hidden")) {
            //展开详情时，读取该产品预约信息
            if ($("div[data-type=operAppointment]", $("#operAppointment" + id)).length == 0) {
                self.reloadAppointment(item);
            }

            //展开详情时，读取该产品交易信息
            if ($("div[data-type=orderItem]", $("#operOrder" + id)).length == 0) {
                self.reloadOrder(item);
            }

            //展开详情时，读取该产品结佣信息
            if ($("div[data-type=operCommission]", $("#operCommission" + id)).length == 0) {
                self.reloadBrokerage(item);
            }

            //展开详情时，读取该产品二次结佣信息
            if ($("div[data-type=operSecondBrokerage]", $("#operSecondBrokerage" + id)).length == 0) {
                self.reloadSecondBrokerage(item);
            }

            //加载产品标签
            if ($("li", $("#operTag" + id)).length == 0)
                self.loadTags(id, detail);
        }
    }

    //列表列中操作上下线
    self.changeStatus = function (id, element) {
        if (element.checked)
            self.onlineProduct(id);
        else
            self.offlineProduct(id);
    }
}