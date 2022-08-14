//请求列表的api
var api = "product/boardmachine";

$(function () {
    //格式化列表table高度
    $.tableHeight(80);
});

function showPassword(password) {
    return password + "&nbsp;&nbsp;<i  title=\"复制\" data-toggle=\"tooltip\" class=\"icon-copy\"></i>";
}