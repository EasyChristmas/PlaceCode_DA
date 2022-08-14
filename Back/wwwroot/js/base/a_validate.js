/*
 * UI页面，数据格式校验处理
 * hujunyi 2016-04-05
 * 
 * 【校验规则】
 * 
 * 参数：requried 说明：不允许为空
 * 参数：number 说明：只允许输入零或正整数
 * 参数：numberNull 说明：只允许输入零或正整数，且可以为空
 * 参数：positiveNumber 说明：只允许输入正整数
 * 参数：positiveNumberNull 说明：只允许输入正整数，且可以为空 
 * 参数：price 说明：只允许输入大于0整数或小数，用于交易价格验证（保留4位小数点）
 * 参数：float 说明：只允许输入整数或小数
 * 参数：float2 说明：只允许输入整数或小数（保留2位小数点）
 * 参数：float3 说明：只允许输入整数或小数（保留3位小数点）
 * 参数：float4 说明：只允许输入整数或小数（保留4位小数点）
 * 参数：floatNull 说明：只允许输入整数或小数，且可以为空
 * 参数：float2Null 说明：只允许输入整数或小数（保留2位小数点，且可以为空）
 * 参数：float3Null 说明：只允许输入整数或小数（保留3位小数点，且可以为空）
 * 参数：float4Null 说明：只允许输入整数或小数（保留4位小数点，且可以为空）
 * 参数：email 说明：只允许输入邮箱格式
 * 参数：emailNull 说明：只允许输入邮箱格式，且可以为空
 * 参数：tel 说明：只允许输入座机格式
 * 参数：telNull 说明：只允许输入座机格式，且可以为空
 * 参数：idCard 说明：只允许输入身份证号码
 * 参数：idCardNull 说明：只允许输入身份证号码，且可以为空
 * 参数：qq 说明：只允许输入QQ号码
 * 参数：qqNull 说明：只允许输入QQ号码，且可以为空
 * 参数：postCode 说明：只允许输入邮政编码格式
 * 参数：postCodeNull 说明：只允许输入邮编格式，且可以为空
 * 参数：ip 说明：只允许输入IP格式
 * 参数：ipNull 说明：只允许输入IP格式，且可以为空
 * 参数：mobile 说明：只允许输入手机号码格式
 * 参数：mobileNull 说明：只允许输入手机号码格式，且可以为空
 * 参数：length-{自定义长度} 示例：<input validate="length-20" /> 说明：只允许输入长度为{自定义长度}以内字符串内容
 * 参数：lengthNull-{自定义长度} 示例：<input validate="lengthNull-20" /> 说明：只允许输入长度为{自定义长度}以内字符串内容，且可为空
 * 参数：range{自定义区间} 示例：<input validate="range{0,100}" /> 说明：只允许输入范围为{自定义区间}以内字符串内容且不能为空
  * 参数：rangeNull{自定义区间} 示例：<input validate="rangeNull{0,100}" /> 说明：只允许输入范围为{自定义区间}以内字符串内容且可以为空
 * 参数：date 说明：只允许输入日期格式（2000-01-01），且不能为空
  * 参数：url 说明：只允许输入url地址（http://www.baidu.com,https://www.baidu.com,ftp://user:pass@host.com:123），且不能为空
  * 参数：urlNull 说明：只允许输入url地址（http://www.baidu.com,https://www.baidu.com,ftp://user:pass@host.com:123），且可以为空
  * 参数：min-{最小值} 说明：<input validate="min-20" /> 说明：输入的最小值为20
  * 参数：dateMin 说明：<input validate="dateMin" /> 说明：输入的日期不能小于当前时间
 */

