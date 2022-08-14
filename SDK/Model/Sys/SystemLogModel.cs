using SDK.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SDK.Models.Sys
{
    public class SystemLogModel
    {
        /// <summary>
        /// 编号
        /// </summary>
        public long Id { get; set; }

        /// <summary>
        /// 模块
        /// </summary>
        public string Module { get; set; }

        /// <summary>
        /// 日志类型
        /// </summary>
        //public EnumLogType Type { get; set; }

        /// <summary>
        /// 被操作编号
        /// </summary>
        public int OriginalId { get; set; }

        /// <summary>
        /// 描述
        /// </summary>
        public string Content { get; set; }
        /// <summary>
        /// 后台用户ID
        /// </summary>
        public int? AdminId { get; set; }

        /// <summary>
        /// 姓名
        /// </summary>
        public string AdminName { get; set; }

        /// <summary>
        /// 手机
        /// </summary>
        public string Mobile { get; set; }

        /// <summary>
        /// 工号
        /// </summary>
        public string JobNum { get; set; }

        /// <summary>
        /// 创建时间
        /// </summary>
        public DateTime CreateTime { get; set; }
    }
}
