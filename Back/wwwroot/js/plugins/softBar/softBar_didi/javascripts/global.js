var hollyglobal = {
    hangupEvent: function (peer) {
//        console.dir(peer);
        //alert('aaaaa');
    },
    ringEvent: function (peer) {
//        console.dir(peer);
    },
    talkingEvent: function (peer) {
//        console.dir(peer);
    },
    loginSuccessCallback: null,

    loginFailureCallback: function (peer) {
//        console.log(peer);
    },
    pbxs: [
        {
            PBX: '2.3.1.101',
            pbxNick: '101',
            NickName: '101',
            proxyUrl: "http://10.8.15.222"
        }
    ],
    accountId: '',
    sipConfigId: '1.2.2.107',
    monitorPassword: '7pu3refwds98172e',
    monitorUserID: '2387rufhinjvcx73rfws',
    loginBusyType: "0",
    loginExtenType: "",
    loginPassword: "",
    loginUser: "",
    loginProxyUrl: "",
    isDisplayInvestigate: true,
    isDisplayConsult: false,
    isHiddenNumber: false,
    isMonitorPage: false,
    isDisplayTransfer: false
};