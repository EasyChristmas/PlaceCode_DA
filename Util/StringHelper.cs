using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;

namespace Util
{
    public static class StringHelper
    {
        /// <summary>
        /// 根据源字符串分割成字符串集合List(有效非空的)
        /// </summary>
        /// <param name="sourceStr">源字符串</param>
        /// <param name="separator">分隔符</param>
        /// <returns></returns>
        public static List<string> GetSplitList(string sourceStr,char separator)
        {
            List<string> ListStr = new List<string>();
            sourceStr.Split(separator).ToList().ForEach((x) =>
            {
                if (!string.IsNullOrWhiteSpace(x))
                    ListStr.Add(x);
            });
            return ListStr;
        }

        /// <summary>
        ///     返回指定数量随机除字母O之外的25个字母和数字0之外的9个数字
        /// </summary>
        /// <param name="count"></param>
        /// <param name="isAllNum"></param>
        /// <returns></returns>
        public static string[] GetRandomStrArray(int count, bool isAllNum = false)
        {
            var r = new Random();
            var lst = new List<string>();
            for (var i = 0; i < count; i++)
            {
                var re = r.Next(GetString(isAllNum).Length - 1);
                lst.Add(GetString(isAllNum)[re]);
            }
            return lst.ToArray();
        }

        /// <summary>
        ///     返回除字母O之外的25个字母和数字0之外的9个数字
        /// </summary>
        /// <returns></returns>
        private static string[] GetString(bool isAllNum = false)
        {
            if (isAllNum)
            {
                string[] Arr =
                {
                    "0","1", "2", "3", "4", "5", "6", "7", "8", "9"
                };
                return Arr;
            }
            else
            {
                string[] Arr =
                {
                    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "P", "Q", "R", "S",
                    "T", "U", "V", "W", "X", "Y", "Z", "1", "2", "3", "4", "5", "6", "7", "8", "9"
                };
                return Arr;
            }
        }
    }
}
