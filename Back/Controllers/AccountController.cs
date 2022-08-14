using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SDK;
using SDK.Request;
using SDK.Request.OA;
using System.Text;
using Util;

namespace Back.Controllers
{
    /// <summary>
    /// 账号控制器
    /// </summary>
    public class AccountController : BaseController
    {

        [AllowAnonymous]
        public async Task<IActionResult> Login()
        {
            return View();
        }

        /// <summary>
        /// 验证图片验证码
        /// </summary>
        /// <param name="code">输入的图片验证码</param>
        /// <returns></returns>
        bool CheckImgCode(string code)
        {
            var imageCode = HttpContext.Session.GetString("ImageCode");
            if (string.IsNullOrEmpty(imageCode) || code != imageCode)
                return false;
            return true;
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> Login(AdminLoginRequest req)
        {
            try
            {
                //if (req.LoginType == EnumLoginType.Sms && !CheckImgCode(req.ImgCode))
                //    return HttpBadRequest("图片验证码输入不正确");

                //登录判断
                var user = await WebHelper.RequestAsync<ApplicationUser>(ApiHost + "oa/admin/login",
                    HttpMethod.Post, new Dictionary<string, string> { { "Authorization", ApiSign } }, req.ToJson());
                user.LoginTime = DateTime.Now;
                CurrentUser = user;
            }
            catch (Exception ex)
            {
                return HttpBadRequest(ex.Message);
            }
            return Json(new { IsSuccess = true });
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> Switch(OperRequest req)
        {
            try
            {
                var user = await WebHelper.RequestAsync<ApplicationUser>(ApiHost + "oa/admin/switch",
                    HttpMethod.Post, new Dictionary<string, string> { { "Authorization", ApiSign } }, req.ToJson());
                user.LoginTime = DateTime.Now;
                CurrentUser = user;
            }
            catch (Exception ex)
            {
                return HttpBadRequest(ex.Message);
            }

            return Json(new { IsSuccess = true });
        }

        public IActionResult Logout()
        {
            CurrentUser = null;
            return RedirectToAction("Login", "Account");
        }
    }
}
