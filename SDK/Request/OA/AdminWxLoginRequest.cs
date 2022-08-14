namespace SDK.Request.OA
{
    /// <summary>
    /// 微信登录
    /// </summary>
    public class AdminWxLoginRequest : OperRequest
    {
        /// <summary>
        /// 企业域名
        /// </summary>
        public string Domain { get; set; }

        /// <summary>
        /// 微信OpenId
        /// </summary>
        public string OpenId { get; set; }
    }
}
