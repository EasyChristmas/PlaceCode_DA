using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Util
{
    public static class ObjectHelper
    {
        /// <summary>
        /// Model赋值转换
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="_obj"></param>
        /// <returns></returns>
        public static T ConvertObject<T>(object _obj) where T : new()
        {
            T _t = new T();
            //遍历需要转换的model
            foreach (PropertyInfo _item in _obj.GetType().GetProperties())
            {
                //在新的model中查找对应名字的属性，搜索忽略名称大小写
                PropertyInfo _property = typeof(T).GetProperty(_item.Name, BindingFlags.Public | BindingFlags.Instance | BindingFlags.IgnoreCase, null, null, new Type[] { }, null);
                if (_property != null && _item.GetValue(_obj, null) != null)
                {
                    //给新的model赋值
                    var t = GetGenericType(_item.PropertyType);
                    //Convert.ChangeType(_item.GetValue(_obj, null), _property.PropertyType)
                    if (_item.PropertyType.IsEnum && GetGenericType(_property.PropertyType) == typeof(int))
                        _property.SetValue(_t, (int)_item.GetValue(_obj, null), null);
                    else if (GetGenericType(_item.PropertyType) == typeof(int) && _property.PropertyType.IsEnum)//update by 余意 Date：2015-05-11
                        _property.SetValue(_t, (int)_item.GetValue(_obj, null), null);
                    else if (GetGenericType(_item.PropertyType) == GetGenericType(_property.PropertyType))
                        _property.SetValue(_t, Convert.ChangeType(_item.GetValue(_obj, null), GetGenericType(_property.PropertyType)), null);
                }
            }
            return _t;
        }

        /// <summary>
        /// 获取内部的类型
        /// </summary>
        /// <param name="t">原类型</param>
        /// <returns>内部的类型</returns>
        public static Type GetGenericType(Type t)
        {
            var type = t;
            if (t.GetGenericArguments().Length > 0)
                type = t.GetGenericArguments()[0];
            return type;
        }

        /// <summary>
        /// 获取实体某个Property的值
        /// </summary>
        /// <param name="t">原类型</param>
        /// <returns></returns>
        public static PropertyInfo GetEntity(object o, string propertyname)
        {
            //在entity中查找对应名字的属性，搜索忽略名称大小写
            PropertyInfo _property = o.GetType().GetProperty(propertyname, BindingFlags.Public | BindingFlags.Instance | BindingFlags.IgnoreCase);
            return _property;
        }

        public static string GetValue(PropertyInfo prop)
        {
            object[] objs = prop.GetCustomAttributes(typeof(DescriptionAttribute), true);
            if (objs.Length > 0)
            {
                return ((DescriptionAttribute)objs[0]).Description;
            }
            return string.Empty;
        }

        public static object GetEntityValue(object o, string propertyname)
        {
            PropertyInfo _property = GetEntity(o, propertyname);
            if (_property != null)
                return _property.GetValue(o, null);
            return null;
        }

        /// <summary>
        /// 返回对象所有字段描述
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <returns></returns>
        public static List<string> GetEntityDesc<T>()
        {
            PropertyInfo[] peroperties = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance);
            List<string> desclist = new List<string>();
            foreach (PropertyInfo property in peroperties)
            {
                object[] objs = property.GetCustomAttributes(typeof(DescriptionAttribute), true);
                if (objs.Length > 0)
                {
                    desclist.Add(((DescriptionAttribute)objs[0]).Description);
                    //Console.WriteLine("{0}: {1}", property.Name, ((DescriptionAttribute)objs[0]).Description);
                }
            }
            return desclist;
        }

        /// <summary>
        /// 返回对象所有字段及字段描述
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <returns></returns>
        public static Dictionary<string, string> GetDicEntityDesc<T>()
        {
            PropertyInfo[] peroperties = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance);
            Dictionary<string, string> desclist = new Dictionary<string, string>();
            foreach (PropertyInfo property in peroperties)
            {
                object[] objs = property.GetCustomAttributes(typeof(DescriptionAttribute), true);
                if (objs.Length > 0)
                {
                    desclist.Add(property.Name, ((DescriptionAttribute)objs[0]).Description);
                }
            }
            return desclist;
        }

        /// <summary>
        /// 返回对象所有字段描述和值
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <returns></returns>
        public static string GetFieldDescAndValue(this object obj)
        {
            StringBuilder stringBuilder = new StringBuilder();

            if(obj ==null) return stringBuilder.ToString();

            try
            {
                PropertyInfo[] peroperties = obj.GetType().GetProperties(BindingFlags.Public | BindingFlags.Instance);
                foreach (PropertyInfo property in peroperties)
                {
                    object[] objs = property.GetCustomAttributes(typeof(DescriptionAttribute), true);
                    if (objs.Length > 0)
                    {
                        var value = property.GetValue(obj, null).TryString(null);
                        if (!string.IsNullOrWhiteSpace(value))
                            stringBuilder.AppendLine($"{((DescriptionAttribute)objs[0]).Description}：{property.GetValue(obj, null)}");
                    }
                }
            }
            catch (Exception ex)
            {
                LogHelper.Error($"获取对象所有字段描述和值异常：{obj.ToJson()}", ex);
            }
            return stringBuilder.ToString();
        }

        ///// <summary>
        ///// 将model转为string
        ///// </summary>
        ///// <param name="_obj"></param>
        ///// <returns></returns>
        //public static string ConvertToString(object _obj)
        //{
        //    StringBuilder result = new StringBuilder();
        //    //遍历需要转换的model
        //    foreach (PropertyInfo _item in _obj.GetType().GetProperties())
        //    {
        //        switch (_item.Name)
        //        {
        //            case "ApiVersion":
        //            case "AppKey":
        //            case "TimeStamp":
        //            case "Sign":
        //            case "Version":
        //            case "Ip":
        //            case "Channel":
        //                continue;
        //        }
        //        if (_item.GetValue(_obj, null) != null)
        //        {
        //            result.AppendFormat("&{0}={1}", System.Web.HttpUtility.UrlEncode(_item.Name), System.Web.HttpUtility.UrlEncode(_item.GetValue(_obj, null).ToString()));
        //        }
        //    }
        //    if (result.Length > 0) result.Remove(0, 1);
        //    return result.ToString();
        //}
    }
}
