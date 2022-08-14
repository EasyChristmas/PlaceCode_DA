using SDK.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SDK.Models.Sys
{
    /// <summary>
	/// 系统反馈
	/// </summary>
	public class SysFeedbackModel
    {
        /// <summary>
        /// Primary，编号	  
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// 后台用户反馈人编号	  
        /// </summary>
        public int AdminId { get; set; }

        /// <summary>
        /// 后台用户反馈人姓名
        /// </summary>
        public string AdminName { get; set; }

        /// <summary>
        /// 反馈内容	  
        /// </summary>
        public string Content { get; set; }

        /// <summary>
        /// 状态
        /// </summary>
        public int Status { get; set; }

        /// <summary>
        /// 创建时间	  
        /// </summary>
        public DateTime CraeteTime { get; set; }

        /// <summary>
        /// 后台用户回复人编号	  
        /// </summary>
        public int? ReplyAdminId { get; set; }

        /// <summary>
        /// 回复内容	  
        /// </summary>
        public string ReplyContent { get; set; }

        /// <summary>
        /// 回复时间	  
        /// </summary>
        public DateTime? ReplyTime { get; set; }

        /// <summary>
        /// 问题分类
        /// </summary>
        public string Type { get; set; }
    }
}