//数字类型
var numberReg = /^[0-9]*$/;
//正整数类型
var positiveNumberReg = /^\+?[1-9][0-9]*$/;
//可以为零的正整数类型
var positiveNumberZeroReg = /^\-?[0-9][0-9]*$/;
//浮点类型
var floatReg = /^[0-9]+\.{0,1}[0-9]{0,9}$/;
//浮点类型（保留2位小数）
var float2Reg = /^[0-9]+\.{0,1}([0-9]{1,2})?$/;
//浮点类型（保留3位小数）
var float3Reg = /^[0-9]+\.{0,1}([0-9]{1,3})?$/;
//浮点类型（保留4位小数）
var float4Reg = /^[0-9]+\.{0,1}([0-9]{1,4})?$/;
//邮箱地址
var emailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
//座机号码
var telReg = /^(\(\d{3,4}-)|\d{3.4}-\)?\d{7,8}$/;
//身份证号码
var idCardReg = /^[A-Z0-9]{10,20}$/;
//QQ号码
var qqReg = /[1-9][0-9]{4,}/;
//邮政编码
var postCodeReg = /[1-9]\d{5}(?!\d)/;
//IP地址
var ipReg = /\d+\.\d+\.\d+\.\d+/;
//手机号码
var mobileReg = /^1[3|4|5|6|7|8|9][0-9]\d{4,8}$/;
//日期格式 2000-01-01
var dateReg = /^(\d{4})-(\d{2})-(\d{2})$/;
//url格式
var urlReg = '^(http|https|ftp)\://([a-zA-Z0-9\.\-]+(\:[a-zA-Z0-9\.&amp;%\$\-]+)*@)*((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|localhost|([a-zA-Z0-9\-]+\.)*[a-zA-Z0-9\-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(\:[0-9]+)*(/($|[a-zA-Z0-9\.\,\?\'\\\+&amp;%\$#\=~_\-]+))*$';
//交易价格
var price = /^\d+(\.\d+)?$/;


$(function () {

    //页面自动校验处理
    $("[validate]").each(function () {

        var obj = $(this);

        //select ，datapicker日历输入框兼容
        if ($(obj).is("select") || $(obj).attr("class").toString().indexOf("datepicker") >= 0 || ($(obj).parent().attr("class") && $(obj).parent().attr("class").toString().indexOf("datepicker") >= 0)) {
            $(obj).change(function (e) {
                validateData(obj, e);
            });
        }
            //select2选择插件兼容
        else if ($(obj).attr("class").toString().indexOf("selectpicker") >= 0) {
            $(obj).on("select2:close", function (e) {
                if ($(obj).val() == "" || $(obj).val() == null || $(obj).val() == undefined) {
                    $(obj).change();
                }
            });
        }
        else {
            $(obj).blur(function (e) {
                validateData(obj, e);
            });
        }
    });
});

jQuery.extend({

    //检索全部校验内容
    //通过返回true，否则返回false
    validate: function (focus) {

        var validateFlag = true;

        $("[validate]").each(function () {

            var obj = $(this);
            if (typeof (focus) == 'undefined') focus = true;
            validateFlag = validateData(obj, undefined, focus);

            if (validateFlag == false) return false;
        });

        return validateFlag;
    }
});

jQuery.fn.extend({
    //检索全部校验内容
    //通过返回true，否则返回false
    validate: function (focus) {

        var validateFlag = true;

        $("[validate]", $(this)).each(function () {

            var obj = $(this);
            if (typeof (focus) == 'undefined') focus = true;
            validateFlag = validateData(obj, undefined, focus);

            if (validateFlag == false) return false;
        });

        return validateFlag;
    },
    //通过表单初始化验证
    validateForm: function () {
        //页面自动校验处理
        $(this).find("[validate]").each(function () {
            var obj = $(this);
            //select ，datapicker日历输入框兼容
            if ($(obj).is("select") || $(obj).attr("class").toString().indexOf("datepicker") >= 0 || ($(obj).parent().attr("class") && $(obj).parent().attr("class").toString().indexOf("datepicker") >= 0)) {
                $(obj).change(function (e) {
                    validateData(obj, e, true);
                });
            }
                //select2选择插件兼容
            else if ($(obj).attr("class").toString().indexOf("selectpicker") >= 0) {
                $(obj).on("select2:close", function (e) {
                    if ($(obj).val() == "" || $(obj).val() == null || $(obj).val() == undefined) {
                        $(obj).change();
                    }
                });
            }
            else {
                $(obj).blur(function (e) {
                    validateData(obj, e, true);
                });
            }
        });
    }
})

