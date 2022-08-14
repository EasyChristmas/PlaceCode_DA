using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SDK.Request.OA
{
	/// <summary>
	/// 管理员登录发送手机号
	/// </summary>
    public class AdminSendSmsRequest : GetRequest
    {
		/// <summary>
		/// 工号
		/// </summary>
		public string JobNum { get; set; }

        /// <summary>
        /// 图片验证码
        /// </summary>
        public string ImgCode { get; set; }
    }
}
