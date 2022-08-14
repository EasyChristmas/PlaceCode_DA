using System;
using System.Collections.Generic;
using System.Reflection;
using System.Text;
using System.Text.RegularExpressions;

namespace Util
{
    #region JsonObject
    /// <summary>
    /// 用于构建属性值的回调
    /// </summary>
    /// <param name="Property"></param>
    public delegate void SetProperties(JsonObject Property);

    /// <summary>
    /// JsonObject属性值类型
    /// </summary>
    public enum JsonPropertyType
    {
        String,
        Object,
        Array,
        Number,
        Bool,
        Null
    }

    /// <summary>
    /// JSON通用对象
    /// </summary>
    public class JsonObject
    {
        private Dictionary<String, JsonProperty> _property;

        public JsonObject()
        {
            this._property = null;
        }

        public JsonObject(String jsonString)
        {
            this.Parse(ref jsonString);
        }

        public JsonObject(SetProperties callback)
        {
            if (callback != null)
            {
                callback(this);
            }
        }

        /// <summary>
        /// Json字符串解析
        /// </summary>
        /// <param name="jsonString"></param>
        private void Parse(ref String jsonString)
        {
            jsonString = StrEncode((jsonString ?? "").Trim());//add at 2010-12-10 by 叶重绿,描述：当值有,或者:时会出现取值错误，这里实现转义
            int len = jsonString.Length;
            if (String.IsNullOrEmpty(jsonString) || jsonString.Substring(0, 1) != "{" || jsonString.Substring(jsonString.Length - 1, 1) != "}")
            {
                throw new ArgumentException("传入文本不符合Json格式!(" + jsonString + ")");
            }
            Stack<Char> stack = new Stack<char>();
            Stack<Char> stackType = new Stack<char>();
            StringBuilder sb = new StringBuilder();
            Char cur;
            bool convert = false;
            bool isValue = false;
            JsonProperty last = null;
            for (int i = 1; i <= len - 2; i++)
            {
                cur = jsonString[i];
                if (cur == '}')
                {
                    ;
                }
                if (cur == ' ' && stack.Count == 0)
                {
                    sb.Append(cur);//add at 2010-12-10 by 叶重绿,描述：当值有空格时这里去除了
                }
                else if ((cur == '\'' || cur == '\"') && !convert && stack.Count == 0 && !isValue)
                {
                    sb.Length = 0;
                    stack.Push(cur);
                }
                else if ((cur == '\'' || cur == '\"') && !convert && stack.Count > 0 && stack.Peek() == cur && !isValue)
                {
                    stack.Pop();
                }
                else if ((cur == '[' || cur == '{') && stack.Count == 0)
                {
                    stackType.Push(cur == '[' ? ']' : '}');
                    sb.Append(cur);
                }
                else if ((cur == ']' || cur == '}') && stack.Count == 0 && stackType.Peek() == cur)
                {
                    stackType.Pop();
                    sb.Append(cur);
                }
                else if (cur == ':' && stack.Count == 0 && stackType.Count == 0 && !isValue)
                {
                    last = new JsonProperty();
                    this[sb.ToString().Trim()] = last;
                    isValue = true;
                    sb.Length = 0;
                }
                else if (cur == ',' && stack.Count == 0 && stackType.Count == 0)
                {
                    if (last != null)
                    {
                        String temp = StrDecode(sb.ToString());
                        last.Parse(ref temp);
                    }
                    isValue = false;
                    sb.Length = 0;
                }
                else
                {
                    sb.Append(cur);
                }
            }
            if (sb.Length > 0 && last != null && last.Type == JsonPropertyType.Null)
            {
                String temp = StrDecode(sb.ToString());
                last.Parse(ref temp);
            }
        }
        #region 字符串转义
        private readonly string _SEMICOLON = "@semicolon";//分号转义符
        private readonly string _COMMA = "@comma"; //逗号转义符
        /// <summary>
        /// 字符串转义,将双引号内的:和,分别转成_SEMICOLON和_COMMA
        /// </summary>
        /// <param name="text"></param>
        /// <returns></returns>
        private string StrEncode(string text)
        {
            MatchCollection matches = Regex.Matches(text, "(\\\")?[^\\\"]+(\\\")?\\s*:\\s*\\\"((\\\\\"|[^\\\"])+)\\\"");
            foreach (Match match in matches)
            {
                text = text.Replace(match.Value, match.Value.Replace(match.Groups[3].Value, match.Groups[3].Value.Replace(":", _SEMICOLON).Replace(",", _COMMA)));
            }
            return text;
        }

