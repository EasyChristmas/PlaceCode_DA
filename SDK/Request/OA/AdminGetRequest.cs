using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SDK.Enum;

namespace SDK.Request.OA
{
	/// <summary>
	/// 员工请求
	/// </summary>
    public class AdminGetRequest : GetRequest
    {
        /// <summary>
        /// 工号
        /// </summary>
        public string JobNum { get; set; }

        /// <summary>
        /// 部门ID
        /// </summary>
        public int? DepartmentId { get; set; }

        /// <summary>
        /// 角色Ids
        /// </summary>
        public string RoleIds { get; set; }
    }
}
