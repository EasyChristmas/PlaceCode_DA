namespace SDK.Request
{
    /// <summary>
    /// 获取多个实体请求
    /// </summary>
    public class GetListRequest : BaseRequest
	{
		/// <summary>
		/// 当前页
		/// </summary>
		public int? PageIndex { get; set; } = 1;

		/// <summary>
		/// 每页数量
		/// </summary>
		public int? PageSize { get; set; } = int.MaxValue;
	}
}
