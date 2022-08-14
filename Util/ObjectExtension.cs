using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text.RegularExpressions;

namespace Util
{
    public static class ObjectExtension
    {
        public static Dictionary<int, string> Base64Code = new Dictionary<int, string>()
        {
            { 0  ,"0"}, { 1  ,"1"}, { 2  ,"2"}, { 3  ,"3"}, { 4  ,"4"}, { 5  ,"5"}, { 6  ,"6"}, { 7  ,"7"}, { 8  ,"8"}, { 9  ,"9"},
            { 10  ,"a"}, { 11  ,"b"}, { 12  ,"c"}, { 13  ,"d"}, { 14  ,"e"}, { 15  ,"f"}, { 16  ,"g"}, { 17  ,"h"}, { 18  ,"i"},{ 19  ,"j"},
            { 20  ,"k"}, { 21  ,"l"}, { 22  ,"m"}, { 23  ,"n"}, { 24  ,"o"}, { 25  ,"p"}, { 26  ,"q"}, { 27  ,"r"}, { 28  ,"s"}, { 29  ,"t"},
            { 30  ,"u"}, { 31  ,"v"}, { 32  ,"w"}, { 33  ,"x"}, { 34  ,"y"}, { 35  ,"z"}, { 36  ,"A"}, { 37  ,"B"}, { 38  ,"C"}, { 39  ,"D"},
            { 40  ,"E"}, { 41  ,"F"}, { 42  ,"G"}, { 43  ,"H"}, { 44  ,"I"}, { 45  ,"J"}, { 46  ,"K"}, { 47  ,"L"}, { 48  ,"M"}, { 49  ,"N"},
            { 50  ,"O"}, { 51  ,"P"}, { 52  ,"Q"}, { 53  ,"R"}, { 54  ,"S"}, { 55  ,"T"}, { 56  ,"U"}, { 57  ,"V"}, { 58  ,"W"}, { 59  ,"X"},
            { 60  ,"Y"}, { 61  ,"Z"}, { 62  ,"-"}, { 63  ,"_"},
    };
        ///// <summary>
        /////     将对象转换为指定格式的字符串
        ///// </summary>
        ///// <param name="obj"></param>
        ///// <returns></returns>
        //public static IHtmlString ToRawJson(this Object obj)
        //{
        //    return JsonHelper.ToRawJson(obj);
        //}


        /// <summary>
        /// 将对象转换成字典
        /// </summary>
        /// <param name="o"></param>
        /// <param name="filterProperties"></param>
        /// <returns></returns>
        public static Dictionary<string, string> ToDic(this object o, List<string> filterProperties = null, bool sort = true)
        {
            var dic = new Dictionary<string, string>();

            var properties = o.GetType().GetProperties();
            foreach (var item in properties)
            {
                var name = item.GetCustomAttribute<JsonPropertyAttribute>().PropertyName;
                var value = item.GetValue(o);
                if (((filterProperties != null && !filterProperties.Contains(name)) || filterProperties == null)
                    && value != null && value.ToString() != string.Empty)
                {
                    dic.Add(name, value.ToString());
                }
            }

            return dic.OrderBy(p => p.Key).ToDictionary(k => k.Key, v => v.Value);
        }

        /// <summary>
        /// 将数字替换成空
        /// </summary>
        /// <param name="str"></param>
        /// <returns></returns>
        public static string CleanNumber(this string str)
        {
            return Regex.Replace(str, @"\d", string.Empty);
        }

        /// <summary>
        /// 将特殊字符替换成空
        /// </summary>
        /// <param name="ex"></param>
        /// <returns></returns>
        public static string CleanChar(this string str)
        {
            return Regex.Replace(str, "[\\\\[ \\] \\^ \\-*×――(^)$%~!@#$…&%￥—|'+=<>/{}《》!！??？:：•`·、。，；,.;\"‘’“”-]", string.Empty);
        }

        /// <summary>
        /// 将身份证号转换为打码格式**************5006格式
        /// </summary>
        /// <param name="str"></param>
        /// <returns></returns>
        public static string ToMaskIDCard(this object str)
        {
            //打码格式**************5006
            var idCard = str + "";
            var idCardLength = idCard.Length;
            if (idCardLength > 4)
            {
                var ends = idCard.Substring(idCardLength - 4);
                var starts = string.Empty;
                for (var i = 0; i < idCardLength - 4; i++)
                    starts += "*";
                return starts + ends;
            }
            return idCard;
        }

