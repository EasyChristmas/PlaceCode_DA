$(function () {
    //格式化列表table高度
    $.tableHeight(45, ".ibox-content");
    //ko绑定
    var vm = new ViewModel();
    ko.applyBindings(vm);
    vm.loadAdType();//加载广告类型 

    for (i = 0; i < vm.adTypeList().length; i++) {
        //console.log(vm.adTypeList()[i].name);
        $("#name").append("<option value='" + vm.adTypeList()[i].name + "'>" + vm.adTypeList()[i].name + "</option>")
    }


    //初始化排序 
    var dragInit = function () {
        $(".sortable").sortable({
            placeholder: "ui-state-highlight",
            cancel: ".nosort"
        });
    };
    dragInit();
    $(".ibox-content").delegate(".ad_content .sortable", "sortupdate", function (event, ui) {
        var list = [];
        $(this).find("li").each(function (index, item) {
            $(item).attr("data-sort", index + 1);
            list.push($(item).attr("data-id"));
        });

        $.post({
            url: 'site/adType/Sort',
            data: { adIdList: list },
            success: function (result) {
            },
            error: function () {
                vm.loadAdType();
                dragInit();
            }
        });
    });
    //TODO: 表单提交--rr
    //保存广告类型
    var savePart = function (id) {
        if ($("#adTypeForm").validate()) {
            $.post({
                url: 'site/adtype',
                data: $("#adTypeForm").toJson(),
                async: false,
                success: function (result) {
                    $("#addType").attr("type-id", 0).modal('hide');
                    $("#adTypeForm").resetForm();
                    vm.loadAdType();
                    dragInit();
                }
            })
        }
    };

    //提交广告类型
    $("#btnaddType").click(function () {
        savePart($("#addType").attr("type-id"));
    });

    //编辑广告类型
    $(".ibox-content")
        .delegate(".ad_title_fl .icon-edit",
            "click",
            function () {
                var id = $(this).parent("a").attr("type-id");
                $("#addType").attr("type-id", id);
                var type = $(this).parent("a").attr("type");
                if (id > 0) {
                    $.get({
                        url: "site/adtype/" + id,
                        success: function (result) {
                            $("#adTypeForm").loadForm(result[0]);
                            dragInit();
                        }
                    });
                }
            });

    //删除广告类型
    $(".ibox-content")
        .delegate(".ad_title_fl .icon-trash",
            "click",
            function () {
                var id = $(this).parent("a").attr("type-id");
                var num = $(this).parents(".ad_title").next().find("li").length;
                if (num > 1) {
                    $.alert("先删除项目，才能删除类型");
                    return;
                } else {
                    $.confirm("确定删除吗？",
                        function () {
                            $.delete({
                                url: "site/adtype/" + id,
                                success: function (result) {
                                    $.success("操作成功！")
                                    vm.loadAdType();
                                    dragInit();
                                }
                            });
                        });
                }
            });

    //给弹框赋值typeid
    $(".ibox-content").delegate(".ad_content .add_li_div.add a", "click", function () {
        var typeId = $(this).attr("type-id");
        $("#addAdList").attr("type-id", typeId);
    });

    //保存广告
    var saveAd = function (id) {
        var data = $("#adForm").toJson();
        data.adTypeId = $("#addAdList").attr("type-id");
        var startTime = $("input[name='startTime']").val();
        var endTime = $("input[name='endTime']").val(); 
        if ($("#adForm").validate()) {
            if (endTime > startTime) {
                $.post({
                    url: 'site/ad',
                    data: data,
                    async: false,
                    success: function (result) {
                        $('#addAdList').modal('hide');
                        $("#adForm").resetForm();
                        //closeLayer();
                        vm.loadAdType();
                        dragInit();
                    }
                })
            } else {
                $.tips('结束时间要大于开始时间', $("input[name='endTime']"));
            }
        }
    };

    //提交广告
    $("#btnaddAd").click(function () {
        saveAd($("#addAdList").attr("ad-id"));
    });

    //编辑广告
    $(".ibox-content").delegate(".ad_content .edit", "click", function () {
        var id = $(this).attr("ad-id");
        $("#addAdList").attr("ad-id", id);
        var typeId = $(this).attr("type-id");
        $("#addAdList").attr("type-id", typeId);
        if (id > 0) {
            $.get({
                url: "site/ad/" + id,
                success: function (result) {
                    $("#adForm").loadForm(result[0]);
                    //$("select[name='mapType']").val($("select[name='mapType'] option[selected]").html())
                    $(".example-image-link").show();
                    $(".example-image-link a").attr("href", $.getFileUrl(result[0].file));
                    $(".example-image-link a img").attr("src", $.getFileUrl(result[0].file));
                    dragInit();
                }
            });
        };

    });

    //删除广告
    $(".ibox-content").delegate(".ad_content .trash", "click", function () {
        var id = $(this).attr("ad-id");
        $.confirm('确定删除吗？', function () {
            $.delete({
                url: "site/ad/" + id,
                success: function (result) {
                    $.success("操作成功！")
                    vm.loadAdType();
                    dragInit();
                }
            });
        });
    })

    //新增广告
    $(".ibox-content").delegate(".ad_content .add_li_div.add a", "click", function () {
        $("#addAdList").attr("ad-id", "0");
        var typeId = $("#addAdList").attr("type-id");
        clearData();
    });

    //新增广告类型
    $("#adType")
        .click(function () {
            $("#addType").attr("type-id", "0");
            clearData();
        });

    //清空数据 
    var clearData = function () {
        $("form").resetForm();
        $("div.modal-backdrop.fade.in").remove();
        $("#addType").attr("type-id", 0);
    }

    //关闭层
    var closeLayer = function () {
        //隐藏页面
        $("#addType").removeClass("in").css("display", "none");
        $("#addAdList").removeClass("in").css("display", "none");
        clearData();
    };

    //关闭弹出层
    $(".close,.btn-close,.modal.fade.in").click(function () {
        closeLayer();
        dragInit();
    });

    //搜索查询
    var querySearch = function () {
        vm.loadAdType();
        dragInit();
    }

    //查询 
    $("body").keyup(function (event) {
        if (event.keyCode == 13) {
            querySearch();
        }
    });
    $(".ibox-search select").change(querySearch);
    $(".ibox-search input[type='text']").blur(querySearch);

    ////图片延迟加载
    //$("div.lazy").lazyload({
    //    container: ".ibox-content",
    //    data_attribute: "bind"
    //});

    //操作文档
    $("#action-document").on("click", function () {
        $.openWin({
            title: "操作手册",
            url: "/docs/site/ad.html",
            width: "1000",
            height: "600"
        });
    });
});