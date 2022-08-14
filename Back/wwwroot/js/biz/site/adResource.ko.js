//当前选中的列表项
grid.currentItem;

//选中某行时触发
grid.selectItem = function (item) {
    grid.currentItem = item;
};

//类型集合
grid.typeList = ko.observableArray([]);

//加载业务资源类型集合
grid.loadTypeList = function () {
    $.get({
        url: 'site/adresource/GetTypeList',
        success: function (result) { 
            grid.typeList(result);

            //默认选中第一个项
            //grid.selectType(grid.typeList().length > 0 ? grid.typeList()[0].value[0] : null);
            //grid.selectedType(grid.typeList().length > 0 ? grid.typeList()[0].value[0].id : null);
            //填充select选择类型数据集合
            var select = $("#adResourceTypeSelect");
            for (var i = 0; i < result.length; i++) {
                select.append("<optgroup label='--" + result[i].key.name + "--'>")
                for (var j = 0; j < result[i].value.length; j++) {

                    //默认第一条选中
                    if (i == 0 && j == 0) {
                        select.append("<option selected value=" + result[i].value[j].id + ">" + result[i].value[j].name + "</option>")
                    } else {
                        select.append("<option value=" + result[i].value[j].id + ">" + result[i].value[j].name + "</option>")
                    }
                }
                select.append("</optgroup>");
            }
        }
    });
};

//当前选中的类型
grid.selectedType = ko.observable();

//选中类型触发
grid.selectType = function (typeItem) {

    //已选中的直接反选
    if (grid.selectedType() == typeItem.id) {
        grid.selectedType(null);
    } else {
        grid.selectedType(typeItem.id);
    }
    query(1);
};

//当前编辑或新增资源标识Id
grid.currentEditItem = ko.observable();

//新增资源
grid.addAdResource = function () {
    $.openDialog({
        title: '创建新资源',
        jqObj: $('#divAdResource')
    });

    //新增资源标识
    grid.currentEditItem(null);
    $("#adResourceTypeSelect").attr("disabled", false);
    if (grid.selectedType() != null) {
        $("#adResourceTypeSelect").val(grid.selectedType());
    }
    //$("#adResourceTypeId").val(grid.selectedType());
};

//编辑资源
grid.editAdResource = function () {
    var id = $.getSelectId();
    if (!id) {
        $.tips('请先选择资源', $(event.toElement));
        return;
    }
    //填充编辑数据
    $.get({
        url: 'site/AdResource?id=' + id,
        success: function (result) {
            $.openDialog({
                title: '编辑资源',
                jqObj: $('#divAdResource')
            });
            $('#adResourceForm').loadForm(result);

            //编辑资源标识=当前编辑资源
            grid.currentEditItem(grid.currentItem);
            $("#adResourceTypeSelect").val(grid.currentItem.adResourceTypeId);
            $("#AdResourceId").val(id);
        }
    });
};

//保存资源信息
grid.saveAdResource = function () {
    var id = $.getSelectId();
    var attachment = $('div[name="attachment"]').attr('data-upload-value');

    ////检查封面是否选择
    //var coverImage = $("Img[name='image']");
    //if (coverImage.attr("src") == null) {
    //    $.tips('请选择封面图片！', $("[name='image']"));
    //    return;
    //}

    $("#adResourceForm").submitForm({
        type: grid.currentEditItem() ==null ? 'post' : 'put',
        url: 'site/AdResource',
        data: { attachment: attachment, id: id },
        success: function (result) {
            query(1);
            $.closeDialog($('#divAdResource'));
        },
        error: function (resultErr) {
            $.errorMsg(resultErr.responseText);
        }
    });
};

//删除资源
grid.delAdResource = function () {
    var id = $.getSelectId();
    if (!id) {
        $.tips('请先选择资源', $(event.toElement));
        return;
    }
    $.confirm('您确定要删除吗?', function () {
        $.delete({
            url: "site/adResource/" + id,
            success: function () {
                $.success('操作成功');
                query(1);
            },
            error: function (resultErr) {
                $.errorMsg(resultErr.responseText);
            }
        });
    });
};

//项目所属绑定
grid.bindProjectStyle = function (currentProject) {
    if (grid.currentEditItem() != null
        && (grid.currentEditItem().project & currentProject) == currentProject) {
        return "active";
    } else {
        return "";
    }
};