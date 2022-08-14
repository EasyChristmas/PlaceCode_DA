var PlatformConsoleViewModel = function () {
    var that = this;
    that.data = {
        pvDataTitle: ko.observable(),
        pvDataSubTitle: ko.observable(),
        uvDataTitle: ko.observable(),
        uvDataSubTitle: ko.observable()
    };
    that.init = function () {

        //会员、机构、产品统计信息
        $.get({
            url: "stat/consolestat/GetPlatformUserStat",
            success: function (res) {
                //机构总数量
                var groupCount = res.group;
                var cooperation = res.cooperation;
                var cooperationName = "合作 " + cooperation;
                var partnerShip = res.partnerShip;
                var partnerShipName = "合伙 " + partnerShip;
                var direct = res.direct;
                var directName = "直营 " + direct;
                $('#chart_group').initRoundChart({
                    title: groupCount,
                    number: "机构数量(家)",
                    legendData: [cooperationName, partnerShipName, directName],
                    seriesData: [
                        {
                            value: cooperation, name: cooperationName, itemStyle: {
                                color: '#6d9ed6'
                            }
                        },
                        {
                            value: partnerShip, name: partnerShipName, itemStyle: {
                                color: '#edc242'
                            }
                        },
                        {
                            value: direct, name: directName, itemStyle: {
                                color: '#577bc5'
                            }
                        }
                    ], 
                    radius: ['45%', '65%'],
                    gridTop: '42%',
                    legendTop: '86%',
                    itemWidth: 6,
                    itemHeight: 6,
                    subtextFontSize: 16,
                    subtextColor: '#5c7bbb',
                    subtextFountWeight: 'bold',
                    subtextLineHeight: '56',
                    titleFontSize: 30,
                    titleColor: '#ff6537',
                    titleFontWeight: 'bold',
                    titleTop: '110'
                });


                //理财师
                var financierCount = res.financierCount;
                var financierPotentialName = "潜客 " + res.financierPotential;
                var financierUserName = "会员 " + res.financierUser;

                //直客
                var customerCount = res.customerCount;
                var customerPotentialName = "潜客 " + res.customerPotential;
                var customerUserName = "会员 " + res.customerUser;

                $('#chart_user').initRoundChart({
                    title: financierCount,
                    number: '理财师数量(位)',
                    legendData: [financierPotentialName, financierUserName],
                    seriesData: [
                        {
                            value: res.financierPotential, name: financierPotentialName, itemStyle: {
                                color: '#a9a9a9'
                            }
                        },
                        {
                            value: res.financierUser, name: financierUserName, itemStyle: {
                                color: '#edc242'
                            }
                        }
                    ],
                    radius: ['45%', '65%'],
                    gridTop: '42%',
                    legendTop: '86%',
                    itemWidth: 6,
                    itemHeight: 6,
                    subtextFontSize: 16,
                    subtextColor: '#5c7bbb',
                    subtextFountWeight: 'bold',
                    subtextLineHeight: '56',
                    titleFontSize: 30,
                    titleColor: '#ff6537',
                    titleFontWeight: 'bold',
                    titleTop: '110'
                });

                //rradd 直客
                $('#chart_user_zhi').initRoundChart({
                    title: customerCount,
                    number: '直客数量(位)',
                    legendData: [customerPotentialName, customerUserName],
                    seriesData: [
                        {
                            value: res.customerPotential, name: customerPotentialName, itemStyle: {
                                color: '#a9a9a9'
                            }
                        },
                        {
                            value: res.customerUser, name: customerUserName, itemStyle: {
                                color: '#edc242'
                            }
                        }
                    ],
                    radius: ['45%', '65%'],
                    gridTop: '42%',
                    legendTop: '86%',
                    itemWidth: 6,
                    itemHeight: 6,
                    subtextFontSize: 16,
                    subtextColor: '#5c7bbb',
                    subtextFountWeight: 'bold',
                    subtextLineHeight: '56',
                    titleFontSize: 30,
                    titleColor: '#ff6537',
                    titleFontWeight: 'bold',
                    titleTop: '110'
                });

                //产品总数量
                var productCount = res.product;
                var productPreheat = res.productPreheat;
                var productPreheatName = "预热 " + productPreheat;
                var productNormal = res.productNormal;
                var productNormalName = "在售 " + productNormal;
                var productFound = res.productFound;
                var productFoundName = "已成立 " + productFound;
                var productFundAccept = res.productFundAccept;
                var productFundAcceptName = "已兑付 " + res.productFundAccept;

                $('#chart_pro').initRoundChart({
                    title: productCount,
                    number: '运营产品(个)',
                    legendData: [productPreheatName, productNormalName, productFoundName, productFundAcceptName],
                    seriesData: [
                        {
                            value: productPreheat, name: productPreheatName, itemStyle: {
                                color: '#e5864c'
                            }
                        },
                        {
                            value: productNormal, name: productNormalName, itemStyle: {
                                color: '#79a4d7'
                            }
                        },

                        {
                            value: productFound, name: productFoundName, itemStyle: {
                                color: '#edc242'
                            }
                        },
                        {
                            value: productFundAccept, name: productFundAcceptName, itemStyle: {
                                color: '#5777c0'
                            }
                        }
                    ],
                    radius: ['45%', '65%'],
                    gridTop: '42%',
                    legendTop: '86%',
                    itemWidth: 6,
                    itemHeight: 6,
                    subtextFontSize: 16,
                    subtextColor: '#5c7bbb',
                    subtextFountWeight: 'bold',
                    subtextLineHeight: '56',
                    titleFontSize: 30,
                    titleColor: '#ff6537',
                    titleFontWeight: 'bold',
                    titleTop: '110'
                });
            }
        });

        //年、月报单金额统计
        $.get({
            url: "stat/consolestat/GetOrderAmountStatByYear",
            success: function (res) {
                //本月报单
                var currentMonth = res.currentMonth;
                //本年度报单
                var sumYear = res.sum;
                //月统计集合
                var monthAmount = [];
                res.monthGroup.forEach(function (item) {
                    monthAmount.push(item.amount);
                });

                $('#chart_column_money').initColumnChart({
                    title: '本月报单：' + currentMonth + '亿    本年度累计报单：' + sumYear + '亿',
                    subText: "金额：百万元 / 日期：月",
                    xAxisData: $.monthData(),
                    seriesData: [
                        {
                            type: 'bar',
                            barWidth: 20,
                            data: monthAmount,
                            label: {
                                normal: {
                                    show: true,
                                    color: '#ff6634',
                                    position: 'top'
                                }
                            },
                        }
                    ]
                });
            }
        });

        //本月报单产品数量统计
        $.get({
            url: "stat/consolestat/GetOrderCountStatByMonth",
            success: function (res) { 
                //产品报单统计集合
                var productList = [];
                var productOrderCountList = [];
                res.countGroup.forEach(function (item) {
                    productList.push(item.productTitle);
                    productOrderCountList.push(item.count);
                });
                $('#chart_column_pro').initColumnChart({
                    title: '本月报单热门产品',
                    subText: "单数：笔 / 产品：名称",
                    xAxisData: productList,
                    rotate: -30,
                    axPadding: [0, 10, 0, 0],
                    gridRight:'9%',
                    seriesData: [
                        {
                            type: 'bar',
                            barWidth: 20,
                            data: productOrderCountList,
                            label: {
                                normal: {
                                    show: true,
                                    color: '#ff6634',
                                    position: 'top'
                                }
                            },
                        }
                    ]
                });
            }
        });
    };
};