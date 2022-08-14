using SDK;
using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Net;
using System.Threading.Tasks;
using Util;
using LogHelper = SDK.Log.LogHelper;

namespace Api.Filters
{
    /// <summary>
    /// 错误特性
    /// </summary>
    public class ExceptionFilter : IExceptionFilter
    {
        public void OnException(ExceptionContext context)
        {
            LogHelper.Error(context.ExceptionDispatchInfo.SourceException.Message, context.ExceptionDispatchInfo.SourceException);

            Exception lastException = context.Exception.GetBaseException();
            string errorMsg = lastException.Message;
            if (ApiGlobalData.IsProduction)
            {
                errorMsg = "系统出现异常,请联系管理员！";
            }
            context.Result = new HttpResult(HttpStatusCode.InternalServerError, errorMsg);
        }
    }
}
