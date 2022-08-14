var ToolsViewModel = function () {
    var self = this;

    //手机号地址查询
    self.getMobileAddress = function () {
        if ($("#toolMobileForm").validate()) {
            var mobile= $("#toolMobileForm input[name='mobile']").val();
            $.get({
                url: 'sys/smalltools/getmobileaddress',
                async: false,
                data: {
                    mobile: mobile
                },
                success: function (res) {
                    var text = "手机号码\"" + mobile + "\"  " + res.data.prov + "  " + res.data.city + "  " + res.data.name;
                    $("#mobileAddress").text(text);
                },
                error: function (error) {
                    $.errorMsg(error.responseText);
                }
            });
        }
    };
};