
//初始化GridPagerModel
var grid = new GridPagerModel();
var vm = new JsonConfigDataViewModel();

$(function () { 
    var myTextarea = document.getElementById('content');    
    var editor = CodeMirror.fromTextArea(myTextarea, {
        mode: "application/json",
        lineNumbers: true,
        theme: 'mdn-like',
        readOnly: 'nocursor'
    });
    //editor.addOverlay('json', { className: "line-error" });
    editor.on("blur", function () {
        vm.save();
    });
    
    //格式化左右两侧div的高度
    $.tableHeightDivLeftRight(".CodeMirror", ".menuNewsLeft", 130, 100);

    vm.setCodeMirror(editor);
    ko.applyBindings(vm);

});