        /// <summary>
        ///  将手机号转换为打码格式*******5006格式
        /// </summary>
        /// <param name="str">手机号</param>
        /// <returns></returns>
        public static string ToMaskPhone(this object str)
        {
            #region 打码格式152********
            //var phone = str + "";
            //if (phone.Length > 3)
            //{
            //	var starts = phone.Substring(0, 3);
            //	var ends = string.Empty;
            //	for (var i = 0; i < phone.Length - 3; i++)
            //		ends += "*";
            //	return starts + ends;
            //}
            //return phone;
            #endregion

            //打码格式*******5006
            var phone = str + "";
            var phoneLength = phone.Length;
            if (phoneLength > 4)
            {
                var ends = phone.Substring(phoneLength - 4);
                var starts = string.Empty;
                for (var i = 0; i < phoneLength - 4; i++)
                    starts += "*";
                return starts + ends;
            }
            return phone;
        }

        /// <summary>
        /// 微信打码(只显示第一个和最后两个字符,中间打码)
        /// </summary>
        /// <param name="str"></param>
        /// <returns></returns>
        public static string ToMaskWeChat(this object str)
        {
            var weChat = str == null ? string.Empty : str.ToString();
            var weChatNewStr = weChat;
            if (weChat.Length > 3)
            {
                weChatNewStr = weChat[0].ToString();
                for (int i = 0; i < weChat.Length - 3; i++)
                {
                    weChatNewStr += "*";
                }
                weChatNewStr = weChatNewStr + weChat[weChat.Length - 2].ToString() + weChat[weChat.Length - 1].ToString();
            }
            return weChatNewStr;
        }

        /// <summary>
        ///  将银行号转换为打码格式6224********5006格式
        /// </summary>
        /// <param name="str">卡号</param>
        /// <returns></returns>
        public static string ToMaskBankCardNo(this object str)
        {
            var bankCardNo = str + "";
            var bankCardNoLength = bankCardNo.Length;
            if (bankCardNoLength > 8)
            {
                var starts = bankCardNo.Substring(0, 4);
                var num = bankCardNo.Substring(4, bankCardNoLength - 4).Length;
                var ends = bankCardNo.Substring(num, 4);
                var middle = string.Empty;
                for (var i = 0; i < num - 4; i++)
                    middle += "*";
                return starts + middle + ends;
            }
            return bankCardNo;
        }

   

        /// <summary>
        ///  将秒转换为时分秒 00:00:00
        /// </summary>
        /// <param name="str">秒</param>
        /// <returns></returns>
        public static string ToMin(this object str)
        {
            //占位符
            var seat = ":";
            var sec = str.TryInt(0);
            //var date = new DateTime().AddSeconds(sec);
            //if (date.Month >= 1)
            //    return date.ToString("MM-dd HH:mm:ss");
            //if (date.DayOfYear > 0)
            //    return date.ToString("dd天 HH:mm:ss");
            //if (date.DayOfYear == 0)
            //    return date.ToString("HH:mm:ss");

            var min = 0;
            var hour = 0;
            if (sec > 60)
            {
                min = (sec / 60);
                sec = (sec % 60);
                if (min > 60)
                {
                    hour = (min / 60);
                    min = (min % 60);
                }
            }
            var hourText = (hour >= 10 ? hour.TryString() : ("0" + hour)) + seat;
            var minText = (min >= 10 ? min.TryString() : ("0" + min)) + seat;
            var secText = (sec >= 10 ? sec.TryString() : ("0" + sec));
            return hourText + minText + secText;
        }

        /// <summary>
        /// 将对象属性转换为key-value对
        /// </summary>
        /// <param name="o"></param>
        /// <returns></returns>
        public static Dictionary<String, Object> ToMap(this Object o)
        {
            Dictionary<String, Object> map = new Dictionary<string, object>();

            Type t = o.GetType();

            PropertyInfo[] pi = t.GetProperties(BindingFlags.Public | BindingFlags.Instance);

            foreach (PropertyInfo p in pi)
            {
                MethodInfo mi = p.GetGetMethod();

                if (mi != null && mi.IsPublic)
                {
                    map.Add(p.Name, mi.Invoke(o, new Object[] { }));
                }
            }
            return map;
        }

