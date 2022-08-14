//产品编辑页面VM控制对象
function productViewModel() {


    var self = this;

    //当前产品ID编号
    self.productId = null;

    //当前产品复制ID编号
    self.copyId = null;

    //当前页面产品信息实体
    self.productInfo = {};

    //产品贴息
    self.productDiscount = { xhJson: [], ycfJson: [], jtJson: [], ycfStartTime: null, jtStartTime: null };

    //价格区间
    self.productPriceStructList = ko.observableArray([]);
    //发行易价格
    self.supplierProductPriceList = ko.observableArray([]);
    self.changePriceStruct = function(elem) {
        var priceRange = $(elem).text();
        var start = priceRange.substring(0, priceRange.indexOf('-'));
        var end = priceRange.substring(priceRange.indexOf('-') + 1, priceRange.indexOf('('));
        //加载发行易价格
        $.get({
            url: 'up/supplierProduct/PriceSummary',
            data: { productId: self.productId, start: start, end: end },
            success: function(result) {
                self.supplierProductPriceList([]);
                for (i = 0; i < result.data.length; i++) {
                    self.supplierProductPriceList.push(result.data[i]);
                }
            }
        });
    }

    //根据产品状态，角色权限，自动判断字段操作权限，可见权限等
    self.autoDisabled = function () {
        $("#newPriceSystemContent input:not([priceItem])").hide();
        //系统管理员开启全部编辑权限 //飞哥说暂时写死万季明全部权限
        if ($("#currentRole").val() == "Admin" || $("#currentUserId").val() == "71" || $("#currentRole").val() == "Contract") {
            $("#priceSystemContent [disabled=disabled]").removeAttr("disabled");
            $("#newPriceSystemContent [disabled=disabled]").removeAttr("disabled");
            $("#tyPriceSystemContent [disabled=disabled]").removeAttr("disabled");
            $("#jdt").removeAttr("disabled");
            $("#raiseProgress").removeAttr("disabled");
            $("#xmld").removeAttr("disabled");
            $("#shortXmld").removeAttr("disabled");
            $("#jTJdt").removeAttr("disabled");
            $("#jTRaiseProgress").removeAttr("disabled");
            $("#jTXmld").removeAttr("disabled");
            $("#tYJdt").removeAttr("disabled");
            $("#tYRaiseProgress").removeAttr("disabled");
            $("#tYXmld").removeAttr("disabled");
            $("#autoGenerate").show();
            $("#saveAuto").show();
            $("#ycfFileUpload").removeAttr("disabled");
            $("#jtFileUpload").removeAttr("disabled");
            $("#tyFileUpload").removeAttr("disabled");
            $("#xhDiscount").show();
            $("#ycfDiscount").hide();
            //$("#jtDiscount").show();
            $("#productDiscountDiv [disabled=disabled]").removeAttr("disabled");
            return;
        }
        //编辑或复制产品
        if (self.copyId || self.productId) {

            //编辑状态：启用价格变更通知按钮
            if (self.productId) {
                $(".priceChangeNofity").show();
                if (($("#currentRole").val() != "Pm" && $("#currentRole").val() != "DataPost" && $("#currentRole").val() != "Admin" && $("#currentRole").val() != "Ceo") || (self.productInfo.jtAdminId != $("#currentUserId").val() && self.productInfo.tyAdminId != $("#currentUserId").val() && self.productInfo.adminId != $("#currentUserId").val())) {
                    self.setDisabledForm();
                    $("#priceSystemContent").show();
                    $(".ycfBackEndContent").show();
                   
                    if ($("#priceEditPower").val() == "1") {
                        if (self.productInfo.isFounded == 0) {
                            $("#priceSystemContent input[data-title='channelPrice'").removeAttr("disabled");
                        }

                        //后端佣金价格，只有平台可以修改
                        if ($.getCurrentUser().project == "PlatForm") {
                            $(".ycfBackEndContent .secretInfo").removeAttr("disabled");
                        }
                    }
                    return;
                }
            }


            //平台产品经理，启用平台价格编辑
            if (self.productInfo.adminId == $("#currentUserId").val() || self.productInfo.jtAdminId == $("#currentUserId").val() || self.productInfo.tyAdminId == $("#currentUserId").val()) {
                //YCF产品经理可操作YCF字段
                if ($("#currentProject").val() == "PlatForm") {
                    $("#jdt").removeAttr("disabled");
                    $("#raiseProgress").removeAttr("disabled");
                    $("#xmld").removeAttr("disabled");
                    $("#shortXmld").removeAttr("disabled");
                    $("#priceSystemContent .ycfPrice").removeAttr("disabled");
                    $("#newPriceSystemContent .ycfPrice").removeAttr("disabled");
                    $("#ycfFileUpload").removeAttr("disabled");
                    $("#ycfDiscount").hide();
                    $("#ycfDiscount [disabled=disabled]").removeAttr("disabled");
                }
                //JT产品经理可操作JT字段
                else if ($("#currentProject").val() == "Jt") {
                    $("#jTJdt").removeAttr("disabled");
                    $("#jTRaiseProgress").removeAttr("disabled");
                    $("#jTXmld").removeAttr("disabled");
                    $("#priceSystemContent .jtPrice").removeAttr("disabled");
                    $("#newPriceSystemContent .jtPrice").removeAttr("disabled");
                    $("#jtFileUpload").removeAttr("disabled");
                    //$("#jtDiscount").show();
                    $("#jtDiscount [disabled=disabled]").removeAttr("disabled");
                }
                //TY产品经理可操作TY字段
                else if ($("#currentProject").val() == "Ty") {
                    $("#tYJdt").removeAttr("disabled");
                    $("#tYRaiseProgress").removeAttr("disabled");
                    $("#tYXmld").removeAttr("disabled");
                    $("#tyFileUpload").removeAttr("disabled");
                    $("#tyPriceSystemContent .tyPrice").removeAttr("disabled");
                }

                $("#priceSystemContent .baseInfo").removeAttr("disabled");
                $("#newPriceSystemContent .baseInfo").removeAttr("disabled");
                $("#priceSystemContent .secretInfo").removeAttr("disabled");
                $("#newPriceSystemContent .secretInfo").removeAttr("disabled");
                $("#tyPriceSystemContent .baseInfo").removeAttr("disabled");
                $("#tyPriceSystemContent .secretInfo").removeAttr("disabled");
            }
            //系统管理员、CEO、启用所有价格编辑
            if ($("#currentRole").val() == "Admin"
                || $("#currentRole").val() == "Ceo") {
                $("#autoGenerate").show();
                $("#saveAuto").show();
                $("#priceSystemContent [disabled=disabled]").removeAttr("disabled");
                $("#newPriceSystemContent [disabled=disabled]").removeAttr("disabled");
                $("#tyPriceSystemContent  [disabled=disabled]").removeAttr("disabled");
                $("#ycfFileUpload").removeAttr("disabled");
                $("#jtFileUpload").removeAttr("disabled");
                $("#tyFileUpload").removeAttr("disabled");
                $("#xhDiscount").show();
                $("#ycfDiscount").hide();
                //$("#jtDiscount").show();
                $("#productDiscountDiv [disabled=disabled]").removeAttr("disabled");
            }


            if (self.copyId) {
                //YCF产品经理可操作YCF字段
                if ($("#currentProject").val() == "PlatForm" && $("#currentRole").val() == "Pm") {
                    $("#jdt").removeAttr("disabled");
                    $("#raiseProgress").removeAttr("disabled");
                    $("#xmld").removeAttr("disabled");
                    $("#shortXmld").removeAttr("disabled");
                    $("#priceSystemContent .ycfPrice").removeAttr("disabled");
                    $("#newPriceSystemContent .ycfPrice").removeAttr("disabled");
                    $("#ycfFileUpload").removeAttr("disabled");
                    $("#ycfDiscount").hide();
                    $("#ycfDiscount [disabled=disabled]").removeAttr("disabled");
                }
                //JT产品经理可操作JT字段
                else if ($("#currentProject").val() == "Jt" && $("#currentRole").val() == "Pm") {
                    $("#jTJdt").removeAttr("disabled");
                    $("#jTRaiseProgress").removeAttr("disabled");
                    $("#jTXmld").removeAttr("disabled");
                    $("#priceSystemContent .jtPrice").removeAttr("disabled");
                    $("#newPriceSystemContent .jtPrice").removeAttr("disabled");
                    $("#jtFileUpload").removeAttr("disabled");
                    //$("#jtDiscount").show();
                    $("#jtDiscount [disabled=disabled]").removeAttr("disabled");
                }
                //TY产品经理可操作TY字段
                else if ($("#currentProject").val() == "Ty" && $("#currentRole").val() == "Pm") {
                    $("#tYJdt").removeAttr("disabled");
                    $("#tYRaiseProgress").removeAttr("disabled");
                    $("#tYXmld").removeAttr("disabled");
                    $("#tyFileUpload").removeAttr("disabled");
                    $("#tyPriceSystemContent .tyPrice").removeAttr("disabled");
                }

                $("#priceSystemContent .baseInfo").removeAttr("disabled");
                $("#newPriceSystemContent .baseInfo").removeAttr("disabled");
                $("#priceSystemContent .secretInfo").removeAttr("disabled");
                $("#newPriceSystemContent .secretInfo").removeAttr("disabled");
                $("#tyPriceSystemContent .baseInfo").removeAttr("disabled");
                $("#tyPriceSystemContent .secretInfo").removeAttr("disabled");
            }
        }
        //新增产品：
        else if (!self.productId && !self.copyId) {
            $(".priceChangeNofity").hide();

            //系统管理员、数据岗、CEO、拥有全部权限
            if ($("#currentRole").val() == "Admin" || $("#currentRole").val() == "DataPost" || $("#currentRole").val() == "Ceo") {
                //启用价格
                $("#priceSystemContent [disabled=disabled]").removeAttr("disabled");
                $("#newPriceSystemContent [disabled=disabled]").removeAttr("disabled");
                $("#tyPriceSystemContent [disabled=disabled]").removeAttr("disabled");
                $("#autoGenerate").show();
                $("#saveAuto").show();
                //启用YCF平台进度
                $("#jdt").removeAttr("disabled");
                $("#raiseProgress").removeAttr("disabled");
                $("#xmld").removeAttr("disabled");
                $("#shortXmld").removeAttr("disabled");
                //启用JT平台进度
                $("#jTJdt").removeAttr("disabled");
                $("#jTRaiseProgress").removeAttr("disabled");
                $("#jTXmld").removeAttr("disabled");
                //启用TY平台进度
                $("#tYJdt").removeAttr("disabled");
                $("#tYRaiseProgress").removeAttr("disabled");
                $("#tYXmld").removeAttr("disabled");
                $("#ycfFileUpload").removeAttr("disabled");
                $("#jtFileUpload").removeAttr("disabled");
                $("#tyFileUpload").removeAttr("disabled");
                $("#xhDiscount").show();
                $("#ycfDiscount").hide();
                //$("#jtDiscount").show();
                $("#productDiscountDiv [disabled=disabled]").removeAttr("disabled");
            }
            else {
                //YCF产品经理可操作YCF字段
                if ($("#currentProject").val() == "PlatForm" && $("#currentRole").val() == "Pm") {
                    $("#jdt").removeAttr("disabled");
                    $("#raiseProgress").removeAttr("disabled");
                    $("#xmld").removeAttr("disabled");
                    $("#shortXmld").removeAttr("disabled");
                    $("#priceSystemContent .ycfPrice").removeAttr("disabled");
                    $("#newPriceSystemContent .ycfPrice").removeAttr("disabled");
                    $("#ycfFileUpload").removeAttr("disabled");
                    $("#ycfDiscount").hide();
                    $("#ycfDiscount [disabled=disabled]").removeAttr("disabled");
                }
                //JT产品经理可操作JT字段
                else if ($("#currentProject").val() == "Jt" && $("#currentRole").val() == "Pm") {
                    $("#jTJdt").removeAttr("disabled");
                    $("#jTRaiseProgress").removeAttr("disabled");
                    $("#jTXmld").removeAttr("disabled");
                    $("#priceSystemContent .jtPrice").removeAttr("disabled");
                    $("#newPriceSystemContent .jtPrice").removeAttr("disabled");
                    $("#jtFileUpload").removeAttr("disabled");
                    //$("#jtDiscount").show();
                    $("#jtDiscount [disabled=disabled]").removeAttr("disabled");
                }
                //TY产品经理可操作TY字段
                else if ($("#currentProject").val() == "Ty" && $("#currentRole").val() == "Pm") {
                    $("#tYJdt").removeAttr("disabled");
                    $("#tYRaiseProgress").removeAttr("disabled");
                    $("#tYXmld").removeAttr("disabled");
                    $("#tyFileUpload").removeAttr("disabled");
                    $("#tyPriceSystemContent .tyPrice").removeAttr("disabled");
                }
            }

            //默认启用分销基础收益、敏感价格信息
            $("#priceSystemContent .baseInfo").removeAttr("disabled");
            $("#newPriceSystemContent .baseInfo").removeAttr("disabled");
            $("#priceSystemContent .secretInfo").removeAttr("disabled");
            $("#newPriceSystemContent .secretInfo").removeAttr("disabled");
            $("#tyPriceSystemContent .baseInfo").removeAttr("disabled");
            $("#tyPriceSystemContent .secretInfo").removeAttr("disabled");
        }

        if (self.productId && self.productInfo.isFounded && $("#currentRole").val() != "Admin" && $("#currentRole").val() != "Ceo") {
            self.setDisabledForm();
            if ($("#currentRole").val() == "Pm") {
                $("#backEndJsonList input").removeAttr("disabled");
            }
        }

        //供应商、联系人
        if ((self.productInfo.jtAdminId == $("#currentUserId").val() || self.productInfo.tyAdminId == $("#currentUserId").val() || self.productInfo.adminId == $("#currentUserId").val()) && self.productInfo.saleStatus < 40 || $("#currentRole").val() == "Ceo" || $("#currentRole").val() == "Admin") {
            $("#selSupplier").removeAttr("disabled");
            $("#selCompany").removeAttr("disabled");
        }
        //合作协议权限判断
        if ((self.productInfo.projectType == 2 || self.productInfo.projectType == 3) &&
            ($("#currentRole").val() == "Ceo" || $("#currentRole").val() == "Admin" || $("#currentRole").val() == "Accounting")) {
            $("#selfCooperationAgreementDiv .filess").removeAttr("disabled");
        }
        if (self.productInfo.projectType == 1 && ((self.productInfo.jtAdminId == $("#currentUserId").val() || self.productInfo.tyAdminId == $("#currentUserId").val() || self.productInfo.adminId == $("#currentUserId").val()) || $("#currentRole").val() == "Ceo" || $("#currentRole").val() == "Admin")) {
            $("#cooperationAgreementDiv .filess").removeAttr("disabled");
        }
        
    }

    //详情页设置为不可用
    self.setDisabledForm = function() {
        $("form").disableForm();
        //会计启用集团成本价、上游价
        if ($("#currentRole").val() == "Accounting") {
            $("input[priceItem=groupCostPrice]").removeAttr("disabled");
            $("input[data-title=groupCostPrice]").removeAttr("disabled");
            $("#encourage").removeAttr("disabled");
            $("#upStream input").removeAttr("disabled");
        }
        //隐藏包销价格体系自动计算，保存，变更通知按钮
        $("#newPriceSystemContent input:not([priceItem])").hide();
        $("#autoGenerate").hide();
        $("#saveAuto").hide();
        $("#priceChangeNofity").hide();
        //隐藏编辑标签
        $("a[class=tag_add]").parent().hide();
        if ($("#currentRole").val() == "Sm" || $("#currentRole").val() == "Cs") {
            $("#priceSystemContent").hide();
            $(".ycfBackEndContent").hide();
        }
    }

    //页面&数据 初始化操作
    self.init = function(params) {

        if ($("#currentRole").val() != "Admin" && $("#currentRole").val() != "DataPost" && $("#currentRole").val() != "Ceo" && $("#currentRole").val() != "Accounting" && $("#currentRole").val() != "Report") {
            if ($("#currentProject").val() == "PlatForm") {
                $("#newPriceSystemContent").hide();
                $(".jtBackEndContent").hide();
                $(".jtEncourageContent").hide();
                $("#tyPriceSystemContent").hide();
            }
            else if ($("#currentProject").val() == "Ty") {
                $("#newPriceSystemContent").hide();
                $(".jtBackEndContent").hide();
                $(".jtEncourageContent").hide();
                $("#priceSystemContent").hide();
                $(".ycfBackEndContent").hide();
                $(".ycfEncourageContent").hide();
            }
            else {
                $("#priceSystemContent").hide();
                $(".ycfBackEndContent").hide();
                $(".ycfEncourageContent").hide();
                $("#tyPriceSystemContent").hide();
            }

        }

        self.productId = params.productId;
        self.copyId = params.copyId;
        self.recommendId = params.recommendId;

        //是否可put更新
        var isPut = self.productId != 'undefined' && self.productId != "" && self.productId != null && self.productId != undefined;

        //需要加载的产品ID编号，编辑或复制时使用，编辑优先
        var loadProductId = null;
        var loadRecommendId = null;
        if (self.productId) {
            loadProductId = self.productId;
            $("#btnSendMail").click(function() {
                self.sendMail();
            });
        }

        else if (self.copyId) {
            //新增产品的时候显示保存按钮
            if ($("#productId").val() == "") $("#btnSave").show();
            loadProductId = self.copyId;
        }
        else if (self.recommendId) {
            loadRecommendId = self.recommendId;
            $("#recommendProductId").val(loadRecommendId);
        }

        //省市区初始化
        $.Data.bindSSQ({
            province: "province",
            city: "selCity",
            area: "selArea"
        });

        if (loadProductId) {

            //加载产品信息
            $.get({
                url: 'product/' + loadProductId,
                async: false,
                success: function(data) {

                    //服务经理隐藏承销类型
                    if ($("#currentRole").val() == "Sm") {
                        $("#projectType").hide();
                        $("#projectType").parent().prev().hide();
                    }

                    self.productInfo = data;
                    if (!self.productInfo.bankInfo || self.productInfo.bankInfo == "")
                        self.productInfo.bankInfo = "【账户名】\n【账　号】\n【开户行】\n【备　注】";
                    self.productInfo.riskRemark = self.productInfo.riskRemark || "";
                    if (!self.productInfo.riskRemark || self.productInfo.riskRemark == "")
                        self.productInfo.riskRemark = $.ConstData.RiskRemark;
                    self.autoDisabled();
                    if (self.productInfo.productTypeId == "1") {
                        $("#productTypeId").html("<option value='1'>信托产品</option>");
                    } else if (self.productInfo.productTypeId == "2") {
                        $("#productTypeId").html("<option value='2'>资管计划</option>");
                    } else if (self.productInfo.productTypeId == "8") {
                        $("#productTypeId").html("<option value='8'>政府债</option>");
                    }

                    //复制产品的时候默认起售日为当天
                    if (self.copyId) {
                        self.productInfo.bqqsr = $.getDate().substr(0, 10);
                        self.productInfo.dealTime = null;
                        self.productInfo.settlementTime = null;
                        //self.productInfo.cooperationAgreementJson = null;

                        //self.productInfo.jdt = null;
                        //self.productInfo.jdTime = null;
                        //self.productInfo.jtJdt = null;
                        //self.productInfo.jtJdTime = null;
                        //self.productInfo.raiseProgress = null;
                        //self.productInfo.jtRaiseProgress = null;
                    }

                    //新增和未成立的时候隐藏成立之后的销售状态
                    if ((self.productId && !self.productInfo.isFounded) || self.copyId) {
                        $("#saleStatus option[value='40']").remove();
                        $("#saleStatus option[value='140']").remove();
                        $("#saleStatus option[value='150']").remove();
                    }
                    self.loadAdmin(false);
                    //包销自营合作协议
                    if ((data.projectType == 2 || data.projectType == 3) &&
                        ($("#currentRole").val() == "Ceo" || $("#currentRole").val() == "Admin" || $("#currentRole").val() == "DataPost" || $("#currentRole").val() == "Accounting")) {
                        $("#selfCooperationAgreementDiv").show();
                    } else {
                        $("#selfCooperationAgreementDiv").hide();
                    }
                    //隐藏显示供应商,合作协议
                    if ($("#currentRole").val() == "Ceo" || $("#currentRole").val() == "Admin" || $("#currentRole").val() == "Pm" || $("#currentRole").val() == "DataPost") {
                        $("#selSupplierDiv").show();
                        $("#selSupplierStr").hide();
                        $("#selCompanyDiv").show();
                        $("#selCompanyStr").hide();
                        //分销显示合作协议，包销自营隐藏合作协议
                        if (data.projectType == 1 &&
                            (self.productInfo.jtAdminId == $("#currentUserId").val() || self.productInfo.tyAdminId == $("#currentUserId").val() || self.productInfo.adminId == $("#currentUserId").val()
                                || $("#currentRole").val() == "Ceo" || $("#currentRole").val() == "Admin" || $("#currentRole").val() == "DataPost")) {
                            $("#cooperationAgreementDiv").show();
                        } else {
                            $("#cooperationAgreementDiv").hide();
                        }
                    } else {
                        $("#selSupplierDiv").hide();
                        $("#selSupplierStr").show();
                        $("#selCompanyDiv").hide();
                        $("#selCompanyStr").show();
                        $("#cooperationAgreementDiv").hide();
                    }

                    //加载省市区信息
                    $.Data.loadSSH({
                        province: "province",
                        provinceId: self.productInfo.province,
                        city: "selCity",
                        cityId: self.productInfo.city,
                        area: "selArea",
                        areaId: self.productInfo.area
                    });
                }
            });

            self.productDiscount.id = loadProductId;
            //加载产品贴息
            $.get({
                url: 'product/productDiscount/' + loadProductId,
                async: false,
                success: function(data) {
                    self.productDiscount = data;
                }
            });
            //加载价格区间
            $.get({
                url: 'up/supplierProduct/GetProductPriceStruct?productId=' + loadProductId,
                success: function(result) {
                    for (i = 0; i < result.length; i++) {
                        self.productPriceStructList.push(result[i]);
                    }
                }
            });
            //加载发行易价格
            $.get({
                url: 'up/supplierProduct/PriceSummary',
                data: { productId: loadProductId },
                success: function(result) {
                    self.supplierProductPriceList([]);
                    for (i = 0; i < result.data.length; i++) {
                        self.supplierProductPriceList.push(result.data[i]);
                    }
                }
            });

            //禁用修改承销类型
            //$("#projectType").attr("disabled", "disabled");
        }
        else {
            self.autoDisabled();
            $("#HasConfirmation").removeAttr("disabled");
            //新增产品的时候显示保存按钮
            if ($("#productId").val() == "") $("#btnSave").show();
            //新增状态：隐藏成立状态
            $("#saleStatus option[value='40']").remove();
            $("#saleStatus option[value='140']").remove();
            $("#saleStatus option[value='150']").remove();
            self.productInfo.dyl = -1;
            if ($.getParam("productTypeId") == "1")
                $("#productTypeId").html("<option value='1'>信托产品</option>");
            else if ($.getParam("productTypeId") == "2")
                $("#productTypeId").html("<option value='2'>资管计划</option>");
            else if (self.productInfo.productTypeId == "8")
                $("#productTypeId").html("<option value='8'>政府债</option>");

            if (loadRecommendId) {
                //加载推荐产品信息
                $.get({
                    url: 'product/ProductRecommend/' + loadRecommendId,
                    async: false,
                    success: function(data) {
                        self.productInfo = data;
                        if (!self.productInfo.bankInfo || self.productInfo.bankInfo == "")
                            self.productInfo.bankInfo = "【账户名】\n【账　号】\n【开户行】\n【备　注】";
                        if (self.productInfo.productTypeId == "1") {
                            $("#productTypeId").html("<option value='1'>信托产品</option>");
                        }else if (self.productInfo.productTypeId == "2") {
                            $("#productTypeId").html("<option value='2'>资管计划</option>");
                        }else if (self.productInfo.productTypeId == "8") {
                            $("#productTypeId").html("<option value='8'>政府债</option>");
                        }

                        self.productInfo.bqqsr = $.getDate().substr(0, 10);
                        self.productInfo.parentId = 0;
                        self.productInfo.dealTime = null;
                        self.productInfo.settlementTime = null;
                    }
                });
            }
            else {
                self.productInfo = { productTypeId: $.getParam("productTypeId"), parentId: 0, bankInfo: "【账户名】\n【账　号】\n【开户行】\n【备　注】", bqqsr: $.getDate().substr(0, 10) };
            }

            self.loadAdmin(true);

            //新增显示供应商，合作协议
            {
                $("#selSupplierDiv").show();
                $("#selSupplierStr").hide();
                $("#selCompanyDiv").show();
                $("#selCompanyStr").hide();
                if ($("#projectType").val() == 1) {
                    $("#cooperationAgreementDiv").show();
                } else {
                    $("#cooperationAgreementDiv").hide();
                }
            }
            //取消禁用修改承销类型
            $("#projectType").removeAttr("disabled");
        }

        //绑定页面数据
        $("form").loadForm(self.productInfo);

        //绑定基础数据
        self.initProvinceAndCity(self.productInfo.province, self.productInfo.city);
        $.Data.bindProductOrganizationAndIssuer(self.productInfo.productOrganizationId, self.productInfo.issuerId, !(self.productInfo.adminId == $("#currentUserId").val() || self.productInfo.jtAdminId == $("#currentUserId").val() || self.productInfo.tyAdminId == $("#currentUserId").val() || $("#currentRole").val() == "Ceo" || $("#currentRole").val() == "Admin" || $("#currentRole").val() == "Pm" || $("#currentRole").val() == "DataPost"));
        $.Data.bindCompanyAndSupplier(self.productInfo.companyId, self.productInfo.supplierId, !(self.productInfo.adminId == $("#currentUserId").val() || self.productInfo.jtAdminId == $("#currentUserId").val() || self.productInfo.tyAdminId == $("#currentUserId").val() || $("#currentRole").val() == "Ceo" || $("#currentRole").val() == "Admin" || $("#currentRole").val() == "Pm" || $("#currentRole").val() == "DataPost"));
        $.Data.bindDataDic("touZiLingYu", "ly", self.productInfo.touZiLingYu);
        $.Data.bindDataDic("shouYiType", "sy", self.productInfo.shouYiType);
        $.Data.bindDataDic("daXiao", "daxiao", self.productInfo.daXiao);
        $.Data.bindDataDic("payStatus", "fx", self.productInfo.payStatus);
        $.Data.bindDataDic("payStatusEx", "fxsm", self.productInfo.payStatusEx, "<option value='无'>无</option>");
        $.Data.bindDataDic("issuerType", "fxrlx", self.productInfo.issuerType);
        $.Data.bindDataDicSelect2("actualOrganization", "organization", self.productInfo.actualOrganization);
        $.Data.bindDataDicMutilSelect2("selectDyEx", "dyEx", self.productInfo.dyEx);
        //发行方选择联动实际发行机构选择框
        $("#selProductOrganization").change(function () {
            var selectText = $(this).find('option:selected').text();
            if ($("#actualOrganization option[value=" + selectText + "]").length > 0) {
                $("#actualOrganization").val(selectText);
                $("#actualOrganization").change();
            } else {
                $("#actualOrganization").val('');
                $("#actualOrganization").change();
            } 
        });
        //加载多选checkBox选中状态 【所属项目，产品特性】
        $("[data-name='attr'").each(function() {
            if ((self.productInfo.attr & parseInt($(this).val())) == parseInt($(this).val())) {
                $(this).parent().addClass("active");
            }
        });
        $("[data-name='project'").each(function() {
            if ((self.productInfo.project & parseInt($(this).val())) == parseInt($(this).val())) {
                $(this).parent().addClass("active");
            }
        });
        //加载价格体系数据
        $.Data.initPriceSystem({ fxJson: self.productInfo.fxJson, jumpJson: self.productInfo.jumpJson, backEndJson: self.productInfo.backEndJson, jtBackEndJson: self.productInfo.jtBackEndJson, fxJson2: self.productInfo.fxJson2, fxJson3: self.productInfo.fxJson3, jtFloatBackEndJson: self.productInfo.jtFloatBackEndJson, encourageJson: self.productInfo.encourageJson, jtEncourageJson: self.productInfo.jtEncourageJson, productDiscount: self.productDiscount });
        $.Data.loadPriceSystem($("#projectType").val() == 3 || $("#projectType").val() == 2);
        //新增产品默认折标系数为0.2
        if (!self.productId && !self.copyId) {
            $("[data-title='conversionRate']").val(0.2);
            $("[priceItem='conversionRate']").val(0.2);
        }
        //发行价格编辑及时获取最大最小收益率和最大最小指导价
        $("#fxJsonList").on("blur", "input", function() {
            if ($("#fxJsonList").validate()) {
                self.autoLoadPrice();
            }
        });
        $("#fxJson2Table").on("blur", "input", function() {
            if ($("#fxJson2Table").validate()) {
                self.autoLoadPrice(true);
            }
        });

        //页面编辑即保存更新
        if (self.productId) {
            //常规input字段 PUT更新
            $("form:not('#mailForm,#addReleaseForm') [name][type!='file']").each(function() {
                var obj = $(this);

                var classObj = $(obj).attr("class");
                var parentClassObj = $(obj).parent().attr("class");

                //PUT修改操作
                if ($(obj).is("select") || (classObj != undefined && classObj.toString().indexOf("datepicker") >= 0) || (parentClassObj != undefined && parentClassObj.toString().indexOf("datepicker") >= 0)) {


                    //select下拉框以及datapicker日历插件为change事件触发PUT
                    $(obj).change(function(e) {
                        if (!e.cancelable) {
                            //当前元素对应字段名
                            var propName = $(obj).attr("name").substr(0, 1).toUpperCase() + $(obj).attr("name").substr(1);
                            //var propName = "";
                            //if ($(obj).attr("name") == $(obj).attr("id"))
                            //    propName = $(obj).attr("name").substr(0, 1).toUpperCase() +
                            //        $(obj).attr("name").substr(1);
                            //else
                            //    propName = $(obj).attr("id");
                            //当前元素对应字段值
                            var propValue ='';
                            if ($(obj)[0].id == "selectDyEx") {
                                if ($(obj).val() != null) {
                                    propValue = $(obj).val().join(',');
                                } 
                            } else {
                                propValue = $(obj).val().trim();
                            }
                            if ($(obj)[0].id != "ycfStartTime" && $(obj)[0].id != "jtStartTime") {
                                self.put({ source: "product", propName: propName, propValue: propValue }, $(obj));
                            }

                            //如果是将产品修改为正常，则将起售日更新为当天
                            if ($(obj).attr("id") == "saleStatus" && $(obj).val() == 20) {
                                $("#bqqsr").val($.getDate().substr(0, 10));
                                $("#bqqsr").change();
                            }
                        }
                    })
                }
                else {
                    //默认元素为blur事件触发PUT
                    $(obj).blur(function(e) {
                        if (!e.cancelable) {
                            //当前元素对应字段名
                            var propName = "";
                            if ($(obj).attr("name") == $(obj).attr("id"))
                                propName = $(obj).attr("name").substr(0, 1).toUpperCase() +
                                    $(obj).attr("name").substr(1);
                            else
                                propName = $(obj).attr("id");
                            //var propName = $(obj).attr("name").substr(0, 1).toUpperCase() + $(obj).attr("name").substr(1);
                            //当前元素对应字段值
                            var propValue = "";

                            if ($(obj).attr("contenteditable") == "true") {
                                propValue = $(obj).html();
                            }
                            else {
                                propValue = $(obj).val().trim();
                            }

                            self.put({ source: "product", propName: propName, propValue: propValue }, $(obj));


                        }
                    });

                }
            });

            //产品特性和所属项目 PUT更新
            $("div[class*='hasoperater'] [data-name='attr']").each(function() {
                $(this).parent().click(function () {
                    console.log(0);
                    self.loadAttr();
                    self.put({ source: "product", propName: "Attr", propValue: $("#attr").val() }, $(this));
                });
            });
        }

        //价格体系编辑保存
        $("#priceSystemContent,#backEndContent,#encourageContent").on("blur", "input[type='text']", function() {
            if ($(this).parent().parent().validate()) {

                //服务经理价自动在市场价+0.05
                if ($(this).parent().parent().parent().parent().attr("id") != "backEndJsonList" && $(this).parent().parent().parent().parent().attr("id") != "jtBackEndJsonList" && $(this).parent().parent().parent().parent().attr("id") != "jtFloatBackEndJsonList" && $(this).parent().parent().parent().parent().attr("id") != "encourageJsonList" && $(this).parent().parent().parent().parent().attr("id") != "jtEncourageJsonList") {
                    if ($(this).attr("data-title") == "price") {
                        var price = parseFloat($(this).val());
                        var length = 0;
                        if (price.toString().indexOf(".") == -1) length = 2;
                        else
                            length = price.toString().split(".")[1].length;
                        if (length < 2) length = 2;
                        ///if (price)
                            //$(this).parent().prev().prev().find("input").val((price + 0.05).toFixed(length));
                    }
                }
                if ($("[name='projectType']").val() == 1) {
                    $("input[data-title='channelPrice']").removeAttr("data-compare").removeAttr("data-index").removeAttr("data-validate");
                    $("input[data-title='employeePrice']").attr("data-compare", "end").attr("data-index", "start");
                }
                else {
                    $("input[data-title='employeePrice']").removeAttr("data-compare").removeAttr("data-index");
                    $("input[data-title='channelPrice']").attr("data-compare", "end").attr("data-index", "start").attr("data-validate", "hight");
                }

                //价格区间验证
                if ($(this).attr("data-title") == "title1") {
                    var endValue = $(this).next().val();
                    if (endValue) {
                        var endNum = parseInt(endValue);
                        if (parseInt($(this).val()) > endNum)
                            $(this).next().val($(this).val());
                    }
                }
                else if ($(this).attr("data-title") == "title2") {
                    var startValue = $(this).prev().val();
                    if (startValue) {
                        var startNum = parseInt(startValue);
                        if (parseInt($(this).val()) < startNum)
                            $(this).prev().val($(this).val());
                    }
                }

                $.Data.loadPriceSystem($("#projectType").val() == 3 || $("#projectType").val() == 2);
                var fieldName = "";
                var fieldValue = "";
                if ($(this).parent().parent().attr("data-type") == "fxJsonItem") {
                    fieldName = "FxJson";
                    fieldValue = $("#fxJson").val();
                }
                else if ($(this).parent().parent().attr("data-type") == "jumpJsonItem") {
                    fieldName = "JumpJson";
                    fieldValue = $("#jumpJson").val();
                }
                else if ($(this).parent().parent().attr("data-type") == "backEndJsonItem") {
                    fieldName = "BackEndJson";
                    fieldValue = $("#backEndJson").val();
                }
                else if ($(this).parent().parent().attr("data-type") == "jtBackEndJsonItem") {
                    fieldName = "JTBackEndJson";
                    fieldValue = $("#jtBackEndJson").val();
                }
                else if ($(this).parent().parent().attr("data-type") == "jtFloatBackEndJsonItem") {
                    fieldName = "JTFloatBackEndJson";
                    fieldValue = $("#jtFloatBackEndJson").val();
                }
                else if ($(this).parent().parent().attr("data-type") == "encourageJsonItem") {
                    fieldName = "EncourageJson";
                    fieldValue = $("#encourageJson").val();
                }
                else if ($(this).parent().parent().attr("data-type") == "jtEncourageJsonItem") {
                    fieldName = "JTEncourageJson";
                    fieldValue = $("#jtEncourageJson").val();
                }
                if (self.productId) {
                    self.put({ source: "Product", propName: fieldName, propValue: fieldValue }, $(this));
                }

            }
        });
        $("#newPriceSystemContent").on("blur", "input[type='text']", function() {
            if ($("#fxJson2Table").validate()) {

                if ($(this).attr("priceItem") == "otherFinacialPlannerPrice") {
                    var price = parseFloat($(this).val());
                    var length = 0;
                    if (price.toString().indexOf(".") == -1) length = 2;
                    else
                        length = price.toString().split(".")[1].length;
                    if (length < 2) length = 2;
                    //if (price)
                        //$(this).parent().parent().next().find("input").val((price + 0.05).toFixed(length));
                }

                $.Data.loadPriceSystem($("#projectType").val() == 3 || $("#projectType").val() == 2);
                if (self.productId) {
                    self.put({ source: "Product", propName: "fxJson2", propValue: $("#fxJson2").val() }, $(this));
                    self.put({ source: "Product", propName: "fxJson", propValue: $("#fxJson").val() }, $(this));

                    $("#newPriceSystemContent #priceChangeNofity").attr("enb", "true");
                    $("#newPriceSystemContent #priceChangeNofity").css("border", "none");
                    $("#newPriceSystemContent #priceChangeNofity").attr("class", "btn btn-orange fl animated shake");
                }
            }
        });
        $("#newPriceSystemContent").on("change", "select", function() {
            if ($("#fxJson2Table").validate()) {
                $.Data.loadPriceSystem($("#projectType").val() == 3 || $("#projectType").val() == 2);
                if (self.productId) {
                    self.put({ source: "Product", propName: "fxJson2", propValue: $("#fxJson2").val() }, $(this));
                    self.put({ source: "Product", propName: "fxJson", propValue: $("#fxJson").val() }, $(this));
                    $("#newPriceSystemContent #priceChangeNofity").attr("enb", "true");
                    $("#newPriceSystemContent #priceChangeNofity").css("border", "none");
                    $("#newPriceSystemContent #priceChangeNofity").attr("class", "btn btn-orange fl animated shake");
                }
            }
        });
        //价格体系switch开关保存
        $("#priceSystemContent input[data-type='switch']").change(function() {
            if ($(this).parent().parent().validate()) {
                $.Data.loadPriceSystem($("#projectType").val() == 3 || $("#projectType").val() == 2);
                var fieldName = "";
                var fieldValue = "";
                if ($(this).parent().parent().attr("data-type") == "fxJsonItem") {
                    fieldName = "FxJson";
                    fieldValue = $("#fxJson").val();
                }
                else if ($(this).parent().parent().attr("data-type") == "jumpJsonItem") {
                    fieldName = "JumpJson";
                    fieldValue = $("#jumpJson").val();
                }
                else if ($(this).parent().parent().attr("data-type") == "backEndJsonItem") {
                    fieldName = "BackEndJson";
                    fieldValue = $("#backEndJson").val();
                }
                else if ($(this).parent().parent().attr("data-type") == "jtBackEndJsonItem") {
                    fieldName = "JTBackEndJson";
                    fieldValue = $("#jtBackEndJson").val();
                }
                if (self.productId) {
                    self.put({ source: "Product", propName: fieldName, propValue: fieldValue }, $(this));
                }

            }
        });
        //新价格体系switch开关保存
        $("#newPriceSystemContent input[data-type='switch']").change(function() {
            if ($("#fxJson2Table").validate()) {
                $.Data.loadPriceSystem($("#projectType").val() == 3 || $("#projectType").val() == 2);
                if (self.productId) {
                    self.put({ source: "Product", propName: "fxJson2", propValue: $("#fxJson2").val() }, $(this));
                    if ($("#projectType").val() == 3 || $("#projectType").val() == 2)
                        self.put({ source: "Product", propName: "FxJson", propValue: $("#fxJson").val() }, $(this));
                    $("#newPriceSystemContent #priceChangeNofity").attr("enb", "true");
                    $("#newPriceSystemContent #priceChangeNofity").css("border", "none");
                    $("#newPriceSystemContent #priceChangeNofity").attr("class", "btn btn-orange fl animated shake");
                }
            }
        });

        //腾云财富价格体系编辑保存
        $("#tyPriceSystemContent").on("blur", "input[type='text']", function() {
            if ($("#fxJson3Table").validate()) {
                $.Data.loadPriceSystem($("#projectType").val() == 3 || $("#projectType").val() == 2);
                if (self.productId) {
                    self.put({
                        source: "Product", propName: "fxJson3", propValue: $("#fxJson3").val()
                    }, $(this));

                    $("#tyPriceSystemContent #priceChangeNofity").attr("enb", "true");
                    $("#tyPriceSystemContent #priceChangeNofity").css("border", "none");
                    $("#tyPriceSystemContent #priceChangeNofity").attr("class", "btn btn-orange fl animated shake");
                }
            }
        });
        $("#tyPriceSystemContent input[data-type='switch']").change(function() {
            if ($("#fxJson3Table").validate()) {
                $.Data.loadPriceSystem($("#projectType").val() == 3 || $("#projectType").val() == 2);
                if (self.productId) {
                    self.put({ source: "Product", propName: "fxJson3", propValue: $("#fxJson3").val() }, $(this));
                    $("#tyPriceSystemContent #priceChangeNofity").attr("enb", "true");
                    $("#tyPriceSystemContent #priceChangeNofity").css("border", "none");
                    $("#tyPriceSystemContent #priceChangeNofity").attr("class", "btn btn-orange fl animated shake");
                }

            }
        });

        //集团贴息
        $("#xhDiscount").on("blur", "input[type='text']", function() {
            if ($("#xhJsonTable").validate()) {
                $.Data.loadPriceSystem($("#projectType").val() == 3 || $("#projectType").val() == 2);
                if (self.productId) {
                    $.put({
                        url: 'product/productDiscount/' + self.productId,
                        data: {
                            source: "productDiscount", propName: "XhJson", propValue: $("#xhJson").val()
                        },
                        success: function() {

                        }
                    });
                }
            }
        });
        //壹财富贴息
        $("#ycfDiscount").on("blur", "input[type='text']", function() {
            var name = $(this).attr("priceItem");
            if (name == "financialRate") {
                $(this).parent("td").next("td").find("input").val("");
            }
            else if (name == "investorRate") {
                $(this).parent("td").prev("td").find("input").val("");
            }
            if ($(this)[0].id != "ycfStartTime") {
                if ($("#ycfJsonTable").validate()) {
                    $.Data.loadPriceSystem($("#projectType").val() == 3 || $("#projectType").val() == 2);
                    if (self.productId) {
                        $.put({
                            url: 'product/productDiscount/' + self.productId,
                            data: {
                                source: "productDiscount", propName: "YcfJson", propValue: $("#ycfJson").val()
                            },
                            success: function() {

                            }
                        });
                    }
                }
            }
        });
        //壹财富贴息起始日期
        $("#ycfStartTime").change(function() {
            if (self.productId) {
                $.put({
                    url: 'product/productDiscount/' + self.productId,
                    data: {
                        source: "productDiscount", propName: "YcfStartTime", propValue: $("#ycfStartTime").val()
                    },
                    success: function() {

                    }
                });
            }
        });
        //九天贴息
        $("#jtDiscount").on("blur", "input[type='text']", function() {
            if ($(this)[0].id != "jtStartTime") {
                if ($("#jtJsonTable").validate()) {
                    $.Data.loadPriceSystem($("#projectType").val() == 3 || $("#projectType").val() == 2);
                    if (self.productId) {
                        $.put({
                            url: 'product/productDiscount/' + self.productId,
                            data: {
                                source: "productDiscount", propName: "JtJson", propValue: $("#jtJson").val()
                            },
                            success: function() {

                            }
                        });
                    }
                }
            }
        });
        //九天贴息其实日期
        $("#jtStartTime").change(function() {
            if (self.productId) {
                $.put({
                    url: 'product/productDiscount/' + self.productId,
                    data: {
                        source: "productDiscount", propName: "JtStartTime", propValue: $("#jtStartTime").val()
                    },
                    success: function() {

                    }
                });
            }
        });

 
        $("#ycfStartTime").val($.showDate(self.productDiscount.ycfStartTime));
        $("#jtStartTime").val($.showDate(self.productDiscount.jtStartTime));

        //加载产品资料
        $.Data.initProductFile(loadProductId, isPut, function() {
            //if (($("#currentRole").val() != "Pm" && $("#currentRole").val() != "Admin" && $("#currentRole").val() != "Ceo"))
            //    $(".update_remove").hide();
            //if (($("#productTypeId").val() == 1 || $("#productTypeId").val() == 2) && $("#saleStatus").val() >= 40)
            //    $(".update_remove").hide();
            //if ($("#productTypeId").val() > 2 && $("#saleStatus").val() >= 130)
            //    $(".update_remove").hide();
            ////if (self.productInfo.adminId != $("#currentUserId").val()
            //    && self.productInfo.jtAdminId != $("#currentUserId").val()
            //    && $("#currentRole").val() == "Pm" && $("#currentLevel").val() != "Director") {
            //    $(".update_remove").hide();
            //}

            if (self.productInfo.projectType == 2 || self.productInfo.projectType == 3) { //包销自营
                if ((($("#selManageAdminId").val() == $("#currentUserId").val() || $("#currentRole").val() == "DataPost") && $("#saleStatus").val() < 40) || $("#currentRole").val() == "Ceo" || $("#currentRole").val() == "Admin") {
                    $(".update_remove").show(); //维护人即合规岗显示所有资料删除按钮
                } else if (self.productInfo.jtAdminId == $("#currentUserId").val() && $("#saleStatus").val() < 40) {
                    $(".update_remove").show();
                    $("#tyFile .update_remove").hide();
                    $("#ycfFile .update_remove").hide();
                    $("#ycfPoster .update_remove").hide();
                } else if (self.productInfo.adminId == $("#currentUserId").val() && $("#saleStatus").val() < 40) {
                    $(".update_remove").show();
                    $("#tyFile .update_remove").hide();
                    $("#jtFile .update_remove").hide();
                    $("#jtPoster .update_remove").hide();
                } else if (self.productInfo.tyAdminId == $("#currentUserId").val() && $("#saleStatus").val() < 40) {
                    $(".update_remove").show();
                    $("#ycfFile .update_remove").hide();
                    $("#ycfPoster .update_remove").hide();
                    $("#jtFile .update_remove").hide();
                    $("#jtPoster .update_remove").hide();
                }
                else {
                    $(".update_remove").hide();
                }
            }
            else if (self.productInfo.projectType == 1) {//分销
                if ($("#currentRole").val() == "Ceo" || $("#currentRole").val() == "Admin") {
                    $(".update_remove").show();//合规岗显示所有资料删除按钮
                } else if (self.productInfo.jtAdminId == $("#currentUserId").val() && $("#saleStatus").val() < 40) {
                    $(".update_remove").show();
                    $("#tyFile .update_remove").hide();
                    $("#ycfFile .update_remove").hide();
                    $("#ycfPoster .update_remove").hide();
                } else if (self.productInfo.adminId == $("#currentUserId").val() && $("#saleStatus").val() < 40) {
                    $(".update_remove").show();
                    $("#tyFile .update_remove").hide();
                    $("#jtFile .update_remove").hide();
                    $("#jtPoster .update_remove").hide();
                } else if (self.productInfo.tyAdminId == $("#currentUserId").val() && $("#saleStatus").val() < 40) {
                    $(".update_remove").show();
                    $("#ycfFile .update_remove").hide();
                    $("#ycfPoster .update_remove").hide();
                    $("#jtFile .update_remove").hide();
                    $("#jtPoster .update_remove").hide();
                }
                else {
                    $(".update_remove").hide();
                }
            }

            //合作协议删除按钮
            if ((self.productInfo.projectType == 2 || self.productInfo.projectType == 3) &&
                ($("#currentRole").val() == "Ceo" || $("#currentRole").val() == "Admin" || $("#currentRole").val() == "Accounting")) {
                $("#selfCooperationAgreementDiv .update_remove").show();
            }
            if (self.productInfo.projectType == 1 && ($("#selManageAdminId").val() == $("#currentUserId").val() || $("#currentRole").val() == "Ceo" || $("#currentRole").val() == "Admin")) {
                $("#cooperationAgreementDiv .update_remove").show();
            }
        });

        //单文件上传
        $("[data-plugin-name='singleUpload']").each(function() {
            var obj = $(this);
            $(obj).singleUpload({
                success: function(e, result) {
                    var name = $(obj).attr("name");
                    $("#" + name).val(result.data);

                    if (self.productId) {
                        self.put({ source: "Product", propName: name.toUpperCase()[0] + name.substr(1), propValue: result.data }, $(obj));
                    }
                }
            })
        });
        //多文件上传
        $("[data-plugin-name='multiUpload']").each(function() {
            var obj = $(this);
            $(obj).multiUpload({
                success: function(e, result) {
                    var name = $(obj).attr("name");
                    $("#" + name).val($(obj).attr("data-upload-value"));
                    if (self.productId) {
                        self.put({ source: "product", propName: name, propValue: $(obj).attr("data-upload-value") }, $(obj));
                    }
                }
            })
        });

        //新增保存产品
        $("#btnSave").click(function() {
            self.save();
        });
        //自动生成价格体系
        $("#autoGenerate").click(function() {
            self.autoGeneratePrice();
        });
        //自动生成标签
        $("#generateTag").click(function() {
            self.autoGenerateTag();
        });
        //保存自动价格体系
        $("#saveAuto").click(function() {
            self.saveAutoPrice();
        });
        //价格通知
        $("[id=priceChangeNofity]").click(function() {
            var obj = $(this);
            if ($(obj).text() == "通知发送中...") {
                $.tips("求别狂点..!", $(obj), 1500);
            }
            else if ($(obj).attr("enb") == "true") {
                $(obj).attr("enb", "false");
                $(obj).text("通知发送中...");
                $.post({
                    url: "product/priceChange",
                    data: {
                        id: self.productId
                    },
                    success: function() {
                        $.tips("通知已发送!", $(obj), 1500);
                        $(obj).attr("enb", "true");
                        $(obj).text("发送价格通知");
                    },
                    error: function() {
                        $.tips("通知失败，请稍后重试", $(obj), 1500);
                        $(obj).attr("enb", "true");
                        $(obj).text("发送价格通知");
                    }
                });
            }
            else
                $.tips("价格更新后才能发送通知", $(obj), 1500);
        });

        //switch开关操作
        $("input[data-type='switch'][id]").click(function() {
            self.switchChange($(this));
        });

        showSwitchery();

        ko.applyBindings(self.tags, $("#tags")[0]);
        ko.applyBindings(self.productTags, $("#productTags")[0]);

        if ((self.productInfo.adminId == $("#currentUserId").val() || $("#currentRole").val() == "Admin" || $("#currentRole").val() == "Ceo" || (("," + $("#currentRoleIds").val() + ",").indexOf(",24,") >= 0 && $("#currentLevel").val() == "Director")) && self.productId) {
            ko.applyBindings(self.productPriceStructList, $("#myTabs")[0]);
            ko.applyBindings(self.supplierProductPriceList, $("#supplierProductPrice")[0]);
        }

        self.refrenceTags(function() {
            self.refrenceProductTags();
        });

        $("#email").removeAttr("disabled");
        var firstLoad = true;
        $("[name=projectType]").change(function() {            //新增或复制
            if (!loadProductId || self.copyId) {
                $("#selManageAdminId").html("<option value=" + $("#currentUserId").val() + ">" + $("#currentUserName").val() + "</option>");
                //分销显示合作协议，包销自营隐藏合作协议
                if ($(this).val() == 1) {
                    $("#cooperationAgreementDiv").show();
                } else {
                    $("#cooperationAgreementDiv").hide();
                }
            }

            //承销类型选择变更为包销时 默认“开具发票”选中
            var value = $(this).val();
            //选中了包销则触发“开具发票”由未选中->选中
            if (value == 2 && $("#IsInvoice").prop("checked") == false) {
                $("#IsInvoice").removeAttr("disabled");
                if (!firstLoad) {
                    $("#IsInvoice").click();
                }
            } else if (value != 2) {
                //选中了非包销则触发“开具发票”由选中->未选中 并禁用按钮
                if ($("#IsInvoice").prop("checked") == true) {
                    $("#IsInvoice").click();
                }
                $("#IsInvoice").prop("disabled", "disabled");
            }
            firstLoad = false;
        });
        //if (self.productInfo.isFounded && new Date(self.productInfo.createTime) < new Date('2016-12-31')) {

        //    $("#priceSystemTable").show();
        //    $("#newPriceSystemContent").hide();
        //}
        //手动触发变更承销类型
        if (self.productId)
            $("[name=projectType]").change();
        
        if (self.productId && $("#currentUserId").val() == "779") {
            
            //图标logo选中
            $(".logoto:first a").on("click", function () {
                $(this).toggleClass("active");
                self.loadAttr();
                self.put({ source: "product", propName: "Attr", propValue: $("#attr").val() }, $(this));
            });
        }

        if (self.productInfo.adminId == $("#currentUserId").val() || !self.productId) {
            //图标logo选中 所属项目
            $(".logoto:eq(1) a").on("click", function () {
                $(this).toggleClass("active");
                self.loadProject();
                if (self.productId) {
                    self.put({ source: "product", propName: "Project", propValue: $("#project").val() }, $(this));
                }
                
            });
        }

    };

    //初始化行政地区
    self.initProvinceAndCity = function(provinceId, cityId) {

        //加载省份信息
        $.get({
            url: 'common/area',
            data: { parentId: 1, type: 2 },
            success: function(data) {
                ko.applyBindings(data, $("#province")[0]);

                if (provinceId) {
                    $("#province").val(provinceId);

                    //加载城市信息
                    $.Data.bindCity({ parentId: provinceId, city: "selCity", defValue: cityId }, function() {
                        $("#selCity option[value='']").remove();
                        $("#selCity").change();
                    });

                }

                $("#province").change(function() {
                    //加载城市信息
                    $.Data.bindCity({ parentId: $(this).val(), city: "selCity" }, function() {
                        $("#selCity option[value='']").remove();
                        $("#selCity").change();
                    });
                    $("#selCity option[value='']").remove();
                });
            }
        });
    }

    //加载页面产品特性值
    self.loadAttr = function () {
        console.log("load");
        var attrValue = 0;
        $("[data-name='attr']").each(function() {
            if ($(this).parent().hasClass("active")) {
                attrValue += parseInt($(this).val());
            }
        });
        $("#attr").val(attrValue);
    }

    //加载页面所属项目值
    self.loadProject = function() {
        var projectValue = 0;
        $("[data-name='project']").each(function() {
            if ($(this).parent().hasClass("active")) {
                projectValue += parseInt($(this).val());
            }
        });
        $("#project").val(projectValue);
    }

    //保存方法（新增产品）
    self.save = function() {
        if ($("#productForm").validate()) {

            //加载并组织页面表单提交数据
            self.loadAttr();
            self.loadProject();

            $("input[data-type='switch']").each(function() {
                if ($(this).is(":checked"))
                    $(this).val("true");
                else
                    $(this).val("false");
            });

            //获取产品详细信息文本框内容
            $("[contenteditable='true']").each(function() {
                $("input[id='" + $(this).attr("id") + "']").val($(this).html());
            });

            //加载价格体系JSON
            $.Data.loadPriceSystem($("#projectType").val() == 3 || $("#projectType").val() == 2);
            $("#productTagJson").val(JSON.stringify(self.productTags()));

            //评分说明
            var riskRemark = $('#riskRemark').summernote('code');

            $.post({
                url: "product/exists",
                data: { title: $("#title").val() + "|" + $("#sTitle").val() },
                success: function(data) {
                    if (data.exists) {
                        $.confirm('产品已存在，继续保存将自动将该产品归入 【' + $("#title").val() + '-' + $("#sTitle").val() + '】 第【' + (data.phase + 1) + '】期，上一期产品创建人【' + data.managerDepartment + '-' + data.managerName + '】', function() {
                            $("#parentId").val(data.parentId);
                            $("#phase").val(data.phase + 1);
                            //建立下一期产品
                            $("#productForm").submitForm({
                                type: 'post',
                                isCheck: false,
                                url: 'product',
                                data: { riskRemark: riskRemark },
                                success: function(result) {
                                    $.success('操作成功');
                                    $.post({
                                        url: 'product/productDiscount',
                                        async: false,
                                        data: { id: result, xhJson: $("#xhJson").val(), ycfJson: $("#ycfJson").val(), jtJson: $("#jtJson").val(), ycfStartTime: $("#ycfStartTime").val(), jtStartTime: $("#jtStartTime").val(), riskRemark: riskRemark },
                                        success: function() {

                                        },
                                        error: function(resultErr) {
                                            $.tips(resultErr.responseText, $(this), 1500);
                                            $(this).focus();
                                            return;
                                        }
                                    });
                                    $.refreshWin("/product/index?productTypeId=" + self.productInfo.productTypeId, $(window.frameElement).attr("data-id"));
                                },
                                error: function(resultErr) {
                                    $.errorMsg(resultErr.responseText);
                                }
                            });
                        });
                    }
                    else {
                        //新产品自动将期数设置为1
                        $("#phase").val(1);
                        //新增产品
                        $("#productForm").submitForm({
                            type: 'post',
                            isCheck: false,
                            url: 'product',
                            success: function(result) {
                                $.success('操作成功');
                                $.post({
                                    url: 'product/productDiscount',
                                    async: false,
                                    data: { id: result, xhJson: $("#xhJson").val(), ycfJson: $("#ycfJson").val(), jtJson: $("#jtJson").val(), ycfStartTime: $("#ycfStartTime").val(), jtStartTime: $("#jtStartTime").val(), riskRemark: riskRemark  },
                                    success: function() {

                                    },
                                    error: function(resultErr) {
                                        $.tips(resultErr.responseText, $(this), 1500);
                                        $(this).focus();
                                        return;
                                    }
                                });
                                $.refreshWin("/product/index?productTypeId=" + self.productInfo.productTypeId, $(window.frameElement).attr("data-id"));
                            },
                            error: function(resultErr) {
                                $.errorMsg(resultErr.responseText);
                            }
                        });
                    }
                }
            });
        }
    }

    //switch开关操作事件方法
    self.switchChange = function(elementObj) {
        if (self.productId)
            self.put({ source: "Product", propName: $(elementObj).attr("id"), propValue: $(elementObj).is(":checked").toString() }, $(elementObj));
    }

    //put更新操作
    //data:请求参数，elementObj:操作元素
    self.put = function (data, elementObj) {
        if ($("#currentRole").val() != "Pm" && $("#currentRole").val() != "Admin" && $("#currentRole").val() != "Ceo" && $("#currentRole").val() != "DataPost" && $("#currentRole").val() != "Accounting" && $("#currentRole").val() != "Contract" && $("#priceEditPower").val() != "1") {
            return;
        }
        $.put({
            url: 'product/' + self.productId,
            data: data,
            success: function() {
                if (data.propName == "cooperationAgreementJson") {
                    var dataids = $(window.frameElement).attr("data-id").split("callback=");
                    var callback = dataids.length > 1 ? dataids[1] : dataids[0];
                    //判断是否从交易详情页面跳转到产品详情页面进行上传合作协议
                    if (callback != "" && callback != null) {
                        $.pageCallBack(callback, data.propValue);
                    }
                }
            },
            error: function(resultErr) {
                $.tips(resultErr.responseText, $(elementObj), 1500);
                $(elementObj).focus();
                return;
            }
        });
    }

    //全部标签
    self.tags = ko.observableArray([]);
    //产品标签
    self.productTags = ko.observableArray([]);

    //刷新全部标签
    self.refrenceTags = function(callBack) {

        $.get({
            url: 'product/producttag/',
            success: function(data) {
                if (data.data) {
                    self.tags.removeAll();
                    for (var i = 0; i < data.data.length; i++) {
                        self.tags.push(data.data[i]);
                    }

                    callBack();
                }
            }
        });

    }
    //刷新产品标签
    self.refrenceProductTags = function() {
        if (self.productId || self.copyId) {
            self.productTags.removeAll();
            $.get({
                url: 'product/producttaginfo/' + (self.productId || self.copyId),
                success: function(data) {
                    if (data.data) {
                        for (var i = 0; i < data.data.length; i++) {
                            self.productTags.push(data.data[i]);
                            $("[tagId=tag" + data.data[i].id + "]").addClass("active");
                        }

                        //已成立的产品隐藏标签删除按钮
                        if ($("#saleStatus").val() >= 40 || ($("#currentUserId").val() != self.productInfo.adminId && self.productInfo.jtAdminId != $("#currentUserId").val() && self.productInfo.tyAdminId != $("#currentUserId").val()))
                            $(".tag_remove").hide();
                    }
                }
            });
        }
    }
    //添加标签
    self.addTag = function(tag) {
        var productTags = self.productTags();
        for (var i = 0; i < productTags.length; i++) {
            if (productTags[i].id == tag.id)
                return;
        }
        if (self.productId) {
            $.post({
                url: 'product/producttaginfo/',
                data: { productId: self.productId, productTagId: tag.id },
                success: function(data) {
                    self.productTags.push(tag);
                }
            });
        }
        else {
            self.productTags.push(tag);
        }

        $("[tagId=tag" + tag.id + "]").addClass("active");
    }
    //删除标签
    self.deleteTag = function(id) {
        if (self.productId) {
            $.delete({
                url: 'product/producttaginfo/?productId=' + self.productId + '&productTagId=' + id,
                success: function () {
                    self.productTags.remove(function (item) { return item.id == id });
                }
            });
        }
        else {
            self.productTags.remove(function(item) { return item.id == id });
        }

        $("[tagId=tag" + id + "]").removeClass("active");
    }

    self.toMail = function() {

        $.openDialog({
            title: '分享到邮箱',
            jqObj: $('#toMail')
        });
    }
    self.sendMail = function() {
        if ($("#toMail").validate()) {
            $.post({
                url: "product/tomail",
                data: { productId: self.productId, email: $("#email").val() },
                success: function() {
                    $.success("分享成功");
                },
                error: function(resultErr) {
                    $.tips(resultErr.responseText, $("#btnSetEmail"), 1500);
                    return;
                }
            })
        }
    }

    //自动读取价格体系表填充页面价格冗余字段
    self.autoLoadPrice = function (isFxJson2) {
        $.Data.loadPriceSystem($("#projectType").val() == 3 || $("#projectType").val() == 2);
        var fxJsonData;
        var minValue = 101;
        var maxValue = -1;
        var guideMinValue = 101;
        var guideMaxValue = -1;

        if (!isFxJson2) {
            var fxJsonData = $.parseJSON($("#fxJson").val());
            for (var i = 0; i < fxJsonData.length; i++) {
                if (parseFloat(fxJsonData[i]["earningRate"]) >= maxValue)
                    maxValue = parseFloat(fxJsonData[i]["earningRate"]);
                if (parseFloat(fxJsonData[i]["earningRate"]) <= minValue)
                    minValue = parseFloat(fxJsonData[i]["earningRate"]);
                if (parseFloat(fxJsonData[i]["price"]) >= guideMaxValue)
                    guideMaxValue = parseFloat(fxJsonData[i]["price"]);
                if (parseFloat(fxJsonData[i]["price"]) <= guideMinValue)
                    guideMinValue = parseFloat(fxJsonData[i]["price"]);
            }
        }
        else {
            var fxJsonData = $.parseJSON($("#fxJson2").val());
            for (var i = 0; i < fxJsonData.length; i++) {
                if (parseFloat(fxJsonData[i]["profitRate"]) >= maxValue)
                    maxValue = parseFloat(fxJsonData[i]["profitRate"]);
                if (parseFloat(fxJsonData[i]["profitRate"]) <= minValue)
                    minValue = parseFloat(fxJsonData[i]["profitRate"]);
                //if (parseFloat(fxJsonData[i]["otherFinacialPlannerPrice"]["priceA"]) >= guideMaxValue)
                //    guideMaxValue = parseFloat(fxJsonData[i]["otherFinacialPlannerPrice"]["priceA"]);
                //if (parseFloat(fxJsonData[i]["otherFinacialPlannerPrice"]["priceA"]) <= guideMinValue)
                //    guideMinValue = parseFloat(fxJsonData[i]["otherFinacialPlannerPrice"]["priceA"]);
            }
        }
        if ($("#currentUserId").val() == self.productInfo.adminId || !self.productId || $("#currentRole").val() == "Admin" || $("#currentRole").val() == "Contract") {
            $("#nianHuaShouYiStart").val(minValue == 101 ? "" : minValue);
            $("#nianHuaShouYiEnd").val(maxValue == -1 ? "" : maxValue);
            $("#nianHuaShouYiStart").blur();
            $("#nianHuaShouYiEnd").blur();
        }
        if (!isFxJson2 && ($("#currentUserId").val() == self.productInfo.adminId || (!self.productId && $("#currentProject").val().indexOf("Ycf") >= 0) || $("#currentRole").val() == "Admin")) {
            $("#zdPrice").val(guideMinValue == 101 ? "" : guideMinValue);
            $("#zdPrice2").val(guideMaxValue == -1 ? "" : guideMaxValue);
            $("#zdPrice").blur();
            $("#zdPrice2").blur();
        }
    }

    self.autoGenerateTag = function() {
        $.put({
            url: 'product/generateTag',
            data: { shouYiType: $("[name=shouYiType]").val(), touZiLingYu: $("[name=touZiLingYu]").val(), qiXian: $("[name=qiXian]").val(), xmld: $("[name=xmld]").val(), jtXmld: $("[name=jtXmld]").val(), fkcs: $("textarea[name=fkcs]").val(), provinceName: $("#province").find("option:selected").text() },
            success: function(res) {
                for (var i = 0; i < res.length; i++) {
                    self.addTag(res[i]);
                }
            }
        });
    }

    //自动计算价格体系
    self.autoGeneratePrice = function() {
        var data = { isInvoice: $("#IsInvoice").is(":checked"), params: [] };
        var paramsList = $("#newPriceSystemContent input[data-title=costPrice]");
        var hasParams = false;
        for (var i = 0; i < paramsList.length; i++) {
            data.params.push({ costPrice: $(paramsList).eq(i).val(), grossProfitRate: $(paramsList).eq(i).parent().next().find("select").eq(0).val() });
            if (data.params[i].grossProfitRate != "" && data.params[i].costPrice != "")
                hasParams = true;
            if (data.params[i].grossProfitRate) {
                var groRate = parseFloat(data.params[i].grossProfitRate);
                var converstionRate = parseFloat(groRate / 20);
                $(paramsList).eq(i).parent().next().next().find("input").eq(1).val(converstionRate);
            }
        }
        if (!hasParams) {
            $.tips("必须至少有一个成本价、预期毛利组合才能自动计算价格", $("#autoGenerate"), 2000);
            return;
        }
        if (data.params.length > 0) {
            $.post({
                url: "product/autoGeneratePrice",
                data: data,
                success: function(data) {
                    $("#newPriceSystemContent input[preview]").val("");
                    for (var i = 0; i < data.length; i++) {
                        var current = $("#fxJson2Table tr").eq(i + 1);
                        //雇佣理财师价格预览
                        if (data[i].financialPlannerPrice != null) {
                            $(current).find("[preview=financialPlannerPriceA]").val(data[i].financialPlannerPrice.priceA);
                            $(current).find("[preview=financialPlannerPriceB]").val(data[i].financialPlannerPrice.priceB);
                            $(current).find("[preview=financialPlannerPriceC]").val(data[i].financialPlannerPrice.priceC);
                        }
                        //众包理财师价格预览
                        if (data[i].otherFinacialPlannerPrice != null) {
                            $(current).find("[preview=otherFinacialPlannerPriceA]").val(data[i].otherFinacialPlannerPrice.priceA);
                            $(current).find("[preview=otherFinacialPlannerPriceB]").val(data[i].otherFinacialPlannerPrice.priceB);
                            $(current).find("[preview=otherFinacialPlannerPriceC]").val(data[i].otherFinacialPlannerPrice.priceC);
                        }
                        //机构价格预览
                        if (data[i].organizationPrice != null) {
                            $(current).find("[preview=organizationPriceA]").val(data[i].organizationPrice.priceA);
                            $(current).find("[preview=organizationPriceB]").val(data[i].organizationPrice.priceB);
                            $(current).find("[preview=organizationPriceC]").val(data[i].organizationPrice.priceC);
                        }
                        //机构经理价格预览
                        if (data[i].organizationManagerPrice != null) {
                            $(current).find("[preview=organizationManagerPriceA]").val(data[i].organizationManagerPrice.priceA);
                            $(current).find("[preview=organizationManagerPriceB]").val(data[i].organizationManagerPrice.priceB);
                            $(current).find("[preview=organizationManagerPriceC]").val(data[i].organizationManagerPrice.priceC);
                        }
                        //服务经理价格预览
                        if (data[i].serviceManagerPrice != null) {
                            $(current).find("[preview=serviceManagerPriceA]").val(data[i].serviceManagerPrice.priceA);
                            $(current).find("[preview=serviceManagerPriceB]").val(data[i].serviceManagerPrice.priceB);
                            $(current).find("[preview=serviceManagerPriceC]").val(data[i].serviceManagerPrice.priceC);
                        }
                    }

                    $("#newPriceSystemContent input:not([priceItem])").show();
                }
            });
        }
    }
    //保存自动生成的价格
    self.saveAutoPrice = function() {
        var previewList = $("#newPriceSystemContent [preview]");
        for (var i = 0; i < previewList.length; i++) {
            var currentItem = $(previewList).eq(i);
            if ($(currentItem).is(":hidden")) {
                $.tips("请先进行计算，获取系统参考价", $("#saveAuto"), 1500);
                return;
            }
            $(currentItem).prev().val($(currentItem).val());
        }
        $(previewList).hide();
        var previewLocalList = $("#newPriceSystemContent [previewLocal]");
        for (var i = 0; i < previewLocalList.length; i++) {
            var currentItem = $(previewLocalList).eq(i);
            $(currentItem).prev().val($(currentItem).val());
        }
        $(previewLocalList).hide();
        self.autoLoadPrice();
        if (self.productId) {
            self.put({ source: "Product", propName: "fxJson2", propValue: $("#fxJson2").val() }, $(this));
            self.put({ source: "Product", propName: "fxJson", propValue: $("#fxJson").val() }, $(this));
            $("#newPriceSystemContent #priceChangeNofity").attr("enb", "true");
            $("#newPriceSystemContent #priceChangeNofity").css("border", "none");
            $("#newPriceSystemContent #priceChangeNofity").attr("class", "btn btn-orange fl animated shake");
        }

    }

    //加载壹财富产品经理、九天产品经理、维护人、所属项目的值
    //在产品改版的时候，我为了不影响原有的代码，单独写了方法处理 吴俊
    self.loadAdmin = function(isAdd) {
        if (isAdd || self.copyId) {
            var optionHtml = "<option value=" + $("#currentUserId").val() + ">" + $("#currentUserName").val() + "</option>";
            console.log(optionHtml);
            self.productInfo.project = 0;
            //是产品经理
            if ($("#currentRole").val() == "Pm") {
                //壹财富产品经理
                if ($("#currentProject").val() == "PlatForm") {
                    $("#selYCFAdminId").html(optionHtml);
                    self.productInfo.project = 1;
                }
                //九天产品经理
                else if ($("#currentProject").val() == "Jt") {
                    $("#selJTAdminId").html(optionHtml);
                    self.productInfo.project = 2;
                }
                //腾云产品经理
                else if ($("#currentProject").val() == "Ty") {
                    $("#selTYAdminId").html(optionHtml);
                    self.productInfo.project = 4;
                }

            }

            //绑定维护人
            $("#selManageAdminId").html(optionHtml);
        }
        else {
            var optionHtml = "<option value=''>-</option>";
            console.log(optionHtml);
            //绑定壹财富产品经理
            if (self.productInfo.adminId > 0)
                $("#selYCFAdminId").html("<option value=" + self.productInfo.adminId + ">" + self.productInfo.adminName + "</option>");
            else
                $("#selYCFAdminId").html(optionHtml);
            //绑定九天产品经理
            if (self.productInfo.jtAdminId > 0)
                $("#selJTAdminId").html("<option value=" + self.productInfo.jtAdminId + ">" + self.productInfo.jtAdminName + "</option>");
            else
                $("#selJTAdminId").html(optionHtml);
            //绑定腾云产品经理
            if (self.productInfo.tyAdminId > 0)
                $("#selTYAdminId").html("<option value=" + self.productInfo.tyAdminId + ">" + self.productInfo.tyAdminName + "</option>");
            else
                $("#selTYAdminId").html(optionHtml);
            //绑定维护人
            $("#selManageAdminId").html("<option value=" + self.productInfo.manageAdminId + ">" + self.productInfo.manageAdminName + "</option>");
        }
    }
}

