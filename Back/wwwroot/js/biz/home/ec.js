

//初始化im聊天框
var layui = layui.use('layim', function (layim) {
    //var layim = layim;
    //演示自动回复
    var autoReplay = [
        '您好，我现在有事不在，一会再和您联系。',
        '你没发错吧？face[微笑] ',
        '洗澡中，请勿打扰，偷窥请购票，个体四十，团体八折，订票电话：一般人我不告诉他！face[哈哈] ',
        '你好，我是主人的美女秘书，有什么事就跟我说吧，等他回来我会转告他的。face[心] face[心] face[心] ',
        'face[威武] face[威武] face[威武] face[威武] ',
        '<（￣︶￣）>',
        '你要和我说话？你真的要和我说话？你确定自己想说吗？你一定非说不可吗？那你说吧，这是自动回复。',
        'face[黑线]  你慢慢说，别急……',
        '(*^__^*) face[嘻嘻] ，是贤心吗？'
    ];

    //基础配置
    layim.config({
        //初始化接口
        init: {
            url: '/api/ec/user'
            , data: {}
        }
        //查看群员接口
        , members: {
            url: '/js/plugins/layim3.0/demo/json/getMembers.json'
            , data: {}
        }
        //上传图片接口
        , uploadImage: {
            url: '/ec/uploadFile'
            , data: {
                path: "EC",
                isRename: true
            }
        }
        //上传文件接口
        , uploadFile: {
            url: '/ec/uploadFile'
            , data: {
                path: "EC",
                isRename: true
            }
        }
        , isAudio: true //开启聊天工具栏音频
        , isVideo: true //开启聊天工具栏视频
        //扩展工具栏
        , tool: [{
            alias: 'code'
            , title: '代码'
            , icon: '&#xe64e;'
        }]

        //,brief: true //是否简约模式（若开启则不显示主面板）

        //,title: 'WebIM' //自定义主面板最小化时的标题
        //,right: '100px' //主面板相对浏览器右侧距离
        //,minRight: '90px' //聊天面板最小化时相对浏览器右侧距离
        , initSkin: '' //1-5 设置初始背景
        //,skin: ['aaa.jpg'] //新增皮肤
        //,isfriend: false //是否开启好友
        //,isgroup: false //是否开启群组
        , min: true //是否始终最小化主面板，默认false
        , notice: true //是否开启桌面消息提醒，默认false
        //,voice: false //声音提醒，默认开启，声音文件为：default.mp3

        //, msgbox: layui.cache.dir + 'css/modules/layim/html/msgbox.html' //消息盒子页面地址，若不开启，剔除该项即可
        //, find: layui.cache.dir + 'css/modules/layim/html/find.html' //发现页面地址，若不开启，剔除该项即可
        //, chatLog: layui.cache.dir + 'css/modules/layim/html/chatLog.html' //聊天记录页面地址，若不开启，剔除该项即可

    });

    //监听在线状态的切换事件
    layim.on('online', function (data) {
        //console.log(data);
    });

    //监听签名修改
    layim.on('sign', function (value) {
        //console.log(value);
    });

    //监听自定义工具栏点击，以添加代码为例
    layim.on('tool(code)', function (insert) {
        layer.prompt({
            title: '插入代码'
            , formType: 2
            , shade: 0
        }, function (text, index) {
            layer.close(index);
            insert('[pre class=layui-code]' + text + '[/pre]'); //将内容插入到编辑器
        });
    });

    //监听layim建立就绪
    layim.on('ready', function (res) {
        //console.log(res.mine);
        layim.msgbox(5); //模拟消息盒子有新消息，实际使用时，一般是动态获得
    });

    //监听发送消息
    layim.on('sendMessage', function (data) {
        var to = data.to, mine = data.mine;//包含我发送的消息及我的信息
        console.log(data);
        //通过ws发送消息给客户端
        signalR.chat.server.clientSendMsgToClient(data);
        //保存消息
        $.post({
            url: "ec/message",
            data: {
                senderId: mine.id
                , receiverId: to.id
                , content: mine.content
                , type: 1
                , avatar: mine.avatar
                , realName: mine.username
            },
            success: function () {
            }
        });

    });

    //监听查看群员
    layim.on('members', function (data) {
        //console.log(data);
    });

    //监听聊天窗口的切换
    layim.on('chatChange', function (res) {
        var type = res.data.type;
        if (type === 'friend') {
            //模拟标注好友状态
            //layim.setChatStatus('<span style="color:#FF5722;">在线</span>');
        } else if (type === 'group') {
            //模拟系统消息
            layim.getMessage({
                system: true
                , id: res.data.id
                , type: "group"
                , content: '模拟群员' + (Math.random() * 100 | 0) + '加入群聊'
            });
        }
    });

    return layim;
});

$(function () {
    //用户上线
    signalR.chat.client.online = function (result) {
        var userList = eval("(" + result + ")");
        var onlineUser = layui.layim.cache().friend[0].list;
        //清空在线好友列表
        for (var j = 0; j < onlineUser.length; j++) {
            var user = onlineUser[j];
            user.type = 'friend';
            user.groupid = layui.layim.cache().friend[0].id;
            layui.layim.removeList(user);
        }
        //重新加载好友列表
        for (var i = 0; i < userList.length; i++) {
            var user = userList[i];
            //排除自己
            if (layui.layim.cache().mine.id != parseInt(user.id)) {
                user.type = 'friend';
                user.groupid = layui.layim.cache().friend[0].id;
                layui.layim.addList(user);
            }
        }
    };

    //用户下线
    signalR.chat.client.offline = function (result) {
        var user = eval("(" + result + ")");
        user.type = 'friend';
        user.groupid = layui.layim.cache().friend[0].id;
        layui.layim.removeList(user);
    };

    //接受消息
    signalR.chat.client.receiveMessage = function (message) {
        var obj = eval("(" + message + ")");
        layui.layim.getMessage({
            username: obj.mine.username //消息来源用户名
            , avatar: obj.mine.avatar //消息来源用户头像
            , id: obj.mine.id //消息的来源ID（如果是私聊，则是用户id，如果是群聊，则是群组id）
            , type: obj.to.type //聊天窗口来源类型，从发送消息传递的to里面获取
            , content: obj.mine.content //消息内容
            , mine: false //是否我发送的消息，如果为true，则会显示在右方
            , fromid: obj.mine.id //消息的发送者id（比如群组中的某个消息发送者），可用于自动解决浏览器多窗口时的一些问题
            , timestamp: new Date().getTime() //服务端时间戳。注意：JS中的时间戳是精确到毫秒，如果你返回的是标准的 unix 时间戳，记得要 *1000
        });
    };
});