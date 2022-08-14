 
 
$(function () { 
    //获取cockie中的值附值 
    $("#userName").val(getCookie('saas-user') ? getCookie('saas-user') : $("#userName").val());
    $("#password").val(getCookie('pass') ? getCookie('pass') : $("#password").val());
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
        var isChecked = $('#check1').is(':checked');
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
            if (isChecked) {
                console.log('记到cookie中');
                setCookie('saas-user', userName);
                setCookie('pass', password);
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
    };  

    //particlesJS('particles-js',
    //    {
    //        "particles": {
    //            "number": {
    //                "value": 80,
    //                "density": {
    //                    "enable": true,
    //                    "value_area": 800
    //                }
    //            },
    //            "color": {
    //                "value": "#ffffff"
    //            },
    //            "shape": {
    //                "type": "circle",
    //                "stroke": {
    //                    "width": 0,
    //                    "color": "#000000"
    //                },
    //                "polygon": {
    //                    "nb_sides": 5
    //                },
    //                "image": {
    //                    "src": "img/github.svg",
    //                    "width": 100,
    //                    "height": 100
    //                }
    //            },
    //            "opacity": {
    //                "value": 0.5,
    //                "random": false,
    //                "anim": {
    //                    "enable": false,
    //                    "speed": 1,
    //                    "opacity_min": 0.1,
    //                    "sync": false
    //                }
    //            },
    //            "size": {
    //                "value": 5,
    //                "random": true,
    //                "anim": {
    //                    "enable": false,
    //                    "speed": 40,
    //                    "size_min": 0.1,
    //                    "sync": false
    //                }
    //            },
    //            "line_linked": {
    //                "enable": true,
    //                "distance": 150,
    //                "color": "#ffffff",
    //                "opacity": 0.4,
    //                "width": 1
    //            },
    //            "move": {
    //                "enable": true,
    //                "speed": 6,
    //                "direction": "none",
    //                "random": false,
    //                "straight": false,
    //                "out_mode": "out",
    //                "attract": {
    //                    "enable": false,
    //                    "rotateX": 600,
    //                    "rotateY": 1200
    //                }
    //            }
    //        },
    //        "interactivity": {
    //            "detect_on": "canvas",
    //            "events": {
    //                "onhover": {
    //                    "enable": true,
    //                    "mode": "repulse"
    //                },
    //                "onclick": {
    //                    "enable": true,
    //                    "mode": "push"
    //                },
    //                "resize": true
    //            },
    //            "modes": {
    //                "grab": {
    //                    "distance": 400,
    //                    "line_linked": {
    //                        "opacity": 1
    //                    }
    //                },
    //                "bubble": {
    //                    "distance": 400,
    //                    "size": 40,
    //                    "duration": 2,
    //                    "opacity": 8,
    //                    "speed": 3
    //                },
    //                "repulse": {
    //                    "distance": 200
    //                },
    //                "push": {
    //                    "particles_nb": 4
    //                },
    //                "remove": {
    //                    "particles_nb": 2
    //                }
    //            }
    //        },
    //        "retina_detect": true,
    //        "config_demo": {
    //            "hide_card": false,
    //            "background_color": "#b61924",
    //            "background_image": "",
    //            "background_position": "50% 50%",
    //            "background_repeat": "no-repeat",
    //            "background_size": "cover"
    //        }
    //    }
    //);
});

//写cookies
function setCookie(name, value) {
    var Days = 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
} 

//读取cookies 
function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");

    if (arr = document.cookie.match(reg))

        return unescape(arr[2]);
    else
        return null;
} 

//删除cookies 
function delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null)
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
} 
