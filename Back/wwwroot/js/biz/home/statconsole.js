$(function () { 
    //新增会员实体
    var newUserModel = new ViewModel();
    ko.applyBindings(newUserModel, document.getElementById("newUserModel"));
    newUserModel.loadData(); 

    //总业绩实体
    var totalTradeModel = new TotalTradeViewModel();
    ko.applyBindings(totalTradeModel, document.getElementById("totalTradeModel"));
    totalTradeModel.loadTotalData();
     
    //返回到月
    $("#btnMonth").on("click", function () {
        $("#container,#containerDay").hide();
        $("#containerMonth").show();
    }); 

    //返回到月
    $("#btnTotalMonth").on("click", function () {
        $("#containerTotal,#containerTotalDay").hide();
        $("#containerTotalMonth").show();
    });

    //报表高度和新增产品高度相同
    $("#statBox").height($("#newProBox").height());
});