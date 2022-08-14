var ViewModel = function () {
    var self = this;
    self.adTypeList = ko.observableArray([]); 
    //加载广告类型
    self.loadAdType = function () {
        var type = $("#type").val();
        var name = $("#name").val();
        var title = $("#title").val().trim();

        $.get({
            url: "site/adtype/get",
            data: { type: type, name:name, title:title},
            async: false,
            success: function (result) { 
                self.adTypeList(result); 

            }
        });
    }
}