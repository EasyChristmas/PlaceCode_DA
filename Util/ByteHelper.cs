using System;
using System.Collections.Generic;
using System.Text;

namespace Util
{
    public static class ByteHelper
    {
        /// <summary>
        /// 将byte数组转换为字符串
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        public static string ByteToStr(byte[] data)
        {
            int size = data.Length;
            string resault = "";
            for (int i = 0; i < size; i++)
            {
                resault = resault + " " + Convert.ToString(data[i], 16).PadLeft(2, '0');
            }
            string strReceiveData = resault.Trim();
            return strReceiveData;
        }
        public static string ToHex(byte[] data)
        {
            string ret = null;

            //TODO 将字节数组转换为字符串
            if (data != null && data.Length > 0)
            {
                StringBuilder sb = new StringBuilder();
                foreach (byte b in data)
                {
                    //分别获取高四位，低四位的内容，将两个数值，转为字符
                    int h = (b >> 4) & 0x0f;
                    int l = b & 0x0f;
                    char ch, cl;
                    if (h > 9)
                    {
                        ch = (char)('A' + (h - 10));
                    }
                    else
                    {  //0--9
                        ch = (char)('0' + h);
                    }

                    if (l > 9)
                    {
                        cl = (char)('A' + (l - 10));
                    }
                    else
                    {  //0--9
                        cl = (char)('0' + l);
                    }


                    sb.Append(ch).Append(cl);
                }
                ret = sb.ToString();
            }

            return ret;
        }
        /// <summary>
        /// 将16进制Ascii码的描述文本转换为对应的字符
        /// </summary>
        /// <param name="asciiStr"></param>
        /// <returns></returns>
        public static string ConvertAsciiToStr(string asciiStr)
        {
            byte[] buff = new byte[asciiStr.Length / 2];
            int index = 0;
            for (int i = 0; i < asciiStr.Length; i+=2)
            {
                buff[index] = Convert.ToByte(asciiStr.Substring(i,2),16);
                ++index;
            }
            return Encoding.Default.GetString(buff);
        }
        /// <summary>
        /// hex文本转换为byte数组
        /// </summary>
        /// <param name="hexStr"></param>
        /// <returns></returns>
        public static byte[] HexStringToBytes(string hexStr)
        {
            if (string.IsNullOrEmpty(hexStr))
            {
                return new byte[0];
            }

            if (hexStr.StartsWith("0x"))
            {
                hexStr = hexStr.Remove(0, 2);
            }

            var count = hexStr.Length;

            if (count % 2 == 1)
            {
                throw new ArgumentException("Invalid length of bytes:" + count);
            }

            var byteCount = count / 2;
            var result = new byte[byteCount];
            for (int ii = 0; ii < byteCount; ++ii)
            {
                var tempBytes = Byte.Parse(hexStr.Substring(2 * ii, 2), System.Globalization.NumberStyles.HexNumber);
                result[ii] = tempBytes;
            }

            return result;
        }
        /// <summary>
        /// 计算校验字符串
        /// </summary>
        /// <returns></returns>
        public static string GetCheckStr(byte[] byteArr)
        {
            return "";
        }
    }
}
