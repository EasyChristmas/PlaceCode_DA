using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;

namespace Util
{
    public class SeauenceHelper
    {
        private static  readonly object lockObject = new object();
        /// <summary>
        /// 生成时间戳，标准北京时间，时区为东八区，自1970年1月1日 0点0分0秒以来的秒数，返回毫秒数
        /// </summary>
        /// <returns>时间戳</returns>
        public static string GenerateTimeStamp()
        {
            TimeSpan ts = DateTime.UtcNow - new DateTime(1970, 1, 1, 0, 0, 0, 0);
            return Convert.ToInt64(ts.TotalMilliseconds).ToString();
        }

        /// <summary>
        /// 生成随机串，随机串包含字母或数字
        /// </summary>
        /// <returns>随机串</returns>
        public static string GenerateNonceStr()
        {
            return Guid.NewGuid().ToString().Replace("-", "");
        }

        /// <summary>
        /// 生成订单号
        /// </summary>
        /// <returns></returns>
        public static string GenerateOrderNo()
        {
            return $"{ DateTime.Now.ToString("yyyyMMddHHmmss")}{ new Random().Next(1000, 9999)}";
        }

        /// <summary>
        /// 生成制定位数的随机码
        /// </summary>
        /// <param name="length"></param>
        /// <returns></returns>
        public static string GenerateRandomCode(int length)
        {
            string allChar = "0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F,G,H,I,G,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z";
            string[] allCharArray = allChar.Split(',');
            string randomCode = "";
            int temp = -1;
            Random rand = new Random();
            for (int i = 0; i < length; i++)
            {
                if (temp != -1)
                {
                    rand = new Random(i * temp * ((int)DateTime.Now.Ticks));
                }
                int t = rand.Next(35);
                if (temp == t)
                {
                    return GenerateRandomCode(length);
                }
                temp = t;
                randomCode += allCharArray[t];
            }
            return randomCode;
        }
        /// <summary>
        /// 获取时间类型的Code+3位随机数字字母码
        /// </summary>
        /// <returns>20位的唯一编号</returns>
        public static string GetTimeCode()
        {
            Monitor.Enter(lockObject);
            try
            {
               return DateTime.Now.ToString("yyyyMMddHHmmssfff") + GenerateRandomCode(3);
            }
            catch
            {
                return string.Empty;
            }
            finally
            {
                Monitor.Exit(lockObject);
            }
        }
    }
}
