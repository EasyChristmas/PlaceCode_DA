using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Reflection;
using System.Threading.Tasks;
using Util;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Back.Filters
{
    /// <summary>
    /// 错误特性
    /// </summary>
    public class ErrorAttribute : ExceptionFilterAttribute
    {
        public override Task OnExceptionAsync(ExceptionContext context)
        {
            var logger = context.HttpContext.RequestServices.GetRequiredService<ILogger<ErrorAttribute>>();
            logger.LogError(
                context.Exception,
                $"Path{context.HttpContext.Request.Path} ErrorMsg:{context.Exception.Message} Connection:{context.HttpContext.TraceIdentifier}");

            Exception lastException = context.Exception.GetBaseException();

            string errorMsg = lastException.Message;
            if (GlobalData.Environment.IsProduction())
            {
                errorMsg = "系统出现异常,请联系管理员！";
            }
            context.Result = new HttpResult(HttpStatusCode.InternalServerError, errorMsg);
            return base.OnExceptionAsync(context);
        }
    }
}
