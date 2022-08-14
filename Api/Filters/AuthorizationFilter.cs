using Api.Controllers;
using Service;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Filters;
using Newtonsoft.Json;
using System;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Util;

namespace Api.Filters
{
    public class AuthorizationFilter : IActionFilter
    {

        public void OnActionExecuted(ActionExecutedContext context)
        {
        }

        public void OnActionExecuting(ActionExecutingContext context)
        {
            //当前上下文
            var baseController = context.Controller as BaseController;
            var httpContext = context.HttpContext;
            var req = httpContext.Request;

            #region 过滤控制器
            if (context.Filters.Select(x => x.ToString()).Any(x => x.EndsWith(typeof(lgnorePowerFilter).Name)))
            {
                return;
            }
            #endregion

            //身份验证
            var authorization = req.Headers["Authorization"].FirstOrDefault();
            authorization = authorization?.Replace("|", "/").Replace("-", "=");

            if (!string.IsNullOrEmpty(authorization))
            {
                using (var db = new EFDbContext())
                {
                    try
                    {
                        #region 身份校验
                        //解密
                        //var authValue = SecurityHelper.Decrypt(authorization);
                        //var arrAuthValue = authValue.Split('|');
                        ////App key
                        //var key = arrAuthValue[0];
                        ////App Secret
                        //var secret = arrAuthValue[1];
                        ////时间
                        //var time = DateTime.Parse(arrAuthValue[2]);
                        //int? adminId = null;
                        //if (arrAuthValue.Length > 3)
                        //    adminId = arrAuthValue[3].TryInt(null);

                        //adminId = 10000;

                        //var app = db.AppInfo.FirstOrDefault(x => x.AppKey == key);
                        //if (app == null)
                        //{
                        //    context.Result = new HttpResult(HttpStatusCode.Unauthorized, "不正确的App Key!");
                        //}
                        //else if (app.AppSecret != secret)
                        //{
                        //    context.Result = new HttpResult(HttpStatusCode.Unauthorized, "不正确的App Secret!");
                        //}
                        #endregion

                        #region 处理操作请求映射请求对象
                        if ((req.Method == "POST" || req.Method == "PUT") && context.ActionArguments.Count > 0)
                        {
                            var body = string.Empty;
                            using (var reader = new StreamReader(context.HttpContext.Request.Body))
                            {
                                body = reader.ReadToEnd();
                            }

                            //获取 Request 的参数
                            var arg = context.ActionArguments["req"];
                            var type = arg.GetType();
                            var obj = JsonConvert.DeserializeObject(body, type);
                            #region 处理PUT请求的Id
                            if (req.Method == "PUT")
                            {
                                if (req.Path.HasValue)
                                {
                                    //获取 Id
                                    var arr = req.Path.Value.Split('/');
                                    var id = arr[arr.Length - 1];
                                    //给参数 Request 的属性 Id 赋值
                                    var prop = type.GetProperty("Id");
                                    if (prop != null)
                                    {
                                        if (obj == null)
                                            obj = Activator.CreateInstance(type);
                                        prop.SetValue(obj, id.TryInt());
                                    }
                                    else
                                    {
                                        context.Result = new HttpResult(HttpStatusCode.NotFound);
                                    }
                                }
                            }
                            if (obj == null)
                            {
                                context.Result = new HttpResult(250, "参数序列化异常，请检查提交的各个参数是否合法");
                            }
                            //重新设置 Action 的参数的值
                            context.ActionArguments["req"] = obj;

                            #endregion
                        }
                        #endregion

                        var validateResult = ValidateHelper.Validate(context.ActionArguments["req"]);
                        if (!validateResult.IsValid)
                        {
                            context.Result = new HttpResult(250, validateResult.Message);
                        }

                        #region 获取操作人的信息


                        //if (adminId != null)
                        //{
                        //    var admin = db.AdminInfo
                        //        .FirstOrDefault(x => x.Id == adminId.Value);
                        //    baseController.CurrentAdmin = baseController.ToApplicationUser(admin, db);

                        //    #region 校验权限

                        //    //CEO角色下一律校验权限 
                        //    if (baseController.CurrentAdmin.Role < EnumRole.Ceo && context.Filters.Select(x => x.ToString())
                        //    .All(x => x != "Api.Filters.IgnorePowerAttribute"))
                        //    {
                        //        //判断当前用户是否有权限操作
                        //        if (req.Method.ToUpper() != "GET")
                        //        {
                        //            //根据请求获取编码
                        //            var code = req.GetCode();
                        //            //if (!baseController.CurrentAdmin.HasPower(code))
                        //            //{
                        //            //    context.Result = new HttpResult(HttpStatusCode.Forbidden, "您没有权限操作，请求编码：" + code);
                        //            //}
                        //        }
                        //    }

                        //    #endregion
                        //}

                        #endregion
                    }
                    catch (Exception ex)
                    {
                        context.Result = new HttpResult(HttpStatusCode.InternalServerError, ex.ToString());
                    }
                }
            }
            else
            {
                context.Result = new HttpResult(HttpStatusCode.Unauthorized, "请求中没有包含身份！");
            }
        }
    }
}
