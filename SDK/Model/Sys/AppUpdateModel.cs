using System;
using SDK.Enum;
using Util;

namespace SDK.Models.Sys
{
    /// <summary>
    /// APP版本更新业务对象
    /// </summary>
    public class AppUpdateModel
    {
        /// <summary>
        /// 编号
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// App编号
        /// </summary>
        public int AppId { get; set; }

        /// <summary>
        /// 版本码
        /// </summary>
        public int Version { get; set; }

        /// <summary>
        /// App渠道
        /// </summary>
        public int Channel { get; set; }

        /// <summary>
        /// 版本号
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// 是否强制更新
        /// </summary>
        public bool IsEnforcement { get; set; }

        /// <summary>
        /// 更新说明
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        /// 备注
        /// </summary>
        public string Remark { get; set; }

        /// <summary>
        /// 更新Url
        /// </summary>
        public string Url { get; set; }

        /// <summary>
        /// 更新时间
        /// </summary>
        public DateTime CreateTime { get; set; }

        /// <summary>
        /// 修改类型
        /// </summary>
        public int ChangeType { get; set; }
    }
}
