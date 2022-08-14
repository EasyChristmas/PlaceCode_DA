$(function () {

    $("#changeImg img").attr("src", "/Account/GetImg?t=" + (new Date()).valueOf());
    //点击重新生成新的验证码
    $("#changeImg").click(function () {
        $("#changeImg").find("img").attr("src", "/Account/GetImg?t=" + (new Date()).valueOf());
    });

    $("#login-button").on("click", function () {
        var $self = $(this);
        var userName = $("#userName").val();
        var password = $("#password").val();
        var imgCode = $("#imgCode").val();
        var smsCode = $("#smsCode").val();

        if (userName.length == 0) {
            $.errorMsg("用户名不能为空！");
            return false;
        }
        //密码登录
        if (loginType == $.Enum.EnumLoginType.password) {
            if (password.length == 0) {
                $.errorMsg("密码不能为空！");
                return false;
            }
        }
            //短信登录
        else {
            if (imgCode.length == 0) {
                $.errorMsg("图片验证码不能为空！");
                return false;
            }
            if (smsCode.length == 0) {
                $.errorMsg("手机验证码不能为空！");
                return false;
            }
        }

        $self.attr("disabled", "disabled");
        $self.html("登录中...");
        $.ajax({
            url: "/account/login",
            type: "post",
            data: {
                loginType: loginType,
                userName: userName,
                password: md5(password),
                smsCode: smsCode,
                ImgCode: imgCode
            },
            success: function () {
                location.href = "/home/index";
            },
            error: function (xhr) {
                $.errorMsg(xhr.responseText);
                $self.removeAttr("disabled");
                $self.html("登录");
            }
        });
        return false;
    });

    //发送短信验证码
    $("#sendMobileCode").on("click", function () {
        var userName = $("#userName").val();
        var imgCode = $("#imgCode").val();
        if (userName.length == 0) {
            $.errorMsg("用户名不能为空！");
            return;
        }
        if (imgCode.length == 0) {
            $.errorMsg("图片验证码不能为空！");
            return;
        }
        $.ajax({
            url: "/account/sendSms",
            type: "post",
            data: { JobNum: userName, ImgCode: imgCode },
            success: function () {
                downtime();
            },
            error: function (xhr) {
                //发送短信失败，就刷新图片验证码
                $("#changeImg").click();
                $.errorMsg(xhr.responseText);
                return;
            }
        });
    });

    var s = false;
    function downtime() {
        var at = 60;
        var myTime = setInterval(function () {
            if (at > 0) {
                s = false;
                at--;
                $("#sendMobileCode").html(at + "秒后获取");
            } else if (at == 0) {
                s = true;
                clearInterval(myTime);
                $("#sendMobileCode").html("发送验证码");
            }
        }, 1000);
    }
});

