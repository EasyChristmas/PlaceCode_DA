using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SDK.Request.Common
{
    public class UploadPostRequest
    {
        /// <summary>
        /// api 版本
        /// </summary>
        public string ApiVersion { get; set; } //默认 1.0.0.0

        /// <summary>
        /// 应用Id
        /// </summary>
        public int AppId { get; set; }

        /// <summary>
        /// 应用key
        /// </summary>
        public string AppKey { get; set; }

        /// <summary>
        /// 时间戳
        /// </summary>
        public DateTime TimeStamp { get; set; }

        /// <summary>
        /// 签名
        /// </summary>
        public string Sign { get; set; }

        /// <summary>
        /// 渠道类型
        /// </summary>
        public int Channel { get; set; }

        /// <summary>
        /// App 的版本
        /// </summary>
        public string Version { get; set; }

        /// <summary>
        /// Ip地址
        /// </summary>
        public string Ip { get; set; }
        /// <summary>
        /// 请求的字段，用英文逗号隔开
        /// </summary>
        public string Fields { set; get; }

        /// <summary>
        /// 上传文件二进制流
        /// </summary>
        public byte[] Files { get; set; }

        /// <summary>
        /// 上传文件Base64
        /// </summary>
        public string File { get; set; }

        /// <summary>
        /// 文件夹
        /// </summary>
        public string Folder { get; set; }

        /// <summary>
        /// 文件名
        /// </summary>
        public string FileName { get; set; }

        /// <summary>
        /// 用户编号
        /// </summary>
        public int? UserId { get; set; }

        /// <summary>
        /// 缩放大小集合
        /// </summary>
        public List<string> ZoomSizeList { get; set; }

        /// <summary>
        /// 缩略宽度
        /// </summary>
        public int? ZoomWidth { get; set; }

        /// <summary>
        /// 缩放高度
        /// </summary>
        public int? ZoomHeight { get; set; }
    }
}
