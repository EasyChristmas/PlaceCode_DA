using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using Util;
using System.IO;
using System.Net;
using System.Net.Sockets;
using SDK;
using Back.Filters;
using System.Text;

namespace Back.Controllers
{
    [Auth]
    public class ApiController : BaseController
    {
        [Route("/api/{module}/{function?}/{route?}/{id?}")]
        public IActionResult Index(string module, string function, string route, int? id)
        {
            //身份授权
            var auth = ApiSign;
            //API 地址
            var apiUrl = ApiHost;
            //API 资源
            var url = module + (string.IsNullOrWhiteSpace(function) ? "" : "/" + function) + (string.IsNullOrWhiteSpace(route) ? "" : "/" + route) + (id.HasValue ? "/" + id.Value : "");
            var method = Request.Method.ToUpper();
            HttpResponseMessage message = null;
            var dict = new Dictionary<string, string>() { { "Authorization", auth } };
            try
            {
                if (method == "GET")
                {
                    message = WebHelper.RequestApi(apiUrl + url + Request.QueryString, HttpMethod.Get, dict);
                }
                else if (method == "POST")
                {
                    var bodyStr = string.Empty;
                    using (var reader = new StreamReader(Request.Body))
                    {
                        bodyStr = reader.ReadToEnd();
                    }
                    message = WebHelper.RequestApi(apiUrl + url, HttpMethod.Post, dict, bodyStr);
                }
                else if (method == "PUT")
                {
                    var bodyStr = string.Empty;
                    using (var reader = new StreamReader(Request.Body))
                    {
                        bodyStr = reader.ReadToEnd();
                    }
                    message = WebHelper.RequestApi(apiUrl + url, HttpMethod.Put, dict, bodyStr);
                }
                else if (method == "DELETE")
                {
                    message = WebHelper.RequestApi(apiUrl + url + Request.QueryString, HttpMethod.Delete, dict);
                }
            }
            catch (SocketException socketException)
            {
                LogHelper.Error("Back里请求Api出错", socketException);
                return new HttpResult(HttpStatusCode.InternalServerError, "API服务连接失败，" + socketException.Message);
            }
            try
            {
                HttpResponseMessage httpContent = message;
                var statusCode = httpContent.StatusCode;
                var result = httpContent.Content.ReadAsStringAsync().Result;
                return new HttpResult(statusCode, result);
            }
            catch (Exception ex)
            {
                LogHelper.Error("Back里请求Api获取响应结果出错", ex);
                return new HttpResult(HttpStatusCode.InternalServerError, "API请求失败，" + ex.Message);
            }
        }
    }
}