/*
* 校验输入数据
* elementObj：元素对象
* e：触发事件对象
* 校验通过返回true,否则返回false
*/
function validateData(elementObj, e, focus) {

    if (typeof (e) == "undefined") e = { cancelable: false };

    //获取自定义校验类型
    var validateType = $(elementObj).attr("validate");
    if (!validateType) return true;
    //是否已经输入内容
    var hasInput = $(elementObj).val() != null && $(elementObj).val().trim() != "" && $(elementObj).val().trim() != undefined;
    //多张图片上传判断是否有图片
    var hasMultiImg = $(elementObj).attr("data-upload-value") != null && $(elementObj).attr("data-upload-value").trim() != "" && $(elementObj).attr("data-upload-value").trim() != undefined;
    //自定义字符长度校验
    if (validateType.indexOf("length") == 0) {
        var lengthType = validateType.split('-')[0];
        var length = validateType.split('-')[1];
        if (lengthType == "length" && $(elementObj).is(":visible")) {
            if ($(elementObj).is("div")) {
                if ($(elementObj).text().length > length || $(elementObj).text().length == 0) {
                    if (focus && $(elementObj).attr("disabled") != "disabled" ) $(elementObj).focus(); else if (focus && $(elementObj).attr("disabled") == "disabled") $($(elementObj).attr("targetInput")).focus(); $.tips("只能输入" + length + "位以内的字符，且不能为空", $(elementObj), 1500); e.cancelable = true; return false;
                }
            }
            else {
                if ($(elementObj).val().trim().length > length || $(elementObj).val().trim().length == 0) {
                    if (focus && $(elementObj).attr("disabled") != "disabled" ) $(elementObj).focus(); else if (focus && $(elementObj).attr("disabled") == "disabled") $($(elementObj).attr("targetInput")).focus(); $.tips("只能输入" + length + "位以内的字符，且不能为空", $(elementObj), 1500); e.cancelable = true; return false;
                }
            }

        }
        else if (lengthType == "lengthNull") {
            if ($(elementObj).is("div")) {
                if ($(elementObj).text().length > length) {
                    if (focus && $(elementObj).attr("disabled") != "disabled") $(elementObj).focus(); else if (focus && $(elementObj).attr("disabled") == "disabled") $($(elementObj).attr("targetInput")).focus(); $.tips("只能输入" + length + "位以内的字符", $(elementObj), 1500); e.cancelable = true; return false;
                }
            }
            else {
                if ($(elementObj).val().trim().length > length) {
                    if (focus && $(elementObj).attr("disabled") != "disabled") $(elementObj).focus(); else if (focus && $(elementObj).attr("disabled") == "disabled") $($(elementObj).attr("targetInput")).focus(); $.tips("只能输入" + length + "位以内的字符", $(elementObj), 1500); e.cancelable = true; return false;
                }
            }

        }
    }
        //数字范围校验
    else if (validateType.indexOf("range") == 0) {
        var lengthType = validateType.substring(0, validateType.indexOf("{"));
        var val = parseInt($(elementObj).val().trim());
        if (lengthType == "range") {
            var rangeVal = validateType.replace("range{", "").replace("}", "");
            var min = rangeVal.split(',')[0];
            var max = rangeVal.split(',')[1];
            if (!hasInput
                || val > parseInt(max)
                || val < parseInt(min)
                || !positiveNumberZeroReg.test($(elementObj).val().trim())) {
                if (focus && $(elementObj).attr("disabled") != "disabled") $(elementObj).focus(); else if (focus && $(elementObj).attr("disabled") == "disabled") $($(elementObj).attr("targetInput")).focus(); $.tips("请在此处输入" + min + "~" + max + "之间的数，且不能为空", $(elementObj), 1500); e.cancelable = true; return false;
            }
        }
        else if (lengthType == "rangeNull") {
            var rangeVal = validateType.replace("rangeNull{", "").replace("}", "");
            var min = rangeVal.split(',')[0];
            var max = rangeVal.split(',')[1];
            if (hasInput &&
                (val > parseInt(max)
                || val < parseInt(min)
                || !positiveNumberZeroReg.test($(elementObj).val().trim()))) {
                if (focus && $(elementObj).attr("disabled") != "disabled") $(elementObj).focus(); else if (focus && $(elementObj).attr("disabled") == "disabled") $($(elementObj).attr("targetInput")).focus(); $.tips("格式有误，只允许输入" + min + "~" + max + "之间的数", $(elementObj), 1500); e.cancelable = true; return false;
            }
        }
    }
        //最小值校验
    else if (validateType.indexOf("min") == 0) {
        var min = validateType.split('-')[1];
        var val = parseInt($(elementObj).val().trim());
        if (!hasInput ||
            (val < parseInt(min)
            || !positiveNumberReg.test($(elementObj).val().trim()))) {
            if (focus && $(elementObj).attr("disabled") != "disabled") $(elementObj).focus(); else if (focus && $(elementObj).attr("disabled") == "disabled") $($(elementObj).attr("targetInput")).focus(); $.tips("格式有误，最小值为" + min, $(elementObj), 1500); e.cancelable = true; return false;
        }
    }
        //最大值校验
    else if (validateType.indexOf("max") == 0) {
        var max = validateType.split('-')[1];
        var val = parseInt($(elementObj).val().trim());
        if (!hasInput ||
            (val > parseInt(max)
            || !positiveNumberReg.test($(elementObj).val().trim()))) {
            if (focus && $(elementObj).attr("disabled") != "disabled") $(elementObj).focus(); else if (focus && $(elementObj).attr("disabled") == "disabled") $($(elementObj).attr("targetInput")).focus(); $.tips("格式有误，最大值为" + max, $(elementObj), 1500); e.cancelable = true; return false;
        }
    }
        //其他类型校验
    else {

        if ($(elementObj).val() == "****") return true;

        switch (validateType) {

            //必填校验
            case "requried":
                if (!hasInput) {

                    if (focus && $(elementObj).attr("disabled") != "disabled") $(elementObj).focus(); else if (focus && $(elementObj).attr("disabled") == "disabled") $($(elementObj).attr("targetInput")).focus(); $.tips("此处内容为必填项", $(elementObj), 1500); e.cancelable = true; return false;
                }
                break;

                //数字类型
            case "number":
                if (!numberReg.test($(elementObj).val().trim()) || $(elementObj).val().trim() == "") {

                    if (focus && $(elementObj).attr("disabled") != "disabled") $(elementObj).focus(); else if (focus && $(elementObj).attr("disabled") == "disabled") $($(elementObj).attr("targetInput")).focus(); $.tips("请在此处输入零或正整数", $(elementObj), 1500); e.cancelable = true; return false;
                }
                break;

                //可空数字类型
            case "numberNull":
                if (!numberReg.test($(elementObj).val().trim()) && hasInput) {

                    if (focus && $(elementObj).attr("disabled") != "disabled") $(elementObj).focus(); else if (focus && $(elementObj).attr("disabled") == "disabled") $($(elementObj).attr("targetInput")).focus(); $.tips("格式有误，只允许请输入零或正整数", $(elementObj), 1500); e.cancelable = true; return false;
                }
                break;

                //正整数类型
            case "positiveNumber":
                if (!positiveNumberReg.test($(elementObj).val().trim()) || $(elementObj).val().trim() == "") {

                    if (focus && $(elementObj).attr("disabled") != "disabled") $(elementObj).focus(); else if (focus && $(elementObj).attr("disabled") == "disabled") $($(elementObj).attr("targetInput")).focus(); $.tips("请在此处输入大于0的正整数", $(elementObj), 1500); e.cancelable = true; return false;
                }
                break;

                //可空正整数类型
            case "positiveNumberNull":
                if (!positiveNumberReg.test($(elementObj).val().trim()) && hasInput) {

                    if (focus && $(elementObj).attr("disabled") != "disabled") $(elementObj).focus(); else if (focus && $(elementObj).attr("disabled") == "disabled") $($(elementObj).attr("targetInput")).focus(); $.tips("格式有误，只允许请输入大于0的正整数", $(elementObj), 1500); e.cancelable = true; return false;
                }
                break;

                //浮点类型
            case "float":
                if (!floatReg.test($(elementObj).val().trim())) {

                    if (focus && $(elementObj).attr("disabled") != "disabled") $(elementObj).focus(); else if (focus && $(elementObj).attr("disabled") == "disabled") $($(elementObj).attr("targetInput")).focus(); $.tips("请在此处输入大于0的数字或小数", $(elementObj), 1500); e.cancelable = true; return false;
                }
                break;

                //可空浮点类型
            case "floatNull":
                if (!floatReg.test($(elementObj).val().trim()) && hasInput) {

                    if (focus && $(elementObj).attr("disabled") != "disabled") $(elementObj).focus(); else if (focus && $(elementObj).attr("disabled") == "disabled") $($(elementObj).attr("targetInput")).focus(); $.tips("格式有误，只允许输入数字或小数", $(elementObj), 1500); e.cancelable = true; return false;
                }
                break;

                //浮点类型（2位小数）
            case "float2":
                if (!float2Reg.test($(elementObj).val().trim())) {

                    if (focus && $(elementObj).attr("disabled") != "disabled") $(elementObj).focus(); else if (focus && $(elementObj).attr("disabled") == "disabled") $($(elementObj).attr("targetInput")).focus(); $.tips("请在此处输入大于0的数字或小数（保留2位小数）", $(elementObj), 1500); e.cancelable = true; return false;
                }
                break;

                //可空浮点类型（2位小数）
            case "float2Null":
                if (!float2Reg.test($(elementObj).val().trim()) && hasInput) {

                    if (focus && $(elementObj).attr("disabled") != "disabled") $(elementObj).focus(); else if (focus && $(elementObj).attr("disabled") == "disabled") $($(elementObj).attr("targetInput")).focus(); $.tips("格式有误，只允许输入数字或小数（保留2位小数）", $(elementObj), 1500); e.cancelable = true; return false;
                }
                break;

                //浮点类型（3位小数）
            case "float3":
                if (!float3Reg.test($(elementObj).val().trim())) {

                    if (focus && $(elementObj).attr("disabled") != "disabled") $(elementObj).focus(); else if (focus && $(elementObj).attr("disabled") == "disabled") $($(elementObj).attr("targetInput")).focus(); $.tips("请在此处输入大于0的数字或小数（保留3位小数）", $(elementObj), 1500); e.cancelable = true; return false;
                }
                break;

                //可空浮点类型（3位小数）
            case "float3Null":
                if (!float3Reg.test($(elementObj).val().trim()) && hasInput) {

                    if (focus && $(elementObj).attr("disabled") != "disabled") $(elementObj).focus(); else if (focus && $(elementObj).attr("disabled") == "disabled") $($(elementObj).attr("targetInput")).focus(); $.tips("格式有误，请输入数字或小数（保留3位小数）", $(elementObj), 1500); e.cancelable = true; return false;
                }
                break;

                //浮点类型（4位小数）
            case "float4":
                if (!float4Reg.test($(elementObj).val().trim())) {

                    if (focus && $(elementObj).attr("disabled") != "disabled") $(elementObj).focus(); else if (focus && $(elementObj).attr("disabled") == "disabled") $($(elementObj).attr("targetInput")).focus(); $.tips("请在此处输入大于0的数字或小数（保留4位小数）", $(elementObj), 1500); e.cancelable = true; return false;
                }
                break;
                //价格验证（4位小数）
            case "price":
                if (!price.test($(elementObj).val().trim()) || $(elementObj).val().trim() == "0") {
                    if (focus && $(elementObj).attr("disabled") != "disabled") $(elementObj).focus(); else if (focus && $(elementObj).attr("disabled") == "disabled") $($(elementObj).attr("targetInput")).focus(); $.tips("请在此处输入大于0的数字或小数（保留4位小数）", $(elementObj), 1500); e.cancelable = true; return false;
                }
                break;
                //可空浮点类型（4位小数）
            case "float4Null":
                if (!float4Reg.test($(elementObj).val().trim()) && hasInput) {

                    if (focus && $(elementObj).attr("disabled") != "disabled") $(elementObj).focus(); else if (focus && $(elementObj).attr("disabled") == "disabled") $($(elementObj).attr("targetInput")).focus(); $.tips("格式有误，只允许输入数字或小数（保留4位小数）", $(elementObj), 1500); e.cancelable = true; return false;
                }
                break;

                //邮箱格式
            case "email":
                if (!emailReg.test($(elementObj).val().trim())) {

                    if (focus && $(elementObj).attr("disabled") != "disabled") $(elementObj).focus(); else if (focus && $(elementObj).attr("disabled") == "disabled") $($(elementObj).attr("targetInput")).focus(); $.tips("请在此处输入邮箱地址", $(elementObj), 1500); e.cancelable = true; return false;
                }
                break;

                //可空邮箱格式
            case "emailNull":
                if (!emailReg.test($(elementObj).val().trim()) && hasInput) {

                    if (focus && $(elementObj).attr("disabled") != "disabled") $(elementObj).focus(); else if (focus && $(elementObj).attr("disabled") == "disabled") $($(elementObj).attr("targetInput")).focus(); $.tips("格式有误，只允许输入邮箱地址", $(elementObj), 1500); e.cancelable = true; return false;
                }
                break;

                //座机号码格式
            case "tel":
                if (!telReg.test($(elementObj).val().trim())) {

                    if (focus && $(elementObj).attr("disabled") != "disabled") $(elementObj).focus(); else if (focus && $(elementObj).attr("disabled") == "disabled") $($(elementObj).attr("targetInput")).focus(); $.tips("请在此处输入座机号码", $(elementObj), 1500); e.cancelable = true; return false;
                }
                break;

                //可空座机号码
            case "telNull":
                if (!telReg.test($(elementObj).val().trim()) && hasInput) {

                    if (focus && $(elementObj).attr("disabled") != "disabled") $(elementObj).focus(); else if (focus && $(elementObj).attr("disabled") == "disabled") $($(elementObj).attr("targetInput")).focus(); $.tips("格式有误，只允许输入座机号码", $(elementObj), 1500); e.cancelable = true; return false;
                }
                break;

                //身份证号码格式
            case "idCard":
                if (!idCardReg.test($(elementObj).val().trim())) {
                    if (focus && $(elementObj).attr("disabled") != "disabled") $(elementObj).focus(); else if (focus && $(elementObj).attr("disabled") == "disabled") $($(elementObj).attr("targetInput")).focus(); $.tips("请在此处输入正确的身份证号码", $(elementObj), 1500); e.cancelable = true; return false;
                }
                break;

                //可空身份证号码
            case "idCardNull":
                if (!idCardReg.test($(elementObj).val().trim()) && hasInput) {

                    if (focus && $(elementObj).attr("disabled") != "disabled") $(elementObj).focus(); else if (focus && $(elementObj).attr("disabled") == "disabled") $($(elementObj).attr("targetInput")).focus(); $.tips("格式有误，只允许输入身份证号码", $(elementObj), 1500); e.cancelable = true; return false;
                }
                break;

                //QQ号码格式
            case "qq":
                if (!qqReg.test($(elementObj).val().trim())) {

                    if (focus && $(elementObj).attr("disabled") != "disabled") $(elementObj).focus(); else if (focus && $(elementObj).attr("disabled") == "disabled") $($(elementObj).attr("targetInput")).focus(); $.tips("请在此处输入QQ号码", $(elementObj), 1500); e.cancelable = true; return false;
                }
                break;

                //可空QQ号码
            case "qqNull":
                if (!qqReg.test($(elementObj).val().trim()) && hasInput) {

                    if (focus && $(elementObj).attr("disabled") != "disabled") $(elementObj).focus(); else if (focus && $(elementObj).attr("disabled") == "disabled") $($(elementObj).attr("targetInput")).focus(); $.tips("格式有误，只允许输入QQ号码", $(elementObj), 1500); e.cancelable = true; return false;
                }
                break;

                //邮政编码格式
            case "postCode":
                if (!postCodeReg.test($(elementObj).val().trim())) {

                    if (focus && $(elementObj).attr("disabled") != "disabled") $(elementObj).focus(); else if (focus && $(elementObj).attr("disabled") == "disabled") $($(elementObj).attr("targetInput")).focus(); $.tips("请在此处输入邮编号码", $(elementObj), 1500); e.cancelable = true; return false;
                }
                break;

                //可空邮政编码
            case "postCodeNull":
                if (!postCodeReg.test($(elementObj).val().trim()) && hasInput) {

                    if (focus && $(elementObj).attr("disabled") != "disabled") $(elementObj).focus(); else if (focus && $(elementObj).attr("disabled") == "disabled") $($(elementObj).attr("targetInput")).focus(); $.tips("格式有误，只允许输入邮编号码", $(elementObj), 1500); e.cancelable = true; return false;
                }
                break;

                //IP地址
            case "ip":
                if (!ipReg.test($(elementObj).val().trim())) {

                    if (focus && $(elementObj).attr("disabled") != "disabled") $(elementObj).focus(); else if (focus && $(elementObj).attr("disabled") == "disabled") $($(elementObj).attr("targetInput")).focus(); $.tips("请在此处输入IP地址", $(elementObj), 1500); e.cancelable = true; return false;
                }
                break;

                //可空IP地址
            case "ipNull":
                if (!ipReg.test($(elementObj).val().trim()) && hasInput) {

                    if (focus && $(elementObj).attr("disabled") != "disabled") $(elementObj).focus(); else if (focus && $(elementObj).attr("disabled") == "disabled") $($(elementObj).attr("targetInput")).focus(); $.tips("格式有误，只允许输入IP地址", $(elementObj), 1500); e.cancelable = true; return false;
                }
                break;

                //手机号码
            case "mobile":
                if (!mobileReg.test($(elementObj).val().trim()) && $(elementObj).is(":visible")) {

                    if (focus && $(elementObj).attr("disabled") != "disabled") $(elementObj).focus(); else if (focus && $(elementObj).attr("disabled") == "disabled") $($(elementObj).attr("targetInput")).focus(); $.tips("请在此处输入正确的手机号码", $(elementObj), 1500); e.cancelable = true; return false;
                }
                break;

                //可空IP地址
            case "mobileNull":
                if (!mobileReg.test($(elementObj).val().trim()) && hasInput) {

                    if (focus && $(elementObj).attr("disabled") != "disabled") $(elementObj).focus(); else if (focus && $(elementObj).attr("disabled") == "disabled") $($(elementObj).attr("targetInput")).focus(); $.tips("格式有误，只允许输入手机号码", $(elementObj), 1500); e.cancelable = true; return false;
                }
                break;
                //日期格式 2000-01-01
            case "date":
                if (!dateReg.test($(elementObj).val().trim())) {
                    if (focus && $(elementObj).attr("disabled") != "disabled") $(elementObj).focus(); else if (focus && $(elementObj).attr("disabled") == "disabled") $($(elementObj).attr("targetInput")).focus(); $.tips("请在此处输入日期", $(elementObj), 1500); e.cancelable = true; return false;
                }
                break;
            case "dateMin":
                if (!dateReg.test($(elementObj).val().trim())) {
                    if (focus && $(elementObj).attr("disabled") != "disabled") $(elementObj).focus(); else if (focus && $(elementObj).attr("disabled") == "disabled") $($(elementObj).attr("targetInput")).focus(); $.tips("请在此处输入日期", $(elementObj), 1500); e.cancelable = true; return false;
                }
                //日期不能小于当前日期验证
                var date = $(elementObj).val();
                var d1 = new Date(date.replace(/\-/g, "\/"));
                var d2 = new Date(new Date().toDateString().replace(/\-/g, "\/"));
                if (date != "" && d2 != "" && d1 < d2) {
                    $($(elementObj).attr("targetInput")).focus(); $.tips("日期不能小于当前日期", $(elementObj), 1500); e.cancelable = true; return false;
                }
                break;
                //url地址
            case "url":
                var regUrl = new RegExp();
                regUrl.compile(urlReg);
                if (!regUrl.test($(elementObj).val().trim())) {
                    if (focus && $(elementObj).attr("disabled") != "disabled") $(elementObj).focus(); else if (focus && $(elementObj).attr("disabled") == "disabled") $($(elementObj).attr("targetInput")).focus(); $.tips("请在此处输入url地址", $(elementObj), 1500); e.cancelable = true; return false;
                }
                break;
                //可空url地址
            case "urlNull":
                var regUrl = new RegExp();
                regUrl.compile(urlReg);
                if (!regUrl.test($(elementObj).val().trim()) && hasInput) {
                    if (focus && $(elementObj).attr("disabled") != "disabled") $(elementObj).focus(); else if (focus && $(elementObj).attr("disabled") == "disabled") $($(elementObj).attr("targetInput")).focus(); $.tips("格式有误，只允许输入url地址", $(elementObj), 1500); e.cancelable = true; return false;
                }
                break;
                //多张图片
            case "multiImg":
                if (!hasMultiImg) {
                    if (focus && $(elementObj).attr("disabled") != "disabled") $(elementObj).focus(); else if (focus && $(elementObj).attr("disabled") == "disabled") $($(elementObj).attr("targetInput")).focus(); $.tips("最少要上传一张图片", $(elementObj), 1500); e.cancelable = true; return false;
                }
        }
    }
    return true;
}