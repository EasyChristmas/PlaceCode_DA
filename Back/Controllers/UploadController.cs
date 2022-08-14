using Microsoft.AspNetCore.Mvc;
using SDK.Request.Common;
using System.Net.Http.Headers;
using Util;

namespace Back.Controllers
{

    /// <summary>
    /// 图片上传
    /// </summary>
    public class UploadController : BaseController
    {
        private IWebHostEnvironment _environment;

        public UploadController(IWebHostEnvironment environment)
        {
            _environment = environment;
        }


        [RequestSizeLimit(100_000_000)]
        public IActionResult UploadFile()
        {
            HttpContext context = Request.HttpContext;
            context.Response.ContentType = "application/json";
            if (context.Request.Form.Files.Count == 0)
                return HttpBadRequest("上传未找到文件！");
            else
            {
                var file = Request.Form.Files[0];

                //存储文件夹
                string path = Request.Form["path"];
                //得到当前人的id
                string userId = CurrentUser == null ? "" : CurrentUser.Id.ToString();
                int? zoomWidth = Request.Form["zoomWidth"].TryInt(null);
                int? zoomHeight = Request.Form["zoomHeight"].TryInt(null);
                //是否重命名
                var isRename = Request.Form["isRename"].TryBool(true);
                if (string.IsNullOrEmpty(path)) path = "Editor";

                //转换为文件流格式
                var parsedContentDisposition = ContentDispositionHeaderValue.Parse(file.ContentDisposition);
                //上传到本地
                var suffix = parsedContentDisposition.FileName.Substring(parsedContentDisposition.FileName.LastIndexOf(".")).ToLower();
                //var filter = ConfigurationManager.AppSettings["FileType"] ?? string.Empty;
                //if (!filter.Contains(suffix) && !string.IsNullOrWhiteSpace(string.Empty))
                //{
                //    return HttpBadRequest("文件格式不支持！");
                //}

                //上传到文件服务器
                var bytes = StreamToBytes(file.OpenReadStream());
                try
                {
                    var timeStamp = DateTime.Now;
                    string appkey = "slxhdidyzlsenzkdqld";
                    const string apiVersion = "1.0.0.0";
                    string secret = "YCFIMGSERVER";

                    var reqAppKey = Request.Form["appkey"].TryString(string.Empty);
                    if (!string.IsNullOrEmpty(reqAppKey))
                        appkey = reqAppKey;

                    var guId = Guid.NewGuid().ToString().Replace("-", "");
                    var fileName = isRename ? (guId + suffix).Replace("\"", "") : parsedContentDisposition.FileName.Replace("\"", "");
                    var json = new UploadPostRequest
                    {
                        Files = bytes,
                        AppKey = appkey,
                        FileName = fileName,
                        Sign = SecurityHelper.ImgServerSign(appkey, timeStamp.ToString("yyyy-MM-dd HH:mm:ss"), apiVersion, secret),
                        Folder = path,
                        TimeStamp = timeStamp,
                        Channel = 6,
                        ZoomHeight = zoomHeight,
                        ZoomWidth = zoomWidth,
                        UserId = string.IsNullOrEmpty(userId) ? (int?)null : int.Parse(userId),
                        ApiVersion = apiVersion
                    }.ToJson();

                    var jsonResult = WebHelper.Post(Configuration["ImgServer:Url"] + "Upload/Index", "application/json", json);

                    if (path.Contains("TouYiFile"))
                    {
                        return Content(jsonResult);
                    }
                    else
                    {
                        var jsonObj = new JsonObject(jsonResult)
                        {
                            ["fileName"] = new JsonProperty(fileName),
                            ["guid"] = new JsonProperty(guId)
                        };

                        return Content(jsonObj.ToString());
                    }

                }
                catch (Exception ex)
                {
                    var baseEx = ex.GetBaseException() ?? ex;
                    return HttpBadRequest(ex.Message);
                }
            }
        }

        /// <summary>
        /// 重命名文件名
        /// </summary>
        /// <returns></returns>
        private static string Rename()
        {
            var random = new Random();
            return DateTime.Now.ToString("yyyyMMddHHmmssffff") + random.Next(10000);
        }

        /// <summary>
        /// 流转化为数组
        /// </summary>
        /// <param name="stream"></param>
        /// <returns></returns>
        private byte[] StreamToBytes(Stream stream)
        {
            var bytes = new byte[stream.Length];
            stream.Read(bytes, 0, bytes.Length);
            // 设置当前流的位置为流的开始 
            stream.Seek(0, SeekOrigin.Begin);
            return bytes;
        }
    }
}
