using System;
using System.Collections;
using System.Linq;
using System.Collections.Generic;
using System.ComponentModel;
using System.Globalization;
using System.Reflection;

namespace Util
{
    /// <summary>
    /// 枚举辅助类
    /// </summary>
    public class EnumHelper
    {
        #region 获取枚举的描述 ：GetDesc

        /// <summary>
        /// 根据值获取枚举的描述 
        /// </summary>
        /// <typeparam name="TEnum">枚举类型</typeparam>
        /// <param name="value">要获得枚举描述的枚举值</param>
        /// <returns>枚举值的描述</returns>
        public static string GetDesc<TEnum>(object @value)
        {
            if (@value == null) return string.Empty;
            List<DictionaryEntry> lists = ToList<TEnum>();
            var a = lists.Find(item => Convert.ToInt32(item.Value) == Convert.ToInt32(@value));
            return a.Key + "";
        }

        /// <summary>
        /// 返回枚举项的描述信息。
        /// </summary>
        /// <param name="value">要获取描述信息的枚举项。</param>
        /// <returns>枚举想的描述信息。</returns>
        public static string GetDesc(Enum value)
        {
            if (value == null) return string.Empty;
            Type enumType = value.GetType();
            // 获取枚举常数名称。
            string name = Enum.GetName(enumType, value);
            if (name != null)
            {
                // 获取枚举字段。
                FieldInfo fieldInfo = enumType.GetField(name);
                if (fieldInfo != null)
                {
                    // 获取描述的属性。
                    var attr = Attribute.GetCustomAttribute(fieldInfo,
                        typeof(DescriptionAttribute), false) as DescriptionAttribute;
                    if (attr?.Description != null)
                    {
                        return attr.Description;
                    }
                }
            }
            return name;
        }

        /// <summary>
        /// 返回枚举项的描述信息。
        /// </summary>
        /// <param name="value">要获取描述信息的枚举字段字符串。</param>
        /// <returns>枚举想的描述信息。</returns>
        public static string GetDesc<T>(string value)
        {
            try
            {
                return GetDesc<T>((T)Enum.Parse(typeof(T), value, true));
            }
            catch (Exception ex)
            {
                LogHelper.Error($"获取描述信息的枚举字段字符串报错，参数Value：{value}" + ex);
                return string.Empty;
            }
        }

        #endregion

        #region 把枚举转化为集合：ToList

        /// <summary>
        /// 把枚举转化为集合
        /// </summary>
        /// <typeparam name="TEnum">枚举类型</typeparam>
        /// <returns>枚举的键值集合</returns>
        public static List<DictionaryEntry> ToList<TEnum>(bool? valIsName = false)
        {
            Type type = typeof(TEnum);
            if (!type.IsEnum)
            {
                throw new ArgumentException("TEnum requires a Enum", "TEnum");
            }

            FieldInfo[] fields = type.GetFields();
            var list = new List<DictionaryEntry>();
            foreach (var field in fields)
            {
                var objs = field.GetCustomAttributes(typeof(DescriptionAttribute), false);
                if (objs.Length > 0)
                {
                    var attr = objs[0] as DescriptionAttribute;
                    if (attr != null)
                        list.Add(new DictionaryEntry(attr.Description, valIsName.HasValue && valIsName.Value ? field.Name : ((int)Enum.Parse(type, field.Name)).ToString(CultureInfo.InvariantCulture)));
                }
            }
            return list;
        }

        /// <summary>
        /// 把枚举转化为集合(包含[全部]选项)
        /// </summary>
        /// <typeparam name="TEnum">枚举类型</typeparam>
        /// <returns>枚举的键值集合</returns>
        public static List<DictionaryEntry> ToList(Type type, bool? valIsName = false)
        {
            if (!type.IsEnum)
            {
                throw new ArgumentException("TEnum requires a Enum", "TEnum");
            }

            FieldInfo[] fields = type.GetFields();
            var list = new List<DictionaryEntry>();

            //全选项
            var allItem = type.GetCustomAttributes<DescriptionAttribute>().FirstOrDefault();
            list.Add(new DictionaryEntry(string.Format(CultureInfo.InvariantCulture, "{0}(全部)", allItem.Description), string.Empty));
            foreach (var field in fields)
            {
                var objs = field.GetCustomAttributes(typeof(DescriptionAttribute), false);
                if (objs.Length > 0)
                {
                    var attr = objs[0] as DescriptionAttribute;
                    if (attr != null)
                        list.Add(new DictionaryEntry(attr.Description, valIsName.HasValue && valIsName.Value ? field.Name : ((int)Enum.Parse(type, field.Name)).ToString(CultureInfo.InvariantCulture)));
                }
            }
            return list;
        }

        /// <summary>
        /// 获取全部枚举字典集合
        /// </summary>
        /// <returns></returns>
        public static string InitEnumDic()
        {
            Module[] mdus = Assembly.Load("Bui.SDK").GetModules();
            var enumDic = new Dictionary<string, string>();
            foreach (Module m in mdus)
            {
                foreach (var type in m.GetTypes())
                {
                    if (type.IsEnum && type.Name != "EnumLogType")
                    {
                        var obj = Activator.CreateInstance(type);
                        FieldInfo[] fields = type.GetFields();
                        foreach (var field in fields)
                        {
                            var attrs = field.GetCustomAttributes(typeof(DescriptionAttribute), false);
                            if (attrs != null && attrs.Length > 0)
                            {
                                var attr = attrs[0] as DescriptionAttribute;
                                enumDic.Add(type.Name + "-" + ((int)Enum.Parse(type, field.Name)), attr.Description);
                            }
                        }
                    }
                }
            }

            return enumDic.ToJson();
        }

        /// <summary>
        /// 获取全部枚举字典集合（此方法为公共方法，勿修改 Assembly.Load("Bui.SDK").GetModules()）
        /// </summary>
        /// <returns></returns>
        public static string GetEnumDic()
        {
            Module[] mdus = Assembly.Load("Cover.SDK").GetModules();
            var enumDic = new Dictionary<string, string>();
            foreach (Module m in mdus)
            {
                foreach (var type in m.GetTypes())
                {
                    if (type.IsEnum && type.Name != "EnumLogType")
                    {
                        var obj = Activator.CreateInstance(type);
                        FieldInfo[] fields = type.GetFields();
                        foreach (var field in fields)
                        {
                            var attrs = field.GetCustomAttributes(typeof(DescriptionAttribute), false);
                            if (attrs != null && attrs.Length > 0)
                            {
                                var attr = attrs[0] as DescriptionAttribute;
                                enumDic.Add(type.Name + "-" + ((int)Enum.Parse(type, field.Name)), attr.Description);
                            }
                        }
                    }
                }
            }

            return enumDic.ToJson();
        }

        #endregion


        ///// <summary>
        ///// 将枚举类型转换成字符串
        ///// </summary>
        ///// <typeparam name="TEnum"></typeparam>
        ///// <returns></returns>
        //public static string ToString<TEnum>()
        //{
        //    Type type = typeof(TEnum);
        //    if (!type.IsEnum)
        //    {
        //        throw new ArgumentException("TEnum requires a Enum", "TEnum");
        //    }

        //    var str = string.Empty;
        //    var propertys = type.GetProperties();

        //    for (var i = 0; i < propertys.Length; i++)
        //    {
        //        if (propertys[i].GetValue(type, null) != null)
        //        {
        //            var val = propertys[i].GetValue(type, null).ToString();
        //            if (i == 0)
        //                str += val;
        //            else
        //                str += "," + val;
        //        }
        //    }

        //    return str;
        //}
    }
}
