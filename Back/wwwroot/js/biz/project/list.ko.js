
//转到详情页
grid.openDetail = function (type, id) {
    var title = "项目详情";
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

//Json序列化错误模型
var JsonFormatErrorModel = function (jsonError) {
    var self = this;
    self.line = ko.observable(jsonError.line);
    self.message = ko.observable(jsonError.message);
}

//列表页视图控制模型
function projectViewModel() {

    var self = this;

    //产品列表数据
    self.data = ko.observableArray([]);

    //产品ko对象
    self.productItem = ko.observable([]);

    self.CodeMirror = {};
    self.jsonFormatError = ko.observable(new JsonFormatErrorModel({ line: 0, message: '如果您需要配置Json字符串，请选中左侧菜单或新增' }));

    self.init = function () {

        $("#delete").click(function () {
            if (!$.getSelectId()) {
                $.tips("请先选项目", $(this), 1000);
                return;
            }
            self.delete();
        });

        $("#add").click(function () {
            self.add();
        });

        $("#edit").click(function () {
            if (!$.getSelectId()) {
                $.tips("请先选择产品", $(this), 1000);
                return;
            }
            self.edit($.getSelectId());
        });

    }

    //设置代码编辑器插件对象
    self.setCodeMirror = function (codemirror) {
        self.CodeMirror = codemirror;
    };

    //Json 字符串格式化
    self.formatJson = function (json) {
        return $.formatJson(json);
    }

    //是否为Json字符串
    self.isJson = function (str, fn) {
        let result = false;
        if (typeof str == 'string') {
            try {
                //var obj = JSON.parse(str);
                var obj = json_parse(str);
                if (typeof obj == 'object' && obj)
                    result = true;
            }
            catch (e) {
                if (fn && typeof fn == 'function')
                    fn(e);
            }
        }
        return result;
    }

    //删除
    self.delete = function () {
        $.confirm('您确定要删除吗?', function () {
            $.delete({
                url: "project/" + $.getSelectId(),
                success: function () {
                    $.success('操作成功');
                    query();
                }
            });
        });
    }

    //新增
    self.add = function () {
        $.openTab({
            url: "/project/edit?redirectUrl=" + $(window.frameElement).attr("data-id"),
            title: "新增项目"
        });
    }

    //编辑
    self.edit = function (id) {
        $.openTab({
            url: "/project/edit?id=" + id+"&redirectUrl=" + $(window.frameElement).attr("data-id"),
            title: "修改项目 - " + id
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

    //上线
    self.online = function (id) {
        $.put({
            url: "project/online/" + id,
            success: function () {
            },
            error: function (resultErr) {
                $.tips(resultErr.responseText, $(this));
                return;
            }
        });
    }

    //下线
    self.offline = function (id) {
        $.put({
            url: "project/offline/" + id,
            success: function () {
            },
            error: function (resultErr) {
                $.tips(resultErr.responseText, $(this));
                return;
            }
        });
    }

    //点击展开详情
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
            self.online(id);
        else
            self.offline(id);
    }
}