//判断数组是否包含某项
Array.prototype.contains = function (e) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == e)
            return true;
    }
    return false;
};

//移出数组某项
Array.prototype.remove = function (n) { //n表示第几项，从0开始算起。
    if (n < 0) //如果n<0，则不进行任何操作。
        return this;
    else
        return this.slice(0, n).concat(this.slice(n + 1, this.length));
    /*
  　　　concat方法：返回一个新数组，这个新数组是由两个或更多数组组合而成的。
  　　　　　　　　　这里就是返回this.slice(0,n)/this.slice(n+1,this.length)
  　　 　　　　　　组成的新数组，这中间，刚好少了第n项。
  　　　slice方法： 返回一个数组的一段，两个参数，分别指定开始和结束的位置。
  　　*/
};

/*
 *转化时间日期
 *  返回格式如下:1970-1-1
 */
Date.prototype.toDateString = function () {
    return this.getFullYear() + "-" + (this.getMonth() + 1) + "-" + this.getDate();
};

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
// 例子： 
// (new Date()).Format("yyyy-MM-dd hh:mm:ss") ==> 2006-07-02 08:09:04
// (new Date()).Format("yyyy-MM-dd hh:mm")      ==> 2006-07-02 08:09
Date.prototype.Format = function (fmt) { //author: easy 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

jQuery.extend({
    //获取url参数
    getParam: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(decodeURI(r[2])); return null;
    },
    //人民币金额转大写
    numToCny: function (num) {
        var strOutput = "";
        var strUnit = '仟佰拾亿仟佰拾万仟佰拾元角分';
        num += "00";
        var intPos = num.indexOf('.');
        if (intPos >= 0)
            num = num.substring(0, intPos) + num.substr(intPos + 1, 2);
        strUnit = strUnit.substr(strUnit.length - num.length);
        for (var i = 0; i < num.length; i++)
            strOutput += '零壹贰叁肆伍陆柒捌玖'.substr(num.substr(i, 1), 1) + strUnit.substr(i, 1);
        return strOutput.replace(/零角零分$/, '整').replace(/零[仟佰拾]/g, '零').replace(/零{2,}/g, '零').replace(/零([亿|万])/g, '$1').replace(/零+元/, '元').replace(/亿零{0,3}万/, '亿').replace(/^元/, "零元");
    },
    /**********格式化金额**********/
    outputdollars: function (number) {
        if (number.length <= 3)
            return (number == '' ? '0' : number);
        else {
            var mod = number.length % 3;
            var output = (mod == 0 ? '' : (number.substring(0, mod)));
            for (i = 0; i < Math.floor(number.length / 3) ; i++) {
                if ((mod == 0) && (i == 0))
                    output += number.substring(mod + 3 * i, mod + 3 * i + 3);
                else
                    output += ',' + number.substring(mod + 3 * i, mod + 3 * i + 3);
            }
            return (output);
        }
    },
    outputmoney: function (number) {
        if (isNaN(number) || number == "") return "0";
        number = Math.round(number * 100) / 100;
        if (number < 0)
            return '-' + $.outputdollars(Math.floor(Math.abs(number) - 0) + '') + $.outputcents(Math.abs(number) - 0);
        else
            return $.outputdollars(Math.floor(number - 0) + '') + $.outputcents(number - 0);
    },
    outputcents: function (amount) {
        amount = Math.round(((amount) - Math.floor(amount)) * 100);
        return (amount < 10 ? '.0' + amount : '.' + amount);

    },
    // 保留两位小数 浮点数四舍五入 位数不够 不补0
    fomatFloat: function(src, pos){
           return Math.round(src * Math.pow(10, pos)) / Math.pow(10, pos);
    },
    formatJson: function (json) {
        if (json == null) return null;
        var i = 0,
            len = 0,
            tab = "    ",
            targetJson = "",
            indentLevel = 0,
            inString = false,
            currentChar = null;

        function repeat(s, count) {
            return new Array(count + 1).join(s);
        }

        for (i = 0, len = json.length; i < len; i += 1) {
            currentChar = json.charAt(i);

            switch (currentChar) {
                case '{':
                case '[':
                    if (!inString) {
                        targetJson += currentChar + "\n" + repeat(tab, indentLevel + 1);
                        indentLevel += 1;
                    } else {
                        targetJson += currentChar;
                    }
                    break;
                case '}':
                case ']':
                    if (!inString) {
                        indentLevel -= 1;
                        targetJson += "\n" + repeat(tab, indentLevel) + currentChar;
                    } else {
                        targetJson += currentChar;
                    }
                    break;
                case ',':
                    if (!inString) {
                        targetJson += ",\n" + repeat(tab, indentLevel);
                    } else {
                        targetJson += currentChar;
                    }
                    break;
                case ':':
                    if (!inString) {
                        targetJson += ": ";
                    } else {
                        targetJson += currentChar;
                    }
                    break;
                case ' ':
                case "\n":
                case "\t":
                    if (inString) {
                        targetJson += currentChar;
                    }
                    break;
                case '"':
                    if (i > 0 && json.charAt(i - 1) !== '\\') {
                        inString = !inString;
                    }
                    targetJson += currentChar;
                    break;
                default:
                    targetJson += currentChar;
                    break;
            }
        }
        return targetJson;
    }
});


