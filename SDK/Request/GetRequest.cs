namespace SDK.Request
{
    /// <summary>
    /// 获取单个实体请求
    /// </summary>
    public class GetRequest : BaseRequest
    {
		/// <summary>
		/// 编号
		/// </summary>
		public int? Id { get; set; }
    }
}
