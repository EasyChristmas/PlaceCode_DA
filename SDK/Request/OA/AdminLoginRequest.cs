using SDK.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SDK.Request.OA
{
    /// <summary>
    /// 员工登陆请求
    /// </summary>
    public class AdminLoginRequest : OperRequest
    {

        /// <summary>
        /// 登录方式
        /// </summary>
        //public EnumLoginType? LoginType { get; set; }

        /// <summary>
        /// 用户名
        /// </summary>
        public string UserName { get; set; }

        /// <summary>
        /// 密码
        /// </summary>
        public string PassWord { get; set; }

        /// <summary>
        /// 短信验证码
        /// </summary>
        public string SmsCode { get; set; }

        /// <summary>
        /// 图片验证码
        /// </summary>
        public string ImgCode { get; set; }
    }
}
