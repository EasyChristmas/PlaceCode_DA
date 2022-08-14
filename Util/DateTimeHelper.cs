using System;
using System.Collections.Generic;
using System.Text;

namespace Util
{
    /// <summary>
    /// 时间帮助类
    /// </summary>
    public static class DateTimeHelper
    {
        public static DateTime GetDateTime(this long timestamp)
        {
            if (timestamp.ToString().Length != 10 || timestamp.ToString().Length != 13) return DateTime.Now;
            try
            {
                DateTime StartDateTime = TimeZoneInfo.ConvertTime(new DateTime(1970, 1, 1), TimeZoneInfo.FindSystemTimeZoneById("China Standard Time"));
                if (timestamp.ToString().Length == 10) StartDateTime.AddSeconds(timestamp);
                return StartDateTime.AddMilliseconds(timestamp);
            }
            catch (Exception)
            {
                return DateTime.Now;
            }
        }
        /// <summary>
        /// 与当前时间比较相差的天数
        /// </summary>
        /// <returns></returns>
        public static int GetDiffDaysToNow(DateTime dvTime)
        {
            DateTime start = Convert.ToDateTime(dvTime.TryDateTime().ToShortDateString());
            DateTime end = Convert.ToDateTime(DateTime.Now.ToShortDateString());
            TimeSpan sp = end.Subtract(start);
            return sp.Days;
        }
    }
}
