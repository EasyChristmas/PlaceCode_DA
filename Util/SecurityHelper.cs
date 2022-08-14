using System;
using System.Collections.Generic;
using System.IO;
using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.DependencyInjection;
using Org.BouncyCastle.Crypto.Parameters;
using Org.BouncyCastle.Security;

namespace Util
{
    public static class SecurityHelper
    {
        //字符编码成HEX
        public static string EncodeHexStr(int dataCoding, string realStr)
        {
            var strhex = "";
            try
            {
                byte[] bytSource = null;
                if (dataCoding == 15)
                    bytSource = Encoding.GetEncoding("GBK").GetBytes(realStr);
                else if (dataCoding == 8)
                    bytSource = Encoding.BigEndianUnicode.GetBytes(realStr);
                else
                    bytSource = Encoding.ASCII.GetBytes(realStr);

                for (var i = 0; i < bytSource.Length; i++)
                    strhex = strhex + i.ToString("X2");
            }
            catch (Exception err)
            {
                 LogHelper.Error(err.ToString());
            }
            return strhex;
        }

        #region Md5加密 ：Md5

        /// <summary>
        /// Md5加密
        /// </summary>
        /// <param name="text">要加密的内容</param>
        /// <returns></returns>
        public static string Md5(string text)
        {
            var md5 = new MD5CryptoServiceProvider();

            var result = md5.ComputeHash(Encoding.Default.GetBytes(text));
            md5.Clear();
            var sTemp = new StringBuilder();
            foreach (byte t in result)
                sTemp.Append(t.ToString("x").PadLeft(2, '0'));
            return sTemp.ToString().ToLower();
        }

        ///<summary>
        /// 字符串MD5加密
        ///</summary>
        ///<param name="str">要加密的字符串</param>
        ///<param name="charset">编码方式</param>
        ///<returns>密文</returns>
        public static string CharsetMD5(string str, string charset)
        {
            byte[] buffer = System.Text.Encoding.GetEncoding(charset).GetBytes(str);
            try
            {
                System.Security.Cryptography.MD5CryptoServiceProvider check;
                check = new System.Security.Cryptography.MD5CryptoServiceProvider();
                byte[] somme = check.ComputeHash(buffer);
                string ret = "";
                foreach (byte a in somme)
                {
                    if (a < 16)
                        ret += "0" + a.ToString("X");
                    else
                        ret += a.ToString("X");
                }
                return ret.ToLower();
            }
            catch
            {
                throw;
            }
        }

        /// <summary>
        /// MD5加盐
        /// </summary>
        /// <param name="text"></param>
        /// <param name="salt"></param>
        /// <returns></returns>
        public static string Md5(string text, string salt)
        {
            var md5 = new MD5CryptoServiceProvider();
            text = text + "{" + salt + "}";
            var result = md5.ComputeHash(Encoding.Default.GetBytes(text));
            md5.Clear();
            var sTemp = new StringBuilder();
            foreach (byte t in result)
                sTemp.Append(t.ToString("x").PadLeft(2, '0'));
            return sTemp.ToString().ToLower();
        }

        public static string GetSalt()
        {
            RandomNumberGenerator saltNumber = new RNGCryptoServiceProvider();
            byte[] s = new byte[10];
            saltNumber.GetBytes(s);
            return Convert.ToBase64String(s); //将盐值转化为字符串
        }
        #endregion

        #region 加密 ： Encrypt

        const string Key64 = "XCHONGKJ";//"XIAOHUV3";//注意了，是8个字符，64位
        const string Iv64 = "XCHONGKJ";//"XIAOHUV3";

