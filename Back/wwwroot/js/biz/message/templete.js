$(function () {
    $.tableHeightTwo(120, ".div-table-content");
    $("#btnTempleteAdd").click(function () {
        editOrg(false);
    });

    function editOrg(isEdit) {

        var $content = $($('#divTempleteEdit').html()).attr('id', 'orgEditForm');

        if (isEdit) {
            $.openDiv({
                title: '编辑模版',
                content: function (dialogRef) {
                    ($content.find('#btnTempleteSave')).on('click', { dialogRef: dialogRef }, function (event) {
                        btnOrgSave(id, event);
                    });
                    return $content;
                }
            });
        }
        else {
            $.openDiv({
                title: '新增模版',
                content: function (dialogRef) {
                    ($content.find('#btnOrgSave')).on('click', { dialogRef: dialogRef }, function (event) {
                        btnOrgSave(0, event);
                    });
                    return $content;
                }
            });
        }
    }

    $("#btnMessageAdd").click(function () {
        editOrg2(false);
    });

    function editOrg2(isEdit) {

        var $content = $($('#divMessageEdit').html()).attr('id', 'orgEditForm');

        

        $content.find("a[data-toggle='tab']").each(function () {
            console.log(this);
        });

        $.openDiv({
            title: '发送消息',
            content: function (dialogRef) {
                ($content.find('#btnMessageSave')).on('click', { dialogRef: dialogRef }, function (event) {
                    btnOrgSave(0, event);
                });
                return $content;
            }
        });

        //延迟执行 等待弹框出来之后再执行
        setTimeout(function () {
            //$content.find("a[data-toggle='tab']").each(function () {
            //    console.log(this);
            //});

            $content.find("a[data-toggle='tab']").click(function (e) {
                console.log(this);
                e.preventDefault()
                $(this).tab('show')

            });


        }, 160);

    }

    //发送方式切换
    $("#sendMode a").click(function () {
        $(this).addClass("colgreen").siblings().removeClass("colgreen");
        if ($(this).hasClass("messages")) {
            console.log("ss");
            $("#sendMode input").css('display', 'inline-block');
        } else {
            $("#sendMode input").css('display', 'none');
        }
    });
});

$("#myTab").delegate("a[data-toggle='tab']", "click", function () {
    alert(1);
});