        /// <summary>
        /// 字符串转义,将_SEMICOLON和_COMMA分别转成:和,
        /// </summary>
        /// <param name="text"></param>
        /// <returns></returns>
        private string StrDecode(string text)
        {
            return text.Replace(_SEMICOLON, ":").Replace(_COMMA, ",");
        }
        #endregion
        /// <summary>
        /// 获取属性
        /// </summary>
        /// <param name="PropertyName"></param>
        /// <returns></returns>
        public JsonProperty this[String PropertyName]
        {
            get
            {
                JsonProperty result = null;
                if (this._property != null && this._property.ContainsKey(PropertyName))
                {
                    result = this._property[PropertyName];
                }
                else
                {
                    result = this.AddProperty(PropertyName);
                    /*
                    if (this._property == null)
                    {
                        this._property = new Dictionary<string, JsonProperty>(StringComparer.OrdinalIgnoreCase);
                    }
                    this._property.Add(PropertyName,null);
                    result = this._property[PropertyName];*/
                }
                return result;
            }
            set
            {
                if (this._property == null)
                {
                    this._property = new Dictionary<string, JsonProperty>(StringComparer.OrdinalIgnoreCase);
                }
                if (this._property.ContainsKey(PropertyName))
                {
                    this._property[PropertyName] = value;
                }
                else
                {
                    this._property.Add(PropertyName, value);
                }
            }
        }

        /// <summary>
        /// 通过此泛型函数可直接获取指定类型属性的值
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="PropertyName"></param>
        /// <returns></returns>
        public virtual T Properties<T>(String PropertyName) where T : class
        {
            JsonProperty p = this[PropertyName];
            if (p != null)
            {
                return p.GetValue<T>();
            }
            return default(T);
        }

        /// <summary>
        /// 获取属性名称列表
        /// </summary>
        /// <returns></returns>
        public String[] GetPropertyNames()
        {
            if (this._property == null)
                return null;
            String[] keys = null;
            if (this._property.Count > 0)
            {
                keys = new String[this._property.Count];
                this._property.Keys.CopyTo(keys, 0);
            }
            return keys;
        }

        /// <summary>
        /// 移除一个属性
        /// </summary>
        /// <param name="PropertyName"></param>
        /// <returns></returns>
        public JsonProperty RemoveProperty(String PropertyName)
        {
            if (this._property != null && this._property.ContainsKey(PropertyName))
            {
                JsonProperty p = this._property[PropertyName];
                this._property.Remove(PropertyName);
                return p;
            }
            return null;
        }
        /// <summary>
        /// 添加一个属性
        /// </summary>
        /// <param name="PropertyName"></param>
        /// <returns></returns>
        public JsonProperty AddProperty(String PropertyName)
        {
            if (this._property == null)
            {
                this._property = new Dictionary<string, JsonProperty>(StringComparer.OrdinalIgnoreCase);
            }
            if (!this._property.ContainsKey(PropertyName))
            {
                this._property.Add(PropertyName, new JsonProperty());
            }
            JsonProperty p = this._property[PropertyName];
            return p;
        }

