using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Util;

namespace SDK.Cache
{
    /// <summary>
    /// Redis缓存客户端
    /// </summary>
    public static class CacheClient
    {
        /// <summary>
        /// 设置缓存
        /// </summary>
        /// <param name="key">键</param>
        /// <param name="value">值</param>
        /// <returns></returns>
        public static bool Set(string key, object value)
        {
            if (string.IsNullOrEmpty(key))
            {
                throw new ArgumentNullException("参数异常！");
            }
            try
            {
                return RedisHelper.Set(key, value);
            }
            catch (Exception ex)
            {
                LogHelper.Error("RedisClient.Set", ex);
                return false;
            }
        }

        /// <summary>
        /// 设置缓存
        /// </summary>
        /// <param name="key">键</param>
        /// <param name="value">值</param>
        /// <param name="expireSeconds">过期时间（单位：秒）</param>
        /// <returns></returns>
        public static bool Set(string key, object value, int expireSeconds)
        {
            if (string.IsNullOrEmpty(key))
            {
                throw new ArgumentNullException("参数异常！");
            }
            try
            {
                return RedisHelper.Set(key, value, expireSeconds);
            }
            catch (Exception ex)
            {
                LogHelper.Error("RedisClient.Set", ex);
                return false;
            }
        }

        /// <summary>
        ///  获取缓存
        /// </summary>
        /// <param name="key">键</param>
        /// <returns></returns>
        public static string Get(string key)
        {
            if (string.IsNullOrEmpty(key))
            {
                throw new ArgumentNullException("参数异常！");
            }
            try
            {
                return RedisHelper.Get(key);
            }
            catch (Exception ex)
            {
                LogHelper.Error("RedisClient.Get", ex);
                return string.Empty;
            }
        }

        /// <summary>
        /// 获取缓存
        /// </summary>
        /// <param name="key">键</param>
        /// <returns></returns>
        public static T Get<T>(string key) where T : class
        {
            if (string.IsNullOrEmpty(key))
            {
                throw new ArgumentNullException("参数异常！");
            }
            try
            {
                return RedisHelper.Get<T>(key);
            }
            catch (Exception ex)
            {
                LogHelper.Error("RedisClient.Get<T>", ex);
                return default(T);
            }
        }

        /// <summary>
        /// 删除缓存
        /// </summary>
        /// <param name="key">键</param>
        /// <returns></returns>
        public static bool Delete(string key)
        {
            if (string.IsNullOrEmpty(key))
            {
                throw new ArgumentNullException("参数异常！");
            }
            try
            {
                return RedisHelper.Del(key) > 0;
            }
            catch (Exception ex)
            {
                LogHelper.Error("RedisClient.Delete", ex);
                return false;
            }
        }

        /// <summary>
        /// 设置hash值
        /// </summary>
        /// <param name="key">键</param>
        /// <param name="field">字段值</param>
        /// <param name="value">值</param>
        /// <returns></returns>
        /// <remarks>1如果field是一个新的字段，0如果field原来在map里面已经存在</remarks>
        /// <remarks>返回值特殊处理，在测试过程中发现执行结果只有创建新表时才会返回true，修改现有表成功只会返回false</remarks>
        public static bool SetHash<T>(string key, string field, T value)
        {
            if (string.IsNullOrEmpty(key) || string.IsNullOrEmpty(field))
            {
                throw new ArgumentNullException("参数异常！");
            }
            try
            {
                var result = RedisHelper.HSet(key, field, value);
                return true;
            }
            catch (Exception ex)
            {
                LogHelper.Error("RedisClient.SetHash<T>", ex);
                return false;
            }
        }

        /// <summary>
        /// 获取hash值
        /// </summary>
        /// <param name="key">键</param>
        /// <param name="field">字段值</param>
        /// <returns></returns>
        public static T GetHash<T>(string key, string field) where T : class
        {
            if (string.IsNullOrEmpty(key) || string.IsNullOrEmpty(field))
            {
                throw new ArgumentNullException("参数异常！");
            }
            try
            {
                return RedisHelper.HGet<T>(key, field);
            }
            catch (Exception ex)
            {
                LogHelper.Error("RedisClient.GetHash<T>", ex);
                return default(T);
            }
        }

        /// <summary>
        /// 获取hash值
        /// </summary>
        /// <param name="key">键</param>
        /// <param name="field">字段值</param>
        /// <returns></returns>
        public static async Task<T> GetHashAsync<T>(string key, string field) where T : class
        {
            if (string.IsNullOrEmpty(key) || string.IsNullOrEmpty(field))
            {
                throw new ArgumentNullException("参数异常！");
            }
            try
            {
                return await RedisHelper.HGetAsync<T>(key, field);
            }
            catch (Exception ex)
            {
                LogHelper.Error($"RedisClient.GetHashAsync<T>  {key}：{field}", ex);
                return default(T);
            }
        }

        /// <summary>
        /// 删除hash值
        /// </summary>
        /// <param name="key">键</param>
        /// <param name="field">字段值</param>
        /// <returns></returns>
        public static bool DeleteHash(string key, string field)
        {
            if (string.IsNullOrEmpty(key) || string.IsNullOrEmpty(field))
            {
                throw new ArgumentNullException("参数异常！");
            }
            try
            {
                return RedisHelper.HDel(key, new string[] { field }) > 0;
            }
            catch (Exception ex)
            {
                LogHelper.Error("RedisClient.DeleteHash", ex);
                return false;
            }
        }

        /// <summary>
        /// 缓存壳
        /// </summary>
        /// <typeparam name="T">泛型对象</typeparam>
        /// <param name="key">键</param>
        /// <param name="expireSeconds">过期时间（单位：秒）</param>
        /// <param name="getData">缓存数据</param>
        /// <returns></returns>
        public static T CacheShell<T>(string key, int expireSeconds, Func<T> getData)
        {
            return RedisHelper.CacheShell<T>(key, expireSeconds, getData);
        }

        /// <summary>
        /// 缓存壳
        /// </summary>
        /// <typeparam name="T">泛型对象</typeparam>
        /// <param name="key">键</param>
        /// <param name="expireSeconds">过期时间（单位：秒）</param>
        /// <param name="getData">缓存数据</param>
        /// <returns></returns>
        public static async Task<T> CacheShellAsync<T>(string key, int expireSeconds, Func<Task<T>> getData)
        {
            return await RedisHelper.CacheShellAsync(key, expireSeconds, getData);
        }

        /// <summary>
        ///  hash缓存壳
        /// </summary>
        /// <typeparam name="T">泛型对象</typeparam>
        /// <param name="key">键</param>
        /// <param name="field">字段值</param>
        /// <param name="expireSeconds">过期时间（单位：秒）</param>
        /// <param name="getData">缓存数据</param>
        /// <returns></returns>
        public static T CacheShellHash<T>(string key, string field, int expireSeconds, Func<T> getData)
        {
            return RedisHelper.CacheShell<T>(key, field, expireSeconds, getData);
        }

        /// <summary>
        /// 普通订阅-需谨慎使用
        /// </summary>
        /// <param name="channels">队列</param>
        public static void Subscribe(params (string, Action<CSRedis.CSRedisClient.SubscribeMessageEventArgs>)[] channels)
        {
            RedisHelper.Subscribe(channels);
        }

        /// <summary>
        /// 发布消息-需谨慎使用
        /// </summary>
        /// <param name="channel">队列</param>
        /// <param name="message">消息</param>
        public static void Publish(string channel, string message)
        {
            RedisHelper.Publish(channel, message);
        }
    }
}