        ///// <summary>
        ///// 将指定的对象转换成string
        ///// </summary>
        ///// <param name="obj"></param>
        ///// <returns></returns>
        //public static string ModelToString(this Object obj)
        //{
        //    StringBuilder result = new StringBuilder();
        //    //遍历需要转换的model
        //    foreach (PropertyInfo _item in obj.GetType().GetProperties())
        //    {
        //        if (_item.GetValue(obj, null) != null)
        //        {
        //            DescriptionAttribute descAttr = (DescriptionAttribute)Attribute.GetCustomAttribute(_item, typeof(DescriptionAttribute));
        //            if (descAttr != null)
        //            {
        //                string key = string.Empty;
        //                string value = string.Empty;

        //                key = descAttr.Description ?? string.Empty;
        //                if (_item.PropertyType.IsEnum)
        //                    value = EnumHelper.GetDesc((Enum)Convert.ChangeType(_item.GetValue(obj, null), ObjectHelper.GetGenericType(_item.PropertyType)));
        //                else
        //                {
        //                    value = _item.GetValue(obj, null).ToString();
        //                }
        //                result.AppendFormat("|{0}:{1}", key, value);
        //            }
        //        }
        //    }
        //    if (result.Length > 0) result.Remove(0, 1);
        //    return result.ToString();
        //}

        ///// <summary>
        /////     将对象转换为指定格式的字符串
        ///// </summary>
        ///// <param name="obj"></param>
        ///// <returns></returns>
        //public static string ToString(this Object obj)
        //{
        //    //定义一个List集合，将各个实体类型存起来
        //    var models = obj.GetType();
        //    //得到公共属性集合
        //    var productFields = models.GetProperties();

        //    StringBuilder str = new StringBuilder();

        //    //得到属性上的标记属性信息即列名   
        //    foreach (PropertyInfo pi in productFields)
        //    {
        //        if (pi.GetValue(obj, null) != null)
        //        {
        //            DescriptionAttribute desc = (DescriptionAttribute)Attribute.GetCustomAttribute(pi, typeof(Attribute));
        //            if (desc != null)
        //            {
        //                str.AppendFormat("|{0}:{1}", desc.Description ?? string.Empty, pi.GetValue(obj, null));
        //            }
        //        }
        //    }
        //    //移除第一个竖杠
        //    if (str.Length > 0)
        //    { str.Remove(0, 1); }
        //    return str.ToString();
        //}

        /// <summary>
        ///     转换为short，默认值：short.MinValue
        /// </summary>
        /// <param name="strText"></param>
        /// <returns></returns>
        public static short TryShort(this Object strText)
        {
            return TryShort(strText, short.MinValue);
        }

        /// <summary>
        ///     转换为short
        /// </summary>
        /// <param name="strText"></param>
        /// <param name="defValue"></param>
        /// <returns></returns>
        public static short TryShort(this Object strText, short defValue)
        {
            short result;
            return short.TryParse(strText + "", out result) ? result : defValue;
        }

        /// <summary>
        ///     转换为short
        /// </summary>
        /// <param name="strText"></param>
        /// <param name="defValue"></param>
        /// <returns></returns>
        public static short? TryShort(this Object strText, short? defValue)
        {
            short result;
            return short.TryParse(strText + "", out result) ? result : defValue;
        }

        /// <summary>
        ///     转换为Int，默认值：int.MinValue
        /// </summary>
        public static int TryInt(this Object strText)
        {
            return TryInt(strText, int.MinValue);
        }

        /// <summary>
        ///     转换为Int
        /// </summary>
        /// <param name="strText"></param>
        /// <param name="defValue">默认值</param>
        /// <returns></returns>
        public static int TryInt(this Object strText, int defValue)
        {
            int temp;
            return int.TryParse(strText + "", out temp) ? temp : defValue;
        }

