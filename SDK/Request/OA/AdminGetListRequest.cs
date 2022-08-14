using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SDK.Enum;

namespace SDK.Request.OA
{
	/// <summary>
	/// 员工列表请求
	/// </summary>
    public class AdminGetListRequest: GetListRequest
    {
        /// <summary>
        /// 部门编号
        /// </summary>
        public int? DepartmentId { get; set; }

        /// <summary>
        /// 根据部门Id获取该部门下面所有子部门员工
        /// </summary>
        public int? DeptParentId { get; set; }

        /// <summary>
        /// 员工姓名
        /// </summary>
        public string RealName { get; set; }

        /// <summary>
        /// 手机号
        /// </summary>
        public string Mobile { get; set; }

        /// <summary>
        /// 工号
        /// </summary>
        public string JobNum { get; set; }

        /// <summary>
        /// 数据角色
        /// </summary>
        public string RoleCode { get; set; }

        /// <summary>
        /// 状态
        /// </summary>
        public EnumAdminStatus? Status { get; set; }
        /// <summary>
        /// 级别
        /// </summary>
        public int? Level { get; set; }

        /// <summary>
        /// 角色 （以,隔开）
        /// </summary>
        public string RoleIds { get; set; }

        /// <summary>
        /// 是否获取下属员工
        /// </summary>
        public bool? OnlyUnderlings { get; set; }

        /// <summary>
        /// 是否获取下属部门
        /// </summary>
        public bool? OnlyDepartmentIds { get; set; }

        /// <summary>
        /// 显示平台
        /// </summary>
        public bool? ShowProject { get; set; }

        /// <summary>
        /// Role名称
        /// </summary>
        public string RoleName { get; set; }
    }
}
   