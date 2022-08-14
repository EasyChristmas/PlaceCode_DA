/*

 @Name: layui WebIM 1.0.0
 @Author：贤心
 @Date: 2014-04-25
 @Blog: http://sentsin.com
 
 */

; (function (win, undefined) {
    $.extend({
        lay: {},
        //默认内置方法。
        layim: function (options) {
            var config = {
                msgurl: '私信地址',
                chatlogurl: '聊天记录url前缀',
                aniTime: 200,
                right: -232,
                api: {},
                user: {},//当前用户信息 
                autoReplay: [],//自动回复内置文案，也可动态读取数据库配置
                chating: {},
                hosts: (function () {
                    var dk = location.href.match(/\:\d+/);
                    dk = dk ? dk[0] : '';
                    return 'http://' + document.domain + dk + '/';
                })(),
                json: function (url, data, callback, error) {
                    return $.ajax({
                        type: 'GET',
                        url: url,
                        data: data,
                        dataType: 'json',
                        success: callback,
                        error: error
                    });
                },
                stopMP: function (e) {
                    e ? e.stopPropagation() : e.cancelBubble = true;
                }
            },
                dom = [$(window), $(document), $('html'), $('body')],
                xxim = {},
                recordArr = [];
            var config = $.extend(config, options);
            //主界面tab
            xxim.tabs = function (index) {
                var node = xxim.node;
                node.tabs.eq(index).addClass('xxim_tabnow').siblings().removeClass('xxim_tabnow');
                node.list.eq(index).show().siblings('.xxim_list').hide();
                if (node.list.eq(index).find('li').length === 0) {
                    xxim.getDates(index);
                }
            };

            //节点
            xxim.renode = function () {
                var node = xxim.node = {
                    tabs: $('#xxim_tabs>span'),
                    list: $('.xxim_list'),
                    online: $('.xxim_online'),
                    setonline: $('.xxim_setonline'),
                    onlinetex: $('#xxim_onlinetex'),
                    xximon: $('#xxim_on'),
                    layimFooter: $('#xxim_bottom'),
                    xximHide: $('#xxim_hide'),
                    xximSearch: $('#xxim_searchkey'),
                    searchMian: $('#xxim_searchmain'),
                    closeSearch: $('#xxim_closesearch'),
                    layimMin: $('#layim_min')
                };
            };

            //主界面缩放
            xxim.expend = function () {
                var node = xxim.node;
                if (xxim.layimNode.attr('state') !== '1') {
                    xxim.layimNode.stop().animate({ right: config.right }, config.aniTime, function () {
                        node.xximon.addClass('xxim_off');
                        try {
                            localStorage.layimState = 1;
                        } catch (e) { }
                        xxim.layimNode.attr({ state: 1 });
                        //node.layimFooter.addClass('xxim_expend').stop().animate({ marginLeft: config.right }, config.aniTime / 2);
                        node.xximHide.addClass('xxim_show');
                    });
                } else {
                    xxim.layimNode.stop().animate({ right: 1 }, config.aniTime, function () {
                        node.xximon.removeClass('xxim_off');
                        try {
                            localStorage.layimState = 2;
                        } catch (e) { }
                        xxim.layimNode.removeAttr('state');
                        //node.layimFooter.removeClass('xxim_expend');
                        node.xximHide.removeClass('xxim_show');
                    });
                    node.layimFooter.stop().animate({ marginLeft: 0 }, config.aniTime);
                }
            };

            //初始化窗口格局
            xxim.layinit = function () {
                var node = xxim.node;

                //主界面
                try {
                    if (!localStorage.layimState) {
                        config.aniTime = 0;
                        localStorage.layimState = 1;
                    }
                    if (localStorage.layimState === '1') {
                        xxim.layimNode.attr({ state: 1 }).css({ right: config.right });
                        node.xximon.addClass('xxim_off');
                        //node.layimFooter.addClass('xxim_expend').css({ marginLeft: config.right });
                        node.xximHide.addClass('xxim_show');
                    }
                } catch (e) {
                    layer.msg(e.message, 5, -1);
                }
            };

            xxim.log = "";

            xxim.jilu = function (log, content, id) {
                var currentItem;
                for (var i = 0; i < recordArr.length; i++) {
                    if (recordArr[i].id) {
                        if (recordArr[i].id == id) {
                            if (!recordArr[i].content) recordArr[i].content = "";
                            recordArr[i].content += (content || "");
                            break;
                        }
                    }
                }
                //弹出聊天记录
                log.chartRecord = $('.layim_chatrecord');
                log.chartRecordUl = $('#layim_recordone' + id);
                log.chartRecordUl.append(content + '<br/>');
                var isExist = function (recordArr, id) {
                    for (var i = 0; i < recordArr.length; i++) {
                        if (recordArr[i].id == id) {
                            recordArr[i].content = log.chartRecordUl.html();
                            return true;
                        }
                    }
                    return false;
                };
                //添加聊天记录
                if (!isExist(recordArr, id))
                    recordArr.push({ id: id, content: log.chartRecordUl.html() });

                for (var i = 0; i < recordArr.length; i++) {
                    if (recordArr[i].id) {
                        if (recordArr[i].id == id) {
                            recordArr[i].content = log.chartRecordUl.html();
                        }
                    }
                }
            }

            //聊天窗口
            xxim.popchat = function (param) {
                var node = xxim.node, log = {};

                log.success = function (layero) {
                    layer.setMove();

                    xxim.chatbox = layero.find('#layim_chatbox');
                    log.chatlist = xxim.chatbox.find('.layim_chatmore>ul');

                    log.chatlist.html('<li data-id="' + param.id + '" type="' + param.type + '"  id="layim_user' + param.type + param.id + '"><span>' + param.name + '</span><em>×</em></li>')
                    xxim.tabchat(param, xxim.chatbox);

                    //最小化聊天窗
                    xxim.chatbox.find('.layer_setmin').on('click', function () {
                        var indexs = layero.attr('times');
                        layero.hide();
                        node.layimMin.text(xxim.nowchat.name).show();
                    });

                    //关闭窗口
                    xxim.chatbox.find('.layim_close').on('click', function () {
                        var indexs = layero.attr('times');
                        layer.close(indexs);
                        xxim.chatbox = null;
                        config.chating = {};
                        config.chatings = 0;
                    });

                    //关闭某个聊天
                    log.chatlist.on('mouseenter', 'li', function () {
                        $(this).find('em').show();
                    }).on('mouseleave', 'li', function () {
                        $(this).find('em').hide
                    });
                    log.chatlist.on('click', 'li em', function (e) {
                        var parents = $(this).parent(), dataType = parents.attr('type');
                        var dataId = parents.attr('data-id'), index = parents.index();
                        var chatlist = log.chatlist.find('li'), indexs;

                        config.stopMP(e);

                        delete config.chating[dataType + dataId];
                        config.chatings--;

                        parents.remove();
                        $('#layim_area' + dataType + dataId).remove();
                        if (dataType === 'group') {
                            $('#layim_group' + dataType + dataId).remove();
                        }

                        if (parents.hasClass('layim_chatnow')) {
                            if (index === config.chatings) {
                                indexs = index - 1;
                            } else {
                                indexs = index + 1;
                            }
                            xxim.tabchat(config.chating[chatlist.eq(indexs).attr('type') + chatlist.eq(indexs).attr('data-id')]);
                        }

                        if (log.chatlist.find('li').length === 1) {
                            log.chatlist.parent().hide();
                        }
                    });

                    //聊天选项卡
                    log.chatlist.on('click', 'li', function () {
                        var othis = $(this), dataType = othis.attr('type'), dataId = othis.attr('data-id');
                        xxim.tabchat(config.chating[dataType + dataId]);

                    });

                    //发送热键切换
                    //log.sendType = $('#layim_sendtype'), log.sendTypes = log.sendType.find('span');
                    //$('#layim_enter').on('click', function (e) {
                    //    config.stopMP(e);
                    //    log.sendType.show();
                    //});
                    //log.sendTypes.on('click', function () {
                    //    log.sendTypes.find('i').text('')
                    //    $(this).find('i').text('√');
                    //});

                    //发送表情
                    //log.showFace = $('.wl_faces_box'),
                    //log.showFaces = log.showFace.find("a");

                    //$('.layim_addface').on('click', function () {
                    //    log.showFace.show();
                    //    return false;
                    //});
                    //dom[1].on('click', function () {
                    //    log.showFace.hide();
                    //});
                    //log.showFaces.on("click", function () {
                    //    console.log($(this).html);
                    //});
                    //发送表情
                    $('.emotion').qqFace({
                        assign: 'layim_write', //给输入框赋值,输入框ID
                        path: '../js/plugins/qqface/face/'    //表情图片存放的路径 
                    });
                    //发送图片
                    $("#layim_upload").next('input[type="file"]').on("click", function () {
                        //var res = $(this).next('input[type="file"]').val();
                        console.log($(this).val());
                    });
                    console.log(config.user);
                    //弹出聊天记录
                    xxim.jilu(log, "", param.id);

                    xxim.transmit();
                };

                log.html = '<div class="layim_chatbox" id="layim_chatbox">'
                    + '<h6>'
                    + '<span class="layim_move"></span>'
                    + '    <a href="' + param.url + '" class="layim_face" target="_blank"><img src="' + $.getFileUrl(param.face || "images/avatars/people.png") + '" class="imface" ></a>'
                    + '    <a href="' + param.url + '" class="layim_names" target="_blank">' + param.name + '</a>'
                    + '    <span class="layim_rightbtn">'
                    + '        <i class="layer_setmin">-</i>'
                    + '        <i class="layim_close">×</i>'
                    + '    </span>'
                    + '</h6>'
                    + '<div class="layim_chatmore" id="layim_chatmore">'
                    + '    <ul class="layim_chatlist"></ul>'
                    + '</div>'
                    + '<div class="layim_chatrecord" id="layim_chatrecord">'
                    + '    <ul class="layim_chart_record layim_recordthis"  id="layim_record' + param.type + param.id + '"></ul>'
                    + '</div>'
                    + '<div class="layim_groups" id="layim_groups"></div>'
                    + '<div class="layim_chat">'
                    + '    <div class="layim_chatarea" id="layim_chatarea">'
                    + '        <ul class="layim_chatview layim_chatthis"  id="layim_area' + param.type + param.id + '"></ul>'
                    + '    </div>'
                    + '    <div class="layim_tool pr">'
                    + '        <a href="javascript:;"><i class="layim_addface icon-smile emotion" title="发送表情" style="margin-top:-4px;">☺</i></a>'
                    + '        <a href="javascript:;" class="pr">'
                    + '             <i class="layim_addimage  icon-picture" title="上传图片" id="layim_upload"></i>'
                    + '             <input type="file" class="file_none pa"/>'
                    + '        </a>'
                    + '        <a href="javascript:;" target="_blank" class="layim_seechatlog"><i class="icon-comment-alt"></i>聊天记录</a>'
                    + '        <div class="wl_faces_box pa dnone" >'
                    + '         <div class="wl_faces_content">'
                    + '             <div class="wl_faces_main">'
                    + '                 <ul>'
                    + '                     <li><a href="javascript:;">'
                    + '                         <img src="../js/plugins/layim/images/face/0/emo_01.gif"></a></li><li><a href="javascript:;">'
                    + '                             <img src="../js/plugins/layim/images/face/0/emo_02.gif"></a></li><li><a href="javascript:;">'
                    + '                                 <img src="../js/plugins/layim/images/face/0/emo_03.gif"></a></li>'
                    + '                     <li><a href="javascript:;">'
                    + '                         <img src="../js/plugins/layim/images/face/0/emo_04.gif"></a></li><li><a href="javascript:;">'
                    + '                             <img src="../js/plugins/layim/images/face/0/emo_05.gif"></a></li><li><a href="javascript:;">'
                    + '                                 <img src="../js/plugins/layim/images/face/0/emo_06.gif"></a></li>'
                    + '                     <li><a href="javascript:;">'
                    + '                         <img src="../js/plugins/layim/images/face/0/emo_07.gif"></a></li><li><a href="javascript:;">'
                    + '                             <img src="../js/plugins/layim/images/face/0/emo_08.gif"></a></li><li><a href="javascript:;">'
                    + '                                 <img src="../js/plugins/layim/images/face/0/emo_09.gif"></a></li>'
                    + '                     <li><a href="javascript:;">'
                    + '                         <img src="../js/plugins/layim/images/face/0/emo_10.gif"></a></li><li><a href="javascript:;">'
                    + '                             <img src="../js/plugins/layim/images/face/0/emo_11.gif"></a></li><li><a href="javascript:;">'
                    + '                                 <img src="../js/plugins/layim/images/face/0/emo_12.gif"></a></li>'
                    + '                     <li><a href="javascript:;">'
                    + '                         <img src="../js/plugins/layim/images/face/0/emo_13.gif"></a></li><li><a href="javascript:;">'
                    + '                             <img src="../js/plugins/layim/images/face/0/emo_14.gif"></a></li><li><a href="javascript:;">'
                    + '                                 <img src="../js/plugins/layim/images/face/0/emo_15.gif"></a></li>'
                    + '                     <li><a href="javascript:;">'
                    + '                         <img src="../js/plugins/layim/images/face/0/emo_16.gif"></a></li><li><a href="javascript:;">'
                    + '                             <img src="../js/plugins/layim/images/face/0/emo_17.gif"></a></li><li><a href="javascript:;">'
                    + '                                 <img src="../js/plugins/layim/images/face/0/emo_18.gif"></a></li>'
                    + '                     <li><a href="javascript:;">'
                    + '                         <img src="../js/plugins/layim/images/face/0/emo_19.gif"></a></li><li><a href="javascript:;">'
                    + '                             <img src="../js/plugins/layim/images/face/0/emo_20.gif"></a></li><li><a href="javascript:;">'
                    + '                                 <img src="../js/plugins/layim/images/face/0/emo_21.gif"></a></li>'
                    + '                     <li><a href="javascript:;">'
                    + '                         <img src="../js/plugins/layim/images/face/0/emo_22.gif"></a></li><li><a href="javascript:;">'
                    + '                             <img src="../js/plugins/layim/images/face/0/emo_23.gif"></a></li><li><a href="javascript:;">'
                    + '                                 <img src="../js/plugins/layim/images/face/0/emo_24.gif"></a></li>'
                    + '                     <li><a href="javascript:;">'
                    + '                         <img src="../js/plugins/layim/images/face/0/emo_25.gif"></a></li><li><a href="javascript:;">'
                    + '                             <img src="../js/plugins/layim/images/face/0/emo_26.gif"></a></li><li><a href="javascript:;">'
                    + '                                 <img src="../js/plugins/layim/images/face/0/emo_27.gif"></a></li>'
                    + '                     <li><a href="javascript:;">'
                    + '                         <img src="../js/plugins/layim/images/face/0/emo_28.gif"></a></li><li><a href="javascript:;">'
                    + '                             <img src="../js/plugins/layim/images/face/0/emo_29.gif"></a></li><li><a href="javascript:;">'
                    + '                                 <img src="../js/plugins/layim/images/face/0/emo_30.gif"></a></li>'
                    + '                     <li><a href="javascript:;">'
                    + '                         <img src="../js/plugins/layim/images/face/0/emo_31.gif"></a></li><li><a href="javascript:;">'
                    + '                             <img src="../js/plugins/layim/images/face/0/emo_32.gif"></a></li><li><a href="javascript:;">'
                    + '                                 <img src="../js/plugins/layim/images/face/0/emo_33.gif"></a></li>'
                    + '                     <li><a href="javascript:;">'
                    + '                         <img src="../js/plugins/layim/images/face/0/emo_34.gif"></a></li><li><a href="javascript:;">'
                    + '                             <img src="../js/plugins/layim/images/face/0/emo_35.gif"></a></li><li><a href="javascript:;">'
                    + '                                 <img src="../js/plugins/layim/images/face/0/emo_36.gif"></a></li>'
                    + '                     <li><a href="javascript:;">'
                    + '                         <img src="../js/plugins/layim/images/face/0/emo_37.gif"></a></li><li><a href="javascript:;">'
                    + '                             <img src="../js/plugins/layim/images/face/0/emo_38.gif"></a></li><li><a href="javascript:;">'
                    + '                                 <img src="../js/plugins/layim/images/face/0/emo_39.gif"></a></li>'
                    + '                     <li><a href="javascript:;">'
                    + '                         <img src="../js/plugins/layim/images/face/0/emo_40.gif"></a></li><li><a href="javascript:;">'
                    + '                             <img src="../js/plugins/layim/images/face/0/emo_41.gif"></a></li><li><a href="javascript:;">'
                    + '                                 <img src="../js/plugins/layim/images/face/0/emo_42.gif"></a></li>'
                    + '                     <li><a href="javascript:;">'
                    + '                         <img src="../js/plugins/layim/images/face/0/emo_43.gif"></a></li><li><a href="javascript:;">'
                    + '                             <img src="../js/plugins/layim/images/face/0/emo_44.gif"></a></li><li><a href="javascript:;">'
                    + '                                 <img src="../js/plugins/layim/images/face/0/emo_45.gif"></a></li>'
                    + '                     <li><a href="javascript:;">'
                    + '                         <img src="../js/plugins/layim/images/face/0/emo_46.gif"></a></li><li><a href="javascript:;">'
                    + '                             <img src="../js/plugins/layim/images/face/0/emo_47.gif"></a></li><li><a href="javascript:;">'
                    + '                                 <img src="../js/plugins/layim/images/face/0/emo_48.gif"></a></li>'
                    + '                     <li><a href="javascript:;">'
                    + '                         <img src="../js/plugins/layim/images/face/0/emo_49.gif"></a></li><li><a href="javascript:;">'
                    + '                             <img src="../js/plugins/layim/images/face/0/emo_50.gif"></a></li><li><a href="javascript:;">'
                    + '                                 <img src="../js/plugins/layim/images/face/0/emo_51.gif"></a></li>'
                    + '                     <li><a href="javascript:;">'
                    + '                         <img src="../js/plugins/layim/images/face/0/emo_52.gif"></a></li><li><a href="javascript:;">'
                    + '                             <img src="../js/plugins/layim/images/face/0/emo_53.gif"></a></li><li><a href="javascript:;">'
                    + '                                 <img src="../js/plugins/layim/images/face/0/emo_54.gif"></a></li>'
                    + '                     <li><a href="javascript:;">'
                    + '                         <img src="../js/plugins/layim/images/face/0/emo_55.gif"></a></li><li><a href="javascript:;">'
                    + '                             <img src="../js/plugins/layim/images/face/0/emo_56.gif"></a></li><li><a href="javascript:;">'
                    + '                                 <img src="../js/plugins/layim/images/face/0/emo_57.gif"></a></li>'
                    + '                     <li><a href="javascript:;">'
                    + '                         <img src="../js/plugins/layim/images/face/0/emo_58.gif"></a></li><li><a href="javascript:;">'
                    + '                             <img src="../js/plugins/layim/images/face/0/emo_59.gif"></a></li><li><a href="javascript:;">'
                    + '                                 <img src="../js/plugins/layim/images/face/0/emo_60.gif"></a></li>'
                    + '                 </ul>'
                    + '             </div>'
                    + '         </div>'
                    + '         <div class="wlf_icon">'
                    + '         </div>'
                    + '     </div>'
                    + '    </div>'
                    + '    <textarea class="layim_write" id="layim_write" name="layim_write"></textarea>'
                    + '    <div class="layim_send">'
                    + '        <div class="layim_sendbtn" id="layim_sendbtn">发送</div>'
                    + '    </div>'
                    + '</div>'
                    + '</div>';

                if (config.chatings < 1) {
                    $.layer({
                        type: 1,
                        border: [0],
                        title: false,
                        shade: [0],
                        area: ['620px', '493px'],
                        move: ['.layim_chatbox .layim_move', true],
                        moveType: 1,
                        closeBtn: false,
                        offset: [(($(window).height() - 493) / 2) + 'px', ''],
                        page: {
                            html: log.html
                        }, success: function (layero) {
                            log.success(layero);
                        }
                    })
                } else {
                    log.chatmore = xxim.chatbox.find('#layim_chatmore');
                    log.chatarea = xxim.chatbox.find('#layim_chatarea');
                    log.chatreco = xxim.chatbox.find('#layim_chatrecord');

                    log.chatmore.show();

                    log.chatmore.find('ul>li').removeClass('layim_chatnow');
                    log.chatmore.find('ul').append('<li data-id="' + param.id + '" type="' + param.type + '" id="layim_user' + param.type + param.id + '" class="layim_chatnow"><span>' + param.name + '</span><em>×</em></li>');

                    log.chatarea.find('.layim_chatview').removeClass('layim_chatthis');
                    log.chatarea.append('<ul class="layim_chatview layim_chatthis" id="layim_area' + param.type + param.id + '"></ul>');

                    log.chatreco.find('.layim_chart_record').removeClass('layim_recordthis');
                    log.chatreco.append('<ul class="layim_chart_record layim_recordthis" id="layim_record' + param.type + param.id + '"></ul>');

                    xxim.tabchat(param);
                }

                //群组
                log.chatgroup = xxim.chatbox.find('#layim_groups');
                if (param.type === 'group') {
                    log.chatgroup.find('ul').removeClass('layim_groupthis');
                    log.chatgroup.append('<ul class="layim_groupthis" id="layim_group' + param.type + param.id + '"></ul>');
                    xxim.getGroups(param);
                }
                //点击群员切换聊天窗
                log.chatgroup.on('click', 'ul>li', function () {
                    xxim.popchatbox($(this));
                });
            };

            //定位到某个聊天队列
            xxim.tabchat = function (param) {
                var node = xxim.node, log = {}, keys = param.type + param.id;
                xxim.nowchat = param;

                xxim.chatbox.find('#layim_user' + keys).addClass('layim_chatnow').siblings().removeClass('layim_chatnow');
                xxim.chatbox.find('#layim_area' + keys).addClass('layim_chatthis').siblings().removeClass('layim_chatthis');
                xxim.chatbox.find('#layim_record' + keys).addClass('layim_recordthis').siblings().removeClass('layim_recordthis');
                xxim.chatbox.find('#layim_group' + keys).addClass('layim_groupthis').siblings().removeClass('layim_groupthis');

                xxim.chatbox.find('.layim_face>img').attr('src', $.getFileUrl(param.face || "images/avatars/people.png"));
                xxim.chatbox.find('.layim_face, .layim_names').attr('href', param.href);
                xxim.chatbox.find('.layim_names').text(param.name);

                //xxim.chatbox.find('.layim_seechatlog').attr('href', config.chatlogurl + param.id);


                log.groups = xxim.chatbox.find('.layim_groups');
                if (param.type === 'group') {
                    log.groups.show();
                } else {
                    log.groups.hide();
                }

                $('#layim_write').focus();
            };

            //弹出聊天窗
            xxim.popchatbox = function (othis) {
                var node = xxim.node, dataId = othis.attr('data-id'), param = {
                    id: dataId, //用户ID
                    type: othis.attr('type'),
                    name: othis.find('.xxim_onename').text(),  //用户名
                    face: othis.find('.xxim_oneface').attr('src'),  //用户头像
                    href: config.hosts + 'user/' + dataId //用户主页
                }, key = param.type + dataId;
                if (!config.chating[key]) {
                    xxim.popchat(param);
                    config.chatings++;
                } else {
                    xxim.tabchat(param);
                }
                $(".xubox_layer").css("top", "");
                config.chating[key] = param;

                var chatbox = $('#layim_chatbox');
                if (chatbox[0]) {
                    node.layimMin.hide();
                    chatbox.parents('.xubox_layer').show();
                }
            };

            //请求群员
            xxim.getGroups = function (param) {
                var keys = param.type + param.id, str = '',
                    groupss = xxim.chatbox.find('#layim_group' + keys);
                groupss.addClass('loading');
                config.json(config.api.groups, {}, function (datas) {
                    if (datas.status === 1) {
                        var ii = 0, lens = datas.data.length;
                        if (lens > 0) {
                            for (; ii < lens; ii++) {
                                str += '<li data-id="' + datas.data[ii].id + '" type="one"><img src="' + $.getFileUrl(datas.data[ii].face || "images/avatars/people.png") + '" class="imface"><span class="xxim_onename">' + datas.data[ii].name + '</span></li>';
                            }
                        } else {
                            str = '<li class="layim_errors">没有群员</li>';
                        }

                    } else {
                        str = '<li class="layim_errors">' + datas.msg + '</li>';
                    }
                    groupss.removeClass('loading');
                    groupss.html(str);
                }, function () {
                    groupss.removeClass('loading');
                    groupss.html('<li class="layim_errors">请求异常</li>');
                });
            };

            //消息传输
            xxim.transmit = function () {
                var node = xxim.node, log = {},
                    message = xxim.loadMessage({
                        formId: config.user.id,
                        name: config.user.name,
                        face: config.user.face
                    }, 'me');
                node.sendbtn = $('#layim_sendbtn');
                node.imwrite = $('#layim_write');

                //发送
                log.send = function () {
                    var data = {
                        //content: replace_em(node.imwrite.val()),
                        content: node.imwrite.val(),
                        id: xxim.nowchat.id,
                        sign_key: '', //密匙
                        _: +new Date
                    };
                    if (config.user.id == data.id) {
                        $.tips('自己不能给自己发送消息！', '#layim_write', 2);
                        node.imwrite.focus();
                        return;
                    }
                    if (data.content.replace(/\s/g, '') === '') {
                        $.tips('说点啥呗！', '#layim_write', 2);
                        node.imwrite.focus();
                    } else {
                        var sendTime = $.getDate();
                        message.imarea.append(message.html({
                            time: sendTime,
                            name: config.user.name,
                            face: config.user.face,
                            content: $.replace_em(data.content),
                            id: data.id,
                            formId: config.user.id
                        }, 'me'));
                        node.imwrite.val('').focus();
                        message.imarea.scrollTop(message.imarea[0].scrollHeight);

                        
                    }

                };

                node.sendbtn.on('click', log.send);

                node.imwrite.keyup(function (e) {
                    if (e.keyCode === 13) {
                        log.send();
                    }
                });

                $('.layim_seechatlog').on('click', function () {
                    $(this).toggleClass('on');
                    message.chartRecord.toggle();
                    $('.layim_chatbox').css('width', '900px');
                    if (!$(this).hasClass('on')) {
                        $('.layim_chatbox').css('width', '620px');
                    };
                    $('#layim_write').focus();
                });
            };

            //加载发送的消息
            xxim.loadMessage = function (param, type) {
                //如果接受的客户端没有打开聊天窗口则自动打开发送方的对话框
                if (param.formId != config.user.id)
                    $(".xxim_chatlist li[data-id='" + param.formId + "']").click();

                var log = {};
                //此处皆为模拟
                var keys = xxim.nowchat.type + xxim.nowchat.id;
                log.chartRecord = $('.layim_chart_record');

                //聊天模版
                log.html = function (param, type) {
                    var s = '<li class="' + (type === 'me' ? 'layim_chateme' : '') + '">'
                        + '<div class="layim_chatuser">'
                        + function () {
                            if (type === 'me') {
                                return '<span class="layim_chattime">' + param.time + '</span>'
                                    + '<span class="layim_chatname">' + param.name + '</span>'
                                    + '<img src="' + $.getFileUrl(param.face || "images/avatars/people.png") + '" class="imface">';
                            } else {
                                return '<img src="' + $.getFileUrl(param.face || "images/avatars/people.png") + '" class="imface">'
                                    + '<span class="layim_chatname">' + param.name + '</span>'
                                    + '<span class="layim_chattime">' + param.time + '</span>';
                            }
                        }()
                        + '</div>'
                        + '<div class="layim_chatsay">' + param.content + '<em class="layim_zero"></em></div>'
                        + '</li>';
                    xxim.jilu(log, s, param.id);

                    return s;
                };

                log.imarea = xxim.chatbox.find('#layim_area' + keys);
                return log;
            };

            //事件
            xxim.event = function () {
                var node = xxim.node;

                //主界面tab
                node.tabs.eq(0).addClass('xxim_tabnow');
                node.tabs.on('click', function () {
                    var othis = $(this), index = othis.index();
                    xxim.tabs(index);
                });

                //列表展收
                node.list.on('click', 'h5', function () {
                    var othis = $(this),
                        chat = othis.siblings('.xxim_chatlist'), parentss = othis.find("i");
                    if (parentss.hasClass('icon-caret-down')) {
                        chat.hide();
                        parentss.attr('class', 'icon-caret-right');
                    } else {
                        chat.show();
                        parentss.attr('class', 'icon-caret-down');
                    }
                });

                //设置在线隐身
                node.online.on('click', function (e) {
                    config.stopMP(e);
                    node.setonline.show();
                });
                node.setonline.find('span').on('click', function (e) {
                    var index = $(this).index();
                    config.stopMP(e);
                    if (index === 0) {
                        node.onlinetex.html('在线');
                        node.online.removeClass('xxim_offline');
                    } else if (index === 1) {
                        node.onlinetex.html('隐身');
                        node.online.addClass('xxim_offline');
                    }
                    node.setonline.hide();
                });

                node.xximon.on('click', xxim.expend);
                node.xximHide.on('click', xxim.expend);

                //搜索
                node.xximSearch.keyup(function () {
                    var val = $(this).val().replace(/\s/g, ''), str = "";
                    if (val !== '') {
                        node.searchMian.show();
                        node.closeSearch.show();
                        var item = _.filter(xxim.onlineUsers, function (item) { return item.name.indexOf(val) >= 0; });
                        str += '<li><ul class="xxim_chatlist">';
                        for (var j = 0; j < item.length; j++) {
                            str += '<li data-id="' + item[j].id + '" class="xxim_childnode" type="one"><img src="' + $.getFileUrl(item[j].face || "images/avatars/people.png") + '" class="xxim_oneface imface" ><span class="xxim_onename">' + item[j].name + '</span></li>';
                        }
                        str += '</ul></li>';
                        //找不到结果
                        if (item.length == 0)
                            str = '<li class="xxim_errormsg">没有符合条件的结果</li>';
                        node.list.eq(3).html(str);
                    } else {
                        node.searchMian.hide();
                        node.closeSearch.hide();
                    }
                });
                node.closeSearch.on('click', function () {
                    $(this).hide();
                    node.searchMian.hide();
                    node.xximSearch.val('').focus();
                });

                //弹出聊天窗
                config.chatings = 0;
                node.list.on('click', '.xxim_childnode', function () {
                    var othis = $(this);
                    xxim.popchatbox(othis);
                });

                //点击最小化栏
                node.layimMin.on('click', function () {
                    $(this).hide();
                    $('#layim_chatbox').parents('.xubox_layer').show();
                });
                //document事件
                dom[1].on('click', function () {
                    node.setonline.hide();
                    $('#layim_sendtype').hide();
                });
            };

            //请求列表数据
            xxim.getDates = function (index) {
                var api = [config.api.friend, config.api.group, config.api.chatlog],
                    node = xxim.node, myf = node.list.eq(index);
                myf.addClass('loading');
                config.json(api[index], {}, function (datas) {
                    if (datas.status === 1) {
                        var i = 0, myflen = datas.data.length, str = '', item;
                        if (myflen > 0) {
                            if (index !== 2) {
                                for (; i < myflen; i++) {
                                    str += '<li data-id="' + datas.data[i].id + '" class="xxim_parentnode">'
                                        + '<h5><i class="icon-caret-right"></i><span class="xxim_parentname">' + datas.data[i].name + '</span><em class="xxim_nums">（' + datas.data[i].nums + '）</em></h5>'
                                        + '<ul class="xxim_chatlist">';
                                    item = datas.data[i].item;
                                    //在线人数
                                    if (i == 0) xxim.onlineUsers = item;
                                    for (var j = 0; j < item.length; j++) {
                                        str += '<li data-id="' + item[j].id + '" class="xxim_childnode" type="' + (index === 0 ? 'one' : 'group') + '"><img src="' + $.getFileUrl(item[j].face || "images/avatars/people.png") + '" class="xxim_oneface imface"><span class="xxim_onename">' + item[j].name + '</span></li>';
                                    }
                                    str += '</ul></li>';
                                }
                            } else {
                                str += '<li class="xxim_liston">'
                                    + '<ul class="xxim_chatlist">';
                                for (; i < myflen; i++) {
                                    str += '<li data-id="' + datas.data[i].id + '" class="xxim_childnode" type="one"><img src="' + $.getFileUrl(datas.data[i].face || "images/avatars/people.png") + '"  class="xxim_oneface imface"><span  class="xxim_onename">' + datas.data[i].name + '</span><em class="xxim_time">' + datas.data[i].time + '</em></li>';
                                }
                                str += '</ul></li>';
                            }
                            myf.html(str);
                        } else {
                            myf.html('<li class="xxim_errormsg">没有任何数据</li>');
                        }
                        myf.removeClass('loading');
                    } else {
                        myf.html('<li class="xxim_errormsg">' + datas.msg + '</li>');
                    }
                }, function () {
                    myf.html('<li class="xxim_errormsg">请求失败</li>');
                    myf.removeClass('loading');
                });
            };

            //加载在线用户
            xxim.reloadOnlineUser = function (data) {
                var index = 0, node = xxim.node, myf = node.list.eq(index);
                myf.addClass('loading');
                if (data.length > 0) {
                    var i = 0, myflen = data.length, str = '', item;
                    if (myflen > 0) {
                        if (index !== 2) {
                            for (; i < myflen; i++) {
                                str += '<li data-id="' + data[i].id + '" class="xxim_parentnode">'
                                    + '<h5><i class="icon-caret-right"></i><span class="xxim_parentname">' + data[i].name + '</span><em class="xxim_nums">（' + data[i].nums + '）</em></h5>'
                                    + '<ul class="xxim_chatlist">';
                                item = data[i].item;
                                for (var j = 0; j < item.length; j++) {
                                    str += '<li data-id="' + item[j].id + '" class="xxim_childnode" type="' + (index === 0 ? 'one' : 'group') + '"><img src="' + $.getFileUrl(item[j].photo || "images/avatars/people.png") + '" class="xxim_oneface imface"><span class="xxim_onename">' + item[j].name + '</span></li>';
                                }
                                str += '</ul></li>';
                            }
                        } else {
                            str += '<li class="xxim_liston">'
                                + '<ul class="xxim_chatlist">';
                            for (; i < myflen; i++) {
                                str += '<li data-id="' + data[i].id + '" class="xxim_childnode" type="one"><img src="' + $.getFileUrl(item[j].photo || "images/avatars/people.png") + '"  class="xxim_oneface imface"><span  class="xxim_onename">' + data[i].name + '</span><em class="xxim_time">' + data[i].time + '</em></li>';
                            }
                            str += '</ul></li>';
                        }
                        myf.html(str);
                    } else {
                        myf.html('<li class="xxim_errormsg">没有任何数据</li>');
                    }
                    myf.removeClass('loading');
                } else {
                    myf.html('<li class="xxim_errormsg">没有任何数据</li>');
                }
            };

            //在线用户数据
            xxim.onlineUsers = [];

            //渲染骨架
            xxim.view = (function () {
                var xximNode = xxim.layimNode = $('<div id="xximmm" class="xxim_main">'
                    + '<div class="xxim_top" id="xxim_top">'
                    + '  <div class="xxim_search"><i class="icon-search"></i><input id="xxim_searchkey" /><span id="xxim_closesearch">×</span></div>'
                    + '  <div class="xxim_tabs" id="xxim_tabs"><span class="xxim_tabfriend" title="好友"><i class="icon-user"></i></span><span class="xxim_tabgroup" title="群组"><i class="icon-group"></i></span><span class="xxim_latechat"  title="最近聊天"><i class="icon-comments"></i></span></div>'
                    + '  <ul class="xxim_list" style="display:block"></ul>'
                    + '  <ul class="xxim_list"></ul>'
                    + '  <ul class="xxim_list"></ul>'
                    + '  <ul class="xxim_list xxim_searchmain" id="xxim_searchmain"></ul>'
                    + '</div>'
                    + '<ul class="xxim_bottom" id="xxim_bottom">'
                    + '<li class="xxim_online" id="xxim_online">'
                    + '<i class="xxim_nowstate icon-check"></i><span id="xxim_onlinetex">在线</span>'
                    + '<div class="xxim_setonline">'
                    + '<span><i class="icon-check"></i>在线</span>'
                    + '<span class="xxim_setoffline"><i class="icon-check"></i>隐身</span>'
                    + '</div>'
                    + '</li>'
                    + '<li id="xxim_on" class="xxim_icon xxim_on"><i class="icon-comments"></i></li>'
                    + '<div class="layim_min" id="layim_min"></div>'
                    + '</ul>'
                    + '</div>');
                dom[3].append(xximNode);
                xxim.renode();
                xxim.getDates(0);
                xxim.event();
                xxim.layinit();
            }());

            //自定义
            xxim.showConsole = function (p) { console.log("自定义方法:" + p); };

            //return xxim;
            $.layim.xxim = xxim;
            //$.lay.xxim = xxim;
        },
        //过滤表情符号的方法
        replace_em: function (str) {
            str = str.replace(/\</g, '<；');
            str = str.replace(/\>/g, '>；');
            //str = str.replace(/\n/g, '<；br/>；');//换行符
            str = str.replace(/\[em_([0-9]*)\]/g, '<img src="../js/plugins/qqface/face/$1.gif" border="0" />');
            return str;
        }
    })
})(window);