        /// <summary>
        /// 加密数据 ： 可逆 对应 Decrypt
        /// </summary>
        /// <param name="data">要加密的字符串</param>
        /// <returns>加密后的字符串</returns>
        public static string Encrypt(string data)
        {
            var byKey = Encoding.ASCII.GetBytes(Key64);
            var byIv = Encoding.ASCII.GetBytes(Iv64);
            var cryptoProvider = new DESCryptoServiceProvider();
            using (var ms = new MemoryStream())
            {
                var cst = new CryptoStream(ms, cryptoProvider.CreateEncryptor(byKey, byIv), CryptoStreamMode.Write);
                using (var sw = new StreamWriter(cst))
                {
                    sw.Write(data);
                    sw.Flush();
                    cst.FlushFinalBlock();
                    return Convert.ToBase64String(ms.GetBuffer(), 0, (int)ms.Length);
                }
            }
        }

        #endregion

        #region 解密 ： Decrypt

        /// <summary>
        /// 解密
        /// </summary>
        /// <param name="data">要解密的数据</param>
        /// <returns>解密后的数据</returns>
        public static string Decrypt(string data)
        {
            //处理+ 号
            data = data.Replace(' ', '+');
            var byKey = Encoding.ASCII.GetBytes(Key64);
            var byIv = Encoding.ASCII.GetBytes(Iv64);
            byte[] byEnc;
            try
            {
                byEnc = Convert.FromBase64String(data);
            }
            catch
            {
                return "";
            }
            var cryptoProvider = new DESCryptoServiceProvider();
            using (var ms = new MemoryStream(byEnc))
            {
                var cryptoProviderCreateDecryptor = cryptoProvider.CreateDecryptor(byKey, byIv);
                var cst = new CryptoStream(ms, cryptoProviderCreateDecryptor, CryptoStreamMode.Read);
                using (var pMemoryStreamTemp = new MemoryStream())
                {
                    while (cst.Read(byEnc, 0, 1) > 0)
                    {
                        pMemoryStreamTemp.Write(byEnc, 0, 1);
                    }
                    return Encoding.UTF8.GetString(pMemoryStreamTemp.ToArray());
                }
            }
        }

        #endregion

        #region RSA签名
        /// <summary>
        /// RSA签名
        /// </summary>
        /// <param name="content">数据</param>
        /// <param name="privateKey">RSA密钥</param>
        /// <returns></returns>
        public static string RsaEncrypt(string content, string privateKey)
        {
            var signer = SignerUtilities.GetSigner("SHA1withRSA");
            //将java格式的rsa密钥转换成.net格式
            var privateKeyParam = (RsaPrivateCrtKeyParameters)PrivateKeyFactory.CreateKey(Convert.FromBase64String(privateKey));
            signer.Init(true, privateKeyParam);
            var plainBytes = Encoding.UTF8.GetBytes(content);
            signer.BlockUpdate(plainBytes, 0, plainBytes.Length);
            var signBytes = signer.GenerateSignature();
            return Convert.ToBase64String(signBytes);
        }
        #endregion

        #region RSA验签

        /// <summary>
        /// RSA验签
        /// </summary>
        /// <param name="content">内容</param>
        /// <param name="publicKey">RSA公钥</param>
        /// <param name="signData">签名字段</param>
        /// <returns></returns>
        public static bool VerifySign(string content, string publicKey, string signData)
        {
            var signer = SignerUtilities.GetSigner("SHA1withRSA");
            var publicKeyParam = (RsaKeyParameters)PublicKeyFactory.CreateKey(Convert.FromBase64String(publicKey));
            signer.Init(false, publicKeyParam);
            var signBytes = Convert.FromBase64String(signData);
            var plainBytes = Encoding.UTF8.GetBytes(content);
            signer.BlockUpdate(plainBytes, 0, plainBytes.Length);
            var ret = signer.VerifySignature(signBytes);
            return ret;
        }

        #endregion

