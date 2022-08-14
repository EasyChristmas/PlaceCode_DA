//请求列表的api
var api = "site/video";
grid.tagList = ko.observableArray([]);
$(function () {
    //格式化列表table高度
    $.tableHeight(45, ".ibox-content");
    //加载视频类型
    for (var i = 0; i < videoType.length; i++) {
        $("#type,#videoType").append("<option value='" + videoType[i]["value"] + "'>" + videoType[i]["key"] + "</option>");
    }
    //加载产品
    $.Data.bindOnlineProduct({ selId: 'productId' });
    $.Data.bindOnlineProduct({ selId: 'selProduct' }); 

    //下拉框切换
    $("#videoType").change(function () {
        var $this = $("#videoType");
        if ($this.val() == 2 || $this.val() == 5 || $this.val() == 6
            || $this.val() == 7 || $this.val() == 8 || $this.val() == 9) {
            $("#lbImage").removeClass("colred").addClass("colred");
            $("#lbStartTime").removeClass("colred").addClass("colred");
            $("#lbGuest").removeClass("colred").addClass("colred");
        } else {
            $("#lbImage").removeClass("colred");
            $("#lbStartTime").removeClass("colred");
            $("#lbGuest").removeClass("colred");
        }
    });

    var tagData = [];
    $.selectTag({
        elem: $('#addTag'),
        loadData: function () {
            return tagData;
        },
        addData: function (name) {
            for (i = 0; i < tagData.length; i++) {
                if (tagData[i].name == name) {
                    $.tips("标签已存在", $('#addTag'), 1000);
                    return;
                }
            }

            var arr = grid.tagList();
            arr.push({ id: tagData.length + 1, name: name, isSystem: false, isEdit: true, isDetele: false, adminId: $("#currentUserId").val() });
            grid.tagList(arr);
            return (tagData.length + 1);
        },
        selectedLine: function (selectedId, isSelected, selArr) {
            grid.tagList(selArr);
            return selectedId;
        }
    });
    //新建视频
    $("#createVideo").on("click", function () {
        $.openDialog({
            title: '创建新项目',
            jqObj: $('#video')
        });
        //给弹框里的视频类型付值
        $("#videoType").val($("#type").val());
        $("#txtFile").val("#");
        //1200-700 = 500
        Math.random() * 500
        var num = Math.random() * 500 + 700;
        num = parseInt(num, 10);
        $("input[name='count']").val(num);
        $("#divLiveUrl").hide();

        grid.tagList([]);

        $.get({
            url: 'site/video/getTag',
            async: false,
            success: function (res) {
                tagData = res;
                for (i = 0; i < tagData.length; i++) {
                    for (j = 0; j < grid.tagList().length; j++) {
                        if (tagData[i].name == grid.tagList()[j].name) {
                            tagData[i].isSelected = true;
                            break;
                        }
                    }
                }
            }
        });
    });

    //编辑视频
    $(".ibox-content").delegate(".edit", "click", function () {
        var id = $(this).attr("data-id");
        $("#divLiveUrl").hide();

        if (id > 0) {
            $.get({
                url: "site/video/" + id,
                async: false,
                success: function (data) {
                    $.openDialog({
                        title: '编辑视频',
                        jqObj: $('#video')
                    });
                    $("form").loadForm(data);
                    $("#videoType").change();
                    //编辑时若是直播则生成直播url，并显示
                    if (data.type == 5 || data.type == 8 || data.type == 12) {
                        $.get({
                            url: "/site/video/getliveurl?id=" + id,
                            success: function (result) {
                                $("#lb_Url").html(result.data);
                                $("#divLiveUrl").show();
                            },
                            error: function (error) {
                                console.log(error.responseText);
                            }
                        });
                    }
                    grid.tagList(data.tagList);

                    $.get({
                        url: 'site/video/getTag',
                        async: false,
                        success: function (res) {
                            tagData = res;
                            for (i = 0; i < tagData.length; i++) {
                                for (j = 0; j < grid.tagList().length; j++) {
                                    if (tagData[i].name == grid.tagList()[j].name) {
                                        tagData[i].isSelected = true;
                                        break;
                                    }
                                }
                            }
                        }
                    });
                }
            });
        }
    });

    //删除视频
    $(".ibox-content").delegate(".trash", "click", function () {
        var id = $(this).attr("data-id");
        $.confirm('确定删除吗？', function () {
            $.delete({
                url: "site/video/" + id,
                success: function (result) {
                    $.success("删除成功！");
                    query();
                }
            });
        });
    });

    //保存
    $("#btnAdd").click(function () {
        var videoType = $("#videoType").val();
        //视频类型为 产品路演，直播，财富讲坛则验证以下内容
        if (videoType == 2 || videoType == 5 || videoType == 6
            || videoType == 7 || videoType == 8 || videoType == 9) {
            //标题
            var title = $("#txtTitle");
            if (title.val().length == 0) {
                $.tips('此处内容为必填项', title);
                return false;
            }
            //上传图片
            var image = $("img[name='image']");
            if (image.attr("data-src") == undefined) {
                var inpFile = $("input[type='file']");
                $.tips('请先上传图片', inpFile);
                return false;
            }
            //开始时间
            var startTime = $("#txtStartTime");
            if (startTime.val().length == 0) {
                $.tips('此处内容为必填项', startTime);
                return false;
            }
            //演讲嘉宾
            var guest = $("#txtGuest");
            if (guest.val().length == 0) {
                $.tips('此处内容为必填项', guest);
                return false;
            }
        }
        //标签
        var tag = '';
        $("#videotag").find("li.tag_wrap span").each(function (index, item) {
            tag += ("," + $(this).html());
        });
        if (tag.startsWith(',')) {
            tag = tag.substring(1);
        }

        $("#adForm").submitForm({
            type: 'post',
            url: 'site/video',
            data: { Project: $("#selProject").val(), attachment: $('div[name="attachment"]').attr('data-upload-value'), tag: tag },
            success: function (result) {
                $('#video').modal('hide');
                $("form").resetForm();
                query();
            },
            error: function (resultErr) {
                $.errorMsg(resultErr.responseText);
            }
        });
    });

    //操作文档
    $("#action-document").on("click", function () {
        $.openWin({
            title: "操作手册",
            url: "/docs/site/video.html",
            width: "1000",
            height: "600"
        });
    });

    //选择新闻特性效果
    $(".quality a").click(function () {
        $(this).toggleClass("active");
    });

    //移到标签上显示删除按钮
    $(".userTag").delegate("li", "mouseover", function () {
        $(this).find("a.tag_remove").show();
    });
    //删除标签
    $("#videotag .userTag").delegate("li a", "click", function () {
        var tag = $(this).prev('span').text();
        for (i = 0; i < grid.tagList().length; i++) {
            if (grid.tagList()[i].name == tag) {
                grid.tagList(grid.tagList().remove(i));
                break;
            }
        }
        for (i = 0; i < tagData.length; i++) {
            if (tagData[i].name == tag) {
                tagData[i].isSelected = false;
                break;
            }
        }
    });
});