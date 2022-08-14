using System.ComponentModel;

namespace SDK.Enum
{
    /// <summary>
    /// 员工状态
    /// </summary>
    public enum EnumAdminStatus
    {
        /// <summary>
        /// 锁定
        /// </summary>
        [Description("锁定")]
        Lock = 0,

        /// <summary>
        /// 正常
        /// </summary>
        [Description("正常")]
        Normal = 1
    }
}
