using SDK.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SDK.Request.OA
{
    public class AdminLoginLogPostRequest : OperRequest
    {
        public int? AdminId { get; set; }

        public string AdminName { get; set; }

        public int? Type { get; set; }
    }
}