        /// <summary>
        /// 是否为空对象
        /// </summary>
        /// <returns></returns>
        public bool IsNull()
        {
            return this._property == null;
        }
        /// <summary>
        /// ToString
        /// </summary>
        /// <returns></returns>
        public override string ToString()
        {
            return this.ToString("");
        }
        /// <summary>
        /// 是否有此属性值
        /// </summary>
        /// <param name="PropertyName"></param>
        /// <returns></returns>
        public bool HasProperty(string PropertyName)
        {
            if (this._property != null && this._property.ContainsKey(PropertyName))
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        /// <summary>
        /// ToString...
        /// </summary>
        /// <param name="format">格式化字符串</param>
        /// <returns></returns>
        public virtual string ToString(String format)
        {
            if (this.IsNull())
            {
                return "{}";
            }
            else
            {
                StringBuilder sb = new StringBuilder();
                foreach (String key in this._property.Keys)
                {
                    sb.Append(",");
                    sb.Append(string.Format("\"{0}\"", key)).Append(":");
                    sb.Append(this._property[key].ToString(format));

                }
                if (this._property.Count > 0)
                {
                    sb.Remove(0, 1);
                }
                sb.Insert(0, "{");
                sb.Append("}");
                return sb.ToString();
            }
        }
        /// <summary>
        /// 返回实体类对象(不区分大小写匹配)
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <returns></returns>
        public T GetEntity<T>() where T : new()
        {
            return GetEntity<T>(false);
        }
        /// <summary>
        /// 返回实体类对象
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="IgnoreCase">是否区分大小写</param>
        /// <returns></returns>
        public T GetEntity<T>(bool IgnoreCase) where T : new()
        {
            T obj = new T();
            foreach (string s in this.GetPropertyNames())
            {
                PropertyInfo p = obj.GetType().GetProperty(s, BindingFlags.Public | BindingFlags.SetProperty | BindingFlags.Instance | (IgnoreCase ? BindingFlags.Default : BindingFlags.IgnoreCase));
                if (p != null)
                {
                    try
                    {
                        string value = this[s].Value;
                        Type t = p.PropertyType;
                        if (t.IsClass && !t.IsPrimitive && t != typeof(System.String) && t != typeof(DateTime))
                        {

                            //System.Web.HttpContext.Current.Response.Write("<br>@(" + t.ToString() + "=" + t.IsClass.ToString() + ")@<br>");
                            Type type = typeof(JsonObject);
                            object o = Activator.CreateInstance(type, (object)this[s].ToString());
                            MethodInfo method = type.GetMethod("GetEntityOOO", BindingFlags.Instance | BindingFlags.Public);

                            method = method.MakeGenericMethod(t);
                            object _parm = Activator.CreateInstance(t);
                            method.Invoke(o, new object[] { _parm, true });

                            /*object _json = Activator.CreateInstance(typeof(JsonObject), this[s].ToString());
                            System.Web.HttpContext.Current.Response.Write("<br>" + p.PropertyType.ToString() + "<br>");
                            object _parm = Activator.CreateInstance(t);
                            //System.Web.HttpContext.Current.Response.Write("<br>" + _parm.ToString() + "<br>");
                            object _result = _json.GetType().GetMethod("GetEntity", new Type[] { t }).Invoke(_json, new object[] { t, true });
                            */
                            //System.Web.HttpContext.Current.Response.Write("<br>2" + _parm.ToString() + "<br>");
                            //object list = Activator.CreateInstance(typeof(List<>).MakeGenericType(typeof(AAA)));
                            //Assembly.GetExecutingAssembly().CreateInstance(t)
                            /*object _obj = Activator.CreateInstance(t, true);
                            MethodInfo method = t.GetMethod(;
                            MakeGenericMethod(t).Invoke(obj, null);
                            object _val = this[s].Object.GetEntity<t>();*/
                            //System.Web.HttpContext.Current.Response.Write("<br>" + (_parm ?? "").ToString() + "=" + t.Namespace.ToString() + "<br>");


                            p.SetValue(obj, Convert.ChangeType(_parm, t), null);
                            //JsonObject.GetEntityFromJson(this[s].Object,)
                            //System.Web.HttpContext.Current.Response.Write("<br>" + t.ToString() + "==" + this[s].ToString() + "<br>");
                        }
                        else if (string.IsNullOrEmpty(value))
                        {
                            if (t.Equals(typeof(System.String)))
                                p.SetValue(obj, "", null);
                        }
                        else if (t.Equals(typeof(System.Boolean)))
                            p.SetValue(obj, (value == "1"), null);
                        else if (t.Equals(typeof(System.DateTime)))
                        {
                            DateTime time;
                            if (!DateTime.TryParse(value, out time)) time = DateTime.MinValue;
                            p.SetValue(obj, time, null);
                        }
                        else
                            p.SetValue(obj, Convert.ChangeType(value, t), null);
                    }
                    catch (Exception ex)
                    {
                        // SDK.Log.LogHelper.Log(string.Format("将Json值赋与对像属性时出错:{0}-{1}",p.Name,s), ex);
                         LogHelper.Error(ex.Message, ex);
                    }
                }
            }
            return obj;
        }

        #region 
        public T GetEntityOOO<T>(T _t, bool IgnoreCase)
        {
            T obj = _t;
            foreach (string s in this.GetPropertyNames())
            {
                PropertyInfo p = obj.GetType().GetProperty(s, BindingFlags.Public | BindingFlags.SetProperty | BindingFlags.Instance | (IgnoreCase ? BindingFlags.Default : BindingFlags.IgnoreCase));
                if (p != null)
                {
                    try
                    {
                        string value = this[s].Value;
                        Type t = p.PropertyType;
                        if (string.IsNullOrEmpty(value))
                        {
                            if (t.Equals(typeof(System.String)))
                                p.SetValue(obj, "", null);
                        }
                        else if (t.Equals(typeof(System.Boolean)))
                            p.SetValue(obj, (value == "1"), null);
                        else if (t.Equals(typeof(System.DateTime)))
                        {
                            DateTime time;
                            if (!DateTime.TryParse(value, out time)) time = DateTime.MinValue;
                            p.SetValue(obj, time, null);
                        }
                        else
                            p.SetValue(obj, Convert.ChangeType(value, t), null);
                    }
                    catch (Exception ex)
                    {
                        // SDK.Log.LogHelper.Log(string.Format("将Json值赋与对像属性时出错:{0}-{1}",p.Name,s), ex);
                    }
                }
            }
            return obj;
        }
        #endregion
        #region 转换
        static public T ConvertEntity<T>(object t) where T : new()
        {
            bool IgnoreCase = false;
            T obj = new T();
            foreach (PropertyInfo p in t.GetType().GetProperties())
            {
                PropertyInfo o = obj.GetType().GetProperty(p.Name, BindingFlags.Public | BindingFlags.Instance | (IgnoreCase ? BindingFlags.Default : BindingFlags.IgnoreCase));
                if (o != null)
                {
                    object val = null;
                    object v = p.GetValue(t, null);
                    val = Convert.ChangeType(v, o.PropertyType);
                    o.SetValue(obj, val, null);
                }
            }
            return obj;
        }
        #endregion

        //public static Regex _reg = new Regex(@"(?<y>\d+)[-\./](?<mon>\d+)[-\./](?<d>\d+)T?((?<h>\d+):(?<m>\d+)(:(?<s>\d+)(\.(?<ms>\d+))?)?)?", RegexOptions.IgnoreCase);
        /// <summary>
        /// 将Json中的值给某个对像
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="js"></param>
        /// <param name="a"></param>
        /// <returns></returns>
        public static T GetEntityFromJson<T>(JsonObject js, ref T a)
        {
            if (a == null) return a;
            if (js == null) return a;
            PropertyInfo[] ps = a.GetType().GetProperties(BindingFlags.Public | BindingFlags.Instance);
            //string[] names = js.GetPropertyNames();
            foreach (PropertyInfo pi in ps)
            {

                string text = null;

                if (js.HasProperty(pi.Name) || js.HasProperty(pi.Name.ToLower()))
                {
                    if (js[pi.Name] == null)
                    {
                        if (js[pi.Name.ToLower()] == null) continue;
                        else text = js[pi.Name.ToLower()].Value;
                    }
                    else
                        text = js[pi.Name].Value;
                }
                else
                    continue;

                TypeCode type = Type.GetTypeCode(pi.PropertyType);
                try
                {
                    if (text == null || text.Length == 0)
                    {
                        if (type == TypeCode.String)
                            pi.SetValue(a, "", null);

                    }

                    if (type == TypeCode.Boolean)
                        pi.SetValue(a, (text == "1"), null);
                    else if (type == TypeCode.DateTime)
                    {
                        DateTime time;
                        if (!DateTime.TryParse(text, out time)) time = DateTime.MinValue;
                        pi.SetValue(a, time, null);
                    }
                    else
                        pi.SetValue(a, Convert.ChangeType(text, pi.PropertyType), null);
                }
                catch (Exception ex)
                {
                    // SDK.Log.LogHelper.Log(string.Format("将Json值赋与对像属性时出错:{0}-{1}", pi.Name, text==null?"NULL":text), ex);
                }
            }
            return a;
        }
    }