        /// <summary>
        /// 签名
        /// </summary>
        /// <param name="appKey">应用key</param>
        /// <param name="timeStamp">时间戳</param>
        /// <param name="version">版本</param>
        /// <param name="secret">密钥</param>
        /// <returns>签名字符串</returns>
        public static string ImgServerSign(string appKey, string timeStamp, string version, string secret)
        {
            var dictionary = new Dictionary<string, string>
                {
                    {"Version", version},
                    {"AppKey", appKey},
                    {"TimeStamp", timeStamp}
                };
            // 第一步：把字典按Key的字母顺序排序
            IDictionary<string, string> sortedParams = new SortedDictionary<string, string>(dictionary);
            IEnumerator<KeyValuePair<string, string>> dem = sortedParams.GetEnumerator();

            // 第二步：把所有参数名和参数值串在一起
            var query = new StringBuilder(secret);
            while (dem.MoveNext())
            {
                string key = dem.Current.Key;
                string value = dem.Current.Value;
                if (!string.IsNullOrEmpty(key) && !string.IsNullOrEmpty(value))
                {
                    query.Append(key).Append(value);
                }
            }

            // 第三步：使用MD5加密
            var md5 = MD5.Create();
            byte[] bytes = md5.ComputeHash(Encoding.UTF8.GetBytes(query.ToString()));

            // 第四步：把二进制转化为大写的十六进制
            var result = new StringBuilder();
            foreach (byte t in bytes)
            {
                string hex = t.ToString("X");
                if (hex.Length == 1)
                {
                    result.Append("0");
                }
                result.Append(hex);
            }

            return result.ToString();
        }


        ///<summary>
        ///电商Sign签名
        ///</summary>
        ///<param name="content">内容</param>
        ///<param name="keyValue">Appkey</param>
        ///<param name="charset">URL编码 </param>
        ///<returns>DataSign签名</returns>
        public static string GetSign(String content, String keyValue, String charset)
        {
            if (keyValue != null)
            {
                return base64(CharsetMD5(content + keyValue, charset), charset);
            }
            return base64(CharsetMD5(content, charset), charset);
        }

        /// <summary>
        /// base64编码
        /// </summary>
        /// <param name="str">内容</param>
        /// <param name="charset">编码方式</param>
        /// <returns></returns>
        public static string base64(String str, String charset)
        {
            return Convert.ToBase64String(System.Text.Encoding.GetEncoding(charset).GetBytes(str));
        }


        ///// <summary>
        ///// 签名
        ///// </summary>
        ///// <param name="appKey">应用key</param>
        ///// <param name="timeStamp">时间戳</param>
        ///// <param name="version">版本</param>
        ///// <param name="secret">密钥</param>
        ///// <returns>签名字符串</returns>
        //public static string Sign(string appKey, string timeStamp, string version, string secret)
        //{
        //    var dictionary = new Dictionary<string, string>
        //        {
        //            {"apiVersion", version},
        //            {"appKey", appKey},
        //            {"timeStamp", timeStamp}
        //        };
        //    // 第一步：把字典按Key的字母顺序排序
        //    IDictionary<string, string> sortedParams = new SortedDictionary<string, string>(dictionary);
        //    IEnumerator<KeyValuePair<string, string>> dem = sortedParams.GetEnumerator();

        //    // 第二步：把所有参数名和参数值串在一起
        //    var query = new StringBuilder(secret);
        //    while (dem.MoveNext())
        //    {
        //        string key = dem.Current.Key;
        //        string value = dem.Current.Value;
        //        if (!string.IsNullOrEmpty(key) && !string.IsNullOrEmpty(value))
        //        {
        //            query.Append(key).Append(value);
        //        }
        //    }

        //    // 第三步：使用MD5加密
        //    var md5 = MD5.Create();
        //    byte[] bytes = md5.ComputeHash(Encoding.UTF8.GetBytes(query.ToString()));

        //    // 第四步：把二进制转化为大写的十六进制
        //    var result = new StringBuilder();
        //    foreach (byte t in bytes)
        //    {
        //        string hex = t.ToString("X");
        //        if (hex.Length == 1)
        //        {
        //            result.Append("0");
        //        }
        //        result.Append(hex);
        //    }

        //    return result.ToString();
        //}
    }
}