        /// <summary>
        ///     转换为Int
        /// </summary>
        /// <param name="strText"></param>
        /// <param name="defValue">默认值</param>
        /// <returns></returns>
        public static int? TryInt(this Object strText, int? defValue)
        {
            int temp;
            return int.TryParse(strText + "", out temp) ? temp : defValue;
        }

        /// <summary>
        ///     转换为Double，默认值：double.MinValue
        /// </summary>
        public static double TryDouble(this Object strText)
        {
            return TryDouble(strText, double.MinValue);
        }

        /// <summary>
        ///     转换为Double
        /// </summary>
        /// <param name="strText"></param>
        /// <param name="defValue">默认值</param>
        /// <returns></returns>
        public static double TryDouble(this Object strText, double defValue)
        {
            double temp;
            return double.TryParse(strText + "", out temp) ? temp : defValue;
        }

        /// <summary>
        ///     转换为Double
        /// </summary>
        /// <param name="strText"></param>
        /// <param name="defValue">默认值</param>
        /// <returns></returns>
        public static double? TryDouble(this Object strText, double? defValue)
        {
            double temp;
            return double.TryParse(strText + "", out temp) ? temp : defValue;
        }

        /// <summary>
        ///     转换为Decimal，默认值：decimal.MinValue
        /// </summary>
        public static decimal TryDecimal(this Object strText)
        {
            return TryDecimal(strText, decimal.MinValue);
        }

        /// <summary>
        ///     转换为Decimal
        /// </summary>
        /// <param name="strText"></param>
        /// <param name="defValue">默认值</param>
        /// <returns></returns>
        public static decimal TryDecimal(this Object strText, decimal defValue)
        {
            decimal temp;
            return decimal.TryParse(strText + "", out temp) ? temp : defValue;
        }

        /// <summary>
        ///     转换为Decimal
        /// </summary>
        /// <param name="strText"></param>
        /// <param name="defValue">默认值</param>
        /// <returns></returns>
        public static decimal? TryDecimal(this Object strText, decimal? defValue)
        {
            decimal temp;
            return decimal.TryParse(strText + "", out temp) ? temp : defValue;
        }

        /// <summary>
        ///     转换为long，默认值：long.MinValue
        /// </summary>
        public static long TryLong(this Object strText)
        {
            return TryLong(strText, long.MinValue);
        }

        /// <summary>
        ///     转换为long
        /// </summary>
        /// <param name="strText"></param>
        /// <param name="defValue">默认值</param>
        /// <returns></returns>
        public static long TryLong(this Object strText, long defValue)
        {
            long temp;
            return long.TryParse(strText + "", out temp) ? temp : defValue;
        }

        /// <summary>
        ///     转换为long
        /// </summary>
        /// <param name="strText"></param>
        /// <param name="defValue">默认值</param>
        /// <returns></returns>
        public static long? TryLong(this Object strText, long? defValue)
        {
            long temp;
            return long.TryParse(strText + "", out temp) ? temp : defValue;
        }

        /// <summary>
        ///     转换为Boolean，默认值：false
        /// </summary>
        public static Boolean TryBool(this Object strText)
        {
            return TryBool(strText, false);
        }

        /// <summary>
        ///     转换为Boolean
        /// </summary>
        /// <param name="strText"></param>
        /// <param name="defValue">默认值</param>
        /// <returns></returns>
        public static Boolean TryBool(this Object strText, bool defValue)
        {
            if (strText.TryInt(0) == 1)
                return true;
            bool temp;
            return bool.TryParse(strText + "", out temp) ? temp : defValue;
        }

        /// <summary>
        ///     转换为Boolean
        /// </summary>
        /// <param name="strText"></param>
        /// <param name="defValue">默认值</param>
        /// <returns></returns>
        public static Boolean? TryBool(this Object strText, bool? defValue)
        {
            var i = strText.TryInt(null);
            if (i.HasValue)
                return i == 1;
            bool temp;
            return bool.TryParse(strText + "", out temp) ? temp : defValue;
        }

        /// <summary>
        ///     转换为DateTime，默认值：DateTimeExtension.DBNull
        /// </summary>
        public static DateTime TryDateTime(this Object strText)
        {
            return TryDateTime(strText, new DateTime(1970, 1, 1));
        }

