var viewData = {};
$(function () {
    $.tableHeight(30, ".ibox-content");
    //初始化Ko
    var initKo = function () {
        //输入数据
        viewData.inputData = ko.observable(null);
        //理财师信息 此处本单个实体 为了使用实体类的属性 用mappingJS来填充
        viewData.userInfoList = ko.observableArray([]);

        viewData.userRecentLoginData = ko.observableArray([]);

        if ($("#currentRoleIds").val().indexOf("26") >= 0 || $("#currentRoleIds").val().indexOf("27") >= 0) {
            $.get({
                async: false,
                url: "User/getrecentloginuser",
                data: { pageSize: 12 },
                success: function (result) {
                    for (var i = 0; i < result.data.length; i++)
                        viewData.userRecentLoginData.push(result.data[i]);
                }
            });
        }
        viewData.openUserFootDetail = function (userId) {

            $.openTab({
                url: "/user/edit?id=" + userId + "&tag=userFootprint",
                title: "用户详情 - " + userId
            });
            //$.openTab({
            //    url: '/user/footprint?userId=' + userId,
            //    title: "会员足迹 - " + userId
            //});
        };
        viewData.platform = ko.observable(null);
        //用户Id
        viewData.userId = ko.observable(null);
        //代预约
        viewData.openAppointmentApprove = function (userModel) {
            viewData.userId(userModel.id());
            viewData.platform(userModel.platform());

            console.log(viewData.platform());
            $("#appointmentForm").resetForm();
            var $self = $("#addAppoinement");
            $self.addClass("toggled");
            //加载产品信息
            $.Data.bindOnlineProduct({ selId: 'selProduct', productTypeId: $("select[name='productTypeId'] option:selected").val() });
        };
        //隐藏预约界面
        viewData.hidePage = function () {
            var $self = $("#addAppoinement");
            event.stopPropagation();
            $self.removeClass("toggled");
        };
        //保存预约数据
        viewData.submitAppointment = function () {
            if ($("#appointmentForm").validate()) {
                $("#appointmentForm").submitForm({
                    type: "post",
                    isCheck: true,
                    url: "trade/appointment",
                    data: { userId: viewData.userId(), platform: viewData.platform() },
                    success: function (result) {
                        if (parseInt(result) > 0) {
                            $("#appointmentForm").resetForm();
                            $.success("预约成功！", 3000);
                            viewData.userInfoList([]);
                            viewData.inputData(null);
                            viewData.userId(null);
                            viewData.hidePage();
                        }
                    },
                    error: function (resultErr) {
                        $.errorMsg(resultErr.responseText);
                    }
                });
            }
        };
        //移除输入数据
        viewData.removeInputData = function () {
            viewData.inputData(null);
            viewData.userInfoList([]);
            viewData.userId(null);
            viewData.hidePage();
            $("#nodata").hide();
        };
        //监控
        viewData = ko.mapping.fromJS(viewData);
        //ko绑定
        ko.applyBindings(viewData);
        //手机号搜索
        $("#txtInputData").keyup(function (event) {
            if (event.keyCode === 13) {
                viewData.inputData($("#txtInputData").val());
                //console.log(viewData.inputData());
                if (viewData.inputData() === null || $.trim(viewData.inputData()) === "") {
                    $.tips("请输入手机号或者身份证", $("#txtInputData"));
                    return;
                }
                var regIdCard = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
                var regMobile = /^1[3|4|5|7|8][0-9]\d{8}$/;
                if (!regMobile.test(viewData.inputData()) && !regIdCard.test(viewData.inputData())) {
                    $.tips("请输入正确的手机号或者身份证", $("#txtInputData"));
                    return;
                }
                var params = {};
                if (regIdCard.test(viewData.inputData())) {
                    params = { idCard: viewData.inputData() }
                }
                if (regMobile.test(viewData.inputData())) {
                    params = { mobile: viewData.inputData() }
                }

                $.get({
                    async: false,
                    url: "User/getConsoleUserInfo",
                    data: params,
                    success: function (result) {
                        viewData.userInfoList.removeAll();
                        $("#nodata").hide();
                        //console.log(result);
                        if (result.length > 0) {
                            ko.mapping.fromJS(result, {}, viewData.userInfoList);
                            //viewData.userInfoList.push(result);
                        } else {
                            $("#nodata").show();
                        }
                    }
                });
            }
        });
    }();
    //初始化加载数据
    var initData = function () {
        //加载……
        var initDataParams = function () {
        };
    }();
    var url = $("#addressQrcodeUrl").text();
    //$("#qrcode").qrcode(url);
    $("#qrcode").qrcode({
        render: "canvas", //table或者canvas方式 
        width: 120, //宽度 
        height: 120, //高度 
        text: $.utf16to8(url) //任意内容 
    });
    //报表
    hightcharts('#container1', '一分统计', '一财', '二财', '三财', '四财',
        [{
            name: '壹财富',
            data: [2, 2, 3, 2]
        }, {
            name: '九天',
            data: [3, 4, 4, 2]
        }]
    );
    hightcharts('#container2', '二分统计', '一财', '二财', '三财', '四财',
        [{
            name: '壹财富',
            data: [2, 2, 3, 2]
        }, {
            name: '九天',
            data: [3, 4, 4, 2]
        }]
    );
    hightcharts('#container3', '三分统计', '一财', '二财', '三财', '四财',
        [{
            name: '壹财富',
            data: [2, 2, 3, 2]
        }, {
            name: '九天',
            data: [3, 4, 4, 2]
        }]
    );
    hightcharts('#container4', '一分统计', '一财', '二财', '三财', '四财',
        [{
            name: '壹财富',
            data: [2, 2, 3, 2]
        }, {
            name: '九天',
            data: [3, 4, 4, 2]
        }]
    );
});

function qrCodeShow() {
    $("#qrcode").show();
}
function qrCodeHide() {
    $("#qrcode").hide();
}
//复制链接地址
function copyUrl() {
    var url = document.getElementById("biao1");
    url.select(); // 选择对象
    document.execCommand("Copy"); // 执行浏览器复制命令
    $.success("已复制好，可贴粘。", 1000);
};
//复制二维码链接地址
function copyQrCodeUrl() {
    var url = document.getElementById("biao2");
    url.select(); // 选择对象
    document.execCommand("Copy"); // 执行浏览器复制命令
    $.success("已复制好，可贴粘。", 1000);
};

//highcharts图表
function hightcharts(item, title, name1, name2, name3, name4, data) {
    $(item).highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: title
        },
        xAxis: {
            categories: [name1, name2, name3, name4]
        },
        yAxis: {
            min: 0,
            title: {
                text: '打款金额/万'
            },
            stackLabels: {
                enabled: true,
                style: {
                    fontWeight: 'bold',
                    color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                }
            }
        },
        legend: {
            align: 'right',
            x: -30,
            verticalAlign: 'top',
            y: 25,
            floating: true,
            //backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
            //borderColor: '#CCC',
            borderWidth: 0,
            shadow: false
        },
        tooltip: {
            formatter: function () {
                return '<b>' + this.x + '</b><br/>' +
                    this.series.name + ': ' + this.y + '<br/>' +
                    'Total: ' + this.point.stackTotal;
            }
        },
        plotOptions: {
            column: {
                stacking: 'normal',
                dataLabels: {
                    enabled: true,
                    color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                    style: {
                        textShadow: '0 0 3px black'
                    }
                }
            }
        },
        credits: {
            enabled: false//隐藏掉右下角的网址
        },
        exporting: {
            enabled: false//隐藏掉右上角的按钮
        },
        series: data
    });
}
