using SDK.Enum;
using SDK.Models.Sys;

namespace SDK
{
    /// <summary>
    /// 应用用户
    /// </summary>
    public class ApplicationUser
    {
        /// <summary>
        /// 编号
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// 姓名
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// 头像
        /// </summary>
        public string Photo { get; set; }

        /// <summary>
        /// 部门编号
        /// </summary>
        public int DepartmentId { get; set; }

        /// <summary>
        /// 部门
        /// </summary>
        public string DepartmentName { get; set; }

        /// <summary>
        /// 级别
        /// </summary>
        public EnumAdminLevel Level { get; set; }

        /// <summary>
        /// 数据角色
        /// </summary>
        public int Role { get; set; }

        /// <summary>
        /// 数据角色集合
        /// </summary>
        public List<int> RoleList { get; set; }

        /// <summary>
        /// 角色编码
        /// </summary>
        public string RoleCode { get; set; }

        /// <summary>
        /// 下属编号集合
        /// </summary>
        public List<int> UnderlingList { get; set; }

        /// <summary>
        /// 下属编号字符串格式：11 或 11,22,24
        /// </summary>
        /// <remarks>用于数据库处理</remarks>
        public string Underlings { get; set; }

        /// <summary>
		/// 角色集合
		/// </summary>
		public List<int> RoleIdList { get; set; }

        /// <summary>
        /// 角色字符串格式：11 或 11,22,24
        /// </summary>
        /// <remarks>用于数据库处理</remarks>
        public string RoleIds { get; set; }

        /// <summary>
        /// 登录时间
        /// </summary>
        public DateTime LoginTime { get; set; }

        /// <summary>
        /// 按钮权限
        /// </summary>
        /// <remarks>页面加载前会获取权限列表</remarks>
        public List<FunctionModel> PowerList { get; set; } = new List<FunctionModel>();

        /// <summary>
        /// 当前登录人手机号码
        /// </summary>
        public string Mobile { get; set; }

        /// <summary>
        /// 是否有权限
        /// </summary>
        /// <param name="code">权限编码</param>
        /// <returns>bool，是否有</returns>
        public bool HasPower(string code)
        {
            if (string.IsNullOrEmpty(code) || PowerList == null) return false;
            return PowerList.Any(x => x.Code.ToLower() == code.ToLower());
        }

        /// <summary>
        /// 获取访问级别
        /// </summary>
        /// <param name="code">权限编码</param>
        /// <returns>访问级别</returns>
        public EnumVisitLevel GetLevel(string code)
        {
            if (string.IsNullOrEmpty(code) || PowerList == null) return EnumVisitLevel.Self;
            //return PowerList.FirstOrDefault(x => x.Code.ToLower() == code.ToLower())?.Level ?? EnumVisitLevel.Self;
            var maxLevelPower = PowerList.Where(x => x.Code.ToLower() == code.ToLower()).OrderByDescending(x => x.Level).FirstOrDefault();
            return maxLevelPower?.Level ?? EnumVisitLevel.Self;
        }
        /// <summary>
        /// 显示会员手机
        /// </summary>
        public bool ShowUserMobile { get; set; }

        /// <summary>
        /// 显示会员详情
        /// </summary>
        public bool ShowUserDetail { get; set; }

        /// <summary>
        /// 所属机构
        /// </summary>
        public int EnterPriseId { get; set; }

        /// <summary>
        /// 是否超级管理员
        /// </summary>
        public bool IsOrgSuperManager { get; set; }

        /// <summary>
        /// 是否机构管理员
        /// </summary>
        public bool IsOrgManager { get; set; }

        /// <summary>
        /// 账户切换
        /// </summary>
        public List<SwitchAdminInfo> SwitchAdminList { get; set; } = new List<SwitchAdminInfo> { };
    }

    /// <summary>
    /// 切换账户信息
    /// </summary>
    public class SwitchAdminInfo
    {
        /// <summary>
        /// 账号Id
        /// </summary>
        public int AdminId { get; set; }

        /// <summary>
        /// 账号姓名
        /// </summary>
        public string AdminName { get; set; }
    } 

}
