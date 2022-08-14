﻿//插件工具包
var selectTagSDK = {
    //目标
    target: '',
    //目标集合
    targetList: [],
    //插件绑定的数据
    tagData: [],
    //标签实体
    tagModel: function (data) {
        var self = this;
        self.id = data.id; //标签编号
        self.name = data.name; //标签名称
        self.isSystem = data.isSystem; //是否系统标签
        self.isSelected = data.isSelected; //是否选中
        self.isEdit = data.isEdit;//是否可选中
    },
    //获取当前目标
    getTarget: function (id) {
        var target = '';
        for (var i = 0; i < selectTagSDK.targetList.length; i++) {
            if (selectTagSDK.targetList[i].id == id) {
                target = selectTagSDK.targetList[i].target;
                break;
            }
        }
        return target;
    },
    //获取控件左绝对位置
    getAbsoluteLeft: function () {
        var obj = document.getElementById(selectTagSDK.target.attr("id"))
        return obj.offsetLeft
    },
    //获取控件上绝对位置
    getAbsoluteTop: function () {
        var obj = document.getElementById(selectTagSDK.target.attr("id"));
        return obj.offsetTop;
    },
    //获取控件宽度
    getElementWidth: function () {
        var obj = document.getElementById(selectTagSDK.target.attr("id"));
        return obj.offsetWidth;
    },
    //获取控件高度
    getElementHeight: function () {
        var obj = document.getElementById(selectTagSDK.target.attr("id"));
        return obj.offsetHeight;
    },
    //获取div的宽度
    getDivWidth: function () {
        //目前写死
        return 200;
    },
    //定位插件div
    positionDiv: function () {
        //页面宽度
        var pageWidth = $('.userTag').width();
        //目标控件与页面的左宽度
        var trgetLeft = selectTagSDK.getAbsoluteLeft();

        selectTagSDK.target.next()
            .css("position", "absolute")
            .css("top", (selectTagSDK.getAbsoluteTop() + selectTagSDK.getElementHeight()) + "px");

        //if (pageWidth - trgetLeft >= selectTagSDK.getDivWidth()) {
        //    selectTagSDK.target.next()
        //        .css("left", trgetLeft + "px");
        //}
        //else {
        //    selectTagSDK.target.next()
        //        .css("left", (pageWidth - selectTagSDK.getDivWidth()) + "px");
        //}
        if (trgetLeft + selectTagSDK.getDivWidth() > pageWidth) {
            selectTagSDK.target.next()
                .css("right", "0px");
        } else {
            selectTagSDK.target.next()
                .css("left", trgetLeft + "px");
        }
    },
    //点击展示标签插件事件
    showTagEvent: function (target) {
        //点击添加标签
        target.click(function (e) {
            if ($('.popover').length == 0) {
                //赋值当前使用的target
                selectTagSDK.target = selectTagSDK.getTarget($(this).attr("id"));
                //赋值当前使用的tagData
                selectTagSDK.tagData = selectTagSDK.target.loadData();

                selectTagSDK.bindHtml(selectTagSDK.tagData);
                //定位插件Div
                selectTagSDK.positionDiv();
                e.stopPropagation();//阻止冒泡到body

                //点击到插件这个div范围时阻止点击body事件
                selectTagSDK.target.next().click(function (e) {//自己要阻止
                    e.stopPropagation();//阻止冒泡到body
                });
                //添加标签事件
                selectTagSDK.addTagEvent();
                //查询标签事件
                selectTagSDK.searchTagEvent();
            }
        });
    },
    //添加标签事件
    addTagEvent: function () {
        //绑定点击添加标签事件
        selectTagSDK.target.next().find("button[type='button']").click(function () {
            var liList = selectTagSDK.target.next().find("ul li");
            //插件内部做基础验证
            //验证要添加的标签名称，不合法则不处理
            var name = $(this).prev().val().trim();
            if (name.length == 0)
                return;
            ////验证重复标签
            //var liTestList = [];
            //(selectTagSDK.tagData).forEach(function (item) {
            //    liTestList.push(item.name);
            //});
            //if ($.inArray(name, liTestList) >= 0)
            //    return;
            //处理添加业务
            var id = selectTagSDK.target.addData(name);
            //业务执行异常，返回return，将停止执行
            if (id == undefined || id == 0)
                return;
            //添加到标签数据集合，默认是添加到最后
            selectTagSDK.tagData.push({ "id": id, "name": name, "isSelected": true, "isSystem": false, "isEdit": true });
            //绑定标签数据
            selectTagSDK.bindLiData(selectTagSDK.tagData);
            //清除文本
            $(this).prev().val("");
            //关闭插件
            $(this).parent().parent().parent().remove();
            
        });
    },
    //查询标签事件
    searchTagEvent: function () {
        //标签文本模糊查询事件
        selectTagSDK.target.next().find("input[type='text']").keyup(function (event) {
            var $this = $(this);
            if (event.keyCode == 13) {
                console.log("按回车啦");
                selectTagSDK.target.next().find("button[type='button']").click();
            }

            var searchData = [];
            for (var i = 0; i < selectTagSDK.tagData.length; i++) {
                if (selectTagSDK.tagData[i].name.indexOf($this.val().toLowerCase()) >= 0 || selectTagSDK.tagData[i].name.indexOf($this.val().toUpperCase()) >= 0)
                    searchData.push(selectTagSDK.tagData[i]);
            }
            //绑定标签数据
            selectTagSDK.bindLiData(searchData);
        });
    },
    //选择标签事件
    selectedTagEvent: function () {
        selectTagSDK.target.next().find('ul li').not(".noSelected").each(function (index, item) {
            //添加下拉框行的单击事件
            $(item).find("a").click(function () {
                //选择的标签Id
                var selectedId = ($(this).parent().attr("data-id"));
                //当前选中对象
                var tagItem = selectTagSDK.getTagItem(selectedId);
                //是否选中
                var isSelected = !tagItem.isSelected;
                //获取所有选中的标签，业务要求按顺序返回
                var selArr = [];
                (selectTagSDK.tagData).forEach(function (item) {
                    if (item.isSelected) {
                        if (item.id == selectedId) {
                            if (item.isSelected)
                                return;
                        }
                        selArr.push(item);
                    }
                    else {
                        if (item.id == selectedId) {
                            if (item.isSelected)
                                return;
                            else
                                selArr.push(item);
                        }
                    }
                });

                //业务处理
                var result = selectTagSDK.target.selectedLine(selectedId, isSelected, selArr);
                //业务执行异常，返回return，将停止执行
                if (result == undefined)
                    return;

                //定位插件Div
                selectTagSDK.positionDiv();

                //业务处理成功之后修改选择样式
                if (!isSelected) {
                    $(this).parent().removeClass("selected");
                    $(this).parent().find('i[class="icon-ok"]').remove();
                }
                else {
                    $(this).parent().addClass("selected");
                    $(this).parent().find('span').after('<i class="icon-ok"></i>');
                }

                //更新数据源的值
                for (var i = 0; i < selectTagSDK.tagData.length; i++) {
                    if (selectTagSDK.tagData[i].id == selectedId) {
                        selectTagSDK.tagData[i].isSelected = isSelected;
                        break;
                    }
                }
            });
        });
    },
    //绑定html
    bindHtml: function (data) {
        var _html = '';
        _html += '<div class="popover popover-menu-view bottom in" style="width: ' + selectTagSDK.getDivWidth() + 'px;  display: block;">';
        _html += '<div class="popover-content thin-scroll">';
        _html += '<div class="menu-input add-form">';
        _html += '<input class="add-input form-control" type="text" maxlength="10" placeholder="请输入标签">';
        _html += '<button class="btn btn-link link-add-handler" type="button">添加</button>';
        _html += '</div>';
        _html += '<div>${TEMPLATE}</div>';
        _html += '</div>';
        _html += '</div>';
        //内容
        var _content = '<ul class="list-unstyled thin-scroll with-input"></ul>';
        _html = _html.replace('${TEMPLATE}', _content);
        selectTagSDK.target.after(_html);
        //绑定标签数据
        selectTagSDK.bindLiData(data);
    },
    //绑定标签数据
    bindLiData: function (data) {
        //内容
        var _content = '';
        for (var i = 0; i < data.length; i++) {
            _content += '<li title="' + data[i].name + '" class="menu-item tag-item' + (data[i].isSelected ? " selected" : "") + (!data[i].isEdit ? " noSelected" : "") + ' " data-id="' + data[i].id + '">';
            _content += '<a class="tag">';
            if (data[i].isSystem)
                _content += ' <i class="icon-cog"></i>';
            else
                _content += ' <i class="icon-user"></i>';
            _content += ' <span class="tag-name">' + data[i].name + '</span>';
            if (data[i].isSelected)
                _content += '<i class="icon-ok"></i>';
            _content += '</a>';
            _content += '</li>';
        }
        selectTagSDK.target.next().find("ul li").remove();
        selectTagSDK.target.next().find("ul").append(_content);
        //重新绑定选择标签事件
        selectTagSDK.selectedTagEvent();
    },
    //获取标签对象
    getTagItem: function (id) {
        var res = [];
        for (var i = 0; i < selectTagSDK.tagData.length; i++) {
            if (selectTagSDK.tagData[i].id == id) {
                res = selectTagSDK.tagData[i];
                break;
            }
        }
        return res;
    },
    //初始化绑定相关事件
    init: function (target) {
        //点击展示标签插件事件
        selectTagSDK.showTagEvent(target);

        //点击body范围都关闭插件展示
        $(" body").click(function () {
            target.next().remove();
        });
    }
}

//对内绑定目标控件和插件
jQuery.fn.extend({
    //加载数据
    loadData: function () {
    },
    //添加标签
    addData: function (name) {
    },
    //选择标签
    selectedLine: function (id, isSelected) {
    },
});

//对外提供回调事件
jQuery.extend({
    selectTag: function (options) {
        var opts = options = options || {};
        var target = opts.elem;
        //业务负责加载需要绑定到插件的数据
        if (typeof (opts.loadData) == "function") {
            target.loadData = opts.loadData;
        }
        //业务负责验证并添加标签到数据库，并返回标签Id;
        if (typeof (opts.addData) == "function") {
            target.addData = opts.addData;
        }
        if (typeof (opts.selectedLine) == "function") {
            target.selectedLine = opts.selectedLine;
        }
        //业务负责处理选择标签，做数据库处理
        selectTagSDK.targetList.push({ "id": target.attr("id"), "target": target });
        //初始化插件
        selectTagSDK.init(target);
    }
});

