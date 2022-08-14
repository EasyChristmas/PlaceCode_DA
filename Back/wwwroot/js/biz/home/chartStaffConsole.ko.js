var PlatformConsoleViewModel = function () {
    var that = this;
    that.data = {
        orgSmPerformanceList: ko.observableArray([]),
        //顾问业绩排名，这里只放前7列的数据
        performanceList: ko.observableArray([]),
        performanceAllList: ko.observableArray([]),
        zkPerformanceList: ko.observableArray([]),
        zkPerformanceAllList: ko.observableArray([]),
        startOrderDate: ko.observable($.initDate().startTime),
        endOrderDate: ko.observable($.initDate().endTime),
        zkStartOrderDate: ko.observable($.initDate().startTime),
        zkEndOrderDate: ko.observable($.initDate().endTime),
        numberData: ko.observableArray([]),
        videoList: ko.observableArray([]),
        userActive: ko.observableArray([]),
        todoList: ko.observableArray([]),
        //用户分布数据
        userDataOne: ko.observableArray([]),
        userDataTwo: ko.observableArray([]),
        userDataThree: ko.observableArray([]),
        zkUserDataOne: ko.observableArray([]),
        zkUserDataTwo: ko.observableArray([]),
        zkUserDataThree: ko.observableArray([]),
        //用户转换漏斗模型数据
        userDataChange: ko.observableArray([]),
        zkUserDataChange: ko.observableArray([]),
        //手机号搜索数据
        searchMobile: ko.observable(),
        zkSearchMobile: ko.observable(),
        userDataList: ko.observableArray([]),
        zkUserDataList: ko.observableArray([]),
        //用户登录日志数据
        userDataLogin: ko.observableArray([]),
        userDataAllLogin: ko.observableArray([]),
        zkUserDataLogin: ko.observableArray([]),
        zkUserDataAllLogin: ko.observableArray([]),
        searchEnterprise: ko.observable(),
        enterpriseDataList: ko.observableArray([]),
        //增量数据
        incrementalDayData: ko.observable(),
        incrementalWeekData: ko.observable(),
        incrementalMonthData: ko.observable(),
        incrementalQuarterData: ko.observable(),
        incrementalYearData: ko.observable(),
        //直客增量数据
        zkIncrementalDayData: ko.observable(),
        zkIncrementalWeekData: ko.observable(),
        zkIncrementalMonthData: ko.observable(),
        zkIncrementalQuarterData: ko.observable(),
        zkIncrementalYearData: ko.observable(),
        //存量数据
        stockData: ko.observable(),
        //直客存量数据
        zkStockData: ko.observable(),
        //选择的服务经理
        selAdminId: ko.observable(),
        //选择的直客服务经理
        zkSelAdminId: ko.observable(),
        //呼叫统计开始、结束时间
        startUserTrackingDate: ko.observable($.initDate().startTime),
        endUserTrackingDate: ko.observable($.initDate().endTime),
        zkStartUserTrackingDate: ko.observable($.initDate().startTime),
        zkEndUserTrackingDate: ko.observable($.initDate().endTime),
        //外呼统计数据
        userTrackingData: {
            dialoutAnswerCount: ko.observable(),
            dialoutCount: ko.observable(),
            dialoutTime: ko.observable(),
            dialoutTimeText: ko.observable(),
            dialoutPercent: ko.observable()
        },
        zkUserTrackingData: {
            dialoutAnswerCount: ko.observable(),
            dialoutCount: ko.observable(),
            dialoutTime: ko.observable(),
            dialoutTimeText: ko.observable(),
            dialoutPercent: ko.observable()
        },

        //判断是否切换到直客
        isZhi: ko.observable(false),
        isShowNoData: ko.observable(false),
        isShowNoDataOrg: ko.observable(false),
    };
    //切换服务经理数据
    that.selAdminChange = function (item,event) {
        var that = this;
        //是否为直客模块
        var isCustomer = event.target.id == "zkSelAdminId";
        //累计数量数据
        that.loadStockData(isCustomer);
        //新增数量数据
        that.loadIncrementalData(isCustomer);
        //用户分布情况数据
        that.loadUserDistributionData(isCustomer);
        //用户转化分析数据
        that.loadOrganUserChange(isCustomer);
    };
    //加载顾问业绩排名数据
    that.loadOrderRanking = function (isCustomer) {
        var that = this;
        if ($.getCurrentUser().role == "OrgSm") {
            $.get({
                url: "stat/consolestat/OrgSmOrderRanking",
                data: {
                    startTime: that.data.startOrderDate(),
                    endTime: that.data.endOrderDate()
                },
                success: function (res) {
                    that.data.orgSmPerformanceList(res);
                }
            });

        } else {
            if (isCustomer == undefined) {
                that.loadFinanicalOrderRankingData();
                that.loadZKOrderRankingData();
            } else {
                if (isCustomer) {
                    that.loadZKOrderRankingData();
                } else {
                    that.loadFinanicalOrderRankingData();
                }
            }
        }

    };
    that.loadFinanicalOrderRankingData = function () {
        //顾问业绩排行数据(本机构)
        $.get({
            url: "stat/consolestat/OrderRanking",
            data: {
                startTime: that.data.startOrderDate(),
                endTime: that.data.endOrderDate(),
                isCustomer: false
            },
            success: function (res) {
                that.data.performanceList(res);
            }
        });

        //顾问业绩排行数据(全平台)
        $.get({
            url: "stat/consolestat/OrderRanking",
            data: {
                startTime: that.data.startOrderDate(),
                endTime: that.data.endOrderDate(),
                enterPriseId: null,
                isCustomer: false
            },
            success: function (res) {
                that.data.performanceAllList(res);
            }
        });
    };
    that.loadZKOrderRankingData = function () {
        //顾问业绩排行数据(本机构)
        $.get({
            url: "stat/consolestat/OrderRanking",
            data: {
                startTime: that.data.zkStartOrderDate(),
                endTime: that.data.zkEndOrderDate(),
                isCustomer: true
            },
            success: function (res) {
                that.data.zkPerformanceList(res);
            }
        });

        //顾问业绩排行数据(全平台)
        $.get({
            url: "stat/consolestat/OrderRanking",
            data: {
                startTime: that.data.zkStartOrderDate(),
                endTime: that.data.zkEndOrderDate(),
                enterPriseId: null,
                isCustomer: true
            },
            success: function (res) {
                that.data.zkPerformanceAllList(res);
            }
        });
    };

    //加载呼叫统计数据
    that.loadUserTracking = function (isCustomer) {
        var that = this;
        //团队长和机构主首页不展示呼叫统计数据
        if ($.getCurrentUser().levelId >= 3) {
            return;
        }
        if (isCustomer == undefined) {
            that.loadFinanicalUserTrackingData();
            that.loadZKUserTrackingData();
        } else {
            if (isCustomer) {
                that.loadZKUserTrackingData();
            } else {
                that.loadFinanicalUserTrackingData();
            }
        }
    };
    that.loadFinanicalUserTrackingData = function () {
        $.get({
            url: "stat/consolestat/GetUserTrackingData",
            data: {
                dateStart: that.data.startUserTrackingDate(),
                dateEnd: that.data.endUserTrackingDate(),
                isCustomer: false
            },
            success: function (res) {
                if (res != null) {
                    that.data.userTrackingData.dialoutAnswerCount(res.dialoutAnswerCount);
                    that.data.userTrackingData.dialoutCount(res.dialoutCount);
                    that.data.userTrackingData.dialoutTime(res.dialoutTime);
                    that.data.userTrackingData.dialoutTimeText(res.dialoutTimeText);
                    that.data.userTrackingData.dialoutPercent(parseInt((res.dialoutAnswerCount / res.dialoutCount) * 10000 / 100));
                } else {
                    that.data.userTrackingData.dialoutAnswerCount(0);
                    that.data.userTrackingData.dialoutCount(0);
                    that.data.userTrackingData.dialoutTime(0);
                    that.data.userTrackingData.dialoutTimeText(0);
                    that.data.userTrackingData.dialoutPercent(0);
                }
            }
        });
    };
    that.loadZKUserTrackingData = function () {
        $.get({
            url: "stat/consolestat/GetUserTrackingData",
            data: {
                dateStart: that.data.zkStartUserTrackingDate(),
                dateEnd: that.data.zkEndUserTrackingDate(),
                isCustomer: true
            },
            success: function (res) {
                if (res != null) {
                    that.data.zkUserTrackingData.dialoutAnswerCount(res.dialoutAnswerCount);
                    that.data.zkUserTrackingData.dialoutCount(res.dialoutCount);
                    that.data.zkUserTrackingData.dialoutTime(res.dialoutTime);
                    that.data.zkUserTrackingData.dialoutTimeText(res.dialoutTimeText);
                    that.data.zkUserTrackingData.dialoutPercent(parseInt((res.dialoutAnswerCount / res.dialoutCount) * 10000 / 100));
                } else {
                    that.data.zkUserTrackingData.dialoutAnswerCount(0);
                    that.data.zkUserTrackingData.dialoutCount(0);
                    that.data.zkUserTrackingData.dialoutTime(0);
                    that.data.zkUserTrackingData.dialoutTimeText(0);
                    that.data.zkUserTrackingData.dialoutPercent(0);
                }
            }
        });
    };
    //增量数据
    that.loadIncrementalData = function (isCustomer) {
        var that = this;
        that.loadIncrementalDataByDateScope(1,isCustomer);
        that.loadIncrementalDataByDateScope(2,isCustomer);
        that.loadIncrementalDataByDateScope(3,isCustomer);
        that.loadIncrementalDataByDateScope(4,isCustomer);
        that.loadIncrementalDataByDateScope(5,isCustomer);
    };
    that.loadIncrementalDataByDateScope = function (dateScope,isCustomer) {
        //机构主管级以上默认看到是整个机构的数据
        var adminId = $.getCurrentUser().levelId >= 3 ? that.data.selAdminId() : $.getCurrentUser().id; 
        var zkAdminId = $.getCurrentUser().levelId >= 3 ? that.data.zkSelAdminId() : $.getCurrentUser().id; 
        var apiPath = $.getCurrentUser().role == "OrgSm" ? "GetOrgSmIncrementalData" : "GetEnterpriseIncrementalData";
        if (isCustomer == undefined) {
            that.loadFinanicalIncrementalData(apiPath, adminId, dateScope);
            that.loadZKIncrementalData(apiPath, zkAdminId, dateScope);
        } else {
            if (isCustomer) {
                that.loadZKIncrementalData(apiPath, zkAdminId, dateScope);
            } else {
                that.loadFinanicalIncrementalData(apiPath, adminId, dateScope);
            }
        }
    };
    that.loadFinanicalIncrementalData = function (apiPath, adminId, dateScope) {
        $.get({
            async: true,
            url: "stat/consolestat/" + apiPath,
            data: { adminId: adminId, dateScope: dateScope },
            success: function (result) {
                switch (dateScope) {
                    case 1:
                        that.data.incrementalDayData(result);
                        break;
                    case 2:
                        that.data.incrementalWeekData(result);
                        break;
                    case 3:
                        that.data.incrementalMonthData(result);
                        break;
                    case 4:
                        that.data.incrementalQuarterData(result);
                        break;
                    case 5:
                        that.data.incrementalYearData(result);
                        break;
                }
            }
        });
    };
    that.loadZKIncrementalData = function (apiPath, adminId, dateScope) {
        $.get({
            async: true,
            url: "stat/consolestat/" + apiPath,
            data: { adminId: adminId, dateScope: dateScope, isCustomer: true },
            success: function (result) {
                switch (dateScope) {
                    case 1:
                        that.data.zkIncrementalDayData(result);
                        break;
                    case 2:
                        that.data.zkIncrementalWeekData(result);
                        break;
                    case 3:
                        that.data.zkIncrementalMonthData(result);
                        break;
                    case 4:
                        that.data.zkIncrementalQuarterData(result);
                        break;
                    case 5:
                        that.data.zkIncrementalYearData(result);
                        break;
                }
            }
        });
    };

    //存量数据
    that.loadStockData = function (isCustomer) {
        var that = this;
        //机构主管级以上默认看到是整个机构的数据
        var adminId = $.getCurrentUser().levelId >= 3 ? that.data.selAdminId() : $.getCurrentUser().id;
        var zkAdminId = $.getCurrentUser().levelId >= 3 ? that.data.zkSelAdminId() : $.getCurrentUser().id;
        //没指定则全部都需要加载
        if (isCustomer == undefined) {
            that.loadFinanicalStockData(adminId);
            that.loadZKStockData(zkAdminId);
        } else {
            if (isCustomer) {
                that.loadZKStockData(zkAdminId);
            } else {
                that.loadFinanicalStockData(adminId);
            }
        } 
    };
    that.loadFinanicalStockData = function (adminId) {
        $.get({
            async: true,
            url: "stat/consolestat/GetEnterpriseStockData",
            data: {
                adminId: adminId
            },
            success: function (res) {
                that.data.stockData(res);
            }
        });
    };
    that.loadZKStockData = function (adminId) {
        $.get({
            async: true,
            url: "stat/consolestat/GetEnterpriseStockData",
            data: {
                adminId: adminId,
                isCustomer: true
            },
            success: function (res) {
                that.data.zkStockData(res);
            }
        });
    };

    //加载用户分布数据
    that.loadUserDistributionData = function (isCustomer) {
        var that = this;
        //机构主管级以上默认看到是整个机构的数据
        var adminId = $.getCurrentUser().levelId >= 3 ? that.data.selAdminId() : $.getCurrentUser().id;
        var zkAdminId = $.getCurrentUser().levelId >= 3 ? that.data.zkSelAdminId() : $.getCurrentUser().id;
        if (isCustomer == undefined) {
            that.loadFinanicalDistributionData(adminId);
            that.loadZKDistributionData(zkAdminId);
        } else {
            if (isCustomer) {
                that.loadZKDistributionData(zkAdminId);
            } else {
                that.loadFinanicalDistributionData(adminId);
            }
        }
    };
    that.loadFinanicalDistributionData = function (adminId) {
        $.get({
            url: "stat/consolestat/GetUserDistributionData",
            data: { adminId: adminId },
            success: function (result) {
                that.loadOrganUserOne(result, false);
                that.loadOrganUserTwo(result, false);
                that.loadOrganUserThree(result,false);
            }
        });
    };
    that.loadZKDistributionData = function (adminId) {
        $.get({
            url: "stat/consolestat/GetUserDistributionData",
            data: { adminId: adminId, isCustomer: true },
            success: function (result) {
                that.loadOrganUserOne(result, true);
                that.loadOrganUserTwo(result, true);
                that.loadOrganUserThree(result, true);
            }
        });
    };

    that.init = function () {

        //liCaiShiOrZhiKe true:纯直客版  false:纯理财师版

        //累计数量数据
        that.loadStockData(liCaiShiOrZhiKe);
        //新增数量数据
        that.loadIncrementalData(liCaiShiOrZhiKe);
        //用户分布情况数据
        that.loadUserDistributionData(liCaiShiOrZhiKe);
        //用户转化分析数据
        that.loadOrganUserChange(liCaiShiOrZhiKe);
        //呼叫统计数据
        that.loadUserTracking(liCaiShiOrZhiKe);

        //年报单金额统计
        that.loadAmountData(liCaiShiOrZhiKe);
        //加载顾问业绩排行数据
        that.loadOrderRanking(liCaiShiOrZhiKe);
        //加载number
        that.loadNumberData();
        //加载视频列表
        that.loadVideoList();
        //加载会员动态
        //that.loadUserActive();
        //加载代办事项
        that.loadTodoList();
        that.loadProductStatData(liCaiShiOrZhiKe);
        that.loadOrganUserLogin(liCaiShiOrZhiKe);

        if ($.getCurrentUser().role == "OrgSm") {
            //new 机构数量统计饼图
            that.loadOrgSmStatData();
        }; 

        //监听角色
        that.toggleRole();
    };
    //选择时间
    that.orderDateChange = function (item,event) {
        var that = this;
        //是否为直客模块
        var isCustomer = event.target.getAttribute("source") == "1";
        that.loadOrderRanking(isCustomer);
    };
    //清空时间
    that.orderDateClear = function (type, ev) {
        if (ev.keyCode == 8 || ev.keyCode == 12) {
            var that = this;
            if (type == 1) {
                that.data.startOrderDate('');
            } else {
                that.data.endOrderDate('');
            }
            that.loadOrderRanking();
        }
    };
    //呼叫统计时间
    that.userTrackingDateChange = function (item,event) {
        var that = this;
        //是否为直客模块
        var isCustomer = event.target.getAttribute("source") == "1";
        that.loadUserTracking(isCustomer);
    };
    //加载日期范围内统计的业绩数据
    that.loadAmountData = function (isCustomer) {
        if ($.getCurrentUser().levelId >= 3 || $.getCurrentUser().role == "OrgSm") {
            var that = this;
            if (isCustomer == undefined) {
                that.loadFinanicalAmountData();
                that.loadZKAmountData();
            } else {
                if (isCustomer) {
                    that.loadZKAmountData();
                } else {
                    that.loadFinanicalAmountData();
                }
            }
        }
    };
    that.loadFinanicalAmountData = function () {
        //加载本周业绩数据
        that.loadAmountDataByDateScope(2, false);
        //加载本月业绩数据
        that.loadAmountDataByDateScope(3, false);
        //加载本年业绩数据
        that.loadAmountDataByDateScope(5, false);
    };
    that.loadZKAmountData = function () {
        //加载本周业绩数据 直客数据
        that.loadAmountDataByDateScope(2, true);
        //加载本月业绩数据
        that.loadAmountDataByDateScope(3, true);
        //加载本年业绩数据
        that.loadAmountDataByDateScope(5, true);
    };
    that.loadAmountDataByDateScope = function (dateScope,isCustomer) {
        $.get({
            url: "stat/consolestat/GetOrderAmountByDate",
            data: { dateScope: dateScope, isCustomer: isCustomer },
            success: function (res) {
                var amountList = [];
                var dateList = [];
                res.forEach(function (item) {
                    amountList.push(item.amount);
                    dateList.push(item.date);
                });

                var elementId = "";
                if (isCustomer) {
                    elementId = '#zk_chart_money_' + dateScope;
                } else {
                    elementId = '#chart_money_' + dateScope;
                }

                $(elementId).initColumnChart({
                    subText: "金额：百万元",
                    xAxisData: dateList,
                    color: ['#5d7dba'],
                    axisPointerColor: '#5d7dba',
                    seriesData: [
                        {
                            type: $.getCurrentUser().role == "OrgSm" ? 'line' : 'bar',
                            data: amountList,
                            label: {
                                normal: {
                                    show: true,
                                    color: '#ff6634',
                                    position: 'top'
                                }
                            }
                        }
                    ]
                });
            }
        });
    };
    that.loadProductStatData = function (isCustomer) {
        //今日在售产品分布情况，下面两个数据是平台的圆饼数据，暂时先展示
        //投资领域
        if ($.getCurrentUser().levelId < 3) {
            $.get({
                url: "stat/consolestat/GetEmployeeProductStat",
                success: function (res) {
                    if (isCustomer == undefined) {
                        that.loadFinanicalProductStatData(res);
                        that.loadZKProductStatData(res);
                    } else {
                        if (isCustomer) {
                             that.loadZKProductStatData(res);
                        } else {
                            that.loadFinanicalProductStatData(res);
                        }
                    }
                }
            });
        }
    };
    that.loadFinanicalProductStatData = function (res) {
        //投资区域-新加的圆饼图
        var touziquyu = res.quYuGroup;
        $('#chart_touziquyu').initRoundChart({
            title: '',
            number: '投资区域',
            legendData: $.initChartRoundData(touziquyu).legendData,
            seriesData: $.initChartRoundData(touziquyu).seriesData,
            labelShow: false,
            radius: ['45%', '65%'],
            itemWidth: 6,
            itemHeight: 6,
            subtextFontSize: 19,
            subtextColor: '#5c7bbb',
            subtextFountWeight: 'bold',
            subtextLineHeight: '30',
            titleFontSize: 30,
            titleColor: '#ff6537',
            titleFontWeight: 'bold'
        });

        //收益率
        var shouyilvData = res.shouYiGroup;
        $('#chart_shouyilv').initRoundChart({
            title: '',
            number: '收益率',
            legendData: $.initChartRoundData(shouyilvData).legendData,
            seriesData: $.initChartRoundData(shouyilvData).seriesData,
            labelShow: false,
            radius: ['45%', '65%'],
            itemWidth: 6,
            itemHeight: 6,
            subtextFontSize: 19,
            subtextColor: '#5c7bbb',
            subtextFountWeight: 'bold',
            subtextLineHeight: '30',
            titleFontSize: 30,
            titleColor: '#ff6537',
            titleFontWeight: 'bold'
        });

        //投资领域
        var linyuData = res.touZiLingYuGroup;
        $('#chart_touzi').initRoundChart({
            title: "",
            number: '投资领域',
            legendData: $.initChartRoundData(linyuData).legendData,
            seriesData: $.initChartRoundData(linyuData).seriesData,
            labelShow: false,
            radius: ['45%', '65%'],
            itemWidth: 6,
            itemHeight: 6,
            subtextFontSize: 19,
            subtextColor: '#5c7bbb',
            subtextFountWeight: 'bold',
            subtextLineHeight: '30',
            titleFontSize: 30,
            titleColor: '#ff6537',
            titleFontWeight: 'bold'
        });
    };
    that.loadZKProductStatData = function (res) {
        //投资区域-新加的圆饼图
        var touziquyu = res.quYuGroup;
        $('#zk_chart_touziquyu').initRoundChart({
            title: '',
            number: '投资区域',
            legendData: $.initChartRoundData(touziquyu).legendData,
            seriesData: $.initChartRoundData(touziquyu).seriesData,
            labelShow: false,
            radius: ['45%', '65%'],
            itemWidth: 6,
            itemHeight: 6,
            subtextFontSize: 19,
            subtextColor: '#5c7bbb',
            subtextFountWeight: 'bold',
            subtextLineHeight: '30',
            titleFontSize: 30,
            titleColor: '#ff6537',
            titleFontWeight: 'bold'
        });

        //收益率
        var shouyilvData = res.shouYiGroup;
        $('#zk_chart_shouyilv').initRoundChart({
            title: '',
            number: '收益率',
            legendData: $.initChartRoundData(shouyilvData).legendData,
            seriesData: $.initChartRoundData(shouyilvData).seriesData,
            labelShow: false,
            radius: ['45%', '65%'],
            itemWidth: 6,
            itemHeight: 6,
            subtextFontSize: 19,
            subtextColor: '#5c7bbb',
            subtextFountWeight: 'bold',
            subtextLineHeight: '30',
            titleFontSize: 30,
            titleColor: '#ff6537',
            titleFontWeight: 'bold'
        });

        //投资领域
        var linyuData = res.touZiLingYuGroup;
        $('#zk_chart_touzi').initRoundChart({
            title: "",
            number: '投资领域',
            legendData: $.initChartRoundData(linyuData).legendData,
            seriesData: $.initChartRoundData(linyuData).seriesData,
            labelShow: false,
            radius: ['45%', '65%'],
            itemWidth: 6,
            itemHeight: 6,
            subtextFontSize: 19,
            subtextColor: '#5c7bbb',
            subtextFountWeight: 'bold',
            subtextLineHeight: '30',
            titleFontSize: 30,
            titleColor: '#ff6537',
            titleFontWeight: 'bold'
        });
    };
    
    //加载number
    that.loadNumberData = function () {
        //$.get({
        //    url: "stat/consolestat/GetEmployee",
        //    success: function (res) {
        //        that.data.numberData(res);
        //    }
        //});
    };
    //加载视频列表，展示两条数据
    that.loadVideoList = function () {
        if ($.getCurrentUser().levelId <3) {
            $.get({
                url: "stat/consolestat/GetHotVideo",
                success: function (res) {
                    that.data.videoList(res);
                }
            });
        }
    };
    //加载会员动态,展示六条数据
    that.loadUserActive = function () {
        $.get({
            url: "stat/consolestat/GetUserFootprint",
            success: function (res) {
                that.data.userActive(res);
            }
        });
       
    };
    //加载待办事项
    that.loadTodoList = function () {
        that.data.todoList([
            {
                title: '预约提醒',
                time: '7月05日 10:33',
                content: '会员编号10010苏大强浏览某产品-8997央企信托某某政信'
            },
            {
                title: '确认书入库',
                time: '7月05日 10:33',
                content: '会员编号10010苏大强浏览某产品-8997央企信托某某政信'
            },
            {
                title: '会员存续通知',
                time: '7月05日 10:33',
                content: '会员编号10010苏大强浏览某产品-8997央企信托某某政信'
            }
        ]);
    };
    //用户活跃度
    that.loadOrganUserOne = function (data, isCustomer) {
        //调用api获取到的数据格式如下，一定要这个格式，因为后面会对数据有处理：
        var arr = [
            {
                name: 'A',
                value: data.levelA
            },
            {
                name: 'B',
                value: data.levelB
            },
            {
                name: 'C',
                value: data.levelC
            },
            {
                name: 'D',
                value: data.levelD
            },
            {
                name: 'E',
                value: data.levelE
            }
        ];
        var elementId = "";
        if (isCustomer) {
            elementId = "zk_chart_suer_one";
            //附值
            that.data.zkUserDataOne(arr);
        } else {
            elementId = "chart_suer_one";
            //附值
            that.data.userDataOne(arr);
        }
      
        $('#' + elementId).initColumnChart({
            //subText: "金额：百万元",
            xAxisData: $.initUserData(arr).arrName,
            xAxisShow: true,
            yAxisShow: false,
            axisPointerShow: false,
            gridLeft: 'left',
            seriesData: [
                {
                    type: 'line',
                    data: $.initUserData(arr).arrValue,
                    smooth: true,//弯曲的线条
                    symbol: 'circle',
                    symbolSize: 12,
                    label: {
                        normal: {
                            show: true,
                            color: '#ff6634',
                            position: 'top'
                        }
                    }
                },
                {
                    type: 'bar',
                    barGap: '-100%',
                    barWidth: 10,
                    itemStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(
                                0, 0, 0, 1,
                                [
                                    { offset: 0, color: 'rgba(20,200,212,0.5)' },
                                    { offset: 0.2, color: 'rgba(20,200,212,0.2)' },
                                    { offset: 1, color: 'rgba(20,200,212,0)' }
                                ]
                            )
                        }
                    },
                    z: -12,
                    data: $.initUserData(arr).arrValue
                },
            ]
        });
    };
    //用户购买能力
    that.loadOrganUserTwo = function (data, isCustomer) {
        //调用api获取到的数据格式如下，一定要这个格式，因为后面会对数据有处理：
        var arr = [
            {
                name: '未知',
                value: data.kind0
            },
            {
                name: '戊',
                value: data.kind5
            },
            {
                name: '丁',
                value: data.kind4
            },
            {
                name: '丙',
                value: data.kind3
            },
            {
                name: '乙',
                value: data.kind2
            },
            {
                name: '甲',
                value: data.kind1
            }
        ];
        var elementId = "";
        if (isCustomer) {
            elementId = "zk_chart_suer_two";
            //附值
            that.data.zkUserDataTwo(arr.reverse());
        } else {
            elementId = "chart_suer_two";
            //附值
            that.data.userDataTwo(arr.reverse());
        }
        $('#' + elementId).initColumnChart({
            yAxisData: $.initUserData(arr.reverse()).arrName,
            xAxisShow: false,
            yAxisShow: true,
            xAxisType: 'value',
            yAxisType: 'category',
            axisPointerShow: false,
            yAxisSplitLineShow: false,
            seriesData: [
                {
                    color: '#587ab9',
                    type: 'bar',
                    barWidth: '30%',
                    data: $.initUserData(arr).arrValue
                }
            ]
        });
    };
    //用户购买意愿
    that.loadOrganUserThree = function (data, isCustomer) {
        //调用api获取到的数据格式如下，一定要这个格式，因为后面会对数据有处理：
        var arr = [
            {
                value: data.purChaseIntentionStrong,
                name: '强',
                color: '#597bb8' 
            },
            {
                value: data.purChaseIntentionWeak,
                name: '弱',
                color: '#ec9143'
            },
            {
                value: data.purChaseIntentionUnknown,
                name: '未知',
                color: '#c0c0be'
            }
        ];
        var elementId = "";
        if (isCustomer) {
            elementId = "zk_chart_suer_three";
            //附值
            that.data.zkUserDataThree(arr);
        } else {
            elementId = "chart_suer_three";
            //附值
            that.data.userDataThree(arr);
        }
      
        $('#' + elementId).initRoundChart({
            legendData: $.initChartRoundDataTwo(arr).legendData,
            seriesData: $.initChartRoundDataTwo(arr).seriesData,
            legendTop: '0',
            labelShow: false,
            radius: ['40%', '45%'],
            itemWidth:6,
            itemHeight: 6,
            gridTop:'50%',
            legendFontWeight: 'bolder'
        });
    };
    //用户转化分析数据
    that.loadOrganUserChange = function (isCustomer) {
        var that = this;
        //机构主管级以上默认看到是整个机构的数据
        var adminId = $.getCurrentUser().levelId >= 3 ? that.data.selAdminId() : $.getCurrentUser().id;
        var zkAdminId = $.getCurrentUser().levelId >= 3 ? that.data.zkSelAdminId() : $.getCurrentUser().id;
        if (isCustomer == undefined) {
            that.loadFinanicalOrganUserChangeData(adminId, false);
            that.loadFinanicalOrganUserChangeData(zkAdminId, true);
        } else {
            if (isCustomer) {
                that.loadFinanicalOrganUserChangeData(zkAdminId, true);
            } else {
                that.loadFinanicalOrganUserChangeData(adminId, false);
            }
        }
    };
    that.loadFinanicalOrganUserChangeData = function (adminId, isCustomer) {
        $.get({
            url: "stat/consolestat/GetUserChangeData",
            data: { adminId: adminId, isCustomer:isCustomer },
            success: function (result) {
                var totalCount = result.totalCount;
                var arr = [
                    {
                        name: '用户',
                        value: totalCount,
                        per: '100%',
                        perTotal: '100%'
                    },
                    {
                        name: '甲乙',
                        value: result.kindJYCount,
                        per: (totalCount == 0 ? 0 : parseInt((result.kindJYCount / totalCount) * 10000) / 100) + '%',
                        perTotal: (totalCount == 0 ? 0 : parseInt((result.kindJYCount / totalCount) * 10000) / 100) + '%'
                    },
                    {
                        name: '微信',
                        value: result.weChatCount,
                        per: (result.kindJYCount == 0 ? 0 : parseInt((result.weChatCount / result.kindJYCount) * 10000) / 100) + '%',
                        perTotal: (totalCount == 0 ? 0 : parseInt((result.weChatCount / totalCount) * 10000) / 100) + '%'
                    },
                    {
                        name: '注册',
                        value: result.registerCount,
                        per: (result.weChatCount == 0 ? 0 : parseInt((result.registerCount / result.weChatCount) * 10000) / 100) + '%',
                        perTotal: (totalCount == 0 ? 0 : parseInt((result.registerCount / totalCount) * 10000) / 100) + '%'
                    },
                    {
                        name: '成交',
                        value: result.okCount,
                        per: (result.registerCount == 0 ? 0 : parseInt((result.okCount / result.registerCount) * 10000) / 100) + '%',
                        perTotal: (totalCount == 0 ? 0 : parseInt((result.okCount / totalCount) * 10000) / 100) + '%'
                    }
                ];
                var elementId = "";
                if (isCustomer) {
                    that.data.zkUserDataChange(arr);
                    elementId = ".circleChart#1";
                } else {
                    that.data.userDataChange(arr);
                    elementId = ".circleChart#2";
                }
               
                var okPercent = parseInt((result.okCount / result.totalCount) * 10000) / 100;
                $(elementId).circleChart({
                    size: 160,
                    value: okPercent,
                    widthRatio: 0.15,
                    color: "#32a2f4",
                    backgroundColor: "#dcdbe1",
                    text: 0,
                    startAngle: '-25',
                    textSize: '28px',
                    textWeight: 'bold',
                    onDraw: function (el, circle) {
                        circle.text(okPercent + "%");
                    }
                });
            }
        });
    };

    //加载根据手机号查询的用户信息
    that.loadOrganUserList = function (data, event) {
        //是否为直客模块
        var isCustomer = event.target.getAttribute("source") == "1";
        var mobile = isCustomer ? that.data.zkSearchMobile() : that.data.searchMobile();
        if (event.keyCode == 13) {
            if (!mobileReg.test(mobile)) {
                $.tips("请输入正确的手机号", $(event.target));
                return;
            }
            var params = {
                mobile: mobile,
                isCustomer: isCustomer
            };
            $.get({
                url: "User/getConsoleUserInfo",
                data: params,
                success: function (res) {
                    var userList = ko.mapping.fromJS(res);
                    if (!res) {
                        that.data.isShowNoData(true);
                    } else {
                        that.data.isShowNoData(false);
                    }
                    if (isCustomer) {
                        that.data.zkUserDataList(userList());
                    } else {
                        that.data.userDataList(userList());
                    }
                }
            });
        }
    };

    //清除输入的查询的用户信息
    that.clearInput = function () {
        //是否为直客模块
        var isCustomer = event.target.getAttribute("source") == "1";
        if (isCustomer) {
            that.data.zkSearchMobile("");
            that.data.zkUserDataList([]);
        } else {
            that.data.searchMobile("");
            that.data.userDataList([]);
        }
       
    };

    //加载机构查询出来的机构信息
    that.loadEnterpriseList = function (data, event) {
        if (event.keyCode == 13) {
            var fullName = that.data.searchEnterprise().trim();
            if (fullName) {
                var params = {
                    fullName: fullName,
                    isHomePageSearch: true,
                    pageSize:8
                };
                $.get({
                    url: "oa/enterprise",
                    data: params,
                    success: function (res) {
                        if (res.data.length == 0) {
                            that.data.isShowNoDataOrg(true);
                        } else {
                            that.data.isShowNoDataOrg(false);
                        }
                        that.data.enterpriseDataList(res.data);
                    }
                });
            }
        }
    };

    //清除输入的查询的机构名称信息
    that.clearEnterpriseInput = function () {
        that.data.searchEnterprise("");
        that.data.enterpriseDataList([]);
    };

    //一键申请会员
    that.userApply = function (item) {
        $.confirm('确定申请该用户？', function () {
            $.post({
                url: "user/userapply",
                data: { id: item.id(), mobile: that.data.searchMobile() },
                success: function (res) {
                    $.success("申请完成！");
                    item.enableApply(false);
                },
                error: function (error) {
                    $.alert(error.responseText);
                }
            });
        });
    };

    that.loadOrganUserLogin = function (isCustomer) {
        if (isCustomer == undefined) {
            that.loadFinanicalOrganUserLoginData();
            that.loadZKOrganUserLoginData();
        } else {
            if (isCustomer) {
                that.loadZKOrganUserLoginData();
            } else {
                that.loadFinanicalOrganUserLoginData();
            }
        }
    };
    that.loadFinanicalOrganUserLoginData = function () {
        //个人
        $.get({
            async: true,
            url: "User/getrecentloginuser",
            data: { pageSize: 10, adminId: $.getCurrentUser().id, isCustomer: false },
            success: function (result) {
                that.data.userDataLogin(result.data);
            }
        });

        if ($.getCurrentUser().levelId >= 3) {
            //团队
            $.get({
                url: "User/getrecentloginuser",
                data: { pageSize: 10, isCustomer: false  },
                success: function (result) {
                    that.data.userDataAllLogin(result.data);
                }
            });
        }
    };
    that.loadZKOrganUserLoginData = function () {
        //个人
        $.get({
            async: true,
            url: "User/getrecentloginuser",
            data: { pageSize: 10, adminId: $.getCurrentUser().id, isCustomer: true },
            success: function (result) {
                that.data.zkUserDataLogin(result.data);
            }
        });

        if ($.getCurrentUser().levelId >= 3) {
            //团队
            $.get({
                url: "User/getrecentloginuser",
                data: { pageSize: 10, isCustomer: true  },
                success: function (result) {
                    that.data.zkUserDataAllLogin(result.data);
                }
            });
        }
    };

    that.openUserFootDetail = function (item) {
        var userId = item.userId;
        $.openTab({
            url: "/user/edit?id=" + userId + "&tag=userFootprint",
            title: "用户详情 - " + userId
        });
    };

    //orgsmdataloading
    that.loadOrgSmStatData = function () {  
        if ($.getCurrentUser().levelId < 3) {
            $.get({
                url: "stat/consolestat/GetOrgSmStockData",
                success: function (res) { 
                    //机构数量
                    var orgNum = res.enterpriseCount; 
                    $('#chart_orgnum').initRoundChart({
                        title: orgNum.count,
                        number: '机构数量',
                        legendData: $.initChartRoundData(orgNum.dicDataModels).legendData,
                        seriesData: $.initChartRoundData(orgNum.dicDataModels).seriesData,
                        labelShow: false,
                        radius: ['45%', '65%'],
                        itemWidth: 6,
                        itemHeight: 6,
                        subtextFontSize: 14,
                        subtextColor: '#5c7bbb',
                        subtextFountWeight: 'bold',
                        subtextLineHeight: '30',
                        titleFontSize: 30,
                        titleColor: '#ff6537',
                        titleFontWeight: 'bold',
                        titleTop: '36%'
                    });

                    //机构理财师 
                    var orgLicaishi = res.enterpriseUserCount;
                    $('#chart_orglicaishi').initRoundChart({
                        title: orgLicaishi.count,
                        number: '机构理财师',
                        legendData: $.initChartRoundData(orgLicaishi.dicDataModels).legendData,
                        seriesData: $.initChartRoundData(orgLicaishi.dicDataModels).seriesData,
                        labelShow: false,
                        radius: ['45%', '65%'],
                        itemWidth: 6,
                        itemHeight: 6,
                        subtextFontSize: 14,
                        subtextColor: '#5c7bbb',
                        subtextFountWeight: 'bold',
                        subtextLineHeight: '30',
                        titleFontSize: 30,
                        titleColor: '#ff6537',
                        titleFontWeight: 'bold',
                        titleTop: '36%'
                    });

                    //机构业绩 
                    var orgYeji = res.enterpriseOrderCount;
                    $('#chart_orgyeji').initRoundChart({
                        title: orgYeji.count,
                        number: '机构业绩(百万)',
                        legendData: $.initChartRoundData(orgYeji.dicDataModels).legendData,
                        seriesData: $.initChartRoundData(orgYeji.dicDataModels).seriesData,
                        labelShow: false,
                        radius: ['45%', '65%'], 
                        itemWidth: 6,
                        itemHeight: 6,
                        subtextFontSize: 14,
                        subtextColor: '#5c7bbb',
                        subtextFountWeight: 'bold',
                        subtextLineHeight: '30',
                        titleFontSize: 30,
                        titleColor: '#ff6537',
                        titleFontWeight: 'bold',
                        titleTop: '36%'
                    });
                     
                }
            });
        };
    };

    //监听理财师和直客选中事件
    that.toggleRole = function () {
        $('#parentTab a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            if (e.target.hash.indexOf('licaishi') > -1)
                that.data.isZhi(false);
            if (e.target.hash.indexOf('zhike') > -1)
                that.data.isZhi(true);
            $.chartResizeAuto();
            that.data.isShowNoData(false);
            that.data.searchMobile('');
            that.data.zkSearchMobile('');
        });
    };
};

