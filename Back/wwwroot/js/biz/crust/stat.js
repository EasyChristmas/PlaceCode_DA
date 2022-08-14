
var ViewModel = function () {
    var self = this;

    self.totalUser = ko.observable(0);
    self.weeksAddTotalUser = ko.observable(0);
    self.todayAddTotalUser = ko.observable(0);

    self.premiumUser = ko.observable(0);
    self.weeksAddPremiumUser = ko.observable(0);
    self.todayAddPremiumUser = ko.observable(0);

    self.depositPool = ko.observable(0);
    self.weeksAddDepositPool = ko.observable(0);
    self.todayAddDepositPool = ko.observable(0);

    self.rewardsDistributed = ko.observable(0);
    self.remainingRewards = ko.observable(0);
};

var vm = new ViewModel();

$(function () {

    ko.applyBindings(vm, document.getElementById("stat"));

    $.get({
        url: 'crust/getStat',
        success: function (result) {
            vm.totalUser($.Data.outputmoney(result.totalUser || 0));
            vm.weeksAddTotalUser(result.weeksAddTotalUser || 0);
            vm.todayAddTotalUser(result.todayAddTotalUser || 0);

            vm.premiumUser($.Data.outputmoney(result.premiumUser || 0));
            vm.weeksAddPremiumUser(result.weeksAddPremiumUser || 0);
            vm.todayAddPremiumUser(result.todayAddPremiumUser || 0);

            vm.depositPool($.Data.outputmoney(result.depositPool || 0));
            vm.weeksAddDepositPool(result.weeksAddDepositPool || 0);
            vm.todayAddDepositPool(result.todayAddDepositPool || 0);

            vm.rewardsDistributed($.Data.outputmoney(result.rewardsDistributed || 0));
            vm.remainingRewards($.Data.outputmoney(result.remainingRewards || 0));
        }
    });


    var statTotalUserViewModel = new StatTotalUserViewModel();
    ko.applyBindings(statTotalUserViewModel, document.getElementById("totalUser"));
    statTotalUserViewModel.loadStatByMonth();

    //返回到周
    $("#btnWeekTotalUser").on("click", function () {
        statTotalUserViewModel.loadStatByWeek();
        $("#containerMonthTotalUser,#containerDayTotalUser").hide();
        $("#containerWeekTotalUser").show();
    });
    //返回到月
    $("#btnMonthTotalUser").on("click", function () {
        statTotalUserViewModel.loadStatByMonth();
        $("#containerWeekTotalUser,#containerDayTotalUser").hide();
        $("#containerMonthTotalUser").show();
    });
});


function show(val) {
    if (val == 0) return val;
    if (val > 0) return "+" + $.Data.outputmoney(val);
    else return "-" + $.Data.outputmoney(val);
}

function showClass(val) {
    if (val == 0) return "";
    if (val > 0) return "stats__value--positive";
    else return "stats__value--negative";
}


var showMonth = function (value) {
    return parseInt(value.substring(4, 6));
};
var showDay = function (value) {
    return parseInt(value.substring(6, 8));
};

var showWeek = function (value) {
    return parseInt(value.substring(0, 4)) + "年第" + parseInt(value.substring(4, 6)) + "周";
}