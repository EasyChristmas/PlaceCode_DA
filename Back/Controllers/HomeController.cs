using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Back.Controllers
{
    /// <summary>
    /// 首页控制器
    /// </summary>
    public class HomeController : AuthController
	{
		public IActionResult Index()
		{
            return View();
		}

		public IActionResult Console()
		{
            return View();
		}

		public IActionResult Error()
		{
			return View();
		}

		/// <summary>
		/// 探针
		/// </summary>
		/// <returns></returns>
		[AllowAnonymous]
		public IActionResult Probe()
		{
			ViewBag.Env = Environment.EnvironmentName;
			ViewBag.Api = ApiHost;

			return View();
		}

		public IActionResult Test()
		{
			return View();
		}

		/// <summary>
		/// 维护页
		/// </summary>
		/// <returns></returns>
		public IActionResult Temp()
		{
			return View();
		}

        /// <summary>
        /// 升级维护页
        /// </summary>
        /// <returns></returns>
        public async Task<IActionResult> Upgrade()
        {
            return View();
        }

        /// <summary>
        /// websocket测试
        /// </summary>
        /// <returns></returns>
        public IActionResult WebSocket()
		{
			return View();
		}

        public IActionResult EC()
        {
            return View();
        }
    }
}
