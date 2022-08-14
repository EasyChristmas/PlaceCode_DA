$(function () {
    var id = $("#id").val();
    $.get({
        url: 'mall/order/' + id,
        success: function (data) {
            //绑定收件人信息
            ko.applyBindings(data);
        }
    });
});