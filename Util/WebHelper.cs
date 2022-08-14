using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Security;
using System.Net.Sockets;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web;

namespace Util
{
    /// <summary>
    /// Web 辅助类
    /// </summary>
    public static class WebHelper
    {
        /// <summary>
        /// 公用一个HttpClient对象
        /// </summary>
        static HttpClient httpClient;

        static WebHelper()
        {
            var handler = new HttpClientHandler() { AutomaticDecompression = DecompressionMethods.GZip, UseProxy = false };
            httpClient = new HttpClient(handler);
            httpClient.DefaultRequestHeaders.Add("user-agent", "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.2; SV1; .NET CLR 1.1.4322; .NET CLR 2.0.50727)");
            AppContext.SetSwitch("System.Net.Http.useSocketsHttpHandler", false);
        }

        /// <summary>
        ///请求--共享一个HttpClient
        /// </summary>
        /// <typeparam name="T">返回的泛型</typeparam>
        /// <param name="url">请求的 API 路径</param>
        /// <param name="httpMethod">谓词方法</param>
        /// <param name="dict">请求头键值对</param>
        /// <param name="body">内容</param>
        /// <returns>返回的实体对象</returns>
        public async static Task<T> RequestAsync<T>(string url, HttpMethod httpMethod, Dictionary<string, string> dict, string body = null) where T : class
        {
            var request = new HttpRequestMessage(httpMethod, new Uri(url, UriKind.Absolute));
            if (dict != null)
            {
                foreach (var item in dict)
                {
                    request.Headers.Add(item.Key, item.Value);
                }
            }
            
            HttpResponseMessage message = null;
            var method = httpMethod.Method.ToUpper();
            try
            {
                if (method == "GET" || method == "DELETE")
                {
                    message = await httpClient.SendAsync(request);
                }
                else if (method == "POST" || method == "PUT")
                {
                    var content = new StringContent(body);
                    //content.Headers.Add("ContentType", "application/json");
                    content.Headers.ContentType = new MediaTypeHeaderValue("application/json");
                    request.Content = content;
                    message = await httpClient.SendAsync(request);
                }
            }
            catch (SocketException ex)
            {
                LogHelper.Error($"RequestAsync请求错误", ex);
                throw ex;
            }
            //message.EnsureSuccessStatusCode();
            var contentResult = await message.Content.ReadAsStringAsync();
            if (message.IsSuccessStatusCode && message.StatusCode == HttpStatusCode.OK)
            {
                return JsonHelper.ParseJson<T>(contentResult);
            }
            throw new Exception(contentResult);
        }

        /// <summary>
        ///请求--共享一个HttpClient
        /// </summary>
        /// <typeparam name="T">返回的泛型</typeparam>
        /// <param name="url">请求的 API 路径</param>
        /// <param name="httpMethod">谓词方法</param>
        /// <param name="dict">请求头键值对</param>
        /// <param name="body">内容</param>
        /// <returns>返回的实体对象</returns>
        public static T Request<T>(string url, HttpMethod httpMethod, Dictionary<string, string> dict, string body = null) where T : class
        {
            var request = new HttpRequestMessage(httpMethod, new Uri(url, UriKind.Absolute));
            if (dict != null)
            {
                foreach (var item in dict)
                {
                    request.Headers.Add(item.Key, item.Value);
                }
            }
            HttpResponseMessage message = null;
            var method = httpMethod.Method.ToUpper();
            try
            {
                if (method == "GET" || method == "DELETE")
                {
                    message = httpClient.SendAsync(request).Result;
                }
                else if (method == "POST" || method == "PUT")
                {
                    var content = new StringContent(body);
                    content.Headers.Add("ContentType", "application/json");
                    request.Content = content;
                    message = httpClient.SendAsync(request).Result;
                }
            }
            catch (SocketException ex)
            {
                LogHelper.Error($"RequestAsync请求错误", ex);
                throw ex;
            }
            //message.EnsureSuccessStatusCode();
            var contentResult = message.Content.ReadAsStringAsync().Result;
            if (message.IsSuccessStatusCode && message.StatusCode == HttpStatusCode.OK)
            {
                return JsonHelper.ParseJson<T>(contentResult);
            }
            throw new Exception(contentResult);
        }


