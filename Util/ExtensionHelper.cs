using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Reflection;

namespace Util
{
    public static class ExtensionHelper
    {
        public static void SetValue(this Object obj, string propName, object value)
        {
            var type = obj.GetType();
            var prop = type.GetProperty(propName);
            prop.SetValue(obj, value);
        }

        /// <summary>
        /// 将对象属性转换为key-value对
        /// </summary>
        /// <param name="obj"></param>
        /// <returns></returns>
        public static Dictionary<String, Object> ToMap(this Object obj)
        {
            var map = new Dictionary<string, object>();
            var t = obj.GetType();
            var pi = t.GetProperties(BindingFlags.Public | BindingFlags.Instance);
            foreach (var p in pi)
            {
                var mi = p.GetGetMethod();
                if (mi != null && mi.IsPublic)
                {
                    map.Add(p.Name, mi.Invoke(obj, new Object[] { }));
                }
            }
            return map;
        }

        /// <summary>
        /// 将对象属性转换为key-value对
        /// </summary>
        /// <param name="obj"></param>
        /// <returns></returns>
        public static Dictionary<string, string> ToMapString(this Object obj)
        {
            var map = new Dictionary<string, string>();
            var t = obj.GetType();
            var pi = t.GetProperties(BindingFlags.Public | BindingFlags.Instance);
            foreach (var p in pi)
            {
                var mi = p.GetGetMethod();
                if (mi != null && mi.IsPublic)
                {
                    map.Add(p.Name.ToLower(), mi.Invoke(obj, new Object[] { }).ToString());
                }
            }
            return map;
        }
        /// <summary>
        /// 生成联盟证书
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public static string UnionNum(int userId)
        {
            //生成联盟证书
            TimeSpan ts = DateTime.UtcNow - new DateTime(1970, 1, 1, 0, 0, 0, 0);
            return Convert.ToInt64(ts.TotalSeconds).ToString() + userId;
        }

        /// <summary>
        /// 产生随机数字
        /// </summary>
        /// <param name="random"></param>
        /// <param name="miniDouble"></param>
        /// <param name="maxiDouble"></param>
        /// <param name="Len"></param>
        /// <param name="isDouble"></param>
        /// <returns></returns>
        public static decimal NextDouble(this Random random, double miniDouble, double maxiDouble, int Len, bool isDouble = true)
        {
            if (isDouble)
            {
                if (random != null)
                {
                    decimal temp = (decimal)Math.Round(random.NextDouble() * (maxiDouble - miniDouble) + miniDouble, Len);

                    return temp;
                }
                else
                {
                    return 0;
                }
            }
            else
            {
                if (random != null)
                {
                    return random.Next((int)miniDouble, (int)maxiDouble);
                }
                else
                {
                    return 0;
                }
            }
        }
    }
}
