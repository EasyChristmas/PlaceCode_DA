
//signalR长连接
var signalRCore = {
    //连接
    signalRConnection: function (url) {
        //debugger
        var adminId = $.getCurrentUser().id;
        var adminName = $.getCurrentUser().name;
        var photo = $.getCurrentUser().photo;
        var deptName = $.getCurrentUser().deptName;
        var queryString = "?adminId=" + adminId;
        queryString += "&adminName=" + adminName;
        queryString += "&photo=" + photo;
        queryString += "&deptName=" + deptName;
        signalr_connection = new signalR.HubConnectionBuilder()
            .withUrl(url +"/signalr" + queryString)
            .configureLogging(signalR.LogLevel.Information)
            .build();
        debugger
        const startConn = function () {
            signalr_connection.start()
                .then(function () {
                    console.log("连接成功");
                }).catch(function (ex) {
                    console.log("连接失败" + ex);
                    setTimeout(() => startConn(), 5000);
                });
        };
        startConn();
        signalr_connection.onclose(function (ex) {
            console.log("连接断开");
            setTimeout(() => startConn(), 5000);
        });
        //$.connection.hub.url = url + '/signalr';
        //$.connection.hub.qs = {
        //    'adminId': $.getCurrentUser().id,
        //    'adminName': $.getCurrentUser().name,
        //    'photo': $.getCurrentUser().photo,
        //    'deptName': $.getCurrentUser().deptName
        //};
        //$.connection.hub.start().done(function () {
        //}).fail(function (err) {
        //    $.error("连接Sockect服务器失败:" + err);
        //});
        return signalr_connection;
    }

    //当前连接对象
    //chat: $.connection.chatHub
};