using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Reflection;
using System.Security.Claims;
using System.Threading.Tasks;
using Back.Controllers;
using Microsoft.Net.Http.Headers;
using Util;
using SDK;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc;
using System.Runtime.Serialization.Formatters.Binary;
using System.IO;
using Microsoft.AspNetCore.Http;
using System.Text;

namespace Back.Filters
{
    /// <summary>
    /// 身份认证特性
    /// </summary>
    public class AuthAttribute : ActionFilterAttribute
    {
        public override Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            //if (!context.HttpContext.Request.IsHttps)
            //{
            //    var request = context.HttpContext.Request;
            //    var url = new StringBuilder().Append("https")
            //    .Append("://")
            //    .Append(request.Host)
            //    .Append(request.PathBase)
            //    .Append(request.Path)
            //    .Append(request.QueryString)
            //    .ToString();

            //    context.Result = new RedirectResult(url.ToString());
            //}

            var claim = context.HttpContext.User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Sid);
            var id = claim?.Value;
            ApplicationUser user = null;
            if (claim != null)
            {
                //user = BaseController.csRedis.GetHash<ApplicationUser>("blockchain-user-online", id.ToString());
            }
            if (user == null && context.Filters.Select(x => x.ToString()).All(x => x != "Microsoft.AspNet.Mvc.Filters.AllowAnonymousFilter" && x != "Microsoft.AspNetCore.Mvc.Authorization.AllowAnonymousFilter"))
            {
                   var accept = context.HttpContext.Request.Headers["Accept"].FirstOrDefault();
                if (!string.IsNullOrEmpty(accept) && accept.IndexOf("application/json", StringComparison.Ordinal) >= 0)
                {
                    //return base.OnActionExecutionAsync(context, next);
                }
                else
                {
                    context.Result = new ContentResult { Content = "<script>window.top.location.href='/account/login'</script>", ContentType = "text/html" };
                }
            }
            return base.OnActionExecutionAsync(context, next);
        }

        ///// <summary>
        ///// 重写身份认证
        ///// </summary>
        ///// <param name="context"></param>
        //public override void OnAuthorization(AuthorizationContext context)
        //{
        //    var claim = context.HttpContext.User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Sid);
        //    var id = claim?.Value;
        //    ApplicationUser user = null;
        //    if (claim != null)
        //        user = BaseController.redis.GetHashSet<ApplicationUser>("user-online", id.ToString());

        //    if (user == null && context.Filters.Select(x => x.ToString()).All(x => x != "Microsoft.AspNet.Mvc.Filters.AllowAnonymousFilter"))
        //    {


        //        //var session = context.HttpContext.Session.GetString("ERP_ApplicationUser");

        //        //判断是否登录及是否需要授权
        //        //    if (string.IsNullOrEmpty(session) && context.Filters.Select(x => x.ToString()).All(x => x != "Microsoft.AspNet.Mvc.Filters.AllowAnonymousFilter"))
        //        //{
        //        var accept = context.HttpContext.Request.Headers["Accept"].FirstOrDefault();
        //        if (!string.IsNullOrEmpty(accept) && accept.IndexOf("application/json", StringComparison.Ordinal) >= 0)
        //            context.Result = new HttpUnauthorizedResult();
        //        else
        //        {
        //            context.Result = new ContentResult { Content = "<script>window.top.location.href='/account/login'</script>", ContentType = MediaTypeHeaderValue.Parse("text/html") };
        //        }
        //    }

        //    base.OnAuthorization(context);
        //}
    }
}
