
//var SysJobViewModel = function () {
//    var self = this;
//    self.id = ko.observable($.getParam("id"));
//    self.status = ko.observable(null); //名称
//    self.statusName = ko.observable(null);   //父节点
//    self.title = ko.observable(null);  //排序
//    self.createTime = ko.observable(null);  //图标
//    self.levelName = ko.observable(null); //员工数量
//    self.moduleName = ko.observable(null);  //子节点集合
//    self.isPower = ko.observable(null);  //子节点集合
//    self.isAskQuestion = ko.observable(null);  //子节点集合
//    self.departmentName = ko.observable(null);  //子节点集合
//    self.currentAdminPhoto = ko.observable(null);  //子节点集合
//    self.sysJobLogList = ko.observableArray([]);  //子节点集合
//    self.init = function() {
//        //加载产品经理
//        $.get({
//            async: true,
//            url: "sys/sysJob/" + self.id(),
//            success: function (result) {
//                self.status(result.status);
//                //状态名称
//                self.statusName(result.statusName);
//                //标题
//                self.title(result.title);
//                //创建时间
//                self.createTime(result.createTime);
//                //级别名称
//                self.levelName(result.levelName);
//                //模块名称
//                self.moduleName(result.moduleName);
//                //是否有权利审核
//                self.isPower(result.isPower);
//                //是否有权利审核
//                self.isAskQuestion(result.isAskQuestion);
//                //头像
//                //viewData.photo(result.photo);
//                //部门名称
//                self.departmentName(result.departmentName);
//                //当前登录人头像
//                self.currentAdminPhoto(result.currentAdminPhoto);
//                //系统工单记录
//                self.sysJobLogList.removeAll();
//                //映射记录列表
//                ko.mapping.fromJS(result.sysJobLogList, {}, self.sysJobLogList);
//            },
//            error: function (resultErr) {
//                $.errorMsg(resultErr.responseText);
//            }
//        });
//        alert(123);
//    };
//    //显示审核工单信息
//    self.showRejectSysJob = function () {
//        $.openDialog({
//            title: "驳回工单",
//            jqObj: $("#modalReject"),
//            width: "600"
//        });
//    };
//    //驳回工单信息
//    self.saveRejectSysJob = function () {
//        if ($("#rejectForm").validate()) {
//            $("#rejectForm").submitForm({
//                type: "put",
//                url: "sys/sysJob",
//                data: { id: self.id(), status: -1 },
//                success: function (result) {
//                    $.success("驳回成功", 2000);
//                    self.status(-1);
//                    $.closeDialog($("#modalReject"));
//                },
//                error: function (resultErr) {
//                    $.error(resultErr.responseText);
//                }
//            });
//        }
//    };
//    //审核通过工单信息
//    self.auditSysJob = function () {
//        $.confirm("您确定要审核通过吗？", function () {
//            $.put({
//                url: "sys/sysJob/" + self.id(),
//                data: { id: self.id(), status: 20 },
//                success: function (result) {
//                    $.success("审核成功", 2000);
//                    //getSysJob();;
//                },
//                error: function (resultErr) {
//                    $.error(resultErr.responseText);
//                }
//            });
//        });
//    };
//    //提交问题
//    self.submitQuestion = function () {
//        var content = $("#summernote").summernote("code");
//        if ($.trim(content) === "" || content == null) {
//            $.tips("内容不能为空！", $("#submitLogQuestion"));
//            return;
//        }
//        $.put({
//            url: "sys/sysJob/" + self.id(),
//            data: { id: self.id(), content: content, status: 25 },
//            success: function (result) {
//                $.success("提交成功", 2000);
//                $("#summernote").summernote("code", "");
//                //getSysJob();
//            },
//            error: function (resultErr) {
//                $.error(resultErr.responseText);
//            }
//        });
//    };
//    //关闭问题
//    self.closeQuestion = function () {
//        $.confirm("您确定要关闭问题吗？", function () {
//            $.put({
//                url: "sys/sysJob/" + self.id(),
//                data: { id: self.id(), status: 30 },
//                success: function (result) {
//                    $.success("关闭成功", 2000);
//                    //getSysJob();
//                },
//                error: function (resultErr) {
//                    $.error(resultErr.responseText);
//                }
//            });
//        });
//    };
//};


