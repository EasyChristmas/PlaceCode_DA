//新闻类型实体
var NewsTypeModel = function (newsType) {
    var self = this;
    self.id = newsType.id; //新闻类型编号
    self.parentId = newsType.parentId; //父类型的编号
    self.name = ko.observable(newsType.name); //新闻类型名称
    self.sort = ko.observable(newsType.sort); //新闻类型排序
    self.newsCount = ko.observable(newsType.newsCount);   //新闻数量
    self.projectId = newsType.projectId;//新闻所属项目
    self.children = ko.observableArray(newsType.children); //新闻子级
    self.childrenCount = ko.observable(newsType.children.length);

};
//新闻实体
var NewsModel = function (news) {
    var self = this;
    self.id = news.id; //新闻编号
    self.title = ko.observable(news.title); //新闻标题
    self.newsTypeId = ko.observable(news.newsTypeId); //新闻类型Id
    //self.newsTypeName = ko.observable(news.newsTypeName); //新闻类型名称
    self.updateTime = ko.observable(news.updateTime); //更新时间
    self.seoKeyword = ko.observable(news.seoKeyword); //SEO标题
    self.attr = ko.observable(news.attr); //特性
    self.url = ko.observable(news.url); //url
    self.source = ko.observable(news.source); //来源
};


