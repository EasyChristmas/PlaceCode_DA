using System;
using System.Collections.Generic;
using Back.Controllers;
using System.Linq;
using Util;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Back.Filters
{
    /// <summary>
    /// 页面特性
    /// </summary>
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = false, Inherited = true)]
    public class ViewAttribute : ActionFilterAttribute
    {
        /// <summary>
        /// 页面执行前
        /// </summary>
        /// <param name="filterContext"></param>
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            //身份验证控制器
            var authController = filterContext.Controller as AuthController;
            if (authController != null)
            {
                //当前用户
                authController.ViewBag.CurrentUser = (dynamic)authController.CurrentUser;

                authController.ViewBag.ImgHost = "http://rescdn.xiaohu.in/";
                authController.ViewBag.TimeStamp = authController.TimeStamp;
                authController.ViewBag.SwitchAdminList = JsonHelper.ToJson(authController.CurrentUser.SwitchAdminList);
            }

            //基础控制器
            var baseController = filterContext.Controller as BaseController;
            if (baseController != null)
            {
                //版本号
                baseController.ViewBag.Version = BaseController.FileVersion;
                baseController.ViewBag.EnvironmentName = BaseController.Environment.EnvironmentName;

#if DEBUG
                baseController.ViewBag.Version = DateTime.Now.Ticks;
#endif
            }

            base.OnActionExecuting(filterContext);
        }
    }
}