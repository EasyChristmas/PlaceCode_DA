
//当前选择的类型
var selectType;

//总数
grid.totalCount = ko.observable(0);

//直接划转总数
grid.totalCommonAllotCount = ko.observable(0);

//会员级别划转总数
grid.levelTotalAllotCountCompute = function () {
    var sum = parseInt(grid.levelOkAllotCount()) + parseInt(grid.levelAAllotCount())
        + parseInt(grid.levelBAllotCount()) + parseInt(grid.levelCAllotCount())
        + parseInt(grid.levelDAllotCount()) + parseInt(grid.levelEAllotCount());

    grid.levelTotalAllotCount(sum);
};
grid.levelTotalAllotCount = ko.observable(0);

//Ok类
grid.levelOkCount = ko.observable(0);
grid.levelOkAllotCount = ko.observable(0);
//A类
grid.levelACount = ko.observable(0);
grid.levelAAllotCount = ko.observable(0);
//B类
grid.levelBCount = ko.observable(0);
grid.levelBAllotCount = ko.observable(0);
//C类
grid.levelCCount = ko.observable(0);
grid.levelCAllotCount = ko.observable(0);
//D类
grid.levelDCount = ko.observable(0);
grid.levelDAllotCount = ko.observable(0);
//E类
grid.levelECount = ko.observable(0);
grid.levelEAllotCount = ko.observable(0);


//会员分类划转总数
grid.kindTotalAllotCount = ko.observable(0);
//甲类
grid.kindFirstCount = ko.observable(0);
grid.kindFirstAllotCount = ko.observable(0);
//乙类
grid.kindSecondCount = ko.observable(0);
grid.kindSecondAllotCount = ko.observable(0);
//丙类
grid.kindThirdCount = ko.observable(0);
grid.kindThirdAllotCount = ko.observable(0);
//丁类
grid.kindFourthCount = ko.observable(0);
grid.kindFourthAllotCount = ko.observable(0);
//戊类
grid.kindFifthCount = ko.observable(0);
grid.kindFifthAllotCount = ko.observable(0);
//空类
grid.kindEmptyCount = ko.observable(0);
grid.kindEmptyAllotCount = ko.observable(0);

//会员级别划转总数
grid.kindTotalAllotCountCompute = function () {
    var sum = parseInt(grid.kindFirstAllotCount()) + parseInt(grid.kindSecondAllotCount())
        + parseInt(grid.kindThirdAllotCount()) + parseInt(grid.kindFourthAllotCount())
        + parseInt(grid.kindFifthAllotCount()) +parseInt(grid.kindEmptyAllotCount());

    grid.kindTotalAllotCount(sum);
};


//统一划转输入处理
grid.inputAllotCount = function (obj) {
    var $Obj = $(obj);
    var id = $Obj.attr("id");
    var inputEditKo;
    var inputTotalCountKo;
    var editTypeId;
    switch (id) {
        //普通模式直接划转
        case "totalCommonAllotCount":
            editTypeId = "common";
            inputEditKo = grid.totalCommonAllotCount;
            inputTotalCountKo = grid.totalCount;
            break;
        case "levelOkAllotCount"://OK类编辑
            editTypeId = "level";
            inputEditKo = grid.levelOkAllotCount;
            inputTotalCountKo = grid.levelOkCount;
            break;
        case "levelAAllotCount"://A类编辑
            editTypeId = "level";
            inputEditKo = grid.levelAAllotCount;
            inputTotalCountKo = grid.levelACount;
            break;
        case "levelBAllotCount"://B类编辑
            editTypeId = "level";
            inputEditKo = grid.levelBAllotCount;
            inputTotalCountKo = grid.levelBCount;
            break;
        case "levelCAllotCount"://C类编辑
            editTypeId = "level";
            inputEditKo = grid.levelCAllotCount;
            inputTotalCountKo = grid.levelCCount;
            break;
        case "levelDAllotCount"://D类编辑
            editTypeId = "level";
            inputEditKo = grid.levelDAllotCount;
            inputTotalCountKo = grid.levelDCount;
            break;
        case "levelEAllotCount"://E类编辑
            editTypeId = "level";
            inputEditKo = grid.levelEAllotCount;
            inputTotalCountKo = grid.levelECount;
            break;
        case "kindFirstAllotCount"://甲类编辑
            editTypeId = "kind";
            inputEditKo = grid.kindFirstAllotCount;
            inputTotalCountKo = grid.kindFirstCount;
            break;
        case "kindSecondAllotCount"://乙类编辑
            editTypeId = "kind";
            inputEditKo = grid.kindSecondAllotCount;
            inputTotalCountKo = grid.kindSecondCount;
            break;
        case "kindThirdAllotCount"://丙类编辑
            editTypeId = "kind";
            inputEditKo = grid.kindThirdAllotCount;
            inputTotalCountKo = grid.kindThirdCount;
            break;
        case "kindFourthAllotCount"://丁类编辑
            editTypeId = "kind";
            inputEditKo = grid.kindFourthAllotCount;
            inputTotalCountKo = grid.kindFourthCount;
            break;
        case "kindFifthAllotCount"://戊类编辑
            editTypeId = "kind";
            inputEditKo = grid.kindFifthAllotCount;
            inputTotalCountKo = grid.kindFifthCount;
            break;
        case "kindEmptyAllotCount"://戊类编辑
            editTypeId = "kind";
            inputEditKo = grid.kindEmptyAllotCount;
            inputTotalCountKo = grid.kindEmptyCount;
            break;
    }

    selectType = editTypeId;
    //检查当前编辑框是否选择分类，没有则自动勾选上
    if (!$("#" + editTypeId + "Type .icheckbox_flat-green").hasClass("checked")) {
        $(".icheckbox_flat-green").removeClass("checked");
        $("#"+editTypeId+"Type .icheckbox_flat-green").addClass("checked");
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
        grid.levelTotalAllotCountCompute();
    }
    if (id.indexOf('kind') > -1) {
        grid.kindTotalAllotCountCompute();
    }
};