    /// <summary>
    /// JSON对象属性
    /// </summary>
    public class JsonProperty
    {
        private JsonPropertyType _type;
        private string _value;
        private JsonObject _object;
        private List<JsonProperty> _list;
        private bool _bool;
        private double _number;

        public JsonProperty()
        {
            this._type = JsonPropertyType.Null;
            this._value = null;
            this._object = null;
            this._list = null;
        }

        public JsonProperty(Object value)
        {
            this.SetValue(value);
        }


        public JsonProperty(String jsonString)
        {
            this.Parse(ref jsonString);
        }


        /// <summary>
        /// Json字符串解析
        /// </summary>
        /// <param name="jsonString"></param>
        public void Parse(ref String jsonString)
        {
            if (String.IsNullOrEmpty(jsonString.Trim()))
            {
                this.SetValue(null);
            }
            else
            {
                jsonString = jsonString.Trim();//add at 2010-12-10 by 叶重绿，bug描述：json值如果最后出现换行会取值错误
                string first = jsonString.Substring(0, 1);
                string last = jsonString.Substring(jsonString.Length - 1, 1);
                if (first == "[" && last == "]")
                {
                    this.SetValue(this.ParseArray(ref jsonString));
                }
                else if (first == "{" && last == "}")
                {
                    this.SetValue(this.ParseObject(ref jsonString));
                }
                else if ((first == "'" || first == "\"") && first == last)
                {
                    this.SetValue(this.ParseString(ref jsonString));
                }
                else if (jsonString == "true" || jsonString == "false")
                {
                    this.SetValue(jsonString == "true" ? true : false);
                }
                else if (jsonString == "null")
                {
                    this.SetValue(null);
                }
                else
                {
                    double d = 0;
                    if (double.TryParse(jsonString, out d))
                    {
                        this.SetValue(d);
                    }
                    else
                    {
                        this.SetValue(jsonString);
                    }
                }
            }
        }

