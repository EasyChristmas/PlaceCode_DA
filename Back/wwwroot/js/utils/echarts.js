 
$.fn.extend({  
    //圆饼图表方法
    initRoundChart: function (options) { 
        var defaults = {
            title: '',
            number: '',
            legendData: [],
            seriesData: [],
            legendTop: '82%',
            labelShow: true,
            radius: ['30%', '55%'],
            itemWidth:15,
            itemHeight: 12,
            gridTop: '41%',
            legendFontWeight: 'normal',
            titleColor: '#333',
            titleFontSize: 14,
            titleFontWeight: 'normal',
            subtextFontSize: 14,
            subtextColor: '#333',
            subtextFountWeight: 'normal',
            subtextLineHeight: '0',
            titleLineHeight: '0',
            titleTop: '31%'
        };
        var opts = $.extend(defaults, options);
        if (!$(this)[0]) {
            return false;
        }
        // 基于准备好的dom，初始化echarts实例   
        var myChart = echarts.init($(this)[0]);

        // 指定图表的配置项和数据
        var option = {
            //标题
            title: {
                //text: opts.title + '：' + opts.number,
                text: opts.title,
                subtext: opts.number,//副标题
                subtextStyle: {
                    fontSize: opts.subtextFontSize,
                    color: opts.subtextColor,
                    fontWeight: opts.subtextFountWeight,
                    lineHeight:opts.subtextLineHeight,
                },
                x: 'center',
                textStyle: {
                    color: opts.titleColor,
                    fontSize: opts.titleFontSize,
                    fontWeight: opts.titleFontWeight,
                    lineHeight: opts.titleLineHeight
                }, 
                top: opts.titleTop
            }, 
            tooltip: {
                trigger: 'item',
                formatter: "{b} ({d}%)",//{a} <br/>{b} : {c} ({d}%) 
            },
            //图例
            legend: {
                orient: 'horizontal',
                left: 'center',
                data: opts.legendData,
                textStyle: {
                    fontSize: 12,
                    color: '#666',
                    fontWeight:opts.legendFontWeight
                },
                itemWidth: opts.itemWidth,
                itemHeight: opts.itemHeight,
                top: opts.legendTop
            }, 
            series: [
                { 
                    name: opts.title,
                    type: 'pie',
                    radius: opts.radius, 
                    center: ['50%', opts.gridTop],//grid的位置
                    data: opts.seriesData, 
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    },
                    //每块的指针
                    label: {
                        normal: {
                            show: opts.labelShow
                        }
                    }
                }
            ]
        };
        myChart.hideLoading();
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    },
    //柱形图表
    initColumnChart: function (options) {
        var defaults = {
            title: '',
            subText: '',
            xAxisData: [],
            yAxisData:[],
            rotate:0,
            seriesData: [], 
            legendData: [],//图例
            axPadding: 0,//x轴文字padding
            gridTop:'22%',
            gridLeft:'3%',
            gridRight: '3%',//默认图表右间距
            xAxisShow: true,//默认显示x轴
            yAxisShow: true,//默认显示y轴
            xAxisType: 'category',
            yAxisType:'value',
            axisPointerShow: true,//默认鼠标移上去显示cross
            yAxisSplitLineShow: true,//背景y轴虚线是否显示
            color: ['#ff6537'],
            axisPointerColor: '#ff6537',
            axisLabelInternal:0

        };
        var opts = $.extend(defaults, options);
        if (!$(this)[0]) {
            return false;
        } 
        
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init($(this)[0]);

        // 指定图表的配置项和数据
        var option = {
            title: {
                text: opts.title,
                subtext: opts.subText,//副标题
                x: 'center',
                textStyle: {
                    color: "#333",
                    fontSize: 14,
                    fontWeight: 'normal'
                }, 
                //textAlign:'center',
                subtextStyle: {
                    color: "#666",
                    fontSize: 12,
                    fontWeight: 'normal',
                },
                top:'0'
            },
            color: opts.color,
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'cross',        // 默认为直线，可选为：'line' | 'shadow' | 'cross'//横纵指示
                    label: {
                        color: '#fff',
                        backgroundColor: opts.axisPointerColor
                    },
                    lineStyle: {
                        color: '#ffbfaa',
                        type: 'dashed'
                    },
                    crossStyle: {
                        color: '#ffbfaa',
                        type:'dashed'
                    }
                }, 
            },
            axisPointer: {
                show:opts.axisPointerShow,
            },
            //canvas的位置
            grid: {
                left: opts.gridLeft,
                right: opts.gridRight,
                bottom: '3%',
                top: opts.gridTop,
                containLabel: true
            },
            xAxis: {
                show: opts.xAxisShow,
                type: opts.xAxisType,
                //背景横轴css
                splitLine: {
                    show: false,
                    lineStyle: {
                        color: '#f5f5f5',
                        type:'dashed'
                    }
                }, 
                //横轴文字
                axisLabel: {
                    interval: opts.axisLabelInternal,//横轴信息全部显示 
                    rotate: opts.rotate,
                    color: '#6d6d6d',
                    padding: opts.axPadding
                },
                //横轴坐标线
                axisLine: {
                    lineStyle: {
                        color: '#f5f5f5',
                        type: 'dashed'
                    }
                },
                data: opts.xAxisData
            },
            yAxis: {
                show: opts.yAxisShow,
                type: opts.yAxisType,
                //背景纵轴css
                splitLine: {
                    show: opts.yAxisSplitLineShow,
                    lineStyle: {
                        color: '#ececec',
                        type: 'dashed', //solid,dashed,dotted
                    }
                },
                //纵轴文字
                axisLabel: {
                    interval: 0,//横轴信息全部显示 
                    color: '#6d6d6d'
                },
                //纵轴坐标线
                axisLine: {
                    lineStyle: {
                        show: false,
                        color: '#f5f5f5',
                        type: 'dashed'
                    }
                },
                data: opts.yAxisData
            },
            legend: {
                data: opts.legendData,
                right:0
            },
            series: opts.seriesData
        };
        myChart.hideLoading();
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    },
    //雷达图表
    //使用方法
    //<div id="chart_radar" class="chart_column"></div>
    //$('#chart_radar').initRadar({
    //    data: [10, 20, 30]
    //});
    initRadar: function (options) {
        var defaults = {
            titleText: '',
            data:[]
        };
        var opts = $.extend(defaults, options);
        if (!$(this)[0]) {
            return false;
        }

        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init($(this)[0]);

        // 指定图表的配置项和数据
        var option = {
            title: {
                text: opts.titleText
            },
            tooltip: {
                trigger: 'axis'
            },
            //legend: {
            //    x: 'center',
            //    data: ['某软件', '某主食手机', '某水果手机', '降水量', '蒸发量']
            //},
            radar: [
                {
                    indicator: [
                        { text: '近度', max: 5 },
                        { text: '熟度', max: 5 },
                        { text: '硬度', max: 5 },
                    ],
                    center: ['50%', '50%'],
                    radius: 40
                },
            ],
            series: [
                {
                    type: 'radar',
                    tooltip: {
                        trigger: 'item'
                    },
                    itemStyle: { normal: { areaStyle: { type: 'default' } } },
                    data: [
                        {
                            value: opts.data,
                            name: '线索'
                        }
                    ]
                },
            ]
        };
        myChart.hideLoading();
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    }
});
$.extend({
    //遍历月份
    monthData: function () {
        var data = [];
        for (var i = 1; i <= 12; i++) {
            data.push(i + '月');
        }
        return data;
    },
    //封装圆饼图输出data的方法
    initChartRoundData: function (arr) {
        if (!arr)
            return false;
        var legendData = [];
        var seriesData = [];
        for (var i = 0; i < arr.length; i++) {
            legendData.push(arr[i].name);
            seriesData.push({
                value: arr[i].value,
                name: arr[i].name,
                itemStyle: {
                    color: arr[i].color
                }
            });
        }; 
        return {
            legendData,
            seriesData
        };
    },
    //封装圆饼图输出data的方法
    initChartRoundDataTwo: function (arr) {
        if (!arr)
            return false;
        var legendData = [];
        var seriesData = [];
        for (var i = 0; i < arr.length; i++) {
            legendData.push(arr[i].name + ' ' + arr[i].value);
            seriesData.push({
                value: arr[i].value,
                name: arr[i].name + ' ' + arr[i].value,
                itemStyle: {
                    color: arr[i].color
                }
            });
        };
        return {
            legendData,
            seriesData
        };
    },
    //封装柱形图输出data的方法
    initChartColumnData: function (arr) {
        if (!arr)
            return false;
        var defaults = {
            name: '',
            type: 'line',
            stack: '',
            data: [],
            barWidth: Number,//默认柱子宽度30px
            color: ''
        };
        var legendData = [];
        var seriesData = [];
        var ops = [];
        for (var i = 0; i < arr.length; i++) {
            ops = $.extend(defaults, arr[i]);
            legendData.push(ops.name);
            seriesData.push({
                name: ops.name,
                type: ops.type,
                stack: ops.stack,
                data: ops.data,
                barWidth: ops.barWidth,
                label: {
                    normal: {
                        show: true,
                        color: '#ff6634',
                        position:'top'
                    }
                },
                itemStyle: {
                    color: ops.color
                }
            });
        }
        return {
            legendData,
            seriesData
        };
    },
    //遍历13年至今的年份
    initYearData: function () {
        var date = new Date;
        var nowYear = date.getFullYear();
        var yearList = [];
        for (var i = 2013; i < nowYear+1; i++) {
            yearList.push(i);
        }
        return yearList;
    },
    //图表自适应,并且默认显示loading图标 
    initChartResize: function (id) { 
        var chart = echarts.init($('#' + id + '')[0]);
        chart.showLoading({
            text: '正在加载中'
        });
        // chart.resize();
        $(window).resize(function () {
            chart.resize();
        });
    },
    //遍历用户分布数
    initUserData: function (arr) {
        var arrName = [];
        var arrValue = [];
        arr.forEach(function (item) {
            arrName.push(item.name);
            arrValue.push(item.value);
        });
        return arr = {
            arrName,
            arrValue
        };

    },
    //图表自适应
    chartResizeAuto: function () {
        var dom = $('.chartSize');
        for (var i = 0; i < dom.length; i++) { 
            var chart = echarts.init($('#' + dom[i].id + '')[0]); 
            chart.resize();
        } 
    }
});

$(function () {
    //图表自适应,凡是有chartSize命名的图表都自适应
    var dom = $('.chartSize'); 
    for (var i = 0; i < dom.length; i++) { 
        $.initChartResize(dom[i].id);
    } 
});