//初始化数据
grid.Init = function () {
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
    selectType = "";

    //恢复提交按钮样式
    grid.resetSubmitBtnStyle();

    $.get({
        url: "user/allotuser/gettransfercount",
        data: data,
        success: function (data) {

            //总数
            grid.totalCount(data.totalCount);
            grid.totalCommonAllotCount(0);

            //会员级别模式划转总数
            grid.levelTotalAllotCount(0);
            grid.levelOkAllotCount(0);
            grid.levelAAllotCount(0);
            grid.levelBAllotCount(0);
            grid.levelCAllotCount(0);
            grid.levelDAllotCount(0);
            grid.levelEAllotCount(0);

            grid.levelOkCount(data.levelOkCount);
            grid.levelACount(data.levelACount);
            grid.levelBCount(data.levelBCount);
            grid.levelCCount(data.levelCCount);
            grid.levelDCount(data.levelDCount);
            grid.levelECount(data.levelECount);

            //会员分类模式划转总数
            grid.kindTotalAllotCount(0);
            grid.kindFirstAllotCount(0);
            grid.kindSecondAllotCount(0);
            grid.kindThirdAllotCount(0);
            grid.kindFourthAllotCount(0);
            grid.kindFifthAllotCount(0);
            grid.kindEmptyAllotCount(0);

            grid.kindFirstCount(data.kindFirstCount);
            grid.kindSecondCount(data.kindSecondCount);
            grid.kindThirdCount(data.kindThirdCount);
            grid.kindFourthCount(data.kindFourthCount);
            grid.kindFifthCount(data.kindFifthCount);
            grid.kindEmptyCount(data.kindEmptyCount);
        }
    });
   
};

//点击打开会员划转页面
grid.changeToAllot = function () {
    $.openDialog({
        title: '公有池会员划转',
        jqObj: $('#divChangeToAllot')
    });

    grid.Init();
};

//提交保存
grid.submit = function () {
    var data = {
        pool: $("#poolId").val()
    };

    //平台划分给机构企业
    if ($.getCurrentUser().project == "PlatForm") {
        if (!$("#targetEnterpriseId").val()) {
            $.tips("必须选择机构企业！", $("#targetEnterpriseId"));
            return;
        }
        data.targetEnterpriseId = $("#targetEnterpriseId").val();
    } else {//机构企业划分给服务经理
        if (!$("#targetAdminId").val()) {
            $.tips("必须选择服务经理！", $("#targetAdminId"));
            return;
        }
        data.targetAdminId = $("#targetAdminId").val();
    }
   
    if (!selectType) {
        $.tips("必须选择一种划分方式！", $("#allotMsg"));
        return;
    }

    
    switch(selectType)
    {
        case "common":
            data.commonCount = grid.totalCommonAllotCount();
            data.selectType = 0;
            if (grid.totalCommonAllotCount() <= 0) {
                $.tips("请输入要划分的数量！", $("#common"));
                return;
            }
            break;
        case "level":
            data.ok=grid.levelOkAllotCount();
            data.a=grid.levelAAllotCount();
            data.b=grid.levelBAllotCount();
            data.c=grid.levelCAllotCount();
            data.d=grid.levelDAllotCount();
            data.e = grid.levelEAllotCount();
            data.selectType = 1;
            if (grid.levelTotalAllotCount() <= 0) {
                $.tips("请输入要划分的数量！", $("#level"))
                return;
            }
            break;
        case "kind":
            data.first=grid.kindFirstAllotCount();
            data.second=grid.kindSecondAllotCount();
            data.third=grid.kindThirdAllotCount();
            data.fourth=grid.kindFourthAllotCount();
            data.fifth=grid.kindFifthAllotCount();
            data.kindEmpty = grid.kindEmptyAllotCount();
            data.selectType = 2;
            if (grid.kindTotalAllotCount() <= 0) {
                $.tips("请输入要划分的数量！", $("#kind"))
                return;
            }
            break;
    }

    //按钮不可编辑
    grid.setProcessingSubmitBtnStyle();

    $.post({
        url: "user/allotuser/transferallot",
        data: data,
        success: function (result) {
            $.success("会员划分完成！");
            grid.resetSubmitBtnStyle();
            $.closeDialog($("#divChangeToAllot"));
        },
        error: function (error) {
            $.alert(error.responseText);
            //刷新数据
            grid.Init();
        }
    })

};

//提交按钮处理中样式
grid.setProcessingSubmitBtnStyle = function () {
    var btnSubmit = $("#btnSubmitAllot");
    btnSubmit.removeClass("btn-info");
    btnSubmit.addClass("btn-default");
    btnSubmit.attr("disabled", true);
    btnSubmit.text("处理中...");
}
//提交按钮恢复样式
grid.resetSubmitBtnStyle = function () {
    var btnSubmit = $("#btnSubmitAllot");
    btnSubmit.removeClass("btn-default");
    btnSubmit.addClass("btn-info");
    btnSubmit.removeAttr("disabled");
    btnSubmit.text("确定");
}
