$(function () {
    var viewModel = new ToolsViewModel();
    ko.applyBindings(viewModel, document.getElementById("toolsContent"));

    //手机号归属地
    $("#toolMobileForm input[name='mobile']").keydown(function () {
        if (event.keyCode == 13) {
            viewModel.getMobileAddress();
        }
    });
});