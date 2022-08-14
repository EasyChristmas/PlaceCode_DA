using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;

namespace Util
{
    /// <summary>
    /// Http 请求的结果
    /// </summary>
    public class HttpResult : IActionResult
    {
        /// <summary>
        /// 状态码值
        /// </summary>
        public int StatusCode { get; set; }

        /// <summary>
        /// 内容
        /// </summary>
        public string Content { get; set; } = string.Empty;

        public HttpResult()
        {
            ;
        }

        /// <summary>
        /// 构造方法
        /// </summary>
        /// <param name="statusCode">状态码</param>
        public HttpResult(HttpStatusCode statusCode)
        {
            StatusCode = (int)statusCode;
        }

        /// <summary>
        /// 构造方法
        /// </summary>
        /// <param name="statusCode">状态码</param>
        /// <param name="content">返回内容</param>
        public HttpResult(HttpStatusCode statusCode, string content)
        {
            StatusCode = (int)statusCode;
            Content = content;
        }

        /// <summary>
        /// 构造方法
        /// </summary>
        /// <param name="code">状态码</param>
        /// <param name="content">返回内容</param>
        public HttpResult(int code, string content)
        {
            StatusCode = code;
            Content = content;
        }

        /// <summary>
        /// 执行结果
        /// </summary>
        /// <param name="context"></param>
        public void ExecuteResult(ActionContext context)
        {
            var res = context.HttpContext.Response;
            res.StatusCode = StatusCode;
            res.ContentType = "application/json;charset=utf-8";
            res.WriteAsync(Content);
        }

        /// <summary>
        /// 异步执行结果
        /// </summary>
        /// <param name="context"></param>
        public Task ExecuteResultAsync(ActionContext context)
        {
            var res = context.HttpContext.Response;
            res.StatusCode = StatusCode;
            res.ContentType = "application/json;charset=utf-8";
            return res.WriteAsync(Content);
        }
    }
}
