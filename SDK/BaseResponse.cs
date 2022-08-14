using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SDK
{
    /// <summary>
    /// 对象基类
    /// </summary>
    public class BaseResponse
    {
        /// <summary>
        /// 错误码
        /// </summary>
        public string ErrCode { get; set; }

        /// <summary>
        /// 错误信息
        /// </summary>
        public string ErrMsg { get; set; }

        /// <summary>
        /// 响应结果是否正确
        /// </summary>
        public bool IsSucceed
        {
            get
            {
                return (string.IsNullOrEmpty(this.ErrCode) && string.IsNullOrEmpty(this.ErrMsg));
            }
        }
    }

    /// <summary>
    /// 对象基类
    /// </summary>
    public class AppBaseResponse
    {
        /// <summary>
        /// 错误码
        /// </summary>
        public int? ErrCode { get; set; }

        /// <summary>
        /// 错误信息
        /// </summary>
        public string ErrMsg { get; set; }

        /// <summary>
        /// 响应结果是否正确
        /// </summary>
        public bool IsSuccess
        {
            get
            {
                return !(this.ErrCode.HasValue && this.ErrCode > 0) && string.IsNullOrEmpty(this.ErrMsg);
            }
        }
    }

    /// <summary>
    /// 对象基类
    /// </summary>
    public class AppBaseResponse<T>
    {
        /// <summary>
        /// 响应
        /// </summary>
        public T Data { get; set; }

        /// <summary>
        /// 错误码
        /// </summary>
        public string ErrCode { get; set; }

        /// <summary>
        /// 错误信息
        /// </summary>
        public string ErrMsg { get; set; }

        /// <summary>
        /// 响应结果是否正确
        /// </summary>
        public bool IsSuccess
        {
            get
            {
                return (string.IsNullOrEmpty(this.ErrCode) && string.IsNullOrEmpty(this.ErrMsg));
            }
        }
    }

    /// <summary>
    /// 对象基类
    /// </summary>
    public class BaseResponse<T>
    {
        /// <summary>
        /// 响应是否成功
        /// </summary>
        public bool IsSuccess
        {
            get
            {
                return string.IsNullOrEmpty(this.ErrMsg);
            }
        }

        /// <summary>
        /// 响应错误消息
        /// </summary>
        public string ErrMsg { get; set; }

        /// <summary>
        /// 响应
        /// </summary>
        public T Data { get; set; }
    }

    /// <summary>
    /// 对象基类
    /// </summary>
    public class BaseResponseCode<T>
    {
        /// <summary>
        /// 响应是否成功
        /// </summary>
        public bool IsSuccess { get; set; }

        /// <summary>
        /// 业务码 0 成功, 101 失败
        /// </summary>
        public int Code { get; set; }

        /// <summary>
        ///消息
        /// </summary>
        public string Msg { get; set; }

        /// <summary>
        /// 响应
        /// </summary>
        public T Data { get; set; }
    }

}