//单个文件移除回调
function singleCloseSuccess(p) {
    var propName = $(p).attr("name");
    var propValue = $(p).attr("data-upload-value");
    var data = { source: "Product", propName: propName, propValue: propValue || "" };
    putFile(data);
}
//多个文件移除回调
function multiCloseSuccess(p) {
    var propName = $(p).attr("name");
    var propValue = $(p).attr("data-upload-value");
    var data = { source: "Product", propName: propName, propValue: propValue || "" };
    putFile(data);
}
//修改产品资料文件
function putFile(data) {
    if ($.getParam("id")) {
        $.put({
            url: 'product/' + $.getParam("id"),
            data: data,
            success: function() {

            },
            error: function(resultErr) {
                $.tips(resultErr.responseText, $(this), 1500);
                $(this).focus();
                return;
            }
        });
    }
}

$(function() {
    //YCF价格体系填写认购级别，自动同步YCF后端认购级别
    $("#fxJsonList").on("blur", "input[data-title=title1]", function() {
        var index = $(this).attr("syc");
        $("#backEndJsonList [syc=" + index + "]").val($(this).val()).blur();
        $("#ycfDiscount [syc=" + index + "]").val($(this).val()).blur();
    });
    $("#fxJsonList").on("blur", "input[data-title=title2]", function() {
        var index = $(this).attr("syc");
        $("#backEndJsonList [syc=" + index + "]").val($(this).val()).blur();
        $("#ycfDiscount [syc=" + index + "]").val($(this).val()).blur();
    });

    $("#category").change(function() {
        if ($("#projectType").val() != 3) {
            if ($(this).val() == 10) {
                $("#projectType").val(1);
                $("#cooperationAgreementDiv").show();
                $("#selfCooperationAgreementDiv").hide();
            }
            else {
                $("#projectType").val(2);
                $("#cooperationAgreementDiv").hide();
                $("#selfCooperationAgreementDiv").show();
            }
            $("#selCompany").val("");
            $("#selSupplier").val("");
            $("#select2-selCompany-container").text("-");
            $("#select2-selSupplier-container").text("-");
            $("[name=cooperationAgreementJson] .example-image-link").remove();
            $("#projectType").change();
        }
    });
})

