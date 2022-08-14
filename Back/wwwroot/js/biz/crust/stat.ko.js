
//ViewModel
var StatTotalUserViewModel = function () {
    var self = this;
    self.types = ko.observableArray([]);
    self.monthTotalUserList = ko.observableArray([]);
    self.weekTotalUserList = ko.observableArray([]);
    self.dayTotalUserList = ko.observableArray([]);

    //加载月统计
    self.loadStatByMonth = function (data) {
        if (!data) {
            data = { year: 2022 };
        }
        $.get({
            url: "crust/getShareByMonth",
            data: data,
            success: function (result) {
                self.types(result.types);
                self.monthTotalUserList(result.data);


                $("#containerWeekTotalUser,#containerDayTotalUser").hide();
                $("#containerMonthTotalUser").show();

                $("#containerMonthTotalUser").bindBar({
                    type: "column",
                    ytitle: data.year + "年每月收益币数(个)",
                    tableId: "monthTotalUserDataTable"
                }, function (ele) {
                    var month = ele.point.name.replace("月", "");
                    data.month = month;

                    self.dayTotalUserList([]);
                    self.loadStatByDay(data);
                });
            }
        });
    };
    //加载每周统计
    self.loadStatByWeek = function (data) {
        //if (!data) {
        //    data = { year: 2022 };
        //}
        $.get({
            url: "crust/getShareByWeek",
            data: data,
            success: function (result) {
                self.types(result.types);
                self.weekTotalUserList(result.data);

                //柱形报表
                $("#containerWeekTotalUser").bindBar({
                    type: "line",
                    ytitle: "Crust 全网周数据",
                    xtitle: "",
                    tableId: "weekTotalUserDataTable"
                }, function (ele) {
                });
            }
        });
    };
    //加载每日统计
    self.loadStatByDay = function (data) {
        if (!data) {
            data = { month: 1 };
        }
        $.get({
            url: "crust/getShareByDay",
            data: data,
            success: function (result) {
                self.types(result.types);
                self.dayTotalUserList(result.data);

                $("#containerWeekTotalUser,#containerMonthTotalUser").hide();
                $("#containerDayTotalUser").show();
                $("#containerDayTotalUser").bindBar({
                    type: "line",
                    ytitle: "Crust 全网" + data.month + "月数据",
                    tableId: "dayTotalUserDataTable"
                }, function (ele) {
                });
            }
        });
    };

};