        /// <summary>
        ///请求--共享一个HttpClient
        /// </summary>
        /// <typeparam name="T">返回的泛型</typeparam>
        /// <param name="url">请求的 API 路径</param>
        /// <param name="httpMethod">谓词方法</param>
        /// <param name="dict">请求头键值对</param>
        /// <param name="body">内容</param>
        /// <returns>返回的实体对象</returns>
        public async static Task<HttpResponseMessage> RequestApiAsync(string url, HttpMethod httpMethod, Dictionary<string, string> dict, string body = null)
        {
            var request = new HttpRequestMessage(httpMethod, new Uri(url, UriKind.Absolute))
            {
                Version = HttpVersion.Version10
            }
            ;
            if (dict != null)
            {
                foreach (var item in dict)
                {
                    request.Headers.Add(item.Key, item.Value);
                }
            }
            HttpResponseMessage message = null;
            var method = httpMethod.Method.ToUpper();

            try
            {
                if (method == "GET" || method == "DELETE")
                {
                    message = await httpClient.SendAsync(request);
                }
                else if (method == "POST" || method == "PUT")
                {
                    var content = new StringContent(body);
                    content.Headers.Add("ContentType", "application/json");
                    request.Content = content;
                    message = await httpClient.SendAsync(request);
                }
            }
            catch (SocketException ex)
            {
                LogHelper.Error($"RequestApiAsync请求错误", ex);
                throw ex;
            }
            return message;
        }

        /// <summary>
        ///请求--共享一个HttpClient
        /// </summary>
        /// <typeparam name="T">返回的泛型</typeparam>
        /// <param name="url">请求的 API 路径</param>
        /// <param name="httpMethod">谓词方法</param>
        /// <param name="dict">请求头键值对</param>
        /// <param name="body">内容</param>
        /// <returns>返回的实体对象</returns>
        public static HttpResponseMessage RequestApi(string url, HttpMethod httpMethod, Dictionary<string, string> dict, string body = null)
        {
            var request = new HttpRequestMessage(httpMethod, new Uri(url, UriKind.Absolute));
            if (dict != null)
            {
                foreach (var item in dict)
                {
                    request.Headers.Add(item.Key, item.Value);
                }
            }
            HttpResponseMessage message = null;
            var method = httpMethod.Method.ToUpper();
            try
            {
                if (method == "GET" || method == "DELETE")
                {
                    message = httpClient.SendAsync(request).Result;
                }
                else if (method == "POST" || method == "PUT")
                {
                    var content = new StringContent(body);
                    content.Headers.Add("ContentType", "application/json");
                    request.Content = content;
                    message = httpClient.SendAsync(request).Result;
                }
            }
            catch (SocketException ex)
            {
                LogHelper.Error($"RequestApi请求错误", ex);
                throw ex;
            }
            return message;
        }
        /// <summary>
        /// POST请求WebService
        /// </summary>
        /// <param name="url"></param>
        /// <param name="param"></param>
        /// <returns></returns>
        public async static Task<HttpResponseMessage> RequestWebServicePost(string url, List<KeyValuePair<string, string>> param)
        {
            HttpResponseMessage message = null;
            var request = new HttpRequestMessage(HttpMethod.Post, new Uri(url, UriKind.Absolute));
            if (!(param != null && param.Count > 0))
            {
                LogHelper.Error("RequestWebServicePost请求错误,参数不能为空");
                throw new Exception("请求的参数不能为空");
            }
            try
            {
                var content = new FormUrlEncodedContent(param);
                //WebService接口ContentType
                content.Headers.Add("ContentType", "application/x-www-form-urlencoded");
                request.Content = content;
                message = await httpClient.SendAsync(request);
            }
            catch (Exception ex)
            {
                LogHelper.Error($"RequestWebServicePost请求错误", ex);
                throw ex;
            }
            return message;
        }
        /// <summary>
        /// 请求WebService
        /// </summary>
        /// <param name="url"></param>
        /// <param name="param"></param>
        /// <returns></returns>
        public async static Task<T> KeyValueRequestWebService<T>(string url, HttpMethod httpMethod, Dictionary<string, string> param) where T : class
        {
            var request = new HttpRequestMessage(httpMethod, new Uri(url, UriKind.Absolute));
            HttpResponseMessage message = null;
            var method = httpMethod.Method.ToUpper();
            try
            {
                if (method == "GET" || method == "DELETE")
                {
                    message = await httpClient.SendAsync(request);
                }
                else if (method == "POST" || method == "PUT")
                {
                    var content = new FormUrlEncodedContent(param);
                    //WebService接口ContentType
                    content.Headers.Add("ContentType", "application/x-www-form-urlencoded");
                    request.Content = content;
                    message = await httpClient.SendAsync(request);
                }
            }
            catch (SocketException ex)
            {
                LogHelper.Error($"RequestAsync请求错误", ex);
                throw ex;
            }
            var contentResult = await message.Content.ReadAsStringAsync();
            if (message.IsSuccessStatusCode && message.StatusCode == HttpStatusCode.OK)
            {
                return JsonHelper.ParseJson<T>(contentResult);
            }
            throw new Exception(contentResult);
        }
        /// <summary>
        /// Post方式提交数据，返回网页的源代码
        /// </summary>
        /// <param name="url">发送请求的 URL</param>
        /// <param name="param">请求的参数集合</param>
        /// <returns>远程资源的响应结果</returns>
        public static string keyValueSendPost(string url, Dictionary<string, string> param, string methodName)
        {
            string result = "";
            StringBuilder postData = new StringBuilder();
            if (param != null && param.Count > 0)
            {
                foreach (var p in param)
                {
                    if (postData.Length > 0)
                    {
                        postData.Append("&");
                    }
                    postData.Append(p.Key);
                    postData.Append("=");
                    postData.Append(p.Value);
                }
            }
            LogHelper.Info(methodName + ":" + postData.ToString());
            byte[] byteData = Encoding.GetEncoding("UTF-8").GetBytes(postData.ToString());
            try
            {
                HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
                request.ContentType = "application/x-www-form-urlencoded";
                request.Referer = url;
                request.Accept = "*/*";
                request.Timeout = 30 * 1000;
                request.UserAgent = "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 2.0.50727; .NET CLR 3.0.04506.648; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729)";
                request.Method = "POST";
                request.ContentLength = byteData.Length;
                Stream stream = request.GetRequestStream();
                stream.Write(byteData, 0, byteData.Length);
                stream.Flush();
                stream.Close();
                HttpWebResponse response = (HttpWebResponse)request.GetResponse();
                Stream backStream = response.GetResponseStream();
                StreamReader sr = new StreamReader(backStream, Encoding.GetEncoding("UTF-8"));
                result = sr.ReadToEnd();
                sr.Close();
                backStream.Close();
                response.Close();
                request.Abort();
            }
            catch (Exception ex)
            {
                LogHelper.Error($"keyValueSendPost请求错误", ex);
                throw ex;
            }
            LogHelper.Info(methodName + ":" + result);
            return result;
        }

