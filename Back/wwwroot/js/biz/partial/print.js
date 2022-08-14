$(function () {
    var id = $("#contractId").val();
    $.get({
        url: 'trade/contract/' + id,
        success: function (data) {
            //绑定收件人信息
            ko.applyBindings(data);
        }
    });
});