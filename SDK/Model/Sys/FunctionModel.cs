using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SDK.Enum;

namespace SDK.Models.Sys
{
    /// <summary>
    /// 功能
    /// </summary>
    public class FunctionModel
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
        /// 编码/地址
        /// </summary>
        public string Code { get; set; }

        /// <summary>
        /// 父编号
        /// </summary>
        public int ParentId { get; set; }

        /// <summary>
        /// 图标
        /// </summary>
        public string Icon { get; set; }

        /// <summary>
        /// 类型 1，菜单；2，按钮
        /// </summary>
        public int Type { get; set; }

        /// <summary>
        /// 排序
        /// </summary>
        public int Sort { get; set; }

        /// <summary>
        /// 是否显示
        /// </summary>
        public bool IsShow { get; set; }

        /// <summary>
        /// 所属项目
        /// </summary>
        public int Project { get; set; }

        /// <summary>
        /// 包含的Api
        /// </summary>
        public string Api { get; set; }

        /// <summary>
        /// 级别
        /// </summary>
        public EnumVisitLevel Level { get; set; } = EnumVisitLevel.Self;

        /// <summary>
        /// 用户权限个数
        /// </summary>
        public int adminPowerCount { get; set; }

        /// <summary>
        /// 角色权限个数
        /// </summary>
        public int rolePowerCount { get; set; }
    }
}
