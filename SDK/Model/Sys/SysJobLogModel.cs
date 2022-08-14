using System;

namespace SDK.Models.Sys
{
    /// <summary>
    /// 系统工单记录
    /// </summary>
    public class SysJobLogModel
    {
        /// <summary>
        /// 编号
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// 后台用户ID
        /// </summary>
        public int AdminId { get; set; }

        /// <summary>
        /// 内容
        /// </summary>
        public string Content { get; set; }

        /// <summary>
        /// 创建时间
        /// </summary>
        public DateTime? CreateTime { get; set; }

        /// <summary>
        /// 后台用户名称
        /// </summary>
        public virtual string AdminName { get; set; }

        /// <summary>
        /// 头像
        /// </summary>
        public virtual string Photo { get; set; }

        /// <summary>
        /// 部门名称
        /// </summary>
        public virtual string DepartmentName { get; set; }
    }
}
