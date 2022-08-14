using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Serialization;
using System;
using System.Collections.Generic;
using System.IO;

namespace Util
{
    /// <summary>
    /// JSON 辅助类
    /// </summary>
    public static class JsonHelper
    {
        private static readonly JsonSerializerSettings JsonSerializerSettings = new JsonSerializerSettings
        {
            NullValueHandling = NullValueHandling.Ignore,
            ContractResolver = new CamelCasePropertyNamesContractResolver(),
            //ReferenceLoopHandling = ReferenceLoopHandling.Serialize,
            //PreserveReferencesHandling = PreserveReferencesHandling.Objects
        };

        static JsonHelper()
        {
            var timeConverter = new IsoDateTimeConverter();
            timeConverter.DateTimeFormat = "yyyy'-'MM'-'dd' 'HH':'mm':'ss";
            JsonSerializerSettings.Converters.Add(timeConverter);
        }

        /// <summary>
        /// 转换对象为json格式字符串
        /// </summary>
        /// <param name="obj"></param>
        /// <param name="loadSetting">加载设置</param>
        /// <returns></returns>
        public static string ToJson(object obj, bool loadSetting = true)
        {
            return loadSetting
                // 设置参数为Formatting.Indented可输出格式化后的json
                ? JsonConvert.SerializeObject(obj, Formatting.None, JsonSerializerSettings)
                : JsonConvert.SerializeObject(obj, Formatting.None);


        }

        ///// <summary>
        /////     转换对象为可供Razor页面使用的json格式字符串
        ///// </summary>
        ///// <param name="obj"></param>
        ///// <returns></returns>
        //public static IHtmlString ToRawJson(object obj)
        //{
        //    return new HtmlString(ToJson(obj));
        //}

        /// <summary>
        ///     转换json格式字符串为指定类型对象
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="json"></param>
        /// <returns></returns>
        public static T ParseJson<T>(string json) where T : class
        {
            try
            {
                JsonSerializer serializer = new JsonSerializer();
                StringReader sr = new StringReader(json);
                object o = serializer.Deserialize(new JsonTextReader(sr), typeof(T));
                //return JsonConvert.DeserializeObject<T>(json);
                return o as T;
            }
            catch (Exception ex)
            {
                LogHelper.Error("ParseJson<T>失败，json:" + json, ex);
                return null;
            }

        }
        /// <summary>
        /// 转换json格式字符串为指定类型对象
        /// </summary>
        /// <param name="json"></param>
        /// <param name="type"></param>
        /// <returns></returns>
        public static object ParseJson(string json, Type type)
        {
            return JsonConvert.DeserializeObject(json, type, JsonSerializerSettings);
        }

        //public static T ParseJson<T>(object p)
        //{
        //    throw new NotImplementedException();
        //}

        /// <summary>
        /// 解析JSON数组生成对象实体集合
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="json"></param>
        /// <returns></returns>
        public static List<T> DeserializeJsonToList<T>(string json) where T : class
        {
            JsonSerializer serializer = new JsonSerializer();
            StringReader sr = new StringReader(json);
            object o = serializer.Deserialize(new JsonTextReader(sr), typeof(List<T>));
            List<T> list = o as List<T>;
            return list;
        }
    }
}