        #region GET 请求：Get

        /// <summary>
        /// 执行HTTP GET请求
        /// </summary>
        /// <param name="url">请求地址</param>
        /// <param name="encoding">编码，为 null 则为默认编码</param>
        /// <returns>HTTP响应</returns>
        /// <exception cref="ArgumentNullException">Url为空时抛出异常ArgumentNullException</exception>
        /// <exception cref="Exception">异常Exception</exception>
        public static async Task<string> Get(string url, Encoding encoding = null)
        {
            if (string.IsNullOrEmpty(url))
            {
                throw new Exception("参数不能为空！");
            }
            try
            {
                var result = await httpClient.GetStringAsync(url);
                return result;
            }
            catch (Exception ex)
            {
                throw new Exception("GET请求发生异常：" + ex.Message);
            }
        }

        public static async Task<string> HttpGetAsync(string url, Encoding encoding = null)
        {
            if (string.IsNullOrEmpty(url))
            {
                throw new Exception("参数不能为空！");
            }
            if (encoding == null)
                encoding = Encoding.Default;
            try
            {
                var result = await httpClient.GetByteArrayAsync(url);
                return encoding.GetString(result);
            }
            catch (Exception ex)
            {
                throw new Exception("GET请求发生异常：" + ex.Message);
            }
        }

        /// <summary>
        /// 执行HTTP GET请求
        /// </summary>
        /// <param name="url">请求地址</param>
        /// <param name="encoding">编码，为 null 则为默认编码</param>
        /// <returns>HTTP响应</returns>
        /// <exception cref="ArgumentNullException">Url为空时抛出异常ArgumentNullException</exception>
        /// <exception cref="Exception">异常Exception</exception>
        public static async Task<TResult> Get<TResult>(string url, Encoding encoding = null) where TResult : class
        {
            if (string.IsNullOrEmpty(url))
            {
                throw new Exception("参数不能为空！");
            }
            try
            {
                var result = await httpClient.GetStringAsync(url);
                var obj = JsonConvert.DeserializeObject<TResult>(result);
                return obj;
            }
            catch (Exception ex)
            {
                throw new Exception("GET请求发生异常：" + ex.Message);
            }
        }

