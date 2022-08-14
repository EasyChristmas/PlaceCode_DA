

//产品属性列表页视图控制模型
function ProductPropertyViewModel() {

    var self = this;

    //列表数据
    self.data = ko.observableArray([]);

    self.init = function () {

        $("#addProperty").click(function () {
            self.addProperty();
        });

        $("#btnSaveProperty").click(function () {
            self.saveProperty();
        });

    }

    //添加属性
    self.addProperty = function () {
        var dialog = $('#dialog_AddProperty');
        $.openDialog({
            title: '添加属性',
            jqObj: dialog
        });
    }

    //保存属性
    self.saveProperty = function () {
        if ($("#addPropertyForm").validate()) {
            var codeList = [];
            $("#tagList").children(".video_tag").each(function (index, item) {
                codeList.push($(item).text());
            });

            $("#addPropertyForm").submitForm({
                type: 'post',
                url: "productProperty",
                data: {
                    codeList: codeList
                },
                beforeSend: function () {
                    $("#btnSaveProperty").attr("disabled", true);
                },
                success: function (result) {
                    $("#btnSaveProperty").removeAttr("disabled");
                    $.closeDialog($('#dialog_AddProperty'));
                    query(1);
                },
                error: function (resultErr) {
                    $("#btnSaveProperty").removeAttr("disabled");
                    $.errorMsg(resultErr.responseText);
                }
            });
        }
    }
}