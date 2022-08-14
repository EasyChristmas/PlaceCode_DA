

//Json Data 实体模型
var JsonConfigDataModel = function (jsonConfig) {
    var self = this;
    self.id = jsonConfig.id;
    self.name = ko.observable(jsonConfig.name);
    self.info = ko.observable(jsonConfig.info);
    self.remark = ko.observable(jsonConfig.remark);
};

//Json序列化错误模型
var JsonFormatErrorModel = function (jsonError) {
    var self = this;
    self.line = ko.observable(jsonError.line);
    self.message = ko.observable(jsonError.message);
}

//视图模型
var ViewModel = function () {
    var self = this;
    self.id = ko.observable($.getParam("id"));
    self.redirectUrl = ko.observable($.getParam("redirectUrl"));
    self.isAddorEdit = true;
    self.jsonConfigList = ko.observableArray([]);
    self.allJsonConfigs = [];
    self.CodeMirror = {};
    self.jsonFormatError = ko.observable(new JsonFormatErrorModel({ line: 0, message: '如果您需要配置Json字符串，请选中左侧菜单或新增' }));
    self.enableEditor = ko.observable(false);

    ///初始化
    self.init = function () {
        self.load();
    };

    self.load = function () {
        if (self.id()) {
            $.get({
                url: 'project/' + self.id(),
                success: function (result) {
                    result.info = self.formatJson(result.info);
                    $("#projectForm").loadForm(result);

                    if (result.info)
                        self.CodeMirror.setValue(result.info);

                    if (!self.isJson(result.info, function (e) {
                        let pot = self.getCodemirrirPosition(e.at);
                        self.codemirrorHighlight({ line: pot.line, at: pot.at }, { line: pot.line, at: pot.len });
                        self.CodeMirror.scrollTo(0, pot.height);

                        //针对重复键特俗处理
                        if (e.message.indexOf('Duplicate key') >= 0)
                            self.codemirrorHighlight({ line: pot.line, at: 0 }, { line: pot.line, at: pot.len });

                        self.jsonFormatError(new JsonFormatErrorModel({ line: pot.line + 1, message: e.message }));

                    })) {
                        return;
                    }
                    self.jsonFormatError(new JsonFormatErrorModel({ line: 0, message: '正确的Json' }));
                }
            });
        }
        else {
            showSwitchery();
        }

        //启用编辑
        self.CodeMirror.setOption("readOnly", false);
        self.enableEditor(true);
    }

    //设置代码编辑器插件对象
    self.setCodeMirror = function (codemirror) {
        self.CodeMirror = codemirror;
    };

    //加载JsonConfig数据集合
    self.loadJsonConfigs = function () {
        self.allJsonConfigs = [];
        self.jsonConfigList([]);

        $.get({
            url: 'site/jsonconfig',
            success: function (result) {
                $.toTree(result);//改为树状结构 
                for (var i = 0; i < result.length; i++) {
                    self.jsonConfigList.push(new JsonConfigDataModel(result[i]));
                }
                self.allJsonConfigs = result;
            }
        });
    };

    //Json 字符串格式化
    self.formatJson = function (json) {
        return $.formatJson(json);
    }

    //是否为Json字符串
    self.isJson = function (str, fn) {
        let result = false;
        if (typeof str == 'string') {
            try {
                //var obj = JSON.parse(str);
                var obj = json_parse(str);
                if (typeof obj == 'object' && obj)
                    result = true;
            }
            catch (e) {
                if (fn && typeof fn == 'function')
                    fn(e);
            }
        }
        return result;
    }

    //根据id获取列表当前索引
    self.getIndexForList = function (id) {
        for (var i = 0; i < self.allJsonConfigs.length; i++) {
            if (self.allJsonConfigs[i].id == id) {
                return i;
                break;
            }
        }
    };

    //重新加载数据
    self.reload = function () {
        self.jsonConfigList([]);
        for (var i = 0; i < self.allJsonConfigs.length; i++) {
            self.jsonConfigList.push(new JsonConfigDataModel(self.allJsonConfigs[i]));
        }
    };

    //代码高亮
    self.codemirrorHighlight = function (start, end) {
        self.CodeMirror.markText({ line: start.line, ch: start.at }, { line: end.line, ch: end.at }, { className: "line-error" });
    }

    //获取Json错误的位置
    self.getCodemirrirPosition = function (at) {
        var rows = 0;
        var cols = 0;
        var lineCount = self.CodeMirror.lineCount();
        for (var i = 0; i < lineCount; i++) {
            var lineContent = self.CodeMirror.getLine(i);
            rows++;
            let line_at = 0;
            var len = lineContent.length;
            at = at - (len + 1);

            if (at <= 0) {
                var lhandle = self.CodeMirror.getLineHandle(rows);
                cols = len + at + 1;
                break;
            }
        }

        var position = { line: rows - 1, at: cols - 1, len: len, height: lhandle ? lhandle.height * (rows - 5) : 0 };
        return position;
    };

    //查询
    self.query = function (event, ele) {
        self.reload();
        var searchkey = $(ele).val();
        var newArr = self.jsonConfigList.remove(function (item) {
            return item.name().indexOf(searchkey) == -1;
        });
    };

    //保存之前
    self.saveBefore = function () {
        var content = self.CodeMirror.getValue();
        content = self.formatJson(content);
        self.CodeMirror.setValue(content);

        if (!self.isJson(content, function (e) {
            let pot = self.getCodemirrirPosition(e.at);
            self.codemirrorHighlight({ line: pot.line, at: pot.at }, { line: pot.line, at: pot.len });
            self.CodeMirror.scrollTo(0, pot.height);

            //针对重复键特俗处理
            if (e.message.indexOf('Duplicate key') >= 0)
                self.codemirrorHighlight({ line: pot.line, at: 0 }, { line: pot.line, at: pot.len });


            self.jsonFormatError(new JsonFormatErrorModel({ line: pot.line + 1, message: e.message }));

        })) {
            return false;
        }
        self.jsonFormatError(new JsonFormatErrorModel({ line: 0, message: '正确的Json' }));
        return true;
    };

    //保存
    self.save = function () {
        var type = "post";
        var $if = self.id() > 0 ? true : false;
        if ($if) {
            type = "put";
        }

        if (!self.saveBefore()) {
            return;
        }

        var info = self.CodeMirror.getValue();
        $("#projectForm").submitForm({
            type: type,
            url: "project",
            data: {
                info: info
            },
            success: function (result) {
                $.success('操作成功');
                $.partRefreshWin(self.redirectUrl(), $(window.frameElement).attr("data-id"));
            }
        });
    };

    $.ajaxSetup({
        contentType: "application/x-www-form-urlencoded;charset=utf-8",
        complete: function (XMLHttpRequest, textStatus) {
        },
        statusCode: {
            250: function (event) {
                if (event.responseText == '标题不允许重复')
                    $.tips(event.responseText, $("#divJsonConfigForm").find("input[name='name']"), 1000);
            }
        }
    });
}