        #endregion


        /// <summary>
        /// 网络文件转换为字节
        /// </summary>
        /// <param name="url">网络文件地址</param>
        /// <returns></returns>
        public static async Task<byte[]> GetByteArrayByWebFileUrl(string url)
        {
            try
            {
                var bytes = await httpClient.GetByteArrayAsync(url);
                return bytes;
            }
            catch (Exception ex)
            {
                throw new Exception($"发生异常：URL={url}-----{ ex.Message}");
            }
        }

        /// <summary>
        /// 请求流数据
        /// </summary>
        /// <param name="url"></param>
        /// <param name="dict"></param>
        /// <param name="body"></param>
        /// <returns></returns>
        public static async Task<Stream> RequestStreamAsync(string url, HttpMethod httpMethod, Dictionary<string, string> dict, string body = null)
        {
            var request = new HttpRequestMessage(httpMethod, new Uri(url, UriKind.Absolute));
            if (dict != null)
            {
                foreach (var item in dict)
                {
                    request.Headers.Add(item.Key, item.Value);
                }
            }
            HttpResponseMessage message = null;
            var method = httpMethod.Method.ToUpper();
            try
            {
                if (method == "GET" || method == "DELETE")
                {
                    message = await httpClient.SendAsync(request);
                }
                else if (method == "POST" || method == "PUT")
                {
                    var content = new StringContent(body);
                    content.Headers.Add("ContentType", "application/json");
                    request.Content = content;
                    message = await httpClient.SendAsync(request);
                }
            }
            catch (SocketException ex)
            {
                LogHelper.Error($"RequestAsync请求错误", ex);
                throw ex;
            }
            //message.EnsureSuccessStatusCode();
            var contentResult = await message.Content.ReadAsStreamAsync();
            return contentResult;
        }


        /// <summary>
        /// 发起POST请求
        /// </summary>
        /// <param name="url">请求地址</param>
        /// <param name="contentType"></param>
        /// <param name="postData">传入请求数据</param>
        /// <param name="cookie">Cookie值</param>
        /// <param name="cert">证书路径，绝对路径</param>
        /// <param name="certPwd">证书密码</param>
        /// <returns>返回的数据</returns>
        /// <remarks>如果有证书，服务器端在IIS程序池高级设置中设置加载用户配置文件为True</remarks>
        public static string Post(string url, string contentType = null, string postData = null, Cookie cookie = null, string cert = null, string certPwd = null, WebHeaderCollection headers = null)
        {
            var rsp = PostR(url, contentType, postData, cookie, cert, certPwd, headers);
            return GetResponseData(rsp);
        }
        public static async Task<TResult> Post<TResult>(string url, string postData = null, string contentType = "application/json") where TResult : class
        {
            if (string.IsNullOrEmpty(url))
            {
                throw new Exception("参数不能为空！");
            }
            try
            {
                byte[] array = Encoding.UTF8.GetBytes(postData);
                MemoryStream stream = new MemoryStream(array);             //convert stream 2 string    

                var content = new StreamContent(stream);
                content.Headers.Add("ContentType", "application/json");
                var message = await httpClient.PostAsync(url, content);
                HttpResponseMessage httpContent = message;
                var result = httpContent.Content.ReadAsStringAsync().Result;
                var obj = JsonConvert.DeserializeObject<TResult>(result);
                return obj;
            }
            catch (Exception ex)
            {
                throw new Exception("Post请求发生异常：" + ex.Message);
            }
        }

