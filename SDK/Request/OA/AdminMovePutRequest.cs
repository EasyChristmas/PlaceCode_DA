using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SDK.Request.OA
{
	/// <summary>
	/// 员工修改（换部门）请求对象
	/// </summary>
    public class AdminMovePutRequest : OperRequest
    {
        /// <summary>
        /// 员工以前所在的部门
        /// </summary>
        public int? OldDepartmentId { get; set; }

        /// <summary>
        /// 员工现在的部门
        /// </summary>
        public int? NewDepartmentId { get; set; }
    }
}
