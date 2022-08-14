using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SDK.Request.OA
{
	/// <summary>
	/// 员工新增请求
	/// </summary>
    public class AdminPostRequest : OperRequest
    {
        /// <summary>
        /// 姓名
        /// </summary>
        public string RealName { get; set; }

        /// <summary>
        /// 工号
        /// </summary>
        public string UserName { get; set; }

        /// <summary>
        /// 所在部门
        /// </summary>
        public int DepartmentId { get; set; }

        /// <summary>
        /// 角色
        /// </summary>
        public int? RoleId { get; set; }

        public int EnterPriseId { get; set; }

        /// <summary>
        /// 手机号
        /// </summary>
        public string Mobile { get; set; }
    }
}