        /// <summary>
        /// 发起POST请求
        /// </summary>
        /// <param name="url">请求地址</param>
        /// <param name="contentType"></param>
        /// <param name="postData">传入请求数据</param>
        /// <param name="cookie">Cookie值</param>
        /// <param name="cert">证书路径，绝对路径</param>
        /// <param name="certPwd">证书密码</param>
        /// <returns>返回的响应</returns>
        /// <remarks>如果有证书，服务器端在IIS程序池高级设置中设置加载用户配置文件为True</remarks>
        public static WebResponse PostR(string url, string contentType = null, string postData = null,
            Cookie cookie = null, string cert = null, string certPwd = null, WebHeaderCollection headers = null)
        {
            var webRequest = WebRequest.Create(url) as HttpWebRequest;
            if (headers != null) if (webRequest != null) webRequest.Headers = headers;
            webRequest.UserAgent = "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 5.1; Trident/4.0; .NET CLR 2.0.50727; .NET CLR 3.0.04506.648; .NET CLR 3.5.21022)";
            webRequest.Method = "POST";
            //webRequest.ServicePoint.Expect100Continue = false;
            webRequest.Timeout = 200000;
            //webRequest.KeepAlive = true;
            if (cookie != null)
            {
                webRequest.CookieContainer = new CookieContainer();
                webRequest.CookieContainer.Add(cookie);
            }
            if (string.IsNullOrEmpty(contentType))
            {
                webRequest.ContentType = "application/x-www-form-urlencoded";
            }
            else
            {
                webRequest.ContentType = contentType;
            }
            if (!string.IsNullOrWhiteSpace(cert) && !string.IsNullOrWhiteSpace(certPwd))
            {
                ServicePointManager.ServerCertificateValidationCallback = CheckValidationResult;
                var cer = new X509Certificate(cert, certPwd);
                webRequest.ClientCertificates.Add(cer);
            }
            if (!string.IsNullOrEmpty(postData))
            {
                StreamWriter requestWriter = null;
                requestWriter = new StreamWriter(webRequest.GetRequestStream());
                try
                {
                    requestWriter.Write(postData);
                }
                catch (Exception e)
                {
                    throw e;
                }
                finally
                {
                    requestWriter.Close();
                    requestWriter.Dispose();
                }
            }
            return webRequest.GetResponse();
        }

        /// <summary>
        /// 获取响应的字符串数据
        /// </summary>
        /// <param name="response">响应</param>
        /// <returns></returns>
        private static string GetResponseData(WebResponse response)
        {
            StreamReader responseReader = null;
            string responseData = "";
            try
            {
                responseReader = new StreamReader(response.GetResponseStream());
                responseData = responseReader.ReadToEnd();
            }
            catch (Exception e)
            {
                throw e;
            }
            finally
            {
                if (responseReader != null)
                {
                    responseReader.Close();
                    responseReader.Dispose();
                }
            }
            return responseData;
        }

        /*CheckValidationResult的定义*/
        private static bool CheckValidationResult(object sender, X509Certificate certificate, X509Chain chain, SslPolicyErrors errors)
        {
            if (errors == SslPolicyErrors.None)
                return true;
            return false;
        }

        /// <summary>
        /// 组装普通文本请求参数。
        /// </summary>
        /// <param name="parameters">请求参数json</param>
        /// <returns>URL编码后的请求数据</returns>
        public static string BuildQuery(object json)
        {
            var paramJson = json.ToJson().Replace("{}", "");
            if (string.IsNullOrEmpty(paramJson))
                return null;

            StringBuilder query = new StringBuilder();
            bool hasParam = false;

            JsonObject paramJsonObject = new JsonObject(paramJson);
            foreach (var item in paramJsonObject.GetPropertyNames())
            {
                string name = item;
                string value = paramJsonObject[item].ToString().Replace("\"", "");

                // 忽略参数名或参数值为空的参数
                if (!string.IsNullOrEmpty(name) && !string.IsNullOrEmpty(value))
                {
                    if (hasParam)
                    {
                        query.Append("&");
                    }
                    query.Append(name);
                    query.Append("=");
                    query.Append(HttpUtility.UrlEncode(value, Encoding.UTF8));
                    hasParam = true;
                }
            }
            return query.ToString();
        }

        public static string GetParam(string param, string name)
        {
            if (param.Length > 0 && (param.Substring(0, 1)) == "?")
            {
                param = ("&" + param.Substring(1));
            }

            // 开始分析参数对  
            Regex re = new Regex(@"(^|&)" + name + "=([^&]+)(&|$)?", RegexOptions.Compiled);
            MatchCollection mc = re.Matches(param);
            var nvc = new NameValueCollection();
            foreach (Match m in mc)
            {
                return m.Result("$2");
            }
            return null;
        }

