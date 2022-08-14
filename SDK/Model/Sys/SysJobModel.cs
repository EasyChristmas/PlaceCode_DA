using System;
using System.Collections.Generic;
using SDK.Enum;
using Util;

namespace SDK.Models.Sys
{
    /// <summary>
    /// 系统工单
    /// </summary>
    public class SysJobModel
    {
        public SysJobModel()
        {
            SysJobLogList = new List<SysJobLogModel>();
        }

        /// <summary>
        /// 编号
        /// </summary>
        public int? Id { get; set; }

        /// <summary>
        /// 标题
        /// </summary>
        public string Title { get; set; }

        /// <summary>
        /// 模块
        /// </summary>
        public int? Module { get; set; }

        /// <summary>
        /// 级别
        /// </summary>
        public int? Level { get; set; }

        /// <summary>
        /// 状态
        /// </summary>
        public int? Status { get; set; }

        /// <summary>
        /// 发起人ID
        /// </summary>
        public int? AdminId { get; set; }

        /// <summary>
        /// 发起人
        /// </summary>
        public string AdminName { get; set; }

        /// <summary>
        /// 审核人ID
        /// </summary>
        public int? AuditAdminId { get; set; }

        /// <summary>
        /// 审核人
        /// </summary>
        public string AuditAdminName { get; set; }

        /// <summary>
        /// 处理人ID
        /// </summary>
        public int? DealAdminId { get; set; }

        /// <summary>
        /// 处理人
        /// </summary>
        public string DealAdminName { get; set; }

        /// <summary>
        /// 创建时间
        /// </summary>
        public DateTime? CreateTime { get; set; }

        /// <summary>
        /// 修改时间
        /// </summary>
        public DateTime? UpdateTime { get; set; }

        /// <summary>
        /// 是否有权限审批
        /// </summary>
        public bool IsPower { get; set; }

        /// <summary>
        /// 是否能提交问题
        /// </summary>
        public bool IsAskQuestion { get; set; }

        /// <summary>
        /// 系统工单记录
        /// </summary>
        public List<SysJobLogModel> SysJobLogList { get; set; }

        ///// <summary>
        ///// 头像
        ///// </summary>
        //public virtual string Photo { get; set; }

        /// <summary>
        /// 部门名称
        /// </summary>
        public virtual string DepartmentName { get; set; }

        /// <summary>
        /// 当前登录人头像
        /// </summary>
        public virtual string CurrentAdminPhoto { get; set; }
    }
}
