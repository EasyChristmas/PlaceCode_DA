using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace Util
{
    public class LogHelper
    {
        /// <summary>
        /// 打印错误信息
        /// </summary>
        /// <param name="msg">标题</param>
        /// <param name="ex">异常</param>
        public static void Error(string msg, Exception ex = null)
        {
            var folder = Directory.GetCurrentDirectory() + "/logs/";
            var path = folder + DateTime.Today.ToString("yyyy-MM-dd") + "-error.txt";
            try
            {
                if (!Directory.Exists(folder))
                    Directory.CreateDirectory(folder);
                File.AppendAllLines(path, new[] {DateTime.Now.ToString("HH:mm:ss") + "：" + msg}, Encoding.UTF8);
                if (ex != null)
                {
                    File.AppendAllLines(path, new[] {"StackTrace：" + ex.StackTrace}, Encoding.UTF8);
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
        public static void Info(string msg)
        {
            try
            {
                var folder = Directory.GetCurrentDirectory() + "/logs/";
                var path = folder + DateTime.Today.ToString("yyyy-MM-dd") + "-info.txt";

                if (!Directory.Exists(folder))
                    Directory.CreateDirectory(folder);
                File.AppendAllLines(path, new[] {DateTime.Now.ToString("HH:mm:ss") + "：" + msg}, Encoding.UTF8);
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
        public static void SocketError(string msg, Exception ex = null)
        {
            var folder = Directory.GetCurrentDirectory() + "/logs/socket/";
            var path = folder + DateTime.Today.ToString("yyyy-MM-dd") + "-error.txt";
            try
            {
                if (!Directory.Exists(folder))
                    Directory.CreateDirectory(folder);
                File.AppendAllLines(path, new[] { DateTime.Now.ToString("HH:mm:ss") + "：" + msg }, Encoding.UTF8);
                if (ex != null)
                {
                    File.AppendAllLines(path, new[] { "StackTrace：" + ex.StackTrace }, Encoding.UTF8);
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
        public static void SocketInfo(string msg)
        {
            try
            {
                var folder = Directory.GetCurrentDirectory() + "/logs/socket/";
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

    }

}
