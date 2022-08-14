


//复制
grid.copyText = function (data, ele) {
    $.get({
        url: "product/boardMachine/getPassword/" + data.id,
        success: function (result) {
            $.copyText(result);
            $.tips("复制成功", $(ele).find("i"));
        },
        error: function (resultErr) {
            $.errorMsg(resultErr.responseText);
        }
    });
    console.log(data);
}
