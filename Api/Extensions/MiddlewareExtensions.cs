using Microsoft.Extensions.Configuration;
//using StackExchange.Profiling;
//using StackExchange.Profiling.Storage;
//using Util;

namespace Api.Extensions
{
    public static class MiddlewareExtensions
    {
        //public static MiniProfilerOptions MiniProfilerOption(MiniProfilerOptions options, IConfigurationRoot Configuration)
        //{
        //    // 设定弹出窗口的位置是左下角
        //    options.PopupRenderPosition = RenderPosition.BottomLeft;
        //    // 设定在弹出的明细窗口里会显式Time With Children这列
        //    options.PopupShowTimeWithChildren = true;
        //    // 设定访问分析结果URL的路由基地址
        //    options.RouteBasePath = "/profiler";

        //    var enable = Configuration["MiniProfiler:Enable"].TryBool(false);
        //    if (enable)
        //    {
        //        #region 数据持久化
        //        try
        //        {
        //            // MySql持久化
        //            //options.Storage = new MySqlStorage(Configuration["MiniProfiler:ConnectionString"].ToString());

        //            // MongoDB持久化
        //            var mongodbStorage = new MongoDbStorage(Configuration["MiniProfiler:ConnectionString"].ToString());
        //            options.Storage = mongodbStorage;
        //            mongodbStorage.WithIndexCreation();
        //            mongodbStorage.GetUnviewedIds("");
        //        }
        //        catch (System.Exception)
        //        {
        //        }
        //        #endregion
        //    }

        //    return options;
        //}
    }
}
