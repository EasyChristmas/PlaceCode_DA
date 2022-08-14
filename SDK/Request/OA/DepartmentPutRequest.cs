using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SDK.Request.OA
{
    /// <summary>
    /// 部门编辑请求
    /// </summary>
    public class DepartmentPutRequest : OperRequest
    {
        /// <summary>
        /// 部门名称
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// 父节点
        /// </summary>
        public int? ParentId { get; set; }

        /// <summary>
        /// 排序
        /// </summary>
        public int Sort { get; set; }

        /// <summary>
        /// 图标
        /// </summary>
        public string Icon { get; set; }

        /// <summary>
        /// 是否公司
        /// </summary>
        public bool IsCompany { get; set; }


        public int EnterPriseId { get; set; }
    }
}
