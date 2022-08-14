using System;
using Microsoft.AspNetCore.Http;

namespace Api
{
    public static class WebExtend
    {
        /// <summary>
        /// 根据请求获取编码
        /// </summary>
        /// <param name="req">Html辅助类</param>
        /// <returns></returns>
        public static string GetCode(this HttpRequest req)
        {
            //path 请求的路径：/api/jt/org/post 或者 /api/jt/org/put/1234
            var path = req.Path.Value.Replace("/api/", "");
            var lastParam = path.Substring(path.LastIndexOf("/") + 1);
            int param = 0;
            if (int.TryParse(lastParam, out param))
                path = path.Substring(0, path.LastIndexOf("/"));
            var code = path.Replace("/", "-") + "-" + req.Method.ToLower();
            return code;
        }
    }
}
