using SDK.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SDK.Models.Sys
{
    /// <summary>
    /// 角色
    /// </summary>
    public class RoleModel
    {
        /// <summary>
        /// 编号
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// 名称
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// 是否管理员
        /// </summary>
        public bool IsManager { get; set; }

        public int ProjectId { get; set; }
    }
}
