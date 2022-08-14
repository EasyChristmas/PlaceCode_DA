namespace SDK.Request.OA
{
    /// <summary>
    /// 验证员工
    /// </summary>
    public class AdminVerifyRequest:OperRequest
    {
        /// <summary>
        /// 员工编号
        /// </summary>
        public int AdminId { get; set; }

        /// <summary>
        /// 微信登录
        /// </summary>
        public string WxLogin { get; set; }
    }
}
