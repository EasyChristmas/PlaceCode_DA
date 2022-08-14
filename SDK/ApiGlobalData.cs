using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Util;

namespace SDK
{
    public class ApiGlobalData
    {

        #region 常量数据

        /// <summary>
        /// 后台超级管理员编号
        /// </summary>
        public const int SupperAdminId = 1;

        /// <summary>
        /// 后台用户默认密码
        /// </summary>
        public const string AdminDefaultPassword = "edgelight";

        /// <summary>
        /// 后台用户默认图像（男）
        /// </summary>
        public const string AdminDefaultBoyHeadPic = "images/avatars/boy.png";

        /// <summary>
        /// 后台用户默认图像（女）
        /// </summary>
        public const string AdminDefaultGirlHeadPic = "images/avatars/girl.png";

        /// <summary>
        /// 后台用户工号前缀
        /// </summary>
        public const string AdminJobNumPrefix = "EL";

        /// <summary>
        /// 后台用户工号起始值
        /// </summary>
        public const int AdminJobNumInitialValue = 100;

        /// <summary>
        /// 后台用户工号长度
        /// </summary>
        public const int AdminJobNumLength = 5;

        /// <summary>
        /// 每月天数（就以每月30天算）
        /// </summary>
        public const int Days = 30;

        #endregion

        #region 配置数据

        /// <summary>
        /// 应用配置
        /// </summary>
        public static IConfigurationRoot Configuration;

        /// <summary>
        /// 环境
        /// </summary>
        public static IWebHostEnvironment Environment;

        /// <summary>
        /// 是否正式环境
        /// </summary>
        public static bool IsProduction => Environment.IsProduction();

        /// <summary>
        /// Ip白名单
        /// </summary>
        public static string IpWhiteList;

        /// <summary>
        /// 数据库链接字符串
        /// </summary>
        public static string DbConnectionString;

        /// <summary>
        /// Mongo数据库链接字符串
        /// </summary>
        public static string MongoConnectionString;
        /// <summary>
        /// 公共服务Appkey
        /// </summary>
        public static string CommonAppkey { get; set; }

        /// <summary>
        /// 公共服务Secret
        /// </summary>
        public static string CommonSecret { get; set; }
        /// <summary>
        /// 小程序接口AppKey
        /// </summary>
        public static string AppletApiAppKey { get; set; }
        /// <summary>
        /// 小程序APIAppSecret
        /// </summary>
        public static string AppletApiAppSecret { get; set; }
        /// <summary>
        /// 文件服务地址
        /// </summary>
        public static string FileApiUrl { get; set; }
        /// <summary>
        /// 文件Api Key
        /// </summary>
        public static string FileApiAppKey { get; set; }

        /// <summary>
        /// 文件Api Secret
        /// </summary>
        public static string FileApiAppSecret { get; set; }

        #endregion

        #region 业务数据

        /// <summary>
        /// 枚举集合
        /// </summary>
        //public static string EnumDic => EnumHelper.GetEnumDic();

        #endregion

        /// <summary>
        /// 初始化配置
        /// </summary>
        public static void Init()
        {
            IpWhiteList = Configuration["IpWhiteList"].TryString();
            DbConnectionString = Configuration["Data:DigitalSentry:ConnectionString"].TryString();
            MongoConnectionString = Configuration["Data:Mongodb:ConnectionString"].TryString();
            AppletApiAppKey = Configuration["Applet:Api:AppKey"].TryString();
            AppletApiAppSecret = Configuration["Applet:Api:AppSecret"].TryString();

            FileApiUrl = Configuration["FileService:ApiUrl"].TryString();
            FileApiAppKey = Configuration["FileService:AppKey"].TryString();
            FileApiAppSecret = Configuration["FileService:AppSecret"].TryString();
            
        }
    }
}