        /// <summary>
        ///     转换为DateTime
        /// </summary>
        /// <param name="strText"></param>
        /// <param name="defValue">默认值</param>
        /// <returns></returns>
        public static DateTime TryDateTime(this Object strText, DateTime defValue)
        {
            //yyyy-MM-dd HH:mm
            //yyyy-M-d HH:mm
            //\d{4}\-\d{1,2}\-\d{1,2}( \d{1,2}:\d{2})?
            var timeText = strText.TryString("").Trim();
            Regex re = new Regex(@"^\d{4}\-\d{1,2}\-\d{1,2}[ \+]\d{1,2}:\d{2}?$");
            if (re.IsMatch(timeText))
            {
                timeText = string.Format("{0}:00", timeText).Replace("+", " ");
            }
            DateTime temp;
            if (DateTime.TryParse(timeText, out temp))
                return temp;
            return defValue;
        }

        /// <summary>
        ///     转换为DateTime
        /// </summary>
        /// <param name="strText"></param>
        /// <param name="defValue">默认值</param>
        /// <returns></returns>
        public static DateTime? TryDateTime(this Object strText, DateTime? defValue)
        {
            DateTime temp;
            return DateTime.TryParse(strText + "", out temp) ? temp : defValue;
        }
        /// <summary>
        ///  UTC+时区差 如北京是东八区，则北京时间=UTC+8.
        /// </summary>
        /// <param name="date">mongodb日期</param>
        /// <returns></returns>
        public static DateTime UTCToDate(this object date)
        {
            try
            {
                return ((DateTime)date).AddHours(8);
            }
            catch (Exception)
            {
                return DateTime.MinValue;
            }
        }
        /// <summary>
        ///     为NULL 和 DBNull的返回String.Empty
        /// </summary>
        /// <param name="str"></param>
        /// <returns></returns>
        public static string TryString(this Object str)
        {
            return TryString(str, "");
        }

        /// <summary>
        ///     转换为""
        /// </summary>
        /// <param name="str"></param>
        /// <param name="defvalue"></param>
        /// <returns></returns>
        public static string TryString(this Object str, string defvalue)
        {
            return str == null ? defvalue : str.ToString();
        }

        /// <summary>
        ///     转换十六进制
        /// </summary>
        /// <param name="i"></param>
        /// <returns></returns>
        public static string ConvertX8(this int i)
        {
            return Convert.ToString(i, 16);
        }

        /// <summary>
        /// Pascal 命名方法的字符串
        /// </summary>
        /// <param name="str">字符串</param>
        /// <returns></returns>
        public static string ToPascal(this string str)
        {
            if (string.IsNullOrEmpty(str))
            {
                return "";
            }
            else
            {
                return str.Substring(0, 1).ToUpper() +
                               str.Substring(1, str.Length - 1);
            }
        }

        /// <summary>
        /// Camel 命名方法的字符串
        /// </summary>
        /// <param name="str">字符串</param>
        /// <returns></returns>
        public static string ToCamel(this string str)
        {
            if (string.IsNullOrEmpty(str))
            {
                return "";
            }
            else
            {
                return str.Substring(0, 1).ToLower() +
                               str.Substring(1, str.Length - 1);
            }
        }

        /// <summary>
        /// 当前索引
        /// </summary>
        /// <param name="arr">数组</param>
        /// <param name="obj">对象</param>
        /// <returns>返回当前索引</returns>
        public static int IndexOf(this string[] arr, string obj)
        {
            var index = -1;
            for (int i = 0; i < arr.Length; i++)
            {
                if (arr[i] == obj)
                {
                    index = -1;
                }
            }
            return index;
        }

        /// <summary>
        /// 高低位转换
        /// </summary>
        /// <param name="strValue"></param>
        /// <returns></returns>
        public static string HighLowConvert(this string strValue)
        {
            int intLength = strValue.Length;
            string res = string.Empty;
            for (int i = 0; i < intLength / 2; i++)
            {
                res += strValue.Substring(intLength - 2 * (i + 1), 2);
            }
            return res;
        }
        /// <summary>
        /// 对象转换字符串
        /// </summary>
        /// <param name="obj"></param>
        /// <returns></returns>
        public static string ToJson(this object obj)
        {
            return JsonHelper.ToJson(obj);
        }
    }
}