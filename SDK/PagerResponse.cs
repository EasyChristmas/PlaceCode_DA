using System.Collections.Generic;

namespace SDK
{
    public class PagerResponse<T> : BaseResponse
    {
        public int TotalCount { get; set; }

        public List<T> Data { get; set; }
    }
}
