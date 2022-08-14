using Exceptionless;
using Exceptionless.Logging;
using System;
using System.Collections.Generic;
using System.Text;

namespace SDK.Log
{
    /// <summary>
    /// 日志服务
    /// </summary>
    internal class LogService
    {
        /// <summary>
        /// 错误-记录错误
        /// </summary>
        public static void Error(string message, params string[] tags)
        {
            ExceptionlessClient.Default.CreateLog(message, LogLevel.Error).AddTags(tags).Submit();
        }

        /// <summary>
        /// 错误-记录错误详细信息   
        /// </summary>
        /// <param name="ex"></param>
        public static void Error(string msg, Exception ex)
        {
            ex.ToExceptionless().Submit();
        }

        /// <summary>
        /// 信息     
        /// </summary>
        public static void Info(string message, params string[] tags)
        {
            ExceptionlessClient.Default.CreateLog(message, LogLevel.Info).AddTags(tags).Submit();
        }

        /// <summary>
        /// 跟踪  
        /// </summary>
        public static void Trace(string message, params string[] tags)
        {
            ExceptionlessClient.Default.CreateLog(message, LogLevel.Trace).AddTags(tags).Submit();
        }

        /// <summary>
        /// 调试    
        /// </summary>
        public static void Debug(string message, params string[] tags)
        {
            ExceptionlessClient.Default.CreateLog(message, LogLevel.Debug).AddTags(tags).Submit();
        }

        /// <summary>
        /// 警告  
        /// </summary>
        public static void Warn(string message, params string[] tags)
        {
            ExceptionlessClient.Default.CreateLog(message, LogLevel.Warn).AddTags(tags).Submit();
        }
    }
}
