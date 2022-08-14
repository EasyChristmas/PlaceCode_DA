using Snowflake.Core;
using System;
using System.Collections.Generic;
using System.Text;

namespace Util
{
    /// <summary>
    /// 雪花ID生成帮助类
    /// </summary>
    public class SnowflakeHelper
    {
        private static readonly IdWorker worker = new IdWorker(1, 1);

        private static readonly object o = new object();

        /// <summary>
        /// 生成的雪花Id
        /// </summary>
        /// <returns></returns>
        public static long GetID()
        {
            lock (o)
            {
                return worker.NextId();
            }
        }
    }
}
