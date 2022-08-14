$.extend({
    // 与后台枚举保持一致，自行完善
    Enum: {
        //极光推送的通知源
        EnumJPushSource: {
            default: "default",
            message: "message",
            news: "news",
            product: "product",
            marketing: "marketing",
            productcollect: "productcollect"
        },
        //所属项目
        EnumProject: {
            xhjr:0,
            ycf: 1,
            jt: 2,
            ty: 4
        },
        //登录方式
        EnumLoginType: {
            password: 1,
            sms: 2,
            weChat: 3
        },
        //环境
        Environment: {
            development: "Development",
            staging: "Staging",
            production: "production"
        },
        //会员跟进记录电话状态枚举
        EnumTrackingMobileStatus: {
            null: 1,  //错空停
            shutdown: 2, // 关机
            connect: 3, // 接通
            reject: 5,  // 拒接
            noOneHeard: 6, // 无人接听
            busyTone: 7  // 忙音
        },
    }
});


