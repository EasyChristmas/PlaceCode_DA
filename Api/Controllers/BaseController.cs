using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Net;

namespace Api.Controllers
{
    /// <summary>
    /// 所有API的基类
    /// </summary>
    public partial class BaseController : Controller
    {
        /// <summary>
        /// 应用配置
        /// </summary>
        public static IConfigurationRoot Configuration;

        /// <summary>
        /// 当前登录人
        /// </summary>
        //public ApplicationUser CurrentAdmin { get; set; }
    }
}
