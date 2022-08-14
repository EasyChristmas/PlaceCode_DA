//当前选择的类型
var selectType;

var viewModel = function () {
    var self = this;

    //总数
    self.totalCount = ko.observable(0);

    //直接划转总数
    self.totalCommonAllotCount = ko.observable(0);

    //会员级别划转总数
    self.levelTotalAllotCountCompute = function () {
        var sum = parseInt(self.levelOkAllotCount()) + parseInt(self.levelAAllotCount())
            + parseInt(self.levelBAllotCount()) + parseInt(self.levelCAllotCount())
            + parseInt(self.levelDAllotCount()) + parseInt(self.levelEAllotCount());

        self.levelTotalAllotCount(sum);
    };
    self.levelTotalAllotCount = ko.observable(0);

    //Ok类
    self.levelOkCount = ko.observable(0);
    self.levelOkAllotCount = ko.observable(0);
    //A类
    self.levelACount = ko.observable(0);
    self.levelAAllotCount = ko.observable(0);
    //B类
    self.levelBCount = ko.observable(0);
    self.levelBAllotCount = ko.observable(0);
    //C类
    self.levelCCount = ko.observable(0);
    self.levelCAllotCount = ko.observable(0);
    //D类
    self.levelDCount = ko.observable(0);
    self.levelDAllotCount = ko.observable(0);
    //E类
    self.levelECount = ko.observable(0);
    self.levelEAllotCount = ko.observable(0);


    //会员分类划转总数
    self.kindTotalAllotCount = ko.observable(0);
    //甲类
    self.kindFirstCount = ko.observable(0);
    self.kindFirstAllotCount = ko.observable(0);
    //乙类
    self.kindSecondCount = ko.observable(0);
    self.kindSecondAllotCount = ko.observable(0);
    //丙类
    self.kindThirdCount = ko.observable(0);
    self.kindThirdAllotCount = ko.observable(0);
    //丁类
    self.kindFourthCount = ko.observable(0);
    self.kindFourthAllotCount = ko.observable(0);
    //戊类
    self.kindFifthCount = ko.observable(0);
    self.kindFifthAllotCount = ko.observable(0);
    //空类
    self.kindEmptyCount = ko.observable(0);
    self.kindEmptyAllotCount = ko.observable(0);

    //会员级别划转总数
    self.kindTotalAllotCountCompute = function () {
        var sum = parseInt(self.kindFirstAllotCount()) + parseInt(self.kindSecondAllotCount())
            + parseInt(self.kindThirdAllotCount()) + parseInt(self.kindFourthAllotCount())
            + parseInt(self.kindFifthAllotCount()) + parseInt(self.kindEmptyAllotCount());

        self.kindTotalAllotCount(sum);
    };


    //统一划转输入处理
    self.inputAllotCount = function (obj) {
        var $Obj = $(obj);
        var id = $Obj.attr("id");
        var inputEditKo;
        var inputTotalCountKo;
        switch (id) {
            //普通模式直接划转
            case "totalCommonAllotCount":
                inputEditKo = self.totalCommonAllotCount;
                inputTotalCountKo = self.totalCount;
                break;
            case "levelOkAllotCount"://OK类编辑
                inputEditKo = self.levelOkAllotCount;
                inputTotalCountKo = self.levelOkCount;
                break;
            case "levelAAllotCount"://A类编辑
                inputEditKo = self.levelAAllotCount;
                inputTotalCountKo = self.levelACount;
                break;
            case "levelBAllotCount"://B类编辑
                inputEditKo = self.levelBAllotCount;
                inputTotalCountKo = self.levelBCount;
                break;
            case "levelCAllotCount"://C类编辑
                inputEditKo = self.levelCAllotCount;
                inputTotalCountKo = self.levelCCount;
                break;
            case "levelDAllotCount"://D类编辑
                inputEditKo = self.levelDAllotCount;
                inputTotalCountKo = self.levelDCount;
                break;
            case "levelEAllotCount"://E类编辑
                inputEditKo = self.levelEAllotCount;
                inputTotalCountKo = self.levelECount;
                break;
            case "kindFirstAllotCount"://甲类编辑
                inputEditKo = self.kindFirstAllotCount;
                inputTotalCountKo = self.kindFirstCount;
                break;
            case "kindSecondAllotCount"://乙类编辑
                inputEditKo = self.kindSecondAllotCount;
                inputTotalCountKo = self.kindSecondCount;
                break;
            case "kindThirdAllotCount"://丙类编辑
                inputEditKo = self.kindThirdAllotCount;
                inputTotalCountKo = self.kindThirdCount;
                break;
            case "kindFourthAllotCount"://丁类编辑
                inputEditKo = self.kindFourthAllotCount;
                inputTotalCountKo = self.kindFourthCount;
                break;
            case "kindFifthAllotCount"://戊类编辑
                inputEditKo = self.kindFifthAllotCount;
                inputTotalCountKo = self.kindFifthCount;
                break;
            case "kindEmptyAllotCount"://戊类编辑
                inputEditKo = self.kindEmptyAllotCount;
                inputTotalCountKo = self.kindEmptyCount;
                break;
        }

        if ($Obj.val() && parseInt($Obj.val()) > inputTotalCountKo()) {
            $.tips('不能超过最大总数！', $Obj);
            var currentValue = $Obj.val();
            var sub = currentValue.toString().substring(0, currentValue.toString().length - 1);
            if (!sub) {
                sub = 0;
            }
            $Obj.val(parseInt(sub));
            return;
        }
        var inputValue = $Obj.val();
        if (!inputValue) {
            inputValue = 0;
            $Obj.val(inputValue);
        }
        inputEditKo(parseInt(inputValue));

        //level分类，计算总体值
        if (id.indexOf('level') > -1) {
            self.levelTotalAllotCountCompute();
        }
        if (id.indexOf('kind') > -1) {
            self.kindTotalAllotCountCompute();
        }
    };

    //初始化数据
    self.Init = function () {
        var adminId = $("#targetAdminId").val();
        var data = {};
        if (adminId > 0) {
            data.targetAdminId = adminId;
        }
        var poolId = $("#poolId").val();
        if (poolId > 0) {
            data.pool = poolId;
        }

        //选择框样式恢复
        $(".icheckbox_flat-green").removeClass("checked");

        //恢复提交按钮样式
        self.resetSubmitBtnStyle();

        $.get({
            url: "user/allotuser/gettransfercount",
            data: data,
            success: function (data) {

                //总数
                self.totalCount(data.totalCount);
                self.totalCommonAllotCount(0);

                //会员级别模式划转总数
                self.levelTotalAllotCount(0);
                self.levelOkAllotCount(0);
                self.levelAAllotCount(0);
                self.levelBAllotCount(0);
                self.levelCAllotCount(0);
                self.levelDAllotCount(0);
                self.levelEAllotCount(0);

                self.levelOkCount(data.levelOkCount);
                self.levelACount(data.levelACount);
                self.levelBCount(data.levelBCount);
                self.levelCCount(data.levelCCount);
                self.levelDCount(data.levelDCount);
                self.levelECount(data.levelECount);

                //会员分类模式划转总数
                self.kindTotalAllotCount(0);
                self.kindFirstAllotCount(0);
                self.kindSecondAllotCount(0);
                self.kindThirdAllotCount(0);
                self.kindFourthAllotCount(0);
                self.kindFifthAllotCount(0);
                self.kindEmptyAllotCount(0);

                self.kindFirstCount(data.kindFirstCount);
                self.kindSecondCount(data.kindSecondCount);
                self.kindThirdCount(data.kindThirdCount);
                self.kindFourthCount(data.kindFourthCount);
                self.kindFifthCount(data.kindFifthCount);
                self.kindEmptyCount(data.kindEmptyCount);
            }
        });

    };

    //点击打开会员划转页面
    self.changeToAllot = function () {
        $.openDialog({
            title: '公有池会员划转',
            jqObj: $('#divChangeToAllot')
        });

        self.Init();
    };

    //提交保存
    self.submit = function () {

        if (!$("#targetAdminId").val()) {
            $.tips("必须选择服务经理！", $("#targetAdminId"))
            return;
        }
        if (!selectType) {
            $.tips("必须选择一种划分方式！", $("#allotMsg"))
            return;
        }

        var data = {
            targetAdminId: $("#targetAdminId").val(),
            pool: $("#poolId").val()
        };
        switch (selectType) {
            case "common":
                data.commonCount = self.totalCommonAllotCount();
                data.selectType = 0;
                if (self.totalCommonAllotCount() <= 0) {
                    $.tips("请输入要划分的数量！", $("#common"))
                    return;
                }
                break;
            case "level":
                data.ok = self.levelOkAllotCount();
                data.a = self.levelAAllotCount();
                data.b = self.levelBAllotCount();
                data.c = self.levelCAllotCount();
                data.d = self.levelDAllotCount();
                data.e = self.levelEAllotCount();
                data.selectType = 1;
                if (self.levelTotalAllotCount() <= 0) {
                    $.tips("请输入要划分的数量！", $("#level"))
                    return;
                }
                break;
            case "kind":
                data.first = self.kindFirstAllotCount();
                data.second = self.kindSecondAllotCount();
                data.third = self.kindThirdAllotCount();
                data.fourth = self.kindFourthAllotCount();
                data.fifth = self.kindFifthAllotCount();
                data.kindEmpty = self.kindEmptyAllotCount();
                data.selectType = 2;
                if (self.kindTotalAllotCount() <= 0) {
                    $.tips("请输入要划分的数量！", $("#kind"))
                    return;
                }
                break;
        }

        //按钮不可编辑
        self.setProcessingSubmitBtnStyle();

        $.post({
            url: "user/allotuser/transferallot",
            data: data,
            success: function (result) {
                $.success("会员划分完成！");
                self.resetSubmitBtnStyle();
                $.closeDialog($("#divChangeToAllot"));

            },
            error: function (error) {
                $.alert(error.responseText);
                //刷新数据
                self.Init();
                self.resetSubmitBtnStyle();
            }
        })

    };

    //提交按钮处理中样式
    self.setProcessingSubmitBtnStyle = function () {
        var btnSubmit = $("#btnSubmitAllot");
        btnSubmit.removeClass("btn-info");
        btnSubmit.addClass("btn-default");
        btnSubmit.attr("disabled", true);
        btnSubmit.text("处理中...");
    }
    //提交按钮恢复样式
    self.resetSubmitBtnStyle = function () {
        var btnSubmit = $("#btnSubmitAllot");
        btnSubmit.removeClass("btn-default");
        btnSubmit.addClass("btn-info");
        btnSubmit.removeAttr("disabled");
        btnSubmit.text("确定");
    }

};
