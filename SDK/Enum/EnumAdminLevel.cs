using System.ComponentModel;

namespace SDK.Enum
{
    /// <summary>
    /// 员工级别
    /// </summary>
    public enum EnumAdminLevel
    {
        /// <summary>
        /// 员工
        /// </summary>
        [Description("员工")]
        Normal = 1,

        /// <summary>
        /// 组长
        /// </summary>
        [Description("组长")]
        Leader = 2,

        /// <summary>
        /// 主管
        /// </summary>
        [Description("主管")]
        Supervisor = 3,

        /// <summary>
        /// 经理
        /// </summary>
        [Description("经理")]
        Manager = 5,

        /// <summary>
        /// 总监
        /// </summary>
        [Description("总监")]
        Director = 7,

        /// <summary>
        /// 副总
        /// </summary>
        [Description("副总")]
        Vp = 8,

        /// <summary>
        /// 总裁
        /// </summary>
        [Description("总裁")]
        Ceo = 9,

        /// <summary>
        /// 管理员
        /// </summary>
        [Description("管理员")]
        Admin = 10
    }
}
