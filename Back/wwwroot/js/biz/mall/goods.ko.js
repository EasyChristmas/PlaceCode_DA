
//新增礼品
grid.addGoods = function () {
    $("#addModel form").resetForm();
    //清空checkbox选中
    $("#addModel form input[type='checkbox']").parent("div").removeClass("checked");
    $.openDialog({
        title: '添加礼品',
        jqObj: $('#addModel'),
        width: '980'
    });
    $("#coupon").hide();
    $('#addModel').attr('data-edit', 'false');
};
//编辑礼品
grid.editGoods = function () {
    var id = $(this)[0].id;
    $.get({
        url: 'mall/goods/' + id,
        success: function (result) {
            $.openDialog({
                title: '编辑礼品',
                jqObj: $('#addModel'),
                width: '980'
            });
            result.coupon = result.extend;
            $('#addModel form').loadForm(result);
            $('#addModel').attr('data-id', id);
            $('#addModel').attr('data-edit', 'true');
            //返现券数量处理
            var couponIds = result.coupon.split(',');
            for (var i = 0; i < couponIds.length; i++) {
                $("#addModel form input[name='coupon']").each(function (index, item) {
                    var val = $(item).val();
                    if (val == couponIds[i]) {
                        var ele = $(item).parents("td").next().find("input[type='text']");
                        var num = isNaN(parseInt(ele.val())) ? 0 : parseInt(ele.val());
                        ele.val(num + 1);
                    }
                });
            }
            if (result.type == "佣金券") $("#coupon").show();
            else $("#coupon").hide();
        }
    })
};
//保存礼品
grid.saveGoods = function () {
    var jqForm = $("#addModel form");
    var id = $('#addModel').attr('data-id');
    var attachment = $('div[name="attachment"]').attr('data-upload-value');
    var $edit = $('#addModel').attr('data-edit') == 'true';
    var coupon = "";

    $("#addModel form input[name='coupon']").each(function () {
        if ($(this).parent("div").hasClass("checked")) {
            var val = $(this).parents("td").next().find("input[type='text']").val();
            var num = isNaN(parseInt(val)) ? 1 : parseInt(val);
            for (var i = 0; i < num; i++) {
                if (coupon == "") {
                    coupon += $(this).val();
                }
                else coupon += "," + $(this).val();
            }
        }
    });

    //商品内容详情(富文本)
    var contentAttachment = $('div[name="contentAttachment"]').attr('data-upload-value');
    var data = $edit ? {
        id: id, attachment: attachment, extend: coupon, contentAttachment: contentAttachment
    } : {
            attachment: attachment, extend: coupon, contentAttachment: contentAttachment
    };
    jqForm.submitForm({
        type: $edit ? 'put' : 'post',
        url: 'mall/goods',
        data: data,
        success: function (result) {
            jqForm.resetForm();
            $.closeDialog($('#addModel'));
            query();
        },
        error: function (resultErr) {
            $.errorMsg(resultErr.responseText);
        }
    });
};
//设置可见状态
grid.setStatus = function () {
    var status = $(this)[0].status;
    var id = $(this)[0].id;
    console.log(id);
    if (status == 0) {
        $.confirm('确定显示吗？', function () {
            setStatusFunction(id, status);
        })
    } else if (status == 1) {
        $.confirm('确定隐藏吗？', function () {
            setStatusFunction(id, status);
        })
    }
};
//封装可见状态
var setStatusFunction = function (id, status) {
    $.put({
        url: 'mall/goods/updatestatus/' + id,
        data: { status: status },
        success: function () {
            query();
        },
        error: function (resultErr) {
            $.errorMsg(resultErr.responseText);
        }
    })
}
//删除礼品
grid.trashGoods = function () {
    var id = $(this)[0].id;
    $.confirm('确定删除吗？', function () {
        $.delete({
            url: "mall/goods/" + id,
            success: function () {
                $.success('操作成功');
                query();
            },
            error: function (resultErr) {
                $.errorMsg(resultErr.responseText);
            }
        });
    })
};
//类型切换
grid.changeType = function (element) {
    var val = $(element).find("option:selected").val();
    if (val == "佣金券") {
        $("#coupon").show();
    }
    else {
        $("#coupon").hide();
    }
};
