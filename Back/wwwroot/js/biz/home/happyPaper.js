//烟花效果
function getStyle(ele, attr) {
    if (window.getComputedStyle) {
        return getComputedStyle(ele, null)[attr];
    } else {
        return ele.currentStyle[attr];
    }
}
function Boom(x, y) {//x,y為用戶點擊的位置
    //創建一個div
    var mDiv = document.createElement("div");
    mDiv.style.width = "5px";
    mDiv.style.height = "5px";
    mDiv.style.background = randomColor();
    mDiv.style.position = "absolute";
    mDiv.style.left = x + "px";
    mDiv.style.top = y + "px";
    mDiv.style.zIndex = "1000";
    mDiv.style.borderRadius = "100%";
    document.body.appendChild(mDiv);
    this.ele = mDiv;
    //x,y 方向的增量
    this.xSpeed = (Math.random() > 0.5 ? 1 : -1) * parseInt(Math.random() * 20);
    this.ySpeed = (Math.random() > 0.5 ? 1 : -1) * parseInt(Math.random() * 20);

}
//拋物線函數
Boom.prototype.mDrop = function () {
    var self = this;
    var timer = setInterval(function () {
        self.ySpeed++;
        self.ele.style.left = parseInt(getStyle(self.ele, "left")) + self.xSpeed + "px";
        self.ele.style.top = parseInt(getStyle(self.ele, "top")) + self.ySpeed + "px";

        if (parseInt(getStyle(self.ele, "top")) > 500 || parseInt(getStyle(self.ele, "left")) < 0 || parseInt(getStyle(self.ele, "left")) > 1200) {
            clearInterval(timer);
            document.body.removeChild(self.ele);
        }
    }, 60);
}
//生成隨機色
function randomColor() {
    return "rgb(" + parseInt(Math.random() * 256) + "," + parseInt(Math.random() * 256) + "," + parseInt(Math.random() * 256) + ")";
}
   