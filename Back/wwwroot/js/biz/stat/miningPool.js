$(function () {
    //格式化列表table高度
    $.tableHeight(30, ".ibox-content");

    //矿池总算力实体
    var totalMiningPoolPowerModel = new TotalMiningPoolPowerViewModel();
    ko.applyBindings(totalMiningPoolPowerModel, document.getElementById("totalMiningPoolPower"));
    //算力
    totalMiningPoolPowerModel.loadMPOW();
    //质押
    //totalMiningPoolPowerModel.loadGPOS();

    //MPOW收益实体
    var miningPoolIncomeViewModel = new MiningPoolIncomeViewModel();
    ko.applyBindings(miningPoolIncomeViewModel, document.getElementById("totalMiningPoolIncome"));
    miningPoolIncomeViewModel.loadMPOWIncomeByYear();
   
    //GPOS收益实体
    //var miningPoolGPOSIncomeViewModel = new MiningPoolIncomeViewModel();
    //ko.applyBindings(miningPoolGPOSIncomeViewModel, document.getElementById("totalMiningPoolGPOSIncome"));
    //miningPoolGPOSIncomeViewModel.loadGPOSIncomeByYear();

    //MPOW收益返回到年
    $("#btnMPOWYearIncome").on("click", function () {
        $("#containerMPOWMonthIncome,#containerMPOWDayIncome").hide();
        $("#containerMPOWYearIncome").show();
    });
    //MPOW收益返回到月
    $("#btnMPOWMonthIncome").on("click", function () {
        $("#containerMPOWYearIncome,#containerMPOWDayIncome").hide();
        $("#containerMPOWMonthIncome").show();
    });

    //GPOS收益返回到年
    $("#btnGPOSYearIncome").on("click", function () {
        $("#containerGPOSMonthIncome,#containerGPOSDayIncome").hide();
        $("#containerGPOSYearIncome").show();
    });
    //MPOW收益返回到月
    $("#btnGPOSMonthIncome").on("click", function () {
        $("#containerGPOSYearIncome,#containerGPOSDayIncome").hide();
        $("#containerGPOSMonthIncome").show();
    });
});



var showMonth = function (value) {
    return parseInt(value.substring(4, 6));
};
var showDay = function (value) {
    return parseInt(value.substring(6, 8));
};
