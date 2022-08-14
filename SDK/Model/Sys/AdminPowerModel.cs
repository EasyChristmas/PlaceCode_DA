using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SDK.Models.Sys
{
    /// <summary>
    /// 用户权限
    /// </summary>
    public class AdminPowerModel
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
        /// 功能
        /// </summary>
        public int FunctionId { get; set; }

        /// <summary>
        /// 操作类型 true，增加 false，减去
        /// </summary>
        public bool OperateType { get; set; }
        public int? Level { get; set; }
    }
}
