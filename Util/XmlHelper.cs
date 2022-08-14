using System;
using System.IO;
using System.Xml.Linq;
using System.Xml.Serialization;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Util
{
    public class XmlHelper
    {
        /// <summary>
        /// 保存 Xml
        /// </summary>
        /// <param name="obj">对象</param>
        /// <param name="path">路径</param>
        public static void SaveXml(object obj, string path)
        {
            string json;
            XDocument doc;
            try
            {
                json = obj.ToJson();
                json = "{'" + obj.GetType().Name + "':" + json + "}";
                doc = JsonConvert.DeserializeXNode(json);
            }
            catch (Exception ex)
            {
                json = new { IsSuccess = false, ErrMsg = ex.Message }.ToJson();
                doc = JsonConvert.DeserializeXNode(json);
            }
            doc.Save(path);
        }

        /// <summary>
        /// 加载 Xml
        /// </summary>
        /// <typeparam name="T">类型</typeparam>
        /// <param name="path">路径</param>
        /// <returns>对象</returns>
        public static T LoadXml<T>(string path) where T : new()
        {
            if (File.Exists(path))
            {
                using (var reader = new StreamReader(path))
                {
                    XNode xnode = XDocument.Load(reader);
                    string json = JsonConvert.SerializeXNode(xnode);
                    var obj = new JsonObject(json);
                    json = obj[typeof(T).Name].ToString();
                    return JsonConvert.DeserializeObject<T>(json);
                }
            }
            return new T();
        }

        /// <summary>
        /// 序列化为xml
        /// </summary>
        /// <param name="obj">要序列化的对象</param>
        /// <returns></returns>
        public static string ToXml(object obj)
        {
            var sw = new StringWriter();
            //创建XML命名空间
            var ns = new XmlSerializerNamespaces();
            var serializer = new XmlSerializer(obj.GetType());
            serializer.Serialize(sw, obj, ns);
            sw.Close();
            return sw.ToString();
        }

        /// <summary>
        /// 反序列化为对象
        /// </summary>
        /// <typeparam name="T">泛型</typeparam>
        /// <param name="xmlStream">xml 流</param>
        /// <returns></returns>
        public static T ParseXml<T>(Stream xmlStream) where T : class
        {
            var xmlSearializer = new XmlSerializer(typeof(T));
            var obj = xmlSearializer.Deserialize(xmlStream) as T;
            return obj;
        }
    }
}