        /// <summary>
        /// Json Array解析
        /// </summary>
        /// <param name="jsonString"></param>
        /// <returns></returns>
        private List<JsonProperty> ParseArray(ref String jsonString)
        {
            List<JsonProperty> list = new List<JsonProperty>();
            int len = jsonString.Length;
            StringBuilder sb = new StringBuilder();
            Stack<Char> stack = new Stack<char>();
            Stack<Char> stackType = new Stack<Char>();
            bool conver = false;
            Char cur;
            for (int i = 1; i <= len - 2; i++)
            {
                cur = jsonString[i];
                if (Char.IsWhiteSpace(cur) && stack.Count == 0)
                {
                    sb.Append(cur);
                }
                else if ((cur == '\'' && stack.Count == 0 && !conver && stackType.Count == 0) || (cur == '\"' && stack.Count == 0 && !conver && stackType.Count == 0))
                {
                    sb.Length = 0;
                    sb.Append(cur);
                    stack.Push(cur);
                }
                else if (cur == '\\' && stack.Count > 0 && !conver)
                {
                    sb.Append(cur);
                    conver = true;
                }
                else if (conver == true)
                {
                    conver = false;

                    /*if (cur == 'u')
                    {
                        sb.Append(new char[] { cur, jsonString[i + 1], jsonString[i + 2], jsonString[i + 3] });
                        i += 4;
                    }
                    else
                    {
                        sb.Append(cur);
                    }*/
                    sb.Append(cur);//上面是原始的
                }
                else if ((cur == '\'' || cur == '\"') && !conver && stack.Count > 0 && stack.Peek() == cur && stackType.Count == 0)
                {
                    sb.Append(cur);
                    list.Add(new JsonProperty(sb.ToString()));
                    sb.Length = 0;//2011-12-18
                    stack.Pop();
                }
                else if ((cur == '[' || cur == '{') && stack.Count == 0)
                {
                    if (stackType.Count == 0)
                    {
                        sb.Length = 0;
                    }
                    sb.Append(cur);
                    stackType.Push((cur == '[' ? ']' : '}'));
                }
                else if ((cur == ']' || cur == '}') && stack.Count == 0 && stackType.Count > 0 && stackType.Peek() == cur)
                {
                    sb.Append(cur);
                    stackType.Pop();
                    if (stackType.Count == 0)
                    {
                        list.Add(new JsonProperty(sb.ToString()));
                        sb.Length = 0;
                    }

                }
                else if (cur == ',' && stack.Count == 0 && stackType.Count == 0)
                {
                    if (sb.Length > 0)
                    {
                        list.Add(new JsonProperty(sb.ToString()));
                        sb.Length = 0;
                    }
                }
                else
                {
                    sb.Append(cur);
                }
            }
            if (stack.Count > 0 || stackType.Count > 0)
            {
                list.Clear();
                throw new ArgumentException("无法解析Json Array对象!");
            }
            else if (sb.ToString().Trim().Length > 0)
            {
                list.Add(new JsonProperty(sb.ToString()));
            }
            return list;
        }