var viewData = {};
$(function () {
    //初始化Ko
    var initKo = function () {
        //系统工单主键ID
        viewData.sysJobId = sysJobId;
        //状态
        viewData.status = null;
        //状态名称
        viewData.statusName = null;
        //标题
        viewData.title = null;
        //创建时间
        viewData.createTime = null;
        //级别名称
        viewData.levelName = null;
        //模块名称
        viewData.moduleName = null;
        //是否有权利审核
        viewData.isPower = null;
        //是否有权利审核提交问题
        viewData.isAskQuestion = null;
        //部门名称
        viewData.departmentName = null;
        //当前登录人头像
        viewData.currentAdminPhoto = null;
        //头像
        //viewData.photo = null;
        //系统工单记录
        viewData.sysJobLogList = [];
        //显示审核工单信息
        viewData.showRejectSysJob = function () {
            $.openDialog({
                title: "驳回工单",
                jqObj: $("#modalReject"),
                width: "600"
            });
        };
        //驳回工单信息
        viewData.saveRejectSysJob = function () {
            if ($("#rejectForm").validate()) {
                $("#rejectForm").submitForm({
                    type: "put",
                    url: "sys/sysJob",
                    data: { id: viewData.sysJobId(), status: -1 },
                    success: function (result) {
                        $.success("驳回成功", 2000);
                        viewData.status(-1);
                        $.closeDialog($("#modalReject"));
                    },
                    error: function (resultErr) {
                        $.error(resultErr.responseText);
                    }
                });
            }
        };
        //审核通过工单信息
        viewData.auditSysJob = function () {
            $.confirm("您确定要审核通过吗？", function () {
                $.put({
                    url: "sys/sysJob/" + viewData.sysJobId(),
                    data: { id: viewData.sysJobId(), status: 20 },
                    success: function (result) {
                        $.success("审核成功", 2000);
                        getSysJob();;
                    },
                    error: function (resultErr) {
                        $.error(resultErr.responseText);
                    }
                });
            });
        };
        //提交问题
        viewData.submitQuestion = function () {
            var content = $("#summernote").summernote("code");
            if ($.trim(content) === "" || content == null) {
                $.tips("内容不能为空！", $("#submitLogQuestion"));
                return;
            }
            $.put({
                url: "sys/sysJob/" + viewData.sysJobId(),
                data: { id: viewData.sysJobId(), content: content, status: 25 },
                success: function (result) {
                    $.success("提交成功", 2000);
                    $("#summernote").summernote("code", "");
                    getSysJob();
                },
                error: function (resultErr) {
                    $.error(resultErr.responseText);
                }
            });
        };
        //关闭问题
        viewData.closeQuestion = function () {
            $.confirm("您确定要关闭问题吗？", function () {
                $.put({
                    url: "sys/sysJob/" + viewData.sysJobId(),
                    data: { id: viewData.sysJobId(), status: 30 },
                    success: function (result) {
                        $.success("关闭成功", 2000);
                        getSysJob();
                    },
                    error: function (resultErr) {
                        $.error(resultErr.responseText);
                    }
                });
            });
        };

        //绑定Ko对象
        viewData = ko.mapping.fromJS(viewData);
        //ko绑定
        ko.applyBindings(viewData);

    }();
    getSysJob();

});

//获取系统数据
function getSysJob() {
    //加载产品经理
    $.get({
        async: true,
        url: "sys/sysJob/" + viewData.sysJobId(),
        success: function (result) {
            //console.log(result);
            //状态
            viewData.status(result.status);
            //状态名称
            viewData.statusName(result.statusName);
            //标题
            viewData.title(result.title);
            //创建时间
            viewData.createTime(result.createTime);
            //级别名称
            viewData.levelName(result.levelName);
            //模块名称
            viewData.moduleName(result.moduleName);
            //是否有权利审核
            viewData.isPower(result.isPower);
            //是否有权利审核
            viewData.isAskQuestion(result.isAskQuestion);
            //头像
            //viewData.photo(result.photo);
            //部门名称
            viewData.departmentName(result.departmentName);
            //当前登录人头像
            viewData.currentAdminPhoto(result.currentAdminPhoto);
            //系统工单记录
            viewData.sysJobLogList.removeAll();
            //映射记录列表
            ko.mapping.fromJS(result.sysJobLogList, {}, viewData.sysJobLogList);
            //console.log(viewData.currentAdminPhoto());
        },
        error: function (resultErr) {
            $.errorMsg(resultErr.responseText);
        }
    });
};