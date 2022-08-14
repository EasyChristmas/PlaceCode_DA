//呼叫中心api
var callcenter = {
    //保存全局对象--公有云
    onloadPublicCloud: function (options) {
        var defaults = {
            pbxs: [{
                PBX: '2.3.1.101',
                pbxNick: '101',
                NickName: '101',
                proxyUrl: "http://10.8.15.222"
            }],
            accountId: "N000000009620",
            //登录方式(软电话=sip,语音网关=gateway,直线=Local)
            loginExtenType: "gateway",
            //登录用户（工号）
            loginUser: $.getCurrentUser().jobNum,
            //登录密码
            loginPassword: "FJtf2244",
            //未知，默认=0
            loginBusyType: "0",
            //服务器ip http://210.14.88.129
            loginProxyUrl: "http://210.14.88.129"
        };
        var opts = $.extend(defaults, options);

        hollyglobal.loginExtenType = opts.loginExtenType;
        hollyglobal.loginPassword = opts.loginPassword;
        hollyglobal.loginBusyType = opts.loginBusyType;
        hollyglobal.loginUser = opts.loginUser.replace("X00", "8").replace("x00", "8") + "@xhjr";
        hollyglobal.loginProxyUrl = opts.loginProxyUrl;
    },
    //保存全局对象--私有云
    onloadPrivateCloud: function (options) {
        ////壹财富的员工用内网IP(特殊处理 529鲍国荣 696冯云影，她们需要在壹财富职场拨打电话)
        ////非壹财富的员工采用外网IP(特殊处理世界广场九天改编的壹财富小组，他们需要在世界广场打电话)
        //var url = (($.getCurrentUser().project == "Ycf" && $.getCurrentUser().departmentId != 125) || $.getCurrentUser().id == 529 || $.getCurrentUser().id == 696) ? "http://192.168.30.200:81" : "http://58.247.248.18:81";

        //搬到金桥职场后所有员工统一使用内网IP登录 
        //var url = "https://192.168.30.200:81";
        //var url = "https://local-call.xiaohu.in";
        var url = "https://a6sh-ycf.7x24cc.com";
        var defaults = {
            pbxs: [{
                PBX: '1.2.134.101',
                pbxNick: '101',
                NickName: '101',
                proxyUrl: url
            }],
            accountId: "N000000020070",//N000000011355
            //登录方式(软电话=sip,语音网关=gateway,直线=Local)
            loginExtenType: "gateway",
            //登录用户（工号）
            loginUser: $.getCurrentUser().jobNum,
            //登录密码
            loginPassword: "QYdq0263",//LHjg1664
            //未知，默认=0
            loginBusyType: "0",
            //服务器ip 
            loginProxyUrl: url
        };
        var opts = $.extend(defaults, options);
        hollyglobal.accountId = opts.accountId;
        hollyglobal.loginExtenType = opts.loginExtenType;
        hollyglobal.loginPassword = opts.loginPassword;
        hollyglobal.loginBusyType = opts.loginBusyType;
        hollyglobal.loginUser = opts.loginUser.replace("X00", "8").replace("x00", "8") + "@shyc";
        hollyglobal.loginProxyUrl = opts.loginProxyUrl;
    },
    //登录
    login: function () {
        //登录成功回调
        hollyglobal.loginSuccessCallback = function () {
            //获取员工编号
            var id = $.getCurrentUser().id;
            //此时修改该坐席数据库状态为签入
            $.put({
                url: "oa/admin/setTelephoneStatus/" + id,
                data: { telephoneStatus: 1 },
                success: function () {
                },
                error: function (resultErr) {
                    console.log(resultErr);
                }
            });
        }

        holly.app.init();
        var actionName = "Login",
            phoneJson = {
                Command: "Action",
                Action: actionName,
                ActionID: actionName + Math.random(),
                Monitor: false,
                ExtenType: hollyglobal.loginExtenType,
                Password: hollyglobal.loginPassword,
                BusyType: hollyglobal.loginBusyType,
                User: hollyglobal.loginUser
            },
            config = {
                proxy_url: hollyglobal.loginProxyUrl,
                user: hollyglobal.loginUser
            };
        holly.phone.phone_register(config, phoneJson);
    },

    //拨号
    dialing: function (userId) {
        $.getBack({
            type: "post",
            url: "/callCenter/dialing",
            data: { userId: userId },
            success: function (result) {
                console.log(result);
                var msg = "";
                switch (result) {
                    case 200:
                        break;
                    case 301:
                        msg = "请求接口时缺少参数！";
                        break;
                    case 303:
                        msg = "拨打的号码格式不正确！";
                        break;
                    case 401:
                        msg = "账户不存在！";
                        break;
                    case 404:
                        msg = "在呼叫系统的帐号不存在！";
                        break;
                    case 405:
                        msg = "呼出接口的key不存在！";
                        break;
                    case 407:
                        msg = "坐席未登录！";
                        break;
                    case 408:
                        msg = "坐席忙碌！";
                        break;
                    case 410:
                        msg = "达到外呼防骚扰上限！";
                        break;
                }
                if (msg.length > 0)
                    $.errorMsg(msg);
            },
            error: function (resultErr) {
                $.errorMsg(resultErr.responseText);
            }
        });
    },
    ////签入
    //checkIn: function () {
    //    if (!holly.session.logined) {
    //        holly.phone._phone_relogin(false);
    //    }
    //},
    //签出
    checkOut: function () {
        top.location.href = "/account/logout";
        //if (holly.session.logined) {
        //    holly.phone._phone_exit(true);
        //}
        ////防止页面失效的时候，请求api报错。
        //var id = $.getCurrentUser().id;
        //$.ajax({
        //    url: "/callback/SetTelephoneStatus",
        //    type: "POST",
        //    data: { telephoneStatus: 0, adminId: id },
        //    success: function (result) {
        //        top.location.href = "/account/logout";
        //    },
        //    error: function (resultErr) {
        //        console.log(resultErr);
        //    }
        //});
    }
}