        /// <summary>
        /// Json String解析
        /// </summary>
        /// <param name="jsonString"></param>
        /// <returns></returns>
        private String ParseString(ref String jsonString)
        {
            int len = jsonString.Length;
            StringBuilder sb = new StringBuilder();
            bool conver = false;
            Char cur;
            for (int i = 1; i <= len - 2; i++)
            {
                cur = jsonString[i];
                if (cur == '\\' && !conver)
                {
                    conver = true;
                }
                else if (conver == true)
                {
                    conver = false;
                    if (cur == '\\' || cur == '\"' || cur == '\'' || cur == '/')
                    {
                        sb.Append(cur);
                    }
                    else
                    {
                        if (cur == 'u')
                        {
                            /*String temp = new String(new char[] { cur, jsonString[i + 1], jsonString[i + 2], jsonString[i + 3] });
                            sb.Append((char)Convert.ToInt32(temp, 16));
                            i += 4;*/
                            sb.Append("\\" + cur);//上面是原始的
                        }
                        else
                        {
                            switch (cur)
                            {
                                case 'b':
                                    sb.Append('\b');
                                    break;
                                case 'f':
                                    sb.Append('\f');
                                    break;
                                case 'n':
                                    sb.Append('\n');
                                    break;
                                case 'r':
                                    sb.Append('\r');
                                    break;
                                case 't':
                                    sb.Append('\t');
                                    break;
                            }
                        }
                    }
                }
                else
                {
                    sb.Append(cur);
                }
            }
            return sb.ToString();
        }

        /// <summary>
        /// Json Object解析
        /// </summary>
        /// <param name="jsonString"></param>
        /// <returns></returns>
        private JsonObject ParseObject(ref String jsonString)
        {
            return new JsonObject(jsonString);
        }

        /// <summary>
        /// 定义一个索引器，如果属性是非数组的，返回本身
        /// </summary>
        /// <param name="index"></param>
        /// <returns></returns>
        public JsonProperty this[int index]
        {
            get
            {
                JsonProperty r = null;
                if (this._type == JsonPropertyType.Array)
                {
                    if (this._list != null && (this._list.Count - 1) >= index)
                    {
                        r = this._list[index];
                    }
                }
                else if (index == 0)
                {
                    return this;
                }
                return r;
            }
        }

        /// <summary>
        /// 提供一个字符串索引，简化对Object属性的访问
        /// </summary>
        /// <param name="PropertyName"></param>
        /// <returns></returns>
        public JsonProperty this[String PropertyName]
        {
            get
            {
                if (this._type == JsonPropertyType.Object)
                {
                    return this._object[PropertyName];
                }
                else
                {
                    return null;
                }
            }
            set
            {
                if (this._type == JsonPropertyType.Object)
                {
                    this._object[PropertyName] = value;
                }
                else
                {
                    throw new NotSupportedException("Json属性不是对象类型!");
                }
            }
        }

        /// <summary>
        /// JsonObject值
        /// </summary>
        public JsonObject Object
        {
            get
            {
                if (this._type == JsonPropertyType.Object)
                    return this._object;
                return null;
            }
        }

        /// <summary>
        /// 字符串值
        /// </summary>
        public String Value
        {
            get
            {
                if (this._type == JsonPropertyType.String)
                {
                    return this._value;
                }
                else if (this._type == JsonPropertyType.Number)
                {
                    return this._number.ToString();
                }
                else if (this._type == JsonPropertyType.Bool)
                {
                    return this._bool.ToString();
                }
                return null;
            }
        }

