using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using Util;

namespace Cookie
{
    /// <summary>
    /// Cookie服务
    /// </summary>
    public class CookieService
    {
        public CookieService()
        {
            ;
        }

        /// <summary>
        /// 写入
        /// </summary>
        /// <param name="key"></param>
        /// <param name="val"></param>
        /// <returns></returns>
        public bool Set(string key, string val)
        {
            try
            {
                var cookies = GetAll();
                var result = cookies.FirstOrDefault(x => x.Type == key);
                if (result != null)
                    cookies.Remove(result);

                var identity = new ClaimsIdentity(CookieAuthenticationDefaults.AuthenticationScheme);
                foreach (var item in cookies)
                    identity.AddClaim(new Claim(item.Type, item.Value));
                identity.AddClaim(new Claim(key, val));
                HttpContext.Current.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(identity), new AuthenticationProperties { IsPersistent = true, ExpiresUtc = DateTimeOffset.Now.Add(TimeSpan.FromHours(12)) }).Wait();
                

                return true;
            }
            catch (Exception ex)
            {
                SDK.Log.LogHelper.Error("SetCookie异常：", ex);
                return false;
            }
        }

        /// <summary>
        /// 获取单个
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="key"></param>
        /// <returns></returns>
        public string Get(string key)
        {
            var cookies = GetAll();
            var result = cookies.FirstOrDefault(x => x.Type == key);
            if (result != null)
                return result.Value;
            else
                return null;
        }

        /// <summary>
        /// 获取所有
        /// </summary>
        /// <returns></returns>
        public List<Claim> GetAll()
        {
            var list = HttpContext.Current.User.Claims.ToList();
            return list;
        }

        /// <summary>
        /// 移除所有
        /// </summary>
        public void RemoveAll()
        {
            HttpContext.Current.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme).Wait();
        }
    }
}
