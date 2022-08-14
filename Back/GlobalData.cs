using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;

namespace Back
{
    /// <summary>
    /// 全局变量
    /// </summary>
    public sealed class GlobalData
    {
        /// <summary>
        /// 应用配置
        /// </summary>
        public static IConfigurationRoot Configuration { get; set; }

        /// <summary>
        /// 环境
        /// </summary>
        public static IWebHostEnvironment Environment { get; set; }
    }
}