//新闻管理页面ko对象
var NewsViewModel = function () {
    var self = this;
    self.newsTypeListData = [];
    self.newsTypeList = ko.observableArray([]);  //新闻类型集合
    self.newsList = ko.observableArray([]);  //新闻集合
    self.total = ko.observable(0); //新闻条数
    self.projectId = 1;//当前选择项目
    self.selNewsTypeId = 0;  //当前选中的新闻类型Id
    self.isEditNewsType = true;  //是否编辑类型(用于区分新增/编辑新闻类型)
    self.selNewsParentTypeId = ko.observable(0); //默认父级id为0

    //选择项目
    self.selProject = function (obj) {
        var changeProjectId = $(obj).val();
        if (changeProjectId) {
            self.projectId = changeProjectId;
        }
        self.loadNewsType();
    };

    self.init = function () {
        self.loadProjectList();
    };

    //加载项目
    self.loadProjectList = function () {
        $.Data.bindProject({
            selId: 'selProject',
            defaultValue: self.projectId
        });
    };

    self.loadNewsType = function () {
        //清空数据
        self.newsTypeList([]);
        self.newsList([]);
        self.selNewsTypeId = 0;
        self.emptyQuery();
        $.get({
            url: 'site/newsType?projectId=' + self.projectId,
            success: function (result) {
                var res = $.toTree(result);
                console.log('res');
                self.newsTypeListData = res;

                var data = JSON.parse(JSON.stringify(res));//改为树状结构 
                for (var i = 0; i < data.length; i++) {
                    if (i == 0)
                        self.selNewsTypeId = data[i].id;
                    if (!data[i].children)
                        data[i].children = [];
                    else {
                        var childrenKo = ko.mapping.fromJS(data[i].children);
                        data[i].children = childrenKo();
                    }
                    self.newsTypeList.push(new NewsTypeModel(data[i]));
                    //&& $parent.$index() == 0  
                    console.log('self.newsTypeList', self.newsTypeList())
                }
                query(1);
            }
        });
    };

    //新闻类型选中
    self.selNewsType = function (obj) {
        var $this = $(obj);
        var id = $this.attr('dataid');
        //选中子集
        self.emptyQuery();
        $this.parent().parent().siblings().find('.menuNewsLeft_a').removeClass('active');
        $("div[dataGroup='newsTypeGroup']").each(function () {
            if ($(this).hasClass("active"))
                $(this).removeClass('active');
        });
        if (!$this.hasClass("active"))
            $this.addClass("active");

        self.selNewsTypeId = id;
        query(1);
    };

    //父级折叠展开
    self.selParentNewsType = function (event, obj) {
        var $this = $(obj);
        $this.toggleClass('closeDiv');
        if ($this.hasClass('closeDiv')) {
            $this.parent().parent().next('.news_type_children').hide();
        } else {
            $this.parent().parent().next('.news_type_children').show();
        }
        $this.find('i').toggleClass('icon-chevron-down').toggleClass('icon-chevron-up');
        event.stopPropagation();    //  阻止事件冒泡
    };

    //父级选中筛选
    self.clickParentMenu = function (obj) {
        var $this = $(obj);
        var pid = $this.attr('dataid');
        $this.addClass('active');
        $this.parent().siblings().find('.news_type_parent').removeClass('active');
        vm.selNewsTypeId = self.getChildIdsByParentId(pid, self.newsTypeListData);
        query(1);
    };

    //根据父级id获取子集id集合
    self.getChildIdsByParentId = function (pid, data) {
        var ids = [];
        data.forEach(function (item, index) {
            if (item.id == pid) {
                item.children.forEach(function (values, indexs) {
                    ids.push(values.id);
                });
                return false;
            }
        });
        return ids.toString();
    };

    //新增新闻一级类型
    self.addNewsParentType = function () {
        self.selNewsParentTypeId(0);
        $.openDialog({
            title: '新增类型',
            jqObj: $('#divNewsType')
        });
        self.isEditNewsType = false;
    };

    //新增新闻二级类型
    self.addNewsType = function (event, obj) {
        var $this = $(obj);
        var parentId = $this.parent().parent().attr('dataid');
        self.selNewsParentTypeId(parentId);
        $.openDialog({
            title: '新增类型',
            jqObj: $('#divNewsType')
        });
        self.isEditNewsType = false;
        event.stopPropagation();    //  阻止事件冒泡
    };

    //编辑新闻类型
    self.editNewsType = function (event, obj) {
        var $this = $(obj);
        var parentId = $this.attr('parentId');
        var id = $this.parent().parent().attr('dataid');
        self.selNewsTypeId = id;

        //当前子集div没选中则不处理
        //if (!$(obj).parent().parent().hasClass('active'))
        //    return;

        if (self.selNewsTypeId == 0) {
            $.tips('请先选择类型', $(event.toElement));
            return;
        }
        $.get({
            url: 'site/NewsType?id=' + self.selNewsTypeId,
            success: function (result) {
                $.openDialog({
                    title: '编辑类型',
                    jqObj: $('#divNewsType')
                });
                $('#newsTypeForm').loadForm(result);
                self.isEditNewsType = true;
            }
        });
        event.stopPropagation();    //  阻止事件冒泡
    };
    //保存新闻类型
    self.saveNewsType = function () {
        var parentId = self.selNewsParentTypeId();
        $("#newsTypeForm").submitForm({
            type: self.isEditNewsType ? 'put' : 'post',
            url: 'site/NewsType',
            data: self.isEditNewsType ? {
                id: self.selNewsTypeId,
                projectId: self.projectId
            } : {
                    projectId: self.projectId,
                    parentId: parentId
                },
            success: function (result) {
                //编辑
                if (self.isEditNewsType) {
                    for (var i = 0; i < self.newsTypeList().length; i++) {
                        if (self.newsTypeList()[i].id == result.id) {
                            self.newsTypeList()[i].name(result.name);
                            break;
                        } else {
                            var childItem = self.newsTypeList()[i].children().filter(x => x.id() == result.id);
                            if (childItem != null && childItem.length > 0) {
                                childItem[0].name(result.name);
                            }
                        }
                    }
                }
                //添加
                else {
                    if (self.newsTypeList().length == 0)
                        self.selNewsTypeId = result.id

                    //增加父级
                    if (result.parentId == 0) {
                        result.children = [];
                        self.newsTypeList.push(new NewsTypeModel(result));
                    } else {
                        //增加子集
                        for (var i = 0; i < self.newsTypeList().length; i++) {
                            if (self.newsTypeList()[i].id == result.parentId) {
                                var count = self.newsTypeList()[i].childrenCount();
                                var childrenKo = ko.mapping.fromJS(result);
                                self.newsTypeList()[i].childrenCount(count + 1);
                                self.newsTypeList()[i].children.push(childrenKo);
                                break;
                            }
                        }
                    }

                }
                $.closeDialog($('#divNewsType'));
            },
            error: function (resultErr) {
                $.errorMsg(resultErr.responseText);
            }
        });
    };

    //删除新闻类型
    self.delNewsType = function (event, obj) {
        var $this = $(obj);
        var id = $this.parent().parent().attr('dataid');
        var parentId = $this.parent().parent().attr('parentId');
        self.selNewsTypeId = id;
        self.selNewsParentTypeId(parentId);
        //当前div没选中则不处理
        //if (!$(obj).parent().parent().hasClass('active'))
        //    return;
        if (self.selNewsTypeId == 0) {
            $.tips('请先选择类型', $(event.toElement));
            return;
        }
        $.confirm('您确定要删除吗?', function () {
            $.delete({
                url: "site/NewsType/" + self.selNewsTypeId,
                success: function () {
                    for (var i = 0; i < self.newsTypeList().length; i++) {
                        if (self.newsTypeList()[i].id == self.selNewsParentTypeId()) {
                            var childArr = self.newsTypeList()[i].children();
                            var count = self.newsTypeList()[i].childrenCount();
                            ko.utils.arrayForEach(childArr, function (el, index) {
                                if (el.id() == self.selNewsTypeId) {
                                    ko.utils.arrayRemoveItem(childArr, el);
                                    self.newsTypeList()[i].children(childArr);
                                    self.newsTypeList()[i].childrenCount(count - 1);
                                    $.success('操作成功');
                                    return;
                                }

                            });
                        }
                    };
                    //self.loadNewsType()

                },
                error: function (resultErr) {
                    $.errorMsg(resultErr.responseText);
                }
            });
        });
        event.stopPropagation();    //  阻止事件冒泡
    };

    //********************************新闻模块********************************

    self.queryNewsTitle = ko.observable("");  //查询条件-新闻标题

    //清空新闻列表查询条件
    self.emptyQuery = function () {
        self.queryNewsTitle("");
    };

    //新增新闻
    self.addNews = function () {

        if (self.selNewsTypeId == 0) {
            $.tips('请先选择类型', $(event.toElement));
            return;
        }
        $.openDialog({
            title: '新增新闻',
            jqObj: $('#divNews')
        });

        //存续公告类型Id集合
        var newsTypeIdList = [41, 43, 45, 46];
        if ($.inArray(parseInt(self.selNewsTypeId), newsTypeIdList) >= 0)
            $("#divProduct").hide();
        else
            $("#divProduct").show();

        showSwitchery();
        $("#divNews").attr("action", "add");
    };

    //编辑新闻
    self.editNews = function () {
        var id = $.getSelectId();
        if (!id) {
            $.tips('请先选择新闻', $(event.toElement));
            return;
        }

        $.get({
            url: 'site/News?id=' + id,
            success: function (result) {
                $.openDialog({
                    title: '编辑新闻',
                    jqObj: $('#divNews')
                });

                //存续公告类型Id集合
                var newsTypeIdList = [41, 43, 45, 46];
                if ($.inArray(parseInt(self.selNewsTypeId), newsTypeIdList) >= 0)
                    $("#divProduct").hide();
                else
                    $("#divProduct").show();
                $('#newsForm').loadForm(result);
                showSwitchery();
                $("#divNews").attr("action", "edit");
            }
        });
    };

    //保存新闻
    self.saveNews = function () {
        var id = $.getSelectId();
        var content = $('#summernote').summernote('code');
        //var reg = /[\u4e00-\u9fa5]/g;
        //if (content.match(reg).length > 1000) {
        //    return $.alert('为保证新闻转换语音质量，不雅超过1000中文字符数!');
        //}

        var attachment = $('div[name="attachment"]').attr('data-upload-value');
        var $if = $("#divNews").attr("action") == 'edit';
        $("#newsForm").submitForm({
            type: $if ? 'put' : 'post',
            url: 'site/News',
            data: $if ? {
                id: id, content: content, attachment: attachment
            } : {
                    newsTypeId: self.selNewsTypeId, content: content, attachment: attachment
                },
            success: function (result) {
                if ($if) {
                    for (var i = 0; i < self.newsList().length; i++) {
                        if (self.newsList()[i].id == result.id) {
                            self.newsList()[i].title(result.title);
                            self.newsList()[i].url(result.url);
                            self.newsList()[i].seoKeyword(result.seoKeyword);
                            self.newsList()[i].updateTime(result.updateTime);
                            self.newsList()[i].attr(result.attr);
                            break;
                        }
                    }
                    query(1);
                }
                else {
                    for (var i = 0; i < self.newsTypeList().length; i++) {
                        if (self.newsTypeList()[i].id == self.selNewsTypeId) {
                            self.newsTypeList()[i].newsCount(self.newsTypeList()[i].newsCount() + 1);
                            break;
                        }
                    }
                    self.emptyQuery();
                    query(1);
                }
                $.closeDialog($('#divNews'));
            },
            error: function (resultErr) {
                $.errorMsg(resultErr.responseText);
            }
        });
    };

    //复制新闻
    self.copyNews = function () {
        var id = $.getSelectId();
        if (!id) {
            $.tips('请先选择新闻', $(event.toElement));
            return;
        }
        $.confirm('您确定要将复制该新闻吗?', function () {
            $.post({
                url: "site/News/copy",
                data: { id: id },
                success: function (res) {
                    $.success('操作成功');
                    for (var i = 0; i < self.newsTypeList().length; i++) {
                        if (self.newsTypeList()[i].id == self.selNewsTypeId) {
                            self.newsTypeList()[i].newsCount(self.newsTypeList()[i].newsCount() + res);
                            break;
                        }
                    }
                    query(1);
                },
                error: function (resultErr) {
                    $.errorMsg(resultErr.responseText);
                }
            });
        });
    };

    //删除新闻
    self.delNews = function (obj) {
        var id = $.getSelectId();
        if (!id) {
            $.tips('请先选择新闻', $(event.toElement));
            return;
        }
        $.confirm('您确定要删除吗?', function () {
            $.delete({
                url: "site/News/" + id,
                success: function () {
                    $.success('操作成功');
                    for (var i = 0; i < self.newsTypeList().length; i++) {
                        if (self.newsTypeList()[i].id == self.selNewsTypeId) {
                            self.newsTypeList()[i].newsCount(self.newsTypeList()[i].newsCount() - 1);
                            break;
                        }
                    }
                    query(1);
                },
                error: function (resultErr) {
                    $.errorMsg(resultErr.responseText);
                }
            });
        });
    };

};