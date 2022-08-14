using System;
using SDK.Enum;
using Util;

namespace SDK.Models.Sys
{
    /// <summary>
    /// APP类型业务对象
    /// </summary>
    public class AppInfoModel
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
        /// AppKey
        /// </summary>
        public string AppKey { get; set; }

        /// <summary>
        /// AppSecret
        /// </summary>
        public string AppSecret { get; set; }

        /// <summary>
        /// 渠道
        /// </summary>
        public int Channel { get; set; }

        /// <summary>
        /// 备注
        /// </summary>
        public string Remark { get; set; }

        /// <summary>
        /// 是否删除
        /// </summary>
        public bool IsDelete { get; set; }

        /// <summary>
        /// 添加时间
        /// </summary>
        public DateTime CreateTime { get; set; }

        /// <summary>
        /// 更新时间
        /// </summary>
        public DateTime UpdateTime { get; set; }
        
        ///// <summary>
        ///// 修改类型类型
        ///// </summary>
        //public string EnumChangeTypeName => EnumHelper.GetDesc<EnumAppUpdateChangeType>(ChangeType) ?? "";
    }
}