        public JsonProperty Add(Object value)
        {
            if (this._type != JsonPropertyType.Null && this._type != JsonPropertyType.Array)
            {
                throw new NotSupportedException("Json属性不是Array类型，无法添加元素!");
            }
            if (this._list == null)
            {
                this._list = new List<JsonProperty>();
            }
            JsonProperty jp = new JsonProperty(value);
            this._list.Add(jp);
            this._type = JsonPropertyType.Array;
            return jp;
        }

        /// <summary>
        /// Array值，如果属性是非数组的，则封装成只有一个元素的数组
        /// </summary>
        public List<JsonProperty> Items
        {
            get
            {
                if (this._type == JsonPropertyType.Array)
                {
                    return this._list;
                }
                else
                {
                    List<JsonProperty> list = new List<JsonProperty>();
                    if (JsonPropertyType.Null != this._type) list.Add(this);
                    return list;
                }
            }
        }

        /// <summary>
        /// 数值
        /// </summary>
        public double Number
        {
            get
            {
                if (this._type == JsonPropertyType.Number)
                {
                    return this._number;
                }
                else
                {
                    return double.NaN;
                }
            }
        }

        public void Clear()
        {
            this._type = JsonPropertyType.Null;
            this._value = String.Empty;
            this._object = null;
            if (this._list != null)
            {
                this._list.Clear();
                this._list = null;
            }
        }

        public Object GetValue()
        {
            if (this._type == JsonPropertyType.String)
            {
                return this._value;
            }
            else if (this._type == JsonPropertyType.Object)
            {
                return this._object;
            }
            else if (this._type == JsonPropertyType.Array)
            {
                return this._list;
            }
            else if (this._type == JsonPropertyType.Bool)
            {
                return this._bool;
            }
            else if (this._type == JsonPropertyType.Number)
            {
                return this._number;
            }
            else
            {
                return null;
            }
        }

        public virtual T GetValue<T>() where T : class
        {
            return (GetValue() as T);
        }

        public virtual void SetValue(Object value)
        {
            if (value is String)
            {
                this._value = (string)value;
                this._type = JsonPropertyType.String;
            }
            else if (value is List<JsonProperty>)
            {
                this._list = ((List<JsonProperty>)value);
                this._type = JsonPropertyType.Array;
            }
            else if (value is JsonObject)
            {
                this._object = (JsonObject)value;
                this._type = JsonPropertyType.Object;
            }
            else if (value is bool)
            {
                this._bool = (bool)value;
                this._type = JsonPropertyType.Bool;
            }
            else if (value == null)
            {
                this._type = JsonPropertyType.Null;
            }
            /*else if (value is JsonProperty)
            {
                JsonProperty val = (JsonProperty)value;
                if (val.Type == JsonPropertyType.Array)
                    this.SetValue(val.Items);
                else
                    this.SetValue(val.Value);
            }*/
            else
            {
                double d = 0;
                if (double.TryParse(value.ToString(), out d))
                {
                    this._number = d;
                    this._type = JsonPropertyType.Number;
                }
                else
                {
                    throw new ArgumentException("错误的参数类型!");
                }
            }
        }

        public virtual int Count
        {
            get
            {
                int c = 0;
                if (this._type == JsonPropertyType.Array)
                {
                    if (this._list != null)
                    {
                        c = this._list.Count;
                    }
                }
                else
                {
                    c = 1;
                }
                return c;
            }
        }

        public JsonPropertyType Type
        {
            get { return this._type; }
        }

        public override string ToString()
        {
            return this.ToString("");
        }