        public static TResult UpLoadFile<TResult>(string url, byte[] fileBytes, string fileName)
        {
            var result = string.Empty;
            var request = (HttpWebRequest)WebRequest.Create(url);
            var boundary = "----------" + DateTime.Now.Ticks.ToString("x");
            request.ContentType = "multipart/form-data; boundary=" + boundary;
            request.Method = "POST";
            using (Stream requestStream = request.GetRequestStreamAsync().Result)
            {
                byte[] boundarybytes = Encoding.UTF8.GetBytes("--" + boundary + "\r\n");
                byte[] trailer = Encoding.UTF8.GetBytes("\r\n--" + boundary + "–-\r\n");

                requestStream.Write(boundarybytes, 0, boundarybytes.Length);
                var header = $"Content-Disposition:form-data;name=\"media\";filename=\"{fileName}\"\r\nfilelength=\"{fileBytes.Length}\"\r\nContent-Type:application/octet-stream\r\n\r\n";
                byte[] postHeaderBytes = Encoding.UTF8.GetBytes(header.ToString());
                requestStream.Write(postHeaderBytes, 0, postHeaderBytes.Length);
                requestStream.Write(fileBytes, 0, fileBytes.Length);
                requestStream.Write(trailer, 0, trailer.Length);
            }
            var response = (HttpWebResponse)request.GetResponseAsync().Result;
            var responseStream = response.GetResponseStream();
            using (var streamReader = new StreamReader(response.GetResponseStream()))
            {
                result = streamReader.ReadToEnd();
            }
            return JsonConvert.DeserializeObject<TResult>(result);
        }


        #region 获取客户端真实IP地址 ： GetClientIp

        /// <summary>
        /// 获取客户端真实IP地址
        /// </summary>
        /// <returns>string</returns>
        public static string GetClientIp(Microsoft.AspNetCore.Http.HttpContext context)
        {
            //相当于asp.net的 "HTTP_X_FORWARDED_FOR"
            //先从代理获取IP
            var ip = context.Request.Headers["X-Forwarded-For"].FirstOrDefault();
            if (!string.IsNullOrEmpty(ip))
            {
                //SDK.Log. SDK.Log.LogHelper.Info("X-Forwarded-For获取到的IP:" + ip);
            }
            else
            {
                //获取客户端IP
                ip = context.Connection.RemoteIpAddress.ToString();
                //SDK.Log. SDK.Log.LogHelper.Info("RemoteIpAddress获取到的IP:" + ip);
            }
            //特殊处理--因为对方有可能返回两个ip，格式是前者是实际ip，后者不知道是什么ip，以前者为准
            ip = (ip + ",").Split(',').FirstOrDefault();
            //特殊处理--因为对方有可能返回带端口号的，格式为118.22.3.44:3322 ，只取Ip去除端口号
            ip = (ip + ":").Split(':').FirstOrDefault();
            //SDK.Log. SDK.Log.LogHelper.Info("返回的IP:" + ip);
            return ip;
        }

        #endregion

        /// <summary>
        /// 生成时间戳，标准北京时间，时区为东八区，自1970年1月1日 0点0分0秒以来的秒数，返回毫秒数
        /// </summary>
        /// <returns>时间戳</returns>
        public static string GenerateTimeStamp()
        {
            TimeSpan ts = DateTime.UtcNow - new DateTime(1970, 1, 1, 0, 0, 0, 0);
            return Convert.ToInt64(ts.TotalMilliseconds).ToString();
        }

        /// <summary>
        /// 生成随机串，随机串包含字母或数字
        /// </summary>
        /// <returns>随机串</returns>
        public static string GenerateNonceStr()
        {
            return Guid.NewGuid().ToString().Replace("-", "");
        }

        /// <summary>
        /// 生成订单号
        /// </summary>
        /// <returns></returns>
        public static string GenerateOrderNo()
        {
            return $"{ DateTime.Now.ToString("yyyyMMddHHmmss")}{ new Random().Next(1000, 9999)}";
        }

        /// <summary>
        /// 生成制定位数的随机码
        /// </summary>
        /// <param name="length"></param>
        /// <returns></returns>
        public static string GenerateRandomCode(int length)
        {
            string allChar = "0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F,G,H,I,G,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z";
            string[] allCharArray = allChar.Split(',');
            string randomCode = "";
            int temp = -1;
            Random rand = new Random();
            for (int i = 0; i < length; i++)
            {
                if (temp != -1)
                {
                    rand = new Random(i * temp * ((int)DateTime.Now.Ticks));
                }
                int t = rand.Next(35);
                if (temp == t)
                {
                    return GenerateRandomCode(length);
                }
                temp = t;
                randomCode += allCharArray[t];
            }
            return randomCode;
        }

    }
}
