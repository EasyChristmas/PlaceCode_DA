//请求列表的api
var api = "project";

//重构后的列表
var projectList = null;

var projectViewModel = new projectViewModel();


//回调函数
var callback = function (data) {
    //重构列表数据
    var result = data;
    //将js对象转换成ko对象
    projectList = ko.mapping.fromJS(result);

    //如果是第一页则直接赋值，否则追加列表数据
    if (grid.pageIndex() == 1)
        projectViewModel.data(projectList.data());
    else {
        $(projectList.data()).each(function (index, item) {
            projectViewModel.data.push(item);
        });
    }

    //初始化是否上线按钮
    if (data != undefined) {
        showSwitchery();
    }
}

//局部刷新报单数据
var partRefreshData = function () {
    query();
}


$(function () {
    projectViewModel.init();

    var myTextarea = document.getElementById('content');
    var editor = CodeMirror.fromTextArea(myTextarea, {
        mode: "application/json",
        lineNumbers: true,
        theme: 'mdn-like',
        readOnly: 'nocursor'
    });
    //editor.addOverlay('json', { className: "line-error" });
    editor.on("blur", function () {
        projectViewModel.save();
    });

    //格式化左右两侧div的高度
    $.tableHeightDivLeftRight(".CodeMirror", ".menuNewsLeft", 130, 100);

    projectViewModel.setCodeMirror(editor);
});