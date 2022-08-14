
//插件工具包
var selectTreeSDK = {
    //绑定html
    //data:数据,pid:父编号,startStr:name前面拼凑的字符串
    bindTree: function (data, pid, startStr) {
        var html = "";
        for (var i = 0; i < data.length; i++) {
            //一级
            if (pid == 0) {
                if (data[i].pid == 0) {
                    html += "<option value='" + data[i].id + "'>" + ( startStr + data[i].name) + "</option>";
                    html += selectTreeSDK.bindTree(data, data[i].id, "&nbsp;&nbsp;" + startStr);
                }
            }
            else {
                if (data[i].pid == pid) {
                    html += "<option value='" + data[i].id + "'>" + (startStr + data[i].name) + "</option>";
                    html += selectTreeSDK.bindTree(data, data[i].id, "&nbsp;&nbsp;" + startStr);
                }
            }
        }
        return html;
    }, 
}

jQuery.fn.extend({
    tree: function (data) {
        if (data == null || data.length == 0)
            return "";
        var html = selectTreeSDK.bindTree(data, 0, "|--");
        this.html(this.html() + html);
    },
});
 

//下拉部门变为可以折叠的
var uid = 0;
class TreeSelect {
    static getUniquId() {
        return uid++;
    }
    constructor(options) {
        var self = this;

        var defaultOptions = {
            valueKey: 'id'
        }
        self.options = options = $.extend(defaultOptions, options);
        var uid = TreeSelect.getUniquId();
        var tpl = `
            <input type="text" class="form-control treeSelect-input "/>
             <div class="ztree treeSelect-panel" id="treeSelect_panel_${uid}"></div>
        `;
        var ele = $(options.element);
        ele.html(tpl);
        var input = ele.find('.treeSelect-input');
        var panel = ele.find('.treeSelect-panel');
        self.element = ele;
        self.input = input;
        self.panel = panel;
        ele.css({
            'position': 'relative'
        });
        input.attr({
            name: options.name,
            placeholder: options.placeholder,
        });
        input.on('keydown', function () {

            //input.val(self.text);
            return false;
        });
        input.click(function () {
            if (!self.isOpen()) {
                self.open();
            } else {
                self.close();
            }

        });
        if (options.url) {
            $.ajax({
                type: options.type,
                url: options.url,
                dataType: 'json',
                data: options.param,
                sucess: function (data) {
                    self.render(data);
                }
            })
        } else if (options.data) {
            self.render(options.data);
        }
    }

    isOpen() {
        var panel = this.panel;
        return !(panel.css('display') == 'none' || panel.height() == 0 || panel.css('opacity') == 0)
    }
    render(data) {
        var self = this;
        var panel = self.panel;
        var setting = {
            callback: {
                onClick: function (event, treeId, treeNode) {
                    //if (!treeNode.isParent) {
                    //    self.input.val(treeNode.name);
                    //    self.value = treeNode[self.options.valueKey];
                    //    self.text = treeNode.name;
                    //    self.close();
                    //}
                    self.input.val(treeNode.name);
                    self.value = treeNode[self.options.valueKey];
                    self.text = treeNode.name;
                    self.close(); 
                    self.options.success();
                }
            }
        };
        self.ztree = $.fn.zTree.init(panel, setting, data);
    } 
    open() {
        var self = this;
        var panel = self.panel;
        panel.css({
            height: 'auto',
            opacity: 1
        });
        panel.show();
        self.mask = $('<div class="treeSelect-mask"></div>');
        $('body').append(self.mask);
        self.mask.click(function () {
            self.close();
        })
    }
    close() { 
        var self = this;
        //panel.animate({
        //    height:0,
        //    opacity:0
        //},500);
        self.panel.hide();
        self.mask.remove();
    }

}