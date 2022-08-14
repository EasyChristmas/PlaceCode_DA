namespace SDK.Request
{
    /// <summary>
    /// 设置的请求
    /// </summary>
    public class PutRequest : OperRequest
    {
        /// <summary>
        /// 操作源
        /// </summary>
        public string Source { get; set; }
        /// <summary>
        /// 属性名称
        /// </summary>
        public string PropName { get; set; }

        /// <summary>
        /// 属性值
        /// </summary>
        public object PropValue { get; set; }

        /// <summary>
        /// 旧属性值
        /// </summary>
        public object PropValueOld { get; set; }
    }
}
