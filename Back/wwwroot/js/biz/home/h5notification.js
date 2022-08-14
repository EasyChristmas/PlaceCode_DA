
(function (root, facotry) {
    if (typeof define === 'function' && define.amd) {
        define('H5Notification', [], facotry)
    } else if (typeof exports === 'object') {
        module.exports = facotry()
    } else {
        root.H5Notification = facotry()
    }
}(this, function () {
    var _self = this;
    _self.isNotification = false;
    _self.themes = {
        info: {
            icon: '',
        },
        warning: {
            icon: '',
        },
        error: {
            icom: '',
        }
    };

    var browserNotification = function (title, opts) {
        this.title = title;
        this.options = { dir: 'auto', lang: 'zh-CN', tag: '', icon: '', body: '', data: '', sticky: false };
        this.callbacks = {
            click: function (event) {
                console.log('click');
            },
            show: function (event) {
                console.log('show');

                //if (_self.isHidden) {
                //    var result = window.open('', 'target', '');
                //    result.close();
                //}

            },
            error: function (event) {
                console.log('error');
            },
            close: function (event) {
                console.log('close');
            },
        };

        this.init = function (opts) {
            $.extend(this.options, opts);
            $.extend(this.callbacks, opts);
        }

        this.init(opts);
    };

    browserNotification.prototype.notice = function () {
        var that = this;
        var data = that.options.data;
        $.showMsg({
            title: that.title,
            text: that.options.body,
            delay: 6000 * (data.weight > 0 ? data.weight : 1),
            callback: function () {
                that.callbacks.click(null, data);
            }
        });
        return null;
    };

    _self.systemNotif = browserNotification;

    Notification.requestPermission(function (permission) {
        _self.isNotification = true;

        /*
        permission
        default表示还没有发出过请求，或者之前请求过，但是用户并没有允许或者禁止，二是直接关闭窗口。这种状态下是不会有通知的。
        granted表示之前向用户请求过权限，而且用户已经允许了。
        denied表示之前向用户请求过权限，但是用户已经拒绝了。
        */
        if (permission == "granted") {
            browserNotification.prototype.notice = function () {
                var self = this;

                /*
                title
                一定会被显示的通知标题
                options 可选（常用，更多需要查api）
                一个被允许用来设置通知的对象。它包含以下属性：
                dir : 文字的方向；它的值可以是 auto（自动）, ltr（从左到右）, or rtl（从右到左）
                body: 通知中额外显示的字符串
                tag: 赋予通知一个ID，以便在必要的时候对通知进行刷新、替换或移除。
                icon: 一个图片的URL，将被用于显示通知的图标。
                vibrate
                */
                var notification = new Notification(self.title, self.options);

                //处理 click 事件的处理。每当用户点击通知时被触发。
                notification.onclick = function (event) {
                    //暂时性解决方案
                    //可能被拦截

                    window.focus();
                    self.callbacks.click(event, event.target.data);

                    this.close();
                };

                //处理 show 事件的处理。当通知显示的时候被触发。
                notification.onshow = function (event) {
                    self.callbacks.show(event, event.target.data);
                };

                //处理 error 事件的处理。每当通知遇到错误时被触发。
                notification.onerror = function (event) {
                    self.callbacks.error(event, event.target.data);
                };

                //处理 close 事件的处理。当用户关闭通知时被触发。
                notification.onclose = function (event) {
                    self.callbacks.close(event, event.target.data);
                };

                return notification;
            }

        }
    });

    //设置主题
    _self.setTheme = function (opts) {
        $.extend(_self.themes, opts);
    };

    //
    _self.baseNotice = function (title, opts) {
        var not = new _self.systemNotif(title, opts);
        not.notice();
    };

    //普通提示
    _self.info = function (title, opts) {
        opts.icon = _self.themes.info.icon;
        var not = new _self.systemNotif(title, opts);
        not.notice();
    };

    //警告
    _self.warning = function (title, opts) {
        opts.icon = _self.themes.warning.icon;
        var not = new _self.systemNotif(title, opts);
        not.notice();
    };

    //错误
    _self.error = function (title, opts) {
        opts.icon = _self.themes.error.icon;
        var not = new _self.systemNotif(title, opts);
        not.notice();
    };

    //Test
    // setTimeout(() => {
    //     _self.info("您有一条新的消息", {
    //         tag: "idididid",
    //         body: '你好啊！我是蚂蚁，我在测试桌面推送',
    //         data: { key: 'key1', key1: 'key2' }
    //     });
    // }, 2000);

    $(function () {
        _self.setTheme({
            info: {
                icon: '/images/favicon.ico',
            },
            warning: {
                icon: '/images/warning.png',
            },
            error: {
                icom: '/images/error.png',
            }
        });
    });

    return {
        setTheme: _self.setTheme,
        notice:_self.baseNotice,
        info: _self.info,
        warning: _self.warning,
        error: _self.error
    };
}));