using Microsoft.AspNetCore.Mvc.Filters;

namespace Api.Filters
{
    /// <summary>
    /// 过滤权限验证
    /// </summary>
    public class lgnorePowerFilter : IActionFilter
    {
        public void OnActionExecuted(ActionExecutedContext context)
        {
        }

        public void OnActionExecuting(ActionExecutingContext context)
        {
        }
    }
}
