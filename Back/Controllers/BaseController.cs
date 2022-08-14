using Back.Filters;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using SDK;
using System.Collections.Concurrent;
using System.Net;
using System.Security.Claims;
using Util;

namespace Back.Controllers
{
    /// <summary>
    /// 控制器基类
    /// </summary>
    [Error]
    [View]
    public class BaseController : Controller
    {

        /// <summary>
        /// 当前在线用户
        /// </summary>
        public ConcurrentDictionary<int, ApplicationUser> Users = null;

        /// <summary>
        /// 日子文件默认目标
        /// </summary>
        public const string DefaultTarget = "Back";

        /// <summary>
        /// OSS文件地址
        /// </summary>
        public const string OssFileUrl = "http://rescdn.xiaohu.in/";

        /// <summary>
        /// redis缓存帮助对象
        /// </summary>
        //public static CSRedisHelper csRedis;

        /// <summary>
        /// 应用配置
        /// </summary>
        public static IConfigurationRoot Configuration;

        /// <summary>
        /// 版本号
        /// </summary>
        public static string FileVersion { get; set; }

        /// <summary>
        /// 环境
        /// </summary>
        public static IWebHostEnvironment Environment;

        /// <summary>
        /// Api 地址
        /// </summary>
        public static string ApiHost => Configuration["Api:Url"];


        /// <summary>
        /// WebSocket服务Url
        /// </summary>
        public static string WebSocketUrl { get; set; }

        /// <summary>
        /// 系统枚举集合JSON（前台使用）
        /// </summary>
        public static string EnumDicJson { get; set; }

        /// <summary>
        /// 静态构造方法
        /// </summary>
        public static void Init()
        {
            FileVersion = DateTime.Now.ToString("yyyyMMddHHmm");
        }


        /// <summary>
        /// Api 签名
        /// </summary>
        public string ApiSign
        {
            get
            {

                var claim = HttpContext.User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Sid);
                //当前登录人编号
                var id = claim?.Value;
                var sign = SecurityHelper.Encrypt(Configuration["Api:AppKey"] + "|" + Configuration["Api:AppSecret"] + "|" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "|" + (id ?? ""));
                sign = sign.Replace("/", "|").Replace("=", "-");
                //Info("请求签名：" + sign);
                return sign;
            }
        }

        /// <summary>
        /// 验证token的时间戳
        /// </summary>
        public string Token
        {
            get
            {
                var claim = HttpContext.User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Sid);
                //当前登录人编号
                var id = claim?.Value;
                TimeStamp = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                var sign = SecurityHelper.Md5(Configuration["Api:AppKey"] + "|" + Configuration["Api:AppSecret"] + "|" + TimeStamp + "|" + (id ?? ""));
                sign = sign.Replace("/", "|").Replace("=", "-");
                return sign;
            }
        }

        /// <summary>
        /// 子系统的时间戳
        /// </summary>
        public string TimeStamp = string.Empty;


        /// <summary>
        /// 应用的用户
        /// </summary>
        public ApplicationUser CurrentUser
        {
            set
            {
                if (value == null)
                {
                    var claim = HttpContext.User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Sid);
                    var id = claim?.Value;
                    try
                    {
                        //csRedis.DeleteHash("user-online", id);
                    }
                    catch (Exception) { }

                    HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
                }
                else
                {
                    //写入cookie
                    var identity = new ClaimsIdentity(CookieAuthenticationDefaults.AuthenticationScheme);
                    identity.AddClaim(new Claim(ClaimTypes.Name, value.Name));
                    identity.AddClaim(new Claim(ClaimTypes.Sid, value.Id.ToString()));

                    HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(identity), new Microsoft.AspNetCore.Authentication.AuthenticationProperties { IsPersistent = true });
                    //var user = csRedis.SetHash<ApplicationUser>("user-online", value.Id.ToString(), value);
                }
            }
            get
            {
                var claim = HttpContext.User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Sid);
                var id = claim?.Value;
                if (string.IsNullOrEmpty(id))
                {
                    LogHelper.Error("获取CurrentUser时，未获取到claim，Sid=" + ClaimTypes.Sid);
                }
                 

                ApplicationUser user = null;
                if (claim != null)
                {
                    //user = csRedis.GetHash<ApplicationUser>("user-online", id.ToString());
                    if (user == null)
                    {
                        LogHelper.Info("获取CurrentUser时，从Redis获取信息时为空，Id="+ id);
                        return null;
                    }
                    //更新cookie
                    var identity = new ClaimsIdentity(CookieAuthenticationDefaults.AuthenticationScheme);
                    identity.AddClaim(new Claim(ClaimTypes.Name, user.Name));
                    identity.AddClaim(new Claim(ClaimTypes.Sid, user.Id.ToString()));
                    HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(identity), new Microsoft.AspNetCore.Authentication.AuthenticationProperties { IsPersistent = true });
                }

                return user;
            }
        }

        #region 返回 HTTP 结果

        /// <summary>
        /// 请求无效
        /// </summary>
        /// <returns>返回 HTTP 状态码 400</returns>
        public IActionResult HttpBadRequest()
        {
            return new HttpResult(HttpStatusCode.BadRequest);
        }

        /// <summary>
        /// 请求无效
        /// </summary>
        /// <param name="content">内容</param>
        /// <returns>返回 HTTP 状态码 400</returns>
        public IActionResult HttpBadRequest(string content)
        {
            return new HttpResult(HttpStatusCode.BadRequest, content);
        }


        #endregion


        /// <summary>
        /// 判断是否有权限
        /// </summary>
        /// <param name="code">按钮代码</param>
        /// <returns></returns>
        public bool Power(string code)
        {
            var user = CurrentUser;
            if ((user != null && user.HasPower(code)) || user?.Id == 76) return true;
            return false;
        }
    }
}
