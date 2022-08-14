using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace Util
{
    /// <summary>
    /// 百度地图帮助
    /// </summary>
    public static class BMapHelper
    {
        /// <summary>
        /// 百度地图GPS转换
        /// </summary>
        /// <param name="longitude"></param>
        /// <param name="latitude"></param>
        /// <returns></returns>
        public static async Task<Tuple<decimal, decimal>> ConvertGPS(decimal longitude, decimal latitude)
        {
            string path = "http://api.map.baidu.com/ag/coord/convert?from=0&to=4&x=" + longitude + "&y=" + latitude + "";
            using (var client = new HttpClient())
            {
                var strResult = await client.GetAsync(path).Result.Content.ReadAsStringAsync();
                MapConvert mapConvert = new MapConvert();
                mapConvert = JsonConvert.DeserializeObject<MapConvert>(strResult);
                string lon = mapConvert.x;
                string lat = mapConvert.y;
                byte[] xBuffer = Convert.FromBase64String(lon);
                string strX = Encoding.UTF8.GetString(xBuffer, 0, xBuffer.Length);

                byte[] yBuffer = Convert.FromBase64String(lat);
                string strY = Encoding.UTF8.GetString(yBuffer, 0, yBuffer.Length);

                return new Tuple<decimal, decimal>(Convert.ToDecimal(strX), Convert.ToDecimal(strY));
            }
        }
        /// <summary>
        /// 腾讯地图坐标转换为百度坐标
        /// </summary>
        /// <param name="lon"></param>
        /// <param name="lat"></param>
        /// <returns></returns>
        public static Tuple<decimal, decimal> Map_txt2bd(double lon, double lat)
        {
            double bd_lon = lon;
            double bd_lat = lat;
            double x_pi = 3.14159265358979324;
            double x = lon, y = lat;
            double z = Math.Sqrt(x * x + y * y) + 0.00002 * Math.Sin(y * x_pi);
            double theta = Math.Atan2(y, x) + 0.000003 * Math.Cos(x * x_pi);
            bd_lon = z * Math.Cos(theta) + 0.0065;
            bd_lat = z * Math.Sin(theta) + 0.006;
            return new Tuple<decimal, decimal>(Convert.ToDecimal(bd_lon), Convert.ToDecimal(bd_lat));
        }
        /// <summary>
        /// 百度地图坐标转换为腾讯地图
        /// </summary>
        /// <param name="lon"></param>
        /// <param name="lat"></param>
        /// <returns></returns>
        public static Tuple<decimal, decimal> Map_bd2tx(double lon,double lat)
        {
            double tx_lat;
            double tx_lon;
            double x_pi = 3.14159265358979324;
            double x = lon - 0.0065, y = lat - 0.006;
            double z = Math.Sqrt(x * x + y * y) - 0.00002 * Math.Sin(y * x_pi);
            double theta = Math.Atan2(y, x) - 0.000003 * Math.Cos(x * x_pi);
            tx_lon = z * Math.Cos(theta);
            tx_lat = z * Math.Sin(theta);
            return new Tuple<decimal, decimal>(Convert.ToDecimal(tx_lon), Convert.ToDecimal(tx_lat));
        }

    }
    public class MapConvert
    {
        public string error { get; set; }
        public string x { get; set; }
        public string y { get; set; }
    }
}
