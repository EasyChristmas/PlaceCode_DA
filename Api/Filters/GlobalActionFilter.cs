﻿using Microsoft.AspNetCore.Mvc.Filters;

namespace Api.Filters
{
    public class GlobalActionFilter : IActionFilter
    {
        public void OnActionExecuted(ActionExecutedContext context)
        {
            //LogHelper.Info("OnActionExecuted");
            //执行方法后执行这
        }

        public void OnActionExecuting(ActionExecutingContext context)
        {
            //LogHelper.Info("OnActionExecuting");
            //执行方法前先执行这
        }
    }
}
