$(function () {
    $.tableHeight(80);
    for (var i = 0; i < adminLevelList.length; i++) {
        $("#level").append("<option value='" + adminLevelList[i]["value"] + "'>" + adminLevelList[i]["key"] + "</option>");
    }

    var liStr = '';
    $.ajax({
        url: "/js/biz/iconfunction.json?_=" + Math.random(),
        type: "GET",
        dataType: "json",
        async: false,
        success: function (result) {
            for (var i = 0; i < result.length; i++) {
                liStr += '<li role="presentation"><a role="menuitem" tabindex="-1" href="#"><i class=' + result[i].keyName + '></i> </a></li>';
            }
        }
    });

    //添加icon下拉列表
    $("form").find('ul.dropdown-icon').append($(liStr));

    $("form ul.dropdown-icon").delegate("li", "click", function () {
        $("#dropdownMenu1,#dropdownMenu2").find("i").attr("class", $(this).find('i').attr('class'));
    });

    //获取员工加载工号和姓名
    $.get({
        url: "oa/admin?status=1",
        success: function (result) {
            var data = result.data;
            for (var i = 0; i < data.length; i++) {
                $("select[name='jobNum']").append("<option value='" + data[i].id + "'>" + data[i].id + "</option>");
                $("select[name='realName']").append("<option value='" + data[i].realName + "'>" + data[i].realName + "</option>");
            }
        }
    });

    //获取部门
    $.get({
        url: "oa/department/getlist",
        success: function (result) {
            for (var i = 0; i < result.length; i++) {
                $("select[name='departmentId']").append("<option value='" + result[i].id + "'>" + result[i].name + "</option>");
            }
        }
    });

    var vm = new ViewModel();
    ko.applyBindings(vm);
    vm.loadAdmin();//加载员工
    vm.loadRole();//加载角色
    vm.loadFunction();//加载菜单

    $("#divParams select").change(function () {
        vm.loadAdmin();
    });

    //用户选中
    $(".admin").delegate("li a", "click", function () {
        //初始化样式
        {
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

            //初始化级别为V1
            $("#functionList .level span").each(function () {
                $(this).html("V1");
            });
        }

        var self = $(this);
        if (self.hasClass("active")) {
            self.addClass("active").removeClass("active");
        } else {
            self.addClass("active").parent().siblings().children("a").removeClass("active");
            var adminId = $(this).attr('admin-id');

            //初始化角色框为未选中状态
            $(".role .check_box").each(function () {
                $(this).removeClass("on");
            });

            //获取角色
            $.get({
                url: "sys/adminrole/get",
                data: { adminId: adminId },
                async: false,
                success: function (result) {
                    var str = ",";
                    for (i = 0; i < result.length; i++) {
                        str += (result[i].roleId + ",");
                        $(".role .check_box").each(function () {
                            var self = $(this);
                            if (self.attr('role-id') == result[i].roleId) {
                                self.addClass("on");
                                return;
                            }
                        });
                    }

                    //根据角色集获取菜单
                    $.get({
                        url: "sys/rolepower/get",
                        data: { roleString: str },
                        async: false,
                        success: function (result) {
                            for (i = 0; i < result.length; i++) {
                                $("#functionList .check_box").each(function () {
                                    var self = $(this);
                                    if (self.attr('function-id') == result[i].functionId) {
                                        self.addClass("on");
                                        return;
                                    }
                                });
                                $("#functionList .fr i").each(function () {
                                    var self = $(this);
                                    if (self.attr('function-id') == result[i].functionId) {
                                        self.addClass("colgreen");
                                        self.parent().next().find(".level span").html("V" + (result[i].level > 0 ? result[i].level : 1));
                                        return;
                                    }
                                });
                            }
                        }
                    });
                }
            });

            //获取菜单
            getAdminPower(adminId);
        }
    });

    //角色选框点击
    $(".role").delegate(".check_box .check_icon", "click", function () {
        var self = $(this);
        self.parent().toggleClass("on");

        //选中的用户
        var adminId = $(".admin li a.active").attr("admin-id");
        if (adminId) {//用户选中

            if (self.parent().hasClass("on")) {

                //增加用户角色
                $.post({
                    url: "sys/adminrole",
                    data: { adminId: adminId, roleId: self.attr("role-id") },
                    success: function (result) {
                    }
                });

                //加载用户角色菜单样式
                $.get({
                    url: "sys/rolepower/get",
                    data: { roleId: self.attr("role-id") },
                    async: false,
                    success: function (result) {
                        for (i = 0; i < result.length; i++) {
                            $("#functionList .check_box").each(function () {
                                var self = $(this);
                                if (self.attr('function-id') == result[i].functionId) {
                                    self.addClass("on");
                                    return;
                                }
                            });
                            $("#functionList .fr i").each(function () {
                                var self = $(this);
                                if (self.attr('function-id') == result[i].functionId) {
                                    self.addClass("colgreen");
                                    self.parent().next().find(".level span").html("V" + (result[i].level > 0 ? result[i].level : 1));
                                    return;
                                }
                            });
                        }
                    }
                });

                //获取菜单
                getAdminPower(adminId);
            } else {

                //删除用户角色
                $.delete({
                    url: "sys/adminrole/delete?adminId=" + adminId + "&roleId=" + self.attr("role-id"),
                    success: function (result) {
                        vm.loadFunction();
                    }
                });

                //去掉用户角色菜单样式
                {
                    //初始化菜单为未选中状态
                    $("#functionList .check_box").each(function () {
                        $(this).removeClass("on");
                    });
                    //初始化按钮未选中状态
                    $("#functionList .fr i").each(function () {
                        $(this).removeClass("colgreen");
                    });
                    //初始化级别为V1
                    $("#functionList .level span").each(function () {
                        $(this).html("V1");
                    });

                    //角色集
                    var str = ",";
                    $(".role_part .check_box.on").each(function () {
                        var self = $(this);
                        str += (self.attr('role-id') + ",");

                    });

                    //根据角色集获取菜单
                    $.get({
                        url: "sys/rolepower/get",
                        data: { roleString: str },
                        async: false,
                        success: function (result) {
                            for (i = 0; i < result.length; i++) {
                                $("#functionList .check_box").each(function () {
                                    var self = $(this);
                                    if (self.attr('function-id') == result[i].functionId) {
                                        self.addClass("on");
                                        return;
                                    }
                                });
                                $("#functionList .fr i").each(function () {
                                    var self = $(this);
                                    if (self.attr('function-id') == result[i].functionId) {
                                        self.addClass("colgreen");
                                        self.parent().next().find(".level span").html("V" + (result[i].level > 0 ? result[i].level : 1));
                                        return;
                                    }
                                });
                            }
                        }
                    });

                    //获取菜单
                    getAdminPower(adminId);
                }
            }
        }
    });

    //角色名称点击
    $(".role").delegate(".role_part span", "click", function () {
        var self = $(this);

        {
            //初始化用户为未选中状态
            $(".admin li a").each(function () {
                $(this).removeClass("active");
            });

            //初始化菜单为未选中状态
            $(".table .check_box").each(function () {
                $(this).removeClass("on");
            });

            //初始化菜单为未选中状态
            $(".admin li a").each(function () {
                $(this).removeClass("active");
            });

            //初始化级别为V1
            $("#functionList .level span").each(function () {
                $(this).html("V1");
            });
        }

        //选中的用户
        var adminId = $(".admin li a.active").attr("admin-id");
        if (adminId) {//用户选中
            if (self.parent().parent().hasClass("active")) {
                self.parent().parent().removeClass("active");
            } else {
                self.parent().parent().addClass("active").siblings().removeClass("active");
            }
        } else {//用户未选中
            //初始化菜单为未选中状态
            $("#functionList .check_box").each(function () {
                $(this).removeClass("on");
            });
            //初始化按钮未选中状态
            $("#functionList .fr i").each(function () {
                $(this).removeClass("colgreen");
            });

            if (self.parent().parent().hasClass("active")) {
                self.parent().parent().removeClass("active");
            } else {
                self.parent().parent().addClass("active").siblings().removeClass("active");

                var roleId = self.attr("role-id");

                //根据角色集获取菜单
                $.get({
                    url: "sys/rolepower/get",
                    data: { roleId: roleId },
                    success: function (result) {
                        for (i = 0; i < result.length; i++) {
                            $("#functionList .check_box").each(function () {
                                var selfFun = $(this);
                                if (selfFun.attr('function-id') == result[i].functionId) {
                                    selfFun.addClass("on");
                                    return;
                                }
                            });
                            $("#functionList .fr i").each(function () {
                                var selfFun = $(this);
                                if (selfFun.attr('function-id') == result[i].functionId) {
                                    selfFun.addClass("colgreen");
                                    selfFun.parent().next().find(".level span").html("V" + (result[i].level > 0 ? result[i].level : 1));
                                    return;
                                }
                            });
                        }
                    }
                });
            }
        }
    });

    //菜单点击
    $("#functionList").delegate(".check_box", "click", function () {
        var self = $(this);
        self.toggleClass("on");

        //选中的角色
        var roleId = $(".role .role_part.active").find("span").attr("role-id");
        //选中的用户
        var adminId = $(".admin li a.active").attr("admin-id");

        if (roleId) {//角色选中
            //选中增加角色菜单
            if (self.hasClass("on")) {
                $.post({
                    url: "sys/rolepower",
                    data: { roleId: roleId, functionId: self.attr("function-id") },
                    success: function (result) {
                    }
                });
            } else {//删除角色菜单
                $.delete({
                    url: "sys/rolepower/delete?roleId=" + roleId + "&functionId=" + self.attr("function-id"),
                    success: function (result) {
                    }
                });
            }
        }
        else if (adminId) {//角色未选中，用户选中
            //选中增加用户菜单
            if (self.hasClass("on")) {
                $.post({
                    url: "sys/adminpower",
                    data: { adminId: adminId, functionId: self.attr("function-id"), operateType: true },
                    success: function (result) {
                    }
                });
            } else {//删除用户菜单
                $.post({
                    url: "sys/adminpower",
                    data: { adminId: adminId, functionId: self.attr("function-id"), operateType: false },
                    success: function (result) {
                    }
                });
            }
        }
    });


    //保存角色
    var saveRole = function (id) {
        var isManager = $("#addRole .i-checks").children("div").hasClass("checked");
        var roleName = $("input[name='roleName']").val().trim();
        var departmentId = $("select[name='departmentId']").val();
        $("#roleEditForm").submitForm({
            type: 'post',
            url: 'sys/role',
            data: { id: id, name: roleName, departmentId: departmentId, isManager: isManager,enterPriseId : $("#currentEnterPriseId").val() },
            success: function (result) {
                $("#roleEditForm").resetForm();
                $("#addRole").attr("roleId", 0);
                $("#addRole").css("display", "none");
                closeLayer();
                vm.loadRole();
            }
        });
    };
    //点击新增角色
    $("#btnSaveRole").click(function () {
        saveRole($("#addRole").attr("roleId"));
    });

    $(".addRole").on("click", function () {
        $("#addRole #myModalLabel").html("新增角色")
    });
    $(".addMenu").on("click", function () {
        $("#addMenu #myModalLabel").html("新增菜单")
    });
    //点击编辑角色
    $("#roleList").delegate(".icon-edit", "click", function () {
        var id = ($(this).attr("role-id"));
        //显示弹框
        $("#addRole").attr("roleId", id);
        $("#addRole #myModalLabel").html("编辑角色")

        if (id > 0) {
            $.get({
                url: "sys/role/" + id,
                success: function (result) {
                    $("input[name='roleName']").val(result.name)
                    $("select[name='departmentId']").val(result.departmentId);
                    if (result.isManager) {
                        $("#addRole .i-checks").children("div").addClass("checked");
                    }
                    else {
                        $("#addRole .i-checks").children("div").removeClass("checked");
                    }
                }
            });
        }
    });
    //点击删除角色
    $("#roleList").delegate(".icon-trash", "click", function () {
        var id = $(this).attr("role-id");
        $.confirm('确定要删除吗？', function () {
            $.delete({
                url: "sys/role/" + id,
                success: function (result) {
                    $.success("删除成功");
                    vm.loadRole();
                }
            });
        });
    });
    //保存菜单
    var saveFunction = function (functionId, isEdit) {
        var isShow = $("#addMenu .i-checks").children("div").hasClass("checked");
        var name = $("input[name='functionName']").val().trim();
        var code = $("input[name='functionCode']").val();
        var sort = $("input[name='functionSort']").val();
        var type = $("input[name='functionType']").val();
        var id = 0;
        var parentId = 0;
        if (isEdit == 1) {
            id = functionId;
            parentId = $("#addMenu").attr("parentId");
        } else {
            parentId = functionId;
        }
        var project = 0;
        if (!$("#projectDiv").is(":hidden"))
            project = $("#functionProject").val();
        var icon = $("#dropdownMenu1").find("i").attr("class");
        $("#functionEditForm").submitForm({
            type: 'post',
            url: 'sys/function',
            data: { id: id, name: name, code: code, parentId: parentId, sort: sort, isShow: isShow, icon: icon, type: 1, project: project },
            success: function (result) {
                $("#functionEditForm").resetForm();
                $("#addMenu").attr("parentId", 0);
                $("#addMenu").attr("functionId", 0);
                $("#addMenu").attr("isEdit", false);
                $("#addMenu").css("display", "none");
                $("#dropdownMenu1").find("i").attr("class", "");
                closeLayer();
                vm.loadFunction();
            }
        });
    };

    //提交菜单保存菜单
    $("#btnSaveFunction").click(function () {
        saveFunction($("#addMenu").attr("functionId"), $("#addMenu").attr("isEdit"));
    });

    //关闭层
    var closeLayer = function () {
        //隐藏页面
        $("#addMenu").removeClass("in").css("display", "none");
        $("#addRole").removeClass("in").css("display", "none");

        //清空数据
        $("#addMenu .i-checks").children("div").removeClass("checked");
        $("input[name='functionName']").val("");
        $("input[name='functionCode']").val("");
        $("input[name='functionSort']").val("");
        //$("input[name='functionType']").val(1);
        $("#addRole .i-checks").children("div").removeClass("checked");
        $("input[name='roleName']").val("");
        $("select[name='departmentId']").val("");
        $("#addRole").attr("roleId", 0);
        $("#addMenu").attr("parentId", 0);
        $("#addMenu").attr("functionId", 0);
        $("#addMenu").attr("isEdit", 0);
        $("div.modal-backdrop.fade.in").remove();
        $("#dropdownMenu1").find("i").attr("class", "");
        $(".menuBtnUl").children("li").remove();
        $("#functionProject").val(2);
    }
    //关闭角色和菜单页面
    $("#btnCloseFunction,#btnCloseRole,#btnCloseFunctionBtn,.close,.confirm").click(function () {
        //关闭层清理数据
        closeLayer();
    });
    $("#addFirstLevel").click(function () {
        //$("#projectDiv").show();
        //$("#functionProject").removeAttr("disabled");
    });
    //点击+新增菜单
    $("#functionList").delegate(".icon-plus:not(.fr .icon-plus)", "click", function () {
        //$("#addMenu").addClass("in").css("display", "block");
        $("#addMenu").attr("functionId", $(this).attr("function-id"));
        $("#addMenu").attr("isEdit", 0);
        $("#addMenu #myModalLabel").html("新增菜单");
        $("#projectDiv").hide();
    });
    //点击/编辑菜单
    $("#functionList").delegate(".icon-edit:not(.fr .icon-edit)", "click", function () {
        //$("#addMenu").addClass("in").css("display", "block");
        var id = ($(this).attr("function-id"));
        $("#addMenu").attr("functionId", id);
        $("#addMenu").attr("parentId", $(this).attr("parentId"));
        $("#addMenu").attr("isEdit", 1);
        $("#addMenu #myModalLabel").html("编辑菜单");
        //var menulevel = $(this).attr("menulevel");
        //if (menulevel == 1) {
        //    $("#projectDiv").show();
        //    $("#functionProject").attr("disabled", "disabled");
        //} else {
        //    $("#projectDiv").hide();
        //}
        if (id > 0) {
            $.get({
                url: "sys/function/" + id,
                success: function (result) {
                    $("select[name='departmentId']").val(result.departmentId);
                    $("input[name='functionName']").val(result.name);
                    $("input[name='functionCode']").val(result.code);
                    $("input[name='functionSort']").val(result.sort);
                    $("input[name='functionType']").val(result.type);
                    //if (menulevel == 1) {
                    //    $("#functionProject").val(result.project);
                    //}
                    $("#dropdownMenu1").find("i").attr("class", result.icon);
                    if (result.isShow) {
                        $("#addMenu .i-checks").children("div").addClass("checked");
                    }
                    else {
                        $("#addMenu .i-checks").children("div").removeClass("checked");
                    }
                }
            });
        }
    });
    //点击删除菜单
    $("#functionList").delegate(".icon-trash:not(.fr .icon-trash)", "click", function () {
        var id = $(this).attr("function-id");
        var childrenLength = $(this).attr("childrenLength");
        var adminPowerCount = $(this).attr("adminPowerCount");
        var rolePowerCount = $(this).attr("rolePowerCount");
        if (childrenLength > 0) {
            $.tips('请先删除子菜单或者按钮!', $(this), 1000)
            return false;
        };
        if (adminPowerCount > 0) {
            $.tips('请先删除用户权限!', $(this), 1000)
            return false;
        };
        if (rolePowerCount > 0) {
            $.tips('请先删除角色权限!', 1000)
            return false;
        };
        $.confirm('确定要删除吗？', function () {
            $.delete({
                url: "sys/function/" + id,
                success: function (result) {
                    $.success("已删除");
                    vm.loadFunction();
                }
            });
        });
    });

    //点击按钮
    $("#functionList").delegate(".fr i", "click", function () {
        var self = $(this);
        self.toggleClass("colgreen");

        //选中的角色
        var roleId = $(".role .role_part.active").find("span").attr("role-id");
        //选中的用户
        var adminId = $(".admin li a.active").attr("admin-id");

        if (roleId) {//角色选中
            //选中增加角色按钮
            if (self.hasClass("colgreen")) {
                $.post({
                    url: "sys/rolepower",
                    data: { roleId: roleId, functionId: self.attr("function-id") },
                    success: function (result) {
                    }
                });
            } else {//删除角色菜单
                $.delete({
                    url: "sys/rolepower/delete?roleId=" + roleId + "&functionId=" + self.attr("function-id"),
                    success: function (result) {

                    }
                });
            }
        }
        else if (adminId) {//角色未选中，用户选中
            //选中增加用户菜单
            if (self.hasClass("colgreen")) {
                $.post({
                    url: "sys/adminpower",
                    data: { adminId: adminId, functionId: self.attr("function-id"), operateType: true },
                    success: function (result) {
                    }
                });
            } else {//删除用户菜单
                $.post({
                    url: "sys/adminpower",
                    data: { adminId: adminId, functionId: self.attr("function-id"), operateType: false },
                    success: function (result) {
                    }
                });
            }
        }
    });

    //菜单功能等级切换
    $("#functionList").delegate(".dropdown-menu li a", "click", function () {
        var $html = $(this).html();
        $(this).parent().parent().prev().html($html);
        var level = $(this).find("span").html().substring(1);
        var functionId = $(this).parent().parent().attr("function-id");
        var isSelected = $(this).parents(".divLevel").prev().children("i").hasClass("colgreen");
        //选中的用户
        var adminId = $(".admin li a.active").attr("admin-id");
        if (adminId && isSelected) {
            //修改level
            $.post({
                url: "sys/adminpower/updateLevel",
                data: { adminId: adminId, functionId: functionId, level: level },
                success: function (result) {
                }
            });
        }

        //选中的角色
        var roleId = $(".role .role_part.active").find("span").attr("role-id");
        if (roleId && isSelected) {
            //修改level
            $.post({
                url: "sys/rolepower/updateLevel",
                data: { roleId: roleId, functionId: functionId, level: level },
                success: function (result) {
                }
            });
        }

    });

    //修改级别
    $("#tbody-erp").delegate("select", "change", function () {
        var level = $(this).val();
        var id = $(this).parent().prev().attr('admin-id');

        $.put({
            url: 'oa/admin/' + id,
            data: { source: "adminInfo", propName: "Level", propValue: level },
            success: function () {
            }
        });
    });
});
function showLevel(level) {
    var html = "<select><option value=''></option>";
    for (var i = 0; i < adminLevelList.length; i++) {
        if (adminLevelList[i]["value"] == level) {
            html += "<option value='" + adminLevelList[i]["value"] + "'selected>" + adminLevelList[i]["key"] + "</option>";
        } else {
            html += "<option value='" + adminLevelList[i]["value"] + "'>" + adminLevelList[i]["key"] + "</option>";
        }
    }
    html += "</select>"
    return html;
}

//获取菜单
var getAdminPower = function (adminId) {
    //获取菜单
    $.get({
        url: "sys/adminpower/get",
        data: { adminId: adminId },
        success: function (result) {
            for (i = 0; i < result.length; i++) {
                $("#functionList .check_box").each(function () {
                    var self = $(this);
                    if (self.attr('function-id') == result[i].functionId) {
                        if (result[i].operateType) {
                            self.addClass("on");
                        }
                        else {
                            self.removeClass("on");
                        }
                        return;
                    }
                });
                $("#functionList .fr i").each(function () {
                    var self = $(this);
                    if (self.attr('function-id') == result[i].functionId) {
                        if (result[i].operateType) {
                            self.addClass("colgreen");
                            var levstr = self.parent().next().find(".level span").html();
                            if (levstr) {
                                var lev = levstr.substring(1);
                                var maxLev = lev > (result[i].level > 0 ? result[i].level : 1) ? lev : (result[i].level > 0 ? result[i].level : 1)
                                self.parent().next().find(".level span").html("V" + maxLev);
                            }
                        } else {
                            self.removeClass("colgreen");
                        }
                        return;
                    }
                });
            }
        }
    });
}


