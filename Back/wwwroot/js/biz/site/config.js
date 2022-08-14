$(function () {

    $.tableHeight(30, ".ibox-content");

    $.get({
        url: 'site/config',
        success: function (result) {
            $('#webConfigForm').loadForm(result);
        }
    });

    //记录修改前的值
    var updVal = '';
    //修改文本框、下拉框 
    $("[data-prop='byBlur']").each(function () {
        var $this = $(this);
        //光标获得事件
        $this.focus(function () {
            updVal = updVal.length > 0 ? updVal : $this.val();
        });
        //光标失去事件
        $this.blur(function () {
            //清空格
            $this.val($this.val().trim());

            var propName = $this.attr('name');
            var propValue = $this.val();

            if ($.validate()) {
                //要修改的值与修改前的值相等，则不处理
                if (propValue == updVal) {
                    updVal = ''; //不予处理，清空修改前的值
                    return;
                }
                propName = propName.substr(0, 1).toUpperCase() + propName.substr(1);

                $.put({
                    url: 'site/config/updateIntro',
                    data: { propName: propName, propValue: propValue.trim() },
                    success: function () {
                        updVal = ''; //修改成功，清空修改前的值
                    },
                    error: function (resultErr) {
                        $.tips(resultErr.responseText, $this);
                        $this.focus();
                        return;
                    }
                });
            }
        });
    });
});