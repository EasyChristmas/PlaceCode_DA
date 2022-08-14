//Grid实体
function GridPagerModel(total, data) {
    var self = this;
    self.total = ko.observable(total);
    self.data = ko.observableArray(data);
    self.pageIndex = ko.observable(1);
    self.pageSize = ko.observable(20);
    self.size = ko.dependentObservable(function () {
        return parseInt(self.total() % self.pageSize() == 0 ? self.total() / self.pageSize() : (self.total() / self.pageSize() + 1));
    });
    self.change = function (t, d) {
        self.total(t);
        self.data(d);
    };
};