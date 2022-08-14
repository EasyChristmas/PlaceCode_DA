
var SearchModel = function (model) {
    var self = this;
    self.id = ko.observable(model.id); //编号
    self.name = ko.observable(model.name); //名称
    self.type = ko.observable(model.type); //类型编号
    self.typeName = ko.observable(model.typeName); //类型
    self.objInfo = ko.observable(model.objInfo); //对象信息
    self.fragment = ko.observable(model.fragment); //匹配内容
};

var searchViewModel = function () {
    var self = this;

    //搜索结果项集合，用于页面展示
    self.searchResultList = ko.observableArray([]);
    //搜索结果项保存，用于页面筛选过滤
    self.searchResultData = [];

    //是否显示下拉框
    self.showDiv = ko.observable(false);

    //点击列表项
    self.clickItem = function (item) {
        //alert(item.name);
    };

    //会员数量
    self.userCount = ko.observable(0);
    //产品数量
    self.productCount = ko.observable(0);
    //报单数量
    self.orderCount = ko.observable(0);

    //查询结果处理方法
    self.searchResult = function (dataList) {
        self.searchResultList([]);
        for (var i = 0; i < dataList.length; i++) {
            var id = dataList[i].id;
            var objInfo = '';
            //产品
            if (dataList[i].type == 1) {
                id = (dataList[i].id + '-' + dataList[i].productTypeId);
                objInfo = "产品编号：" + dataList[i].id + ", "
                    + "产品类型：" + dataList[i].productType + ", "
                    + "收益率：" + dataList[i].profit + ", "
                    + "收益类型：" + dataList[i].profitType + ", "
                    + "发行机构：" + dataList[i].productOrganizationName + ", "
                    + "投资门槛：" + dataList[i].menKan + ", "
                    + "投资期限：" + dataList[i].term;
            }
            //报单
            else if (dataList[i].type == 3) {
                objInfo = "报单编号：" + dataList[i].id + ", "
                    + "产品名称：" + dataList[i].productName + ", "
                    + "服务经理：" + dataList[i].cmanagerName + ","
                    + "产品经理：" + dataList[i].pmanagerName + ", "
                    //+ "会员名称：" + dataList[i].userName + ", "
                    //+ "客户名称：" + dataList[i].customerName + ", "
                    + "打款金额：" + dataList[i].payPrice + ", "
                    + "产品成立：" + dataList[i].foundTime;
            }
            //会员
            else if (dataList[i].type == 4) {
                objInfo = "会员编号：" + dataList[i].id + ", "
                    + "会员身份：" + dataList[i].roleName + ", "
                    + "会员状态：" + dataList[i].statusName + ", "
                    + "服务经理：" + dataList[i].adminName + ", "
                    + "所属平台：" + dataList[i].platformName + ", "
                    + "注册时间：" + $.showDate(dataList[i].createTime, 'yyyy-MM-dd') + ", "
                    + "最近登录：" + $.showDate(dataList[i].lastLoginTime, 'yyyy-MM-dd')
            }
            self.searchResultList.push(new SearchModel({ id: id, name: dataList[i].name, type: dataList[i].type, typeName: dataList[i].typeName, fragment: dataList[i].fragment, objInfo: objInfo }));
        }
    };

    //统计分类数量
    self.totalTypeCount = function () {
        var productCount = 0;
        var orderCount = 0;
        var userCount = 0;
        for (var i = 0; i < self.searchResultData.length; i++) {
            //产品
            if (self.searchResultData[i].type == 1) {
                productCount++;
            }
            //报单
            else if (self.searchResultData[i].type == 3) {
                orderCount++;
            }
            //会员
            else if (self.searchResultData[i].type == 4) {
                userCount++;
            }
        }
        self.productCount(productCount);
        self.orderCount(orderCount);
        self.userCount(userCount);
    }

    //打开详情
    self.openDetail = function (obj) {
        //编号
        var idData = $(obj).attr('dataid');
        //类型
        var type = $(obj).attr('datatype');

        self.closeSearchDiv();
        //产品
        if (type == 1) {
            id = idData.split('-')[0];
            var productTypeId = idData.split('-')[1];

            if (productTypeId <= 2) {
                $.openTab({
                    url: '/product/detail?id=' + id,
                    title: "产品详情 - " + id
                });
            }
            else if (productTypeId == 3) {
                $.openTab({
                    url: '/product/creditdetail?id=' + id,
                    title: "产品详情 - " + id
                });
            }
            else if (productTypeId == 4) {
                $.openTab({
                    url: '/product/privatedetail?id=' + id,
                    title: "产品详情 - " + id
                });
            }
            else {
                $.openTab({
                    url: '/product/pevcdetail?id=' + id,
                    title: "产品详情 - " + id
                });
            }
        }
        //报单
        else if (type == 3) {
            $.openTab({
                url: "/trade/orderapprove?orderId=" + idData,
                title: "交易详情 - " + idData
            });
        }
        //会员
        else if (type == 4) {
            $.openTab({
                url: "/user/edit?id=" + idData,
                title: "用户详情 - " + idData
            });
        }
    }

    self.getSearchData = function (keyword) {
        if (!keyword) {
            self.searchDataDivReset();
            return;
        }
        $.get({
            url: "search?pageIndex=1&pageSize=10&keyword=" + keyword,
            success: function (res) {
                var data = res;
                self.searchResultData = data;
                self.searchResult(self.searchResultData);
                self.totalTypeCount();

                //$("#bot_box").html("");
                //var html = "<ul>"
                //for (var i = 0; i < data.length; i++) {
                //    html += "<li>";
                //    html += "【" + data[i].typeName + "-" + data[i].id + "】";
                //    html += data[i].name;
                //    html += "<br/>";
                //    html += "<span class='fragment'>" + data[i].fragment + "</span>";
                //    if (i < data.length - 1) {
                //        html += "<hr/>"
                //    }
                //    html += "</li>";
                //}
                //html += "</ul>";
                //$("#bot_box").html(html);
                if (data.length > 0) {
                    //$("#bot_box").show();
                    self.showDiv(true);
                } else {
                    //$("#bot_box").hide();
                    self.showDiv(false);
                }
            }
        })
    }

    //搜索数据下拉框还原
    self.searchDataDivReset = function (obj) {
        self.showDiv(false);
        self.searchResultList([]);

        self.userCount(0);
        self.productCount(0);
        self.orderCount(0);
    }

    //关闭查询结果框
    self.closeSearchDiv = function () {
        $("#divSearch").hide();
        //给Input搜索框赋空值
        $("#searchContent").val('');
    }
};
