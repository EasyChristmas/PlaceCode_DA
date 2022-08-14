//新增会员实体
var ViewModel = function () {
    var self = this;
    self.yearData = ko.observable(null);
    self.monthData = ko.observableArray([]);
    self.dayData = ko.observableArray([]);
    self.clickYearVal = ko.observable(null);
    self.clickMonthVal = ko.observable(null);
    //加载数据
    self.loadData = function () {
        $.get({
            url: "Stat/UserStat/getUserStatByYear",
            success: function (result) { 
                var lastYear = result.strYearList[result.strYearList.length - 1];
                self.yearData(result.strYearList);//最新一年
                //console.log(result);
                //线形报表
                var year = function (yearObj) { 
                    $("#btnAdd").show();
                    //console.log(yearObj);
                    var yearVal = yearObj.replace("年", "");
                    self.clickYearVal(yearVal);
                    //console.log(self.clickYearVal());
                    self.monthData([]);
                    $.get({
                        url: "Stat/UserStat/getUserStatByMonth",
                        success: function (month) {
                            for (var i = 1; i <= 12; i++) {
                                self.monthData.push({ key: i, value: month[i] });
                            }
                            $("#container").hide();
                            $("#containerMonth").show();
                            $("#containerMonth").bindBar({
                                type: "line",
                                tableId: "datatable",
                                ytitle: "每月新增人数(人)"
                            }, function (monthObj) {
                                //console.log(monthObj);
                                var monthVal = monthObj.point.name.replace("月", "");
                                self.clickMonthVal(monthVal);
                                //console.log(self.clickMonthVal());
                                self.dayData([]);
                                $.get({
                                    url: "Stat/UserStat/getUserStatByDay",
                                    data: { year: self.clickYearVal(), month: self.clickMonthVal() },
                                    success: function (day) {
                                        //console.log(day);
                                        //console.log(day.dayDic);
                                        //console.log(day.days);
                                        for (var j = 1; j <= day.days; j++) {
                                            self.dayData.push({ key: j + "号", value: day.dayDic[j] });
                                        }
                                        $("#containerMonth").hide();
                                        $("#containerDay").show();
                                        $("#containerDay").bindBar({
                                            type: "line",
                                            tableId: "datatableday",
                                            ytitle: self.clickMonthVal() + "月新增人数(人)"
                                        });
                                    }
                                });
                            });
                        }
                    });
                }
                year(lastYear);
            }
        });
    }
}

//总业绩实体
var TotalTradeViewModel = function () {
    var self = this;
    self.yearTotalData = ko.observableArray([]);
    self.monthTotalData = ko.observableArray([]);
    self.dayTotalData = ko.observableArray([]);
    self.clickTotalYearVal = ko.observable(null);
    self.clickTotalMonthVal = ko.observable(null);
    //加载数据
    self.loadTotalData = function () {
        $.get({
            url: "Stat/OrderStat/getOrderStatByYear",
            success: function (result) {
                var lastYear = result.strYearList[result.strYearList.length - 1];
                self.yearTotalData(result.strYearList);
                //console.log(result);
                //console.log(result.strYearList);
                //线形报表
                var years = function (yearObj) {
                    $("#btnTotalAdd").show();
                    //console.log(yearObj);
                    var yearVal = yearObj.replace("年", "");
                    self.clickTotalYearVal(yearVal);
                    //console.log(self.clickYearVal());
                    self.monthTotalData([]);
                    $.get({
                        url: "Stat/OrderStat/getOrderStatByMonth",
                        success: function (month) {

                            for (var i = 1; i <= 12; i++) {
                                self.monthTotalData.push({ key: i, value: month[i] });
                            }
                            $("#containerTotal").hide();
                            $("#containerTotalMonth").show();
                            $("#containerTotalMonth").bindBar({
                                type: "line",
                                tableId: "datatableTotalMonth",
                                ytitle: "每月新增报单金额(万元)"
                            }, function (monthObj) {
                                //console.log(monthObj);
                                var monthVal = monthObj.point.name.replace("月", "");
                                self.clickTotalMonthVal(monthVal);
                                //console.log(self.clickMonthVal());
                                self.dayTotalData([]);
                                $.get({
                                    url: "Stat/OrderStat/getOrderStatByDay",
                                    data: { year: self.clickTotalYearVal(), month: self.clickTotalMonthVal() },
                                    success: function (day) {
                                        //console.log(day.dayDic);
                                        //console.log(day.days);
                                        for (var j = 1; j <= day.days; j++) {
                                            self.dayTotalData.push({ key: j + "号", value: day.dayDic[j] });
                                        }
                                        $("#containerTotalMonth").hide();
                                        $("#containerTotalDay").show();
                                        $("#containerTotalDay").bindBar({
                                            type: "line",
                                            tableId: "datatableTotalDay",
                                            ytitle: self.clickTotalMonthVal() + "月新增报单金额(万元)"
                                        });
                                    }
                                });
                            });
                        }
                    });
                };
                years(lastYear);
            }
        });
    }
}