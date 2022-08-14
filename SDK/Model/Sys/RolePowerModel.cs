using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SDK.Models.Sys
{
    /// <summary>
    /// 角色权限
    /// </summary>
    public class RolePowerModel
    {
        /// <summary>
        /// 编号
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// 角色
        /// </summary>
        public int RoleId { get; set; }

        /// <summary>
        /// 功能
        /// </summary>
        public int FunctionId { get; set; }
        public int? Level { get; set; }
    }
}
