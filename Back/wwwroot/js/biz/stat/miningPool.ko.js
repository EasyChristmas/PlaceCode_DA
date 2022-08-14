//矿池总算力实体
var TotalMiningPoolPowerViewModel = function () {
    var self = this;
    self.onlineMiningPool = ko.observableArray([]);
    self.clickTotalYearVal = ko.observable(null);
    self.clickTotalMonthVal = ko.observable(null);
    //加载MPOW数据
    self.loadMPOW = function () {
        $.get({
            url: "Stat/GetMiningPoolPower",
            data: {
                projectId: 1
            },
            success: function (result) {
                var poolNameList = [];
                var poolPowerList = [];
                for (var i = 0; i < result.length; i++) {
                    poolNameList.push(result[i].poolName);
                    poolPowerList.push(result[i].power);
                }

                self.onlineMiningPool(result);
                //柱形报表
                $("#containerMPOW").bindBar({
                    type: "column",
                    ytitle: "算力(TiB)",
                    xtitle: "矿池算力",
                    xdata: poolNameList,
                    ydata: poolPowerList

                }, function (ele) {
                    var poolName = ele.point.category;
                    var onlineMiningPools = self.onlineMiningPool();
                    for (var i = 0; i < onlineMiningPools.length; i++) {
                        if (onlineMiningPools[i].poolName == poolName) {
                            self.loadMPOWIncomeByMonth(onlineMiningPools[i])
                            break;
                        }
                    }
                });
            },
            error: function (resultErr) {
                $.errorMsg(resultErr.responseText);
            }
        });
    };
    //加载GPOS数据
    self.loadGPOS = function () {
        $.get({
            url: "Stat/GetMiningPoolPower",
            data: {
                projectId: 5
            },
            success: function (result) {
                var poolNameList = [];
                var getCoinsList = [];
                for (var i = 0; i < result.length; i++) {
                    poolNameList.push(result[i].poolName);
                    getCoinsList.push(result[i].power);
                }
                //柱形报表
                $("#containerGPOS").bindBar({
                    type: "column",
                    ytitle: "质押币(个数)",
                    xtitle: "质押币",
                    xdata: poolNameList,
                    ydata: getCoinsList

                }, function (yearObj) {

                });
            },
            error: function (resultErr) {
                $.errorMsg(resultErr.responseText);
            }
        });
    };
}

//矿收益实体
var MiningPoolIncomeViewModel = function () {
    var self = this;
    self.miningPoolData = ko.observableArray([]);
    self.yearIncomeData = ko.observableArray([]);
    self.monthIncomeData = ko.observableArray([]);
    self.dayIncomeData = ko.observableArray([]);
    //加载MPOW年收益数据
    self.loadMPOWIncomeByYear = function () {
        $.get({
            url: "Stat/GetMiningPoolIncomeByYear",
            data: {
                projectId: 1
            },
            success: function (result) {
                self.miningPoolData(result.miningPoolList);
                self.yearIncomeData(result.data);

                //柱形报表
                $("#containerMPOWYearIncome").bindBar({
                    type: "column",
                    ytitle: "矿池收入(币数)",
                    xtitle: "",
                    tableId: "MPOWYearIncomeDataTable"
                }, function (ele) {
                    $("#btnTotalIncome").show();
                    var year = ele.point.name.replace("年", "");

                    self.monthIncomeData([]);
                    self.loadMPOWIncomeByMonth({ year: year });
                });
            }
        });
    };
    //加载MPOW月收益
    self.loadMPOWIncomeByMonth = function (data) {
        data.projectId = 1;
        $.get({
            url: "Stat/GetMiningPoolIncomeByMonth",
            data: data,
            success: function (result) {
                self.miningPoolData(result.miningPoolList);
                self.monthIncomeData(result.data);


                $("#containerMPOWYearIncome").hide();
                $("#containerMPOWMonthIncome").show();

                $("#containerMPOWMonthIncome").bindBar({
                    type: "line",
                    ytitle: data.year + "年每月收益币数(个)",
                    tableId: "MPOWMonthIncomeDataTable"
                }, function (ele) {
                    var month = ele.point.name.replace("月", "");
                    data.month = month;

                    self.dayIncomeData([]);
                    self.loadMPOWIncomeByDay(data);
                });
            }
        });
    };
    //加载MPOW日收益
    self.loadMPOWIncomeByDay = function (data) {
        data.projectId = 1;
        $.get({
            url: "Stat/GetMiningPoolIncomeByDay",
            data: data,
            success: function (result) {
                self.miningPoolData(result.miningPoolList);
                self.dayIncomeData(result.data);

                $("#containerMPOWYearIncome,#containerMPOWMonthIncome").hide();
                $("#containerMPOWDayIncome").show();
                $("#containerMPOWDayIncome").bindBar({
                    type: "line",
                    ytitle: data.year + "年" + data.month + "月收益币数(个)",
                    tableId: "MPOWDayIncomeDataTable"
                }, function (ele) {
                });
            }
        });
    };

    //加载GPOS年收益数据
    self.loadGPOSIncomeByYear = function () {
        $.get({
            url: "Stat/GetMiningPoolIncomeByYear",
            data: {
                projectId: 5
            },
            success: function (result) {
                self.miningPoolData(result.miningPoolList);
                self.yearIncomeData(result.data);

                //柱形报表
                $("#containerGPOSYearIncome").bindBar({
                    type: "column",
                    ytitle: "矿池收入(币数)",
                    xtitle: "",
                    tableId: "GPOSYearIncomeDataTable"
                }, function (ele) {
                    $("#btnGPOSTotalIncome").show();
                    var year = ele.point.name.replace("年", "");

                    self.monthIncomeData([]);
                    self.loadGPOSIncomeByMonth({ year: year });
                });
            }
        });
    };
    //加载GPOS月收益
    self.loadGPOSIncomeByMonth = function (data) {
        data.projectId = 5;
        $.get({
            url: "Stat/GetMiningPoolIncomeByMonth",
            data: data,
            success: function (result) {
                self.miningPoolData(result.miningPoolList);
                self.monthIncomeData(result.data);


                $("#containerGPOSYearIncome").hide();
                $("#containerGPOSMonthIncome").show();

                $("#containerGPOSMonthIncome").bindBar({
                    type: "line",
                    ytitle: data.year + "年每月收益币数(个)",
                    tableId: "GPOSMonthIncomeDataTable"
                }, function (ele) {
                    var month = ele.point.name.replace("月", "");
                    data.month = month;

                    self.dayIncomeData([]);
                    self.loadGPOSIncomeByDay(data);
                });
            }
        });
    };
    //加载GPOS日收益
    self.loadGPOSIncomeByDay = function (data) {
        data.projectId = 5;
        $.get({
            url: "Stat/GetMiningPoolIncomeByDay",
            data: data,
            success: function (result) {
                self.miningPoolData(result.miningPoolList);
                self.dayIncomeData(result.data);

                $("#containerGPOSYearIncome,#containerGPOSMonthIncome").hide();
                $("#containerGPOSDayIncome").show();
                $("#containerGPOSDayIncome").bindBar({
                    type: "line",
                    ytitle: data.year + "年" + data.month + "月收益币数(个)",
                    tableId: "GPOSDayIncomeDataTable"
                }, function (ele) {
                });
            }
        });
    };
};
