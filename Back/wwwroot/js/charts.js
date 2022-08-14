Highcharts.setOptions({
    lang: {
        contextButtonTitle: "图表导出菜单",
        decimalPoint: ".",
        downloadJPEG: "下载JPEG图片",
        downloadPDF: "下载PDF文件",
        downloadPNG: "下载PNG文件",
        downloadSVG: "下载SVG文件",
        drillUpText: "返回 {series.name}",
        loading: "加载中",
        months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        noData: "没有数据",
        numericSymbols: ["千", "兆", "G", "T", "P", "E"],
        printChart: "打印图表",
        resetZoom: "恢复缩放",
        resetZoomTitle: "恢复图表",
        shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        thousandsSep: ",",
        weekdays: ["星期一", "星期二", "星期三", "星期三", "星期四", "星期五", "星期六", "星期天"]
    }
});
jQuery.fn.extend({
    //绑定柱状图
    bindBar: function (options, callBack) {
        var defaults =
            {
                type: '',
                tableId: '',
                xdata: '',
                ydata: '',
                xtitle: '',
                ytitle: ''
            };
        var opts = $.extend(defaults, options);
        $(this).highcharts({
            credits: {
                enabled: false//不显示logo
            },
            data: options.tableId ? {
                table: opts.tableId
            } : null,
            chart: {
                type: opts.type,//图表类型 column为矩形，line为线性
            },
            title: {
                text: ' '
            },
            xAxis: {
                categories: opts.xdata,//x轴数据
                labels: {
                    style: {
                        fontFamily: '微软雅黑'
                    }
                },
            },
            yAxis: {
                allowDecimals: false,
                title: {
                    text: opts.ytitle
                },
                labels: {
                    style: {
                        fontFamily: '微软雅黑'
                    }
                },
                max: opts.ymax //y轴最大数据
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}：</td>' +
                '<td style="padding:0"><b>{point.y}</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                series: {
                    cursor: 'pointer',
                    events: {
                        click: function (obj) {
                            if (typeof (callBack) == "function")
                                callBack(obj);
                            else {
                                return $(obj);
                            }
                        }
                    }
                }
            },
            legend: {
                //layout: 'vertical',
                //backgroundColor: '#FFFFFF',
                //floating: true,
                //align: 'bootom',
                //verticalAlign: 'bootom',
                //x: 90,
                //y: 45,
                //labelFormat: '<span style="{color}">{name}</span>'
            },
            series: [{
                name: opts.xtitle,//x轴title
                data: opts.ydata,//y轴数据
                showInLegend: true,// 设置为 false 即为不显示在图例中

            }]

        });
    },
    //绑定饼图
    bindPie: function (options) {
        var defaults =
            {
                colors: [],
                seriesName: "",
                seriesData: []
            };
        var opts = $.extend(defaults, options);

        var seriesData = [];
        for (var i = 0; i < opts.seriesData.length; i++) {
            seriesData.push({ name: opts.seriesData[i].name, y: opts.seriesData[i].value });
        }

        $(this).highcharts({
            credits: {
                enabled: false//不显示logo
            },
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie',
                width: "350"
            },
            exporting: {
                enabled: false
            },
            title: {
                text: ''
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    colors: opts.colors,
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b><br>{point.percentage:.1f} %',
                        distance: -50,
                        filter: {
                            property: 'percentage',
                            operator: '>',
                            value: 4
                        }
                    }
                }
            },
            series: [{
                name: opts.seriesName,
                data: seriesData
            }]
        });
    }
});