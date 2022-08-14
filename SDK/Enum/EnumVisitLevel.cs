using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Threading.Tasks;

namespace SDK.Enum
{
    /// <summary>
    /// 访问级别
    /// </summary>
    public enum EnumVisitLevel
    {
        /// <summary>
        /// 所有
        /// </summary>
        [Description("所有")]
        All = 3,

        /// <summary>
        /// 分等级
        /// </summary>
        [Description("分等级")]
        Grading = 2,

        /// <summary>
        /// 自己
        /// </summary>
        [Description("自己")]
        Self = 1,
    }
}