        public virtual string ToString(String format)
        {
            StringBuilder sb = new StringBuilder();
            if (this._type == JsonPropertyType.String)
            {
                sb.Append("\"").Append(this._value.Replace("\"", "\\\"").Replace("\n", "\\n").Replace("\r", "\\r").Replace("\t", "\\t")).Append("\"");
                return sb.ToString();
            }
            else if (this._type == JsonPropertyType.Bool)
            {
                return this._bool ? "true" : "false";
            }
            else if (this._type == JsonPropertyType.Number)
            {
                return this._number.ToString();
            }
            else if (this._type == JsonPropertyType.Null)
            {
                return "null";
            }
            else if (this._type == JsonPropertyType.Object)
            {
                return this._object.ToString();
            }
            else
            {
                if (this._list == null || this._list.Count == 0)
                {
                    sb.Append("[]");
                }
                else
                {
                    sb.Append("[");
                    if (this._list.Count > 0)
                    {
                        foreach (JsonProperty p in this._list)
                        {
                            sb.Append(p.ToString());
                            sb.Append(", ");
                        }
                        sb.Length -= 2;
                    }
                    sb.Append("]");
                }
                return sb.ToString();
            }
        }
        #region tools
        private string ConvertTo(string str, string encode)
        {
            StringBuilder tmpStr = new StringBuilder();
            for (int i = 0; i < str.Length; i++)
            {
                if (str[i] == '\\' && str[i + 1] == 'u')
                {
                    string s1 = str.Substring(i + 2, 2);
                    string s2 = str.Substring(i + 4, 2);
                    int t1 = Convert.ToInt32(s1, 16);
                    int t2 = Convert.ToInt32(s2, 16);
                    byte[] array = new byte[2];
                    array[0] = (byte)t2;
                    array[1] = (byte)t1;
                    string s = System.Text.Encoding.GetEncoding(encode).GetString(array);
                    tmpStr.Append(s);
                    i = i + 5;
                }
                else { tmpStr.Append(str[i]); }
            }
            return tmpStr.ToString();
        }
        #endregion
    }
    #endregion
}


/* JsonObject 用法  */
//通过标准构造函数
/*
    JsonObject json = new JsonObject();
    json["orders"] = new JsonProperty(new JsonObject());
    json["blog"] = new JsonProperty("http://www.cnblogs.com/xfrog");

    JsonObject config = json.Properties<JsonObject>("orders");
    json["orders"]["date"] = new JsonProperty(DateTime.Now.ToLongTimeString());
    json["orders"]["name"] = new JsonProperty("Xfrog");
    json["orders"]["books"] = new JsonProperty();

    JsonProperty book = json["orders"]["books"].Add(new JsonObject());
    book["name"] = new JsonProperty("C# 网络核心编程");
    book["publish"] = new JsonProperty("2010-3-24");

    book = json["orders"]["books"].Add(new JsonObject());
    book["name"] = new JsonProperty("C#入门经典中文版");
    book["publish"] = new JsonProperty("2009-10-16");

    String jsonStr = json.ToString();
    Console.WriteLine("转换后的Json字符串:\r\n" + jsonStr);

    //通过字符串构建Json对象
    JsonObject newObj = new JsonObject(jsonStr);

    Console.WriteLine("获取属性值：");
    //通过泛型函数
    Console.WriteLine(newObj["orders"].GetValue<JsonObject>()["books"].GetValue<List<JsonProperty>>()[1].GetValue<JsonObject>()["name"].Value);
    //通过属性类型对应的属性
    Console.WriteLine(newObj["orders"].Object["books"].Items[1].Object["name"].Value);
    //如果属性为对象类型，可通过字符串索引简化
    Console.WriteLine(newObj["orders"]["books"][1]["name"].Value);

    //通过回调函数简化对象的构建
    JsonObject json2 = new JsonObject((a) =>
    {
        a["orders"] = new JsonProperty(new JsonObject((b) =>
        {
            b["date"] = new JsonProperty(DateTime.Now.ToLongTimeString());
            b["name"] = new JsonProperty("Xfrog");
            b["books"] = new JsonProperty();
            b["books"].Add(new JsonObject((c) =>
            {
                c["name"] = new JsonProperty("C# 网络核心编程");
                c["publish"] = new JsonProperty("2010-3-24");
            }));
            b["books"].Add(new JsonObject((c) =>
            {
                c["name"] = new JsonProperty("C#入门经典中文版");
                c["publish"] = new JsonProperty("2009-10-16");
            }));
        }));
        a["blog"] = new JsonProperty("http://www.cnblogs.com/xfrog");
    });

    Console.WriteLine("通过回调函数构建Json对象:\r\n" + json2.ToString());

    Console.Read();
*/
