using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SDK.Models.Sys
{
    /// <summary>
    /// 系统工单
    /// </summary>
    public class AdminRoleModel
    {
        /// <summary>
        /// 编号
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// 后台用户
        /// </summary>
        public int AdminId { get; set; }

        /// <summary>
        /// 角色
        /// </summary>
        public int RoleId { get; set; }
    }
}
