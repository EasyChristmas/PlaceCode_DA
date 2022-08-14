
grid.changeQueryMiningPool = function () {
    query();
};

//总算力
grid.totalPower = ko.observable(0);


//持有统计列表页视图控制模型
function HoldStatViewModel() {

    var self = this;

    //列表数据
    self.data = ko.observableArray([]);

    self.init = function () {

        $.Data.bindMiningPool({
            selId: "selMiningPool"
        });

    }
}