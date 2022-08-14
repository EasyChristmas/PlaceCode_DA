using CSRedis;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Text;

namespace SDK.Cache
{
    /// <summary>
    /// Redis代理类
    /// </summary>
    public static class RedisProxy
    {
        /// <summary>
        /// Redis连接
        /// </summary>
        private static CSRedisClient RedisClient { get; set; }

        /// <summary>
        /// 创建Redis连接对象
        /// </summary>
        public static void CreateRedisClient(IConfiguration config)
        {
            if (RedisClient == null)
            {
                var connectionString = config["Redis:ConnectionString"];
                RedisClient = new CSRedisClient(connectionString);
            }
            RedisHelper.Initialization(RedisClient);
        }

        /// <summary>
        /// 创建Redis连接对象
        /// </summary>
        public static void CreateRedisClient(string connectionString)
        {
            if (RedisClient == null)
            {
                RedisClient = new CSRedisClient(connectionString);
            }
            RedisHelper.Initialization(RedisClient);
        }

        /// <summary>
        /// 获取Redis连接对象
        /// </summary>
        /// <returns>暂时弃用，用CSRedisCore提供的RedisHelper</returns>
        public static CSRedisClient GetRedisClient()
        {
            if (RedisClient == null)
                throw new Exception("Redis连接对象为空！");
            return RedisClient;
        }
    }
}
