$(function () {

    //服务经理
    $.Data.bindAdmin({ selId: "selAdminId", onlyUnderlings: true });
    $.Data.bindAdmin({ selId: "zkSelAdminId", onlyUnderlings: true });

    //设置datetimepicker默认时间
    //放在viewModel之前，防止setDate触发ko绑定的changeDate事件
    $("input[name='startOrderTime']").datepicker("setDate", $.initDate().startTime);
    $("input[name='endOrderTime']").datepicker("setDate", $.initDate().endTime);
    $("input[name='startUserTrackingDate']").datepicker("setDate", $.initDate().startTime);
    $("input[name='endUserTrackingDate']").datepicker("setDate", $.initDate().endTime);
    var vm = new PlatformConsoleViewModel();
    vm.init();
    ko.applyBindings(vm);

    //视频播放关闭窗口，清除播放插件部分
    $("#videoPlay").on('hide.bs.modal', function () {
        $("#a1").empty();
    });

    $.tableHeight(90); 

    //渲染底部二维码 
    
});
