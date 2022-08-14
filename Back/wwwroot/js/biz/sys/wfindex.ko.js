var api = '';
//新增分类
grid.addClass = function () {
    $.openDialog({
        title: '新增',
        jqObj: $('#classAdd')
    })
}
//编辑分类
grid.classEdit = function () {
    $.openDialog({
        title: '编辑',
        jqObj: $('#classAdd')
    });
},
//创建新审批
grid.addSubClass = function () {
    $.openDialog({
        title: '创建新审批',
        jqObj: $('#creatNew')
    });
}

