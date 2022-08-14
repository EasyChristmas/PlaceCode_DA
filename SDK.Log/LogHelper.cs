using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace SDK.Log
{
    public class LogHelper
    {
        /// <summary>
        /// 打印错误信息
        /// </summary>
        /// <param name="msg">标题</param>
        public static void Error(string msg, params string[] tags)
        {
            LogService.Error(msg, tags);
            var folder = Directory.GetCurrentDirectory() + "\\logs\\";
            var path = folder + DateTime.Today.ToString("yyyy-MM-dd") + "-error.txt";
            try
            {
                if (!Directory.Exists(folder))
                    Directory.CreateDirectory(folder);
                File.AppendAllLines(path, new[] { DateTime.Now.ToString("HH:mm:ss") + "：" + msg }, Encoding.UTF8);
            }
            catch (Exception)
            {
                return;
            }
        }

        /// <summary>
        /// 打印错误信息
        /// </summary>
        /// <param name="msg">标题</param>
        /// <param name="ex">异常</param>
        public static void Error(string msg, Exception ex = null)
        {
            LogService.Error(msg, ex ?? new Exception(msg));

            var folder = Directory.GetCurrentDirectory() + "\\logs\\";
            var path = folder + DateTime.Today.ToString("yyyy-MM-dd") + "-error.txt";
            try
            {
                if (!Directory.Exists(folder))
                    Directory.CreateDirectory(folder);
                File.AppendAllLines(path, new[] { DateTime.Now.ToString("HH:mm:ss") + "：" + msg }, Encoding.UTF8);
                if (ex != null)
                {
                    File.AppendAllLines(path, new[] { "StackTrace：" + ex.StackTrace, "Message：" + ex.Message }, Encoding.UTF8);
                }
            }
            catch (Exception)
            {
                return;
            }
        }

        /// <summary>
        /// 打印消息信息
        /// </summary>
        /// <param name="msg">标题</param>
        public static void Info(string msg, params string[] tags)
        {
            LogService.Info(msg, tags);
            try
            {
                var folder = Directory.GetCurrentDirectory() + "\\logs\\";
                var path = folder + DateTime.Today.ToString("yyyy-MM-dd") + "-info.txt";

                if (!Directory.Exists(folder))
                    Directory.CreateDirectory(folder);
                File.AppendAllLines(path, new[] { DateTime.Now.ToString("HH:mm:ss") + "：" + msg }, Encoding.UTF8);
            }
            catch (Exception)
            {
                return;
            }
        }

        /// <summary>
        /// 跟踪  
        /// </summary>
        public static void Trace(string message, params string[] tags)
        {
            LogService.Trace(message, tags);
            try
            {
                var folder = Directory.GetCurrentDirectory() + "\\logs\\";
                var path = folder + DateTime.Today.ToString("yyyy-MM-dd") + "-trace.txt";

                if (!Directory.Exists(folder))
                    Directory.CreateDirectory(folder);
                File.AppendAllLines(path, new[] { DateTime.Now.ToString("HH:mm:ss") + "：" + message }, Encoding.UTF8);
            }
            catch (Exception)
            {
                return;
            }
        }

        /// <summary>
        /// 调试    
        /// </summary>
        public static void Debug(string message, params string[] tags)
        {
            LogService.Debug(message, tags);
            try
            {
                var folder = Directory.GetCurrentDirectory() + "\\logs\\";
                var path = folder + DateTime.Today.ToString("yyyy-MM-dd") + "-debug.txt";

                if (!Directory.Exists(folder))
                    Directory.CreateDirectory(folder);
                File.AppendAllLines(path, new[] { DateTime.Now.ToString("HH:mm:ss") + "：" + message }, Encoding.UTF8);
            }
            catch (Exception)
            {
                return;
            }
        }

        /// <summary>
        /// 警告  
        /// </summary>
        public static void Warn(string message, params string[] tags)
        {
            LogService.Warn(message, tags);
            try
            {
                var folder = Directory.GetCurrentDirectory() + "\\logs\\";
                var path = folder + DateTime.Today.ToString("yyyy-MM-dd") + "-warn.txt";

                if (!Directory.Exists(folder))
                    Directory.CreateDirectory(folder);
                File.AppendAllLines(path, new[] { DateTime.Now.ToString("HH:mm:ss") + "：" + message }, Encoding.UTF8);
            }
            catch (Exception)
            {
                return;
            }
        }
    }

}
