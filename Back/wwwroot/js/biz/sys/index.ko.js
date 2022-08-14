
var ViewModel = function () {
    var self = this;
    self.adminData = ko.observableArray([]);

    //员工加载数据
    self.loadAdmin = function () {
        var param = {};
        param.status = 1;
        $("#divParams select").each(function (index, item) {
            var name = $(item).attr("name");
            var val = $(item).val();
            param[name] = val;
        });
        param["enterPriseId"] = $("#currentEnterPriseId").val();
        $.get({
            url: 'oa/admin',
            data: param,
            async: false,
            success: function (result) {
                self.adminData(result.data);
            }
        });
    };

    self.roleData = ko.observableArray([]);
    //角色加载数据
    self.loadRole = function () {
        $.get({
            url: "sys/role",
            data: { "enterPriseId": $("#currentEnterPriseId").val() },
            async: false,
            success: function (result) {
                self.roleData(result);
            }
        });
    };

    self.functionData = ko.observableArray([]);
    //菜单加载数据
    self.loadFunction = function () {
        $.get({
            url: "sys/function/getlist",
            data: {"roleIds": $("#currentRoleIds").val()},
            async: false,
            success: function (result) {
                //构造树
                var res = buildTree(result, null);
                self.functionData(res);
            }
        });
    };
    //tooltipshow
    self.tooltip = function (obj) {
        $(obj).tooltip();
    };

    self.btnsData = ko.observableArray([]);
    self.loadBtns = function (id) {
        $.get({
            url: "sys/function/getlist?parentId=" + id,
            success: function (result) {
                self.btnsData(result);
            }
        });
    };

    //编辑菜单按钮
    self.editBtns = function (obj) {
        var $this = $(obj);
        $.openDialog({
            title: '编辑菜单按钮',
            jqObj: $('#editMenuBtn')
        });
        var id = ($this.attr("function-id"));
        $("#menuParentId").val(id);
        self.loadBtns(id)
    };
    //点击按钮
    self.clickMenu = function (obj) {
        $(obj).toggleClass("active").parent().siblings().children("a").removeClass("active");
        if ($(obj).hasClass("active")) {
            var id = $(obj).attr("data-id");
            if (id) {
                $.get({
                    url: "sys/function/" + id,
                    success: function (result) {
                        $("#functionBtnForm").loadForm(result);
                        $("#dropdownMenu2").find("i").attr("class", result.icon);
                        if (result.isShow) {
                            $("#editMenuBtn .i-checks").children("div").addClass("checked");
                        }
                        else {
                            $("#editMenuBtn .i-checks").children("div").removeClass("checked");
                        }
                    }
                });
            }
        } else {
            $("#functionBtnForm").resetForm();
            $("#dropdownMenu2").find("i").attr("class", "");
            $("#editMenuBtn .i-checks").children("div").removeClass("checked");
        }
    };
    //删除按钮
    self.delMenu = function (obj) {
        var id = $(obj).attr("data-id");
        var parentId = $(obj).attr("data-parentId");
        if (id) {
            $.delete({
                url: "sys/function/" + id,
                success: function (result) {
                    if ($(obj).prev().hasClass("active")) {
                        $("#functionBtnForm").resetForm();
                        $("#dropdownMenu2").find("i").attr("class", "");
                        $("#editMenuBtn .i-checks").children("div").removeClass("checked");
                    }
                    
                    self.loadBtns(parentId);
                    self.loadFunction();
                }
            });
        }
    };
    //保存
    self.saveMenu = function () {
        var isShow = $("#editMenuBtn .i-checks").children("div").hasClass("checked");
        var icon = $("#dropdownMenu2").find("i").attr("class");
        var parentId = $("#menuParentId").val();
        var id = $("#menuId").val();
        $("#functionBtnForm").submitForm({
            type: 'post',
            url: 'sys/function',
            data: { parentId: parentId, type: 2, isShow: isShow, icon: icon },
            success: function (result) {
                $("#dropdownMenu2").find("i").attr("class", "");
                $("#functionBtnForm").resetForm();
                $("#dropdownMenu2").find("i").attr("class", "");
                $("#editMenuBtn .i-checks").children("div").removeClass("checked");
                
                self.loadBtns(parentId);
                self.loadFunction();

                //去掉用户角色菜单样式
                {
                    //初始化用户为未选中状态
                    $(".admin li a").each(function () {
                        $(this).removeClass("active");
                    });
                    //初始化菜单和角色框为未选中状态
                    $(".table .check_box").each(function () {
                        $(this).removeClass("on");
                    });
                    //初始化按钮未选中状态
                    $("#functionList .fr i").each(function () {
                        $(this).removeClass("colgreen");
                    });

                    //初始化角色名为未选中状态
                    $(".role .role_part").each(function () {
                        $(this).removeClass("active");
                    });
                }
            },
        });
    }
};
//创建树
function buildTree(data, res) {
    if (res == null) {
        //var res = FindbyPId(0, result);
        var res = [];
        //新的数据源
        var source = data;
        for (i = 0; i < data.length; i++) {
            if (data[i].parentId == 0) {
                res.push(data[i]);
                source = data.remove(i);
            }
        }
        data = source;
    }
    for (var i = 0; i < res.length; i++) {
        //res[i].children = FindbyPId(res[i].id, result);

        //子数组
        var chArry = [];
        //新的数据源
        var source = data;
        for (j = 0; j < data.length; j++) {
            if (data[j].parentId == res[i].id) {
                //子数组添加元素
                chArry.push(data[j]);
                //数据源删除已遍历过的元素
                source = data.remove(j);
            }
        }
        //赋值
        res[i].children = chArry;
        //递归调用
        buildTree(source, res[i].children);
    }
    return res;
}
