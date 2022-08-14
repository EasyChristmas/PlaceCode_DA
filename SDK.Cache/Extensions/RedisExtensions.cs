using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Text;

namespace SDK.Cache.Extensions
{
    /// <summary>
    /// 对外暴露Redis中间件
    /// </summary>
    public static class RedisExtensions
    {
        /// <summary>
        /// 使用Redis中间件
        /// </summary>
        /// <param name="app"></param>
        /// <param name="config">配置对象</param>
        /// <returns></returns>
        public static IApplicationBuilder UseRedis(this IApplicationBuilder app, IConfiguration config)
        {
            RedisProxy.CreateRedisClient(config);
            return app;
        }

        /// <summary>
        /// 使用Redis中间件
        /// </summary>
        /// <param name="app"></param>
        /// <param name="connectionString">连接字符串</param>
        /// <returns></returns>
        public static IApplicationBuilder UseRedis(this IApplicationBuilder app, string connectionString)
        {
            RedisProxy.CreateRedisClient(connectionString);
            return app;
        }
    }
}
