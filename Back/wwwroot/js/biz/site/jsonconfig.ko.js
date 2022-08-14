

//Json Data 实体模型
var JsonConfigDataModel = function (jsonConfig) {
    var self = this;
    self.id = jsonConfig.id;
    self.name = ko.observable(jsonConfig.name);
    self.content = ko.observable(jsonConfig.content);
    self.remark = ko.observable(jsonConfig.remark);
};

//Json序列化错误模型
var JsonFormatErrorModel = function (jsonError) {
    var self = this;
    self.line = ko.observable(jsonError.line);
    self.message = ko.observable(jsonError.message);
}

//Json Data 视图模型
var JsonConfigDataViewModel = function () {
    var self = this;
    self.selectedId = ko.observable(0);
    self.selectedIndex = ko.observable(-1);
    self.isAddorEdit = true;
    self.jsonConfigList = ko.observableArray([]);
    self.allJsonConfigs = [];
    self.CodeMirror = {};
    self.jsonFormatError = ko.observable(new JsonFormatErrorModel({ line: 0, message: '如果您需要配置Json字符串，请选中左侧菜单或新增' }));
    self.testshow = ko.computed(function () { return self.selectedId() > 0 ? true : false; }, this)
    self.enableEditor = ko.observable(false);

    ///初始化
    self.init = function () {
        self.loadJsonConfigs();
    };

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
        var i = 0,
            len = 0,
            tab = "    ",
            targetJson = "",
            indentLevel = 0,
            inString = false,
            currentChar = null;

        function repeat(s, count) {
            return new Array(count + 1).join(s);
        }

        for (i = 0, len = json.length; i < len; i += 1) {
            currentChar = json.charAt(i);

            switch (currentChar) {
                case '{':
                case '[':
                    if (!inString) {
                        targetJson += currentChar + "\n" + repeat(tab, indentLevel + 1);
                        indentLevel += 1;
                    } else {
                        targetJson += currentChar;
                    }
                    break;
                case '}':
                case ']':
                    if (!inString) {
                        indentLevel -= 1;
                        targetJson += "\n" + repeat(tab, indentLevel) + currentChar;
                    } else {
                        targetJson += currentChar;
                    }
                    break;
                case ',':
                    if (!inString) {
                        targetJson += ",\n" + repeat(tab, indentLevel);
                    } else {
                        targetJson += currentChar;
                    }
                    break;
                case ':':
                    if (!inString) {
                        targetJson += ": ";
                    } else {
                        targetJson += currentChar;
                    }
                    break;
                case ' ':
                case "\n":
                case "\t":
                    if (inString) {
                        targetJson += currentChar;
                    }
                    break;
                case '"':
                    if (i > 0 && json.charAt(i - 1) !== '\\') {
                        inString = !inString;
                    }
                    targetJson += currentChar;
                    break;
                default:
                    targetJson += currentChar;
                    break;
            }
        }
        return targetJson;
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

    //打开新增Json标题对话框
    self.openAddDialog = function () {
        self.isAddorEdit = true;
        $.openDialog({
            title: '新增',
            jqObj: $('#divJsonConfig')
        });
    }

    //打开编辑Json标题对话框
    self.openEditDialog = function (id) {
        self.isAddorEdit = false;
        self.get(id,function (result) {
            $.openDialog({
                title: '编辑',
                jqObj: $('#divJsonConfig')
            });
            $('#divJsonConfig').loadForm(result);
        })
    }

    ///设置选中值
    self.setSelectId = function (id, index, ele) {
        self.selectedId(id);
        self.selectedIndex(index);
        var $this = $(ele);
        var id = $this.attr('dataid');

        //启用编辑
        self.CodeMirror.setOption("readOnly", false);
        self.enableEditor(true);

        self.get(id,function (result) {
            result.content = self.formatJson(result.content);
            $('#jsonForm').loadForm(result);

            self.CodeMirror.setValue(result.content);
            //vm.jsonFormatError(new JsonFormatErrorModel({ line: 0, message: '' }));

            if (!self.isJson(result.content, function (e) {
                let pot = vm.getCodemirrirPosition(e.at);
                self.codemirrorHighlight({ line: pot.line, at: pot.at }, { line: pot.line, at: pot.len });
                self.CodeMirror.scrollTo(0, pot.height);

                //针对重复键特俗处理
                if (e.message.indexOf('Duplicate key') >= 0)
                    self.codemirrorHighlight({ line: pot.line, at: 0 }, { line: pot.line, at: pot.len });

                self.jsonFormatError(new JsonFormatErrorModel({ line: pot.line + 1, message: e.message }));

            })) {
                return ;
            } 
            vm.jsonFormatError(new JsonFormatErrorModel({ line: 0, message: '正确的Json' }));

        });
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
            at = at - (len+1);

            if (at <= 0) {
                var lhandle = self.CodeMirror.getLineHandle(rows);
                cols = len + at + 1;
                break;
            }
        }

        var position = { line: rows - 1, at: cols - 1, len: len, height: lhandle ? lhandle.height * (rows - 5):0 };
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

    //获取单个jsonconfig对象
    self.get = function (id, fn) {
        if (!id)
            id = self.selectedId();

        $.get({
            url: 'site/jsonconfig/' + id,
            success: function (result) {
                if (fn && typeof fn === 'function') fn(result);
            }
        });
    };

    //保存之前
    self.saveBefore = function () {
        var content = self.CodeMirror.getValue();
        content = self.formatJson(content);
        self.CodeMirror.setValue(content);

        if (!self.isJson(content, function (e) {
            let pot = vm.getCodemirrirPosition(e.at);
            self.codemirrorHighlight({ line: pot.line, at: pot.at }, { line: pot.line, at: pot.len });
            self.CodeMirror.scrollTo(0, pot.height);

            //针对重复键特俗处理
            if (e.message.indexOf('Duplicate key') >= 0)
                self.codemirrorHighlight({ line: pot.line, at: 0 }, { line: pot.line, at: pot.len });


            self.jsonFormatError(new JsonFormatErrorModel({ line: pot.line + 1, message: e.message }));

        })) {
            return false;
        }
        vm.jsonFormatError(new JsonFormatErrorModel({ line: 0, message: '正确的Json' }));
        return true;
    };

    //保存
    self.save = function () {
        var id = self.selectedId();
        var $if = id > 0 ? true : false;
        if (!$if)
            return;

        if (!self.saveBefore()) {
            return;
        }
        var content = self.CodeMirror.getValue();
        $("#jsonForm").submitForm({
            type: $if ? 'put' : 'post',
            url: 'site/jsonconfig',
            data: $if ? {
                id: self.selectedId(), content: content
            } : {
                },
            success: function (result) {
                var index = self.getIndexForList(id);
                if (index > -1) {
                    self.allJsonConfigs.splice(index, 1, result);
                    self.reload();
                }

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

    //弹出框保存
    self.saveForDialog = function () {
        var $if = self.isAddorEdit ? false : true;
        var id = $("#divJsonConfigForm").find("input[name=id]").val();
        $("#divJsonConfigForm").submitForm({
            type: $if ? 'put' : 'post',
            url: 'site/jsonconfig',
            success: function (result) {
                $.closeDialog($('#divJsonConfig'));
                if ($if) {
                    var index = self.getIndexForList(id);
                    if (index > -1) {
                        self.allJsonConfigs.splice(index, 1, result);
                        self.reload();
                    }
                } else {
                    self.allJsonConfigs.push(result);
                    self.reload();
                }
            }
        });
    };

    //删除
    self.delete = function (id) {
        if (id <= 0)
            return;

        $.confirm('您确定要删除吗?', function () {
            $.delete({
                url: 'site/jsonconfig/' + id,
                success: function (result) {
                    var index = self.getIndexForList(id);
                    if (index > -1) {
                        self.allJsonConfigs.splice(index, 1);
                        self.reload();
                    }

                    if (id == self.selectedId()) {
                        self.selectedId(0);
                        self.selectedIndex(-1);
                    }
                }
            });
        });
    };

    self.init();
}