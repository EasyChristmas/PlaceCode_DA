using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using System.Reflection;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using System.Drawing;
using NPOI.HSSF.UserModel;
using NPOI.SS.UserModel;
using NPOI.XSSF.UserModel;

namespace Util
{
    public static class FileHelper
    {
        /// <summary>
        /// 导出excel的html格式
        /// </summary>
        /// <param name="title">导出列名</param>
        /// <param name="contentJson">导出内容</param>
        /// <returns></returns>
        public static string ExportHtml(string[] title, string contentJson)
        {
            if (title.Count() == 0)
                return string.Empty;

            var sphtml = new StringBuilder();

            #region 导出标题
            sphtml.Append("<table border=\"1px\" style=\"text-align: left; font-size: 10pt\" cellpadding=\"0\" cellspacing=\"0\">");
            sphtml.Append("<tr style=\"background-color: yellow;\">");
            foreach (var titleItem in title)
            {
                sphtml.Append(string.Format("<td align=\"center\">{0}</td>", titleItem));
            }
            sphtml.Append("</tr>");

            #endregion

            #region  导出内容
            try
            {
                dynamic contentList = Newtonsoft.Json.JsonConvert.DeserializeObject(contentJson);
                string[] propertyNames = null;

                for (var i = 0; i < contentList.Count; i++)
                {
                    sphtml.Append("<tr>");
                    JsonObject item = new JsonObject(contentList[i] + "");
                    propertyNames = item.GetPropertyNames();

                    if (propertyNames != null)
                    {
                        foreach (var contentItem in propertyNames)
                        {
                            sphtml.Append(string.Format("<td style=\"mso-number-format:'\\@';\" align=\"center\">{0}</td>", item[contentItem].ToString().Replace("\"", "").Replace("\\n", "<br/>").Replace("\\t", "&nbsp;")));
                        }
                    }
                    sphtml.Append("</tr>");
                }
            }
            catch (Exception ex)
            {
                LogHelper.Error("导出方法异常:", ex);
                throw new Exception("Json格式化错误");
            }
            sphtml.Append("</table>");

            #endregion

            return sphtml.ToString();

            #region 页面调用方式
            //string html = string.Empty;
            //try
            //{
            //	html = FileHelper.ExportHtml(title, contentJson);
            //}
            //catch (Exception ex)
            //{
            //	return new HttpResult(System.Net.HttpStatusCode.InternalServerError, ex.Message);
            //}
            //var buffer = Encoding.Default.GetBytes(html);
            //var fileName = System.Web.HttpUtility.UrlEncode($"产品经理在线产品统计{ DateTime.Now.ToString("yyyymmddhhmm")}.xls", System.Text.Encoding.UTF8);
            //Response.Headers["Content-Disposition"] = "attachment;filename=" + fileName;
            //return File(buffer, "application/ms-excel");
            #endregion

        }

        /// <summary>
        /// 导出excel的csv格式
        /// </summary>
        /// <param name="title">导出列名</param>
        /// <param name="contentJson">导出内容</param>
        /// <returns></returns>
        public static MemoryStream ExportCSV(string[] title, string contentJson)
        {
            MemoryStream output = new MemoryStream();
            StreamWriter writer = new StreamWriter(output, Encoding.UTF8);

            #region 输出标题，逗号分割（注意最后一列不加逗号）
            var writeTitle = string.Join(",", title);
            writer.Write(writeTitle);
            writer.WriteLine();
            #endregion

            #region  输出内容
            try
            {
                dynamic contentList = Newtonsoft.Json.JsonConvert.DeserializeObject(contentJson);
                for (var i = 0; i < contentList.Count; i++)
                {
                    JsonObject item = new JsonObject(contentList[i] + "");
                    var index = 1;
                    foreach (var contentItem in item.GetPropertyNames())
                    {
                        var writeContent = item[contentItem].ToString().Replace("\"", "");
                        if (writeContent.Contains(","))
                        {
                            writeContent = writeContent.Replace(",", " ");
                        }
                        //银行卡号字符串特殊处理
                        if (writeContent.Length >= 15 && writeContent.TryLong(0) >= 100000000000000)
                            writeContent = "\t" + writeContent;
                        //第一列
                        if (index == 1)
                            writer.Write($"{writeContent}" + ",\"");
                        //最后一列
                        else if (index == item.GetPropertyNames().Count())
                            writer.Write($"{writeContent}\",");
                        //中间列
                        else
                            writer.Write($"{writeContent}\",\"");

                        index++;
                    }
                    writer.WriteLine();
                }
            }
            catch (Exception ex)
            {
                LogHelper.Error("导出方法异常:", ex);
                throw new Exception("Json格式化错误");
            }
            #endregion

            writer.Flush();
            output.Position = 0;
            return output;
        }

        /// <summary>
        /// 到处excel的csv格式
        /// </summary>
        /// <typeparam name="T">数据类型</typeparam>
        /// <param name="title">导出列名</param>
        /// <param name="data">源数据集合(大数据量)</param>
        /// <param name="skip">跳过行数</param>
        /// <param name="take">需要行数</param>
        /// <returns></returns>
        public static Stream ExportBigDataCSV<T>(string[] title, List<T> data, int skip, int take)
        {
            try
            {
                Stream output = new MemoryStream();
                StreamWriter writer = new StreamWriter(output, Encoding.UTF8);

                #region 输出标题，逗号分割（注意最后一列不加逗号）

                if (skip == 0)
                {
                    var writeTitle = string.Join(",", title);
                    writer.Write(writeTitle);
                    writer.WriteLine();
                }

                #endregion

                #region  输出内容

                for (var i = skip; i < skip + take; i++)
                {
                    IDictionary<String, Object> item = (IDictionary<String, Object>)data[i];
                    int propertyCount = item.Count;
                    var index = 1;
                    foreach (var contentItem in item)
                    {
                        var value = contentItem.Value ?? "";
                        var writeContent = string.Empty;
                        if (value.GetType() == typeof(DateTime))
                            writeContent = ((DateTime)value).ToString("yyyy/MM/dd HH:mm:ss");
                        else
                            writeContent = value.ToString();


                        //特殊字符替换(\或,)
                        if (writeContent.Contains("\""))
                        {
                            writeContent = writeContent.Replace("\"", "");
                        }
                        if (writeContent.Contains(","))
                        {
                            writeContent = writeContent.Replace(",", " ");
                        }

                        //银行卡号字符串特殊处理
                        if (writeContent.Length >= 15)
                            writeContent = "\t" + writeContent;
                        //第一列
                        if (index == 1)
                            writer.Write($"{writeContent}" + ",\"");
                        //最后一列
                        else if (index == propertyCount)
                            writer.Write($"{writeContent}\",");
                        //中间列
                        else
                            writer.Write($"{writeContent}\",\"");

                        index++;
                    }
                    writer.WriteLine();
                }

                //=======过多的Json序列话操作浪费很多性能！！！！
                //for (var i = 0; i < data.Count; i++)
                //{
                //    JsonObject item = new JsonObject(data[i].ToJson() + "");

                //    var index = 1;
                //    foreach (var contentItem in item.GetPropertyNames())
                //    {
                //        var writeContent = item[contentItem].ToString().Replace("\"", "");
                //        //银行卡号字符串特殊处理
                //        if (writeContent.Length >= 15)
                //            writeContent = "\t" + writeContent;
                //        //第一列
                //        if (index == 1)
                //            writer.Write($"{writeContent}" + ",\"");
                //        //最后一列
                //        else if (index == item.GetPropertyNames().Count())
                //            writer.Write($"{writeContent}\",");
                //        //中间列
                //        else
                //            writer.Write($"{writeContent}\",\"");

                //        index++;
                //    }
                //    writer.WriteLine();
                //}
                #endregion

                writer.Flush();
                output.Position = 0;
                return output;
            }
            catch (Exception ex)
            {
                LogHelper.Error("ExportBigDataCSV异常", ex);
                return null;
            }
        }

        /// <summary>
        /// 导出excel的html格式
        /// </summary>
        /// <param name="title">导出列名</param>
        /// <param name="contentJson">导出内容</param>
        /// <returns></returns>
        public static Stream ExportBigDataHtml<T>(string[] title, List<T> data, int skip, int take)
        {

            var sphtml = new StringBuilder();

            #region 导出标题

            if (skip == 0)
            {
                sphtml.Append("<table border=\"1px\" style=\"text-align: left; font-size: 10pt\" cellpadding=\"0\" cellspacing=\"0\">");
                sphtml.Append("<tr style=\"background-color: yellow;\">");
                sphtml.Append("<td align=\"center\"><b>序号</b></td>");
                foreach (var titleItem in title)
                {
                    sphtml.Append(string.Format("<td align=\"center\">{0}</td>", titleItem));
                }
                sphtml.Append("</tr>");
            }

            #endregion

            #region  导出内容

            for (var i = skip; i < skip + take; i++)
            {
                sphtml.Append("<tr>");
                sphtml.Append(string.Format("<td align=\"center\">{0}</td>", (i + 1)));
                IDictionary<String, Object> item = (IDictionary<String, Object>)data[i];
                int propertyCount = item.Count;

                foreach (var contentItem in item)
                {
                    var value = contentItem.Value ?? "";
                    var writeContent = string.Empty;
                    if (value.GetType() == typeof(DateTime))
                        writeContent = ((DateTime)value).ToString("yyyy/MM/dd HH:mm:ss");
                    else
                        writeContent = value.ToString().Replace("\"", "");
                    sphtml.Append(string.Format("<td align=\"center\">{0}</td>", writeContent));
                }
                sphtml.Append("</tr>");
            }

            if ((skip + take) == data.Count)
            {
                sphtml.Append("</table>");
            }


            #endregion

            var buffer = Encoding.Default.GetBytes(sphtml.ToString());
            Stream output = new MemoryStream(buffer);
            return output;
        }

        /// <summary>
        /// 根据文件地址获取文件的字符串
        /// </summary>
        /// <param name="url">必须的绝对路径 比如 http://www.baidu.com/pic/1.png </param>
        /// <returns></returns>
        public static async Task<string> GetFileString(string url)
        {
            string result;
            using (var client = new WebClient())
            {
                var bytes = await client.DownloadDataTaskAsync(url);
                result = Convert.ToBase64String(bytes);
            }
            return result;
        }

        /// <summary>
        /// 导入
        /// </summary>
        /// <param name="newStream">Excel文件流</param>
        /// <returns>导入json</returns>
        public static Tuple<bool, string, List<T>> Import<T>(Stream newStream)
        {
            //网络文件地址转为流对象
            //var stream = WebHelper.GetStreamByWebFileUrl(url).Result;
            //var stream = new FileInfo(url);
            try
            {
                using (var package = new ExcelPackage(newStream))
                {
                    var worksheet = package.Workbook.Worksheets[1];
                    //列数量
                    var colCount = worksheet.Dimension.Columns;
                    //行数量
                    var rowCount = worksheet.Dimension.Rows;

                    var jsonObject = new JsonObject();
                    //保存列头集合
                    var headerList = new List<string>();
                    //拚一个jsonList
                    var sb = new StringBuilder();
                    //拚json开始
                    sb.Append("[");
                    //循环遍历行
                    for (var row = 1; row <= rowCount; row++)
                    {
                        //循环遍历列
                        for (var col = 1; col <= colCount; col++)
                        {
                            var cellValue = worksheet.Cells[row, col].Value.TryString();
                            //列头
                            if (row == 1)
                            {
                                var newCellValue = cellValue.Replace("（", ")").Replace("）", ")")
                                                            .Substring(cellValue.IndexOf("(", StringComparison.Ordinal) + 1).Replace(")", "")
                                                            .Replace(" ", "");
                                headerList.Add(newCellValue);
                            }
                            //内容
                            else
                                jsonObject[headerList[col - 1]].SetValue(cellValue);
                        }
                        //追加逗号
                        if (row > 2)
                            sb.Append(",");
                        //追加内容
                        if (row > 1)
                            sb.Append(jsonObject.TryString());
                    }
                    //拼json结束
                    sb.Append("]");

                    var sbJson = sb.TryString();
                    var result = JsonHelper.ParseJson<List<T>>(sbJson);
                    return new Tuple<bool, string, List<T>>(true, "", result);
                }
            }
            catch (Exception ex)
            {
                return new Tuple<bool, string, List<T>>(false, ex.Message, null);
            }
        }

        /// <summary>
        /// EPPlus 导出到Execl
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="datas"></param>
        /// <param name="columnNames"></param>
        /// <param name="outOfColumn"></param>
        /// <param name="sheetName"></param>
        /// <param name="title"></param>
        /// <param name="isProtected"></param>
        /// <returns></returns>
        public static Byte[] GetByteToExportExcel<T>(List<T> datas, Dictionary<string, string> columnNames, List<string> outOfColumn, string sheetName = "Sheet1", string title = "", int isProtected = 0)
        {
            using (var fs = new MemoryStream())
            {
                using (var package = CreateExcelPackage(datas, columnNames, outOfColumn, sheetName, title, isProtected))
                {
                    package.SaveAs(fs);
                    return fs.ToArray();
                }
            }
        }


        /// <summary>
        /// 创建ExcelPackage
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="datas">数据实体</param>
        /// <param name="columnNames">列名</param>
        /// <param name="outOfColumns">排除列</param>
        /// <param name="sheetName">sheet名称</param>
        /// <param name="title">标题</param>
        /// <param name="isProtected">是否加密</param>
        /// <returns></returns>
        private static ExcelPackage CreateExcelPackage<T>(List<T> datas, Dictionary<string, string> columnNames, List<string> outOfColumns, string sheetName = "Sheet1", string title = "", int isProtected = 0)
        {
            var package = new ExcelPackage();
            var worksheet = package.Workbook.Worksheets.Add(sheetName);
            if (isProtected == 1)
            {
                worksheet.Protection.IsProtected = true;//设置是否进行锁定
                worksheet.Protection.SetPassword("xiangzhidaomimama");//设置密码
                worksheet.Protection.AllowAutoFilter = false;//下面是一些锁定时权限的设置
                worksheet.Protection.AllowDeleteColumns = false;
                worksheet.Protection.AllowDeleteRows = false;
                worksheet.Protection.AllowEditScenarios = false;
                worksheet.Protection.AllowEditObject = false;
                worksheet.Protection.AllowFormatCells = false;
                worksheet.Protection.AllowFormatColumns = false;
                worksheet.Protection.AllowFormatRows = false;
                worksheet.Protection.AllowInsertColumns = false;
                worksheet.Protection.AllowInsertHyperlinks = false;
                worksheet.Protection.AllowInsertRows = false;
                worksheet.Protection.AllowPivotTables = false;
                worksheet.Protection.AllowSelectLockedCells = false;
                worksheet.Protection.AllowSelectUnlockedCells = false;
                worksheet.Protection.AllowSort = false;
            }

            var titleRow = 0;
            if (!string.IsNullOrWhiteSpace(title))
            {
                titleRow = 1;
                worksheet.Cells[1, 1, 1, columnNames.Count()].Merge = true;//合并单元格
                worksheet.Cells[1, 1].Value = title;
                worksheet.Cells.Style.WrapText = true;
                worksheet.Cells[1, 1].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;//水平居中
                worksheet.Cells[1, 1].Style.VerticalAlignment = ExcelVerticalAlignment.Center;//垂直居中
                worksheet.Row(1).Height = 30;//设置行高
                worksheet.Cells.Style.ShrinkToFit = true;//单元格自动适应大小
            }

            //获取要反射的属性,加载首行
            Type myType = typeof(T);
            List<PropertyInfo> myPro = new List<PropertyInfo>();
            int i = 1;
            foreach (string key in columnNames.Keys)
            {
                PropertyInfo p = myType.GetProperty(key);
                myPro.Add(p);

                worksheet.Cells[1 + titleRow, i].Value = columnNames[key];
                worksheet.Cells[1 + titleRow, i].AutoFitColumns();
                worksheet.Cells[1 + titleRow, i].Style.Font.Bold = true;
                //worksheet.Cells[1 + titleRow, i].Style.Fill.BackgroundColor.SetColor(Color.LightGray);
                i++;
            }
            int row = 2 + titleRow;
            foreach (T data in datas)
            {
                int column = 1;
                foreach (PropertyInfo p in myPro.Where(info => !outOfColumns.Contains(info.Name)))
                {
                    worksheet.Cells[row, column].Value = p == null ? "" : Convert.ToString(p.GetValue(data, null));
                    column++;
                }
                row++;
            }
            return package;
        }

        #region Excel导入
        /// <summary>
        /// Excel导入
        /// </summary>
        /// <typeparam name="T">泛型对象</typeparam>
        /// <param name="url">网络地址</param>
        /// <param name="starRows">解析开始行,默认从第一行开始解析</param>
        /// <returns></returns>
        public static List<T> Import<T>(string url, int? starRows = 1) where T : new()
        {
            try
            {
                var bt = WebHelper.GetByteArrayByWebFileUrl(url).Result;
                var stream = new MemoryStream(bt);
                var suffix = url.Substring(url.LastIndexOf("."));
                var sheet = (suffix == ".xls") ? new HSSFWorkbook(stream).GetSheetAt(0) : new XSSFWorkbook(stream).GetSheetAt(0);
                //实现自动将 Excel 的公式计算出来
                sheet.ForceFormulaRecalculation = true;

                var rowHeader = sheet.GetRow(starRows.TryInt() - 1);//标题行
                var rowCount = sheet.LastRowNum;
                var rowStart = sheet.FirstRowNum;
                var cellCount = rowHeader.Cells.Count;

                //保存列头集合
                var headerList = new List<string>();
                var idx = rowStart + (starRows.Value - 1);
                //返回的结果
                var result = new List<T>();
                //循环行
                for (var i = idx; i <= rowCount; i++)
                {
                    IRow row = sheet.GetRow(i);
                    //空行跳过
                    if (row == null) continue;

                    var model = new T();
                    //循环列
                    for (var j = 0; j < cellCount; j++)
                    {
                        //列头
                        if (i == idx)
                        {
                            var cellValue = rowHeader.GetCell(j).CellComment == null ? "" : rowHeader.GetCell(j).CellComment.String.ToString().Replace("\n", "").Replace("/r", "").Trim();
                            headerList.Add(cellValue);
                        }
                        //内容
                        else
                        {
                            //判断单元格值是否表单式
                            if (row.GetCell(j) != null && row.GetCell(j).CellType == CellType.Formula)
                                row.GetCell(j).SetCellType(CellType.String);


                            //不要使用row.Cells[cellNum],  Cells属性只返回有值得列
                            var cellValue = string.Empty;

                            //是日期型
                            if (row.GetCell(j) != null && row.GetCell(j).CellType == CellType.Numeric && DateUtil.IsCellDateFormatted(row.GetCell(j)))
                                cellValue = row.GetCell(j).DateCellValue.ToString("yyyy/MM/dd");
                            else
                            {
                                cellValue = row.GetCell(j).TryString(null);
                            }


                            //处理空行数据
                            if (row.Count() > 0)
                            {
                                var prop = model.GetType().GetProperty(headerList[j]);
                                if (prop == null)
                                    throw new Exception($"Excel中列头{headerList[j]}无法识别，请检查");

                                try
                                {
                                    SetEntity(ref model, prop, cellValue);
                                }
                                catch (Exception ex)
                                {
                                    throw new Exception("Excel中第" + (i + starRows) + "行无法识别，请检查");
                                }
                            }
                        }
                    }
                    if (i != idx)
                    {
                        if (model != null)
                        {
                            result.Add(model);
                        }
                    }
                }
                return result;
            }
            catch (Exception ex)
            {
                LogHelper.Error($"解析excel错误{ex.Message}");
                throw ex;
            }
        }

        /// <summary>
        /// 反射更新字段
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="entity">数据库表对象</param>
        /// <param name="prop">反射表对象</param>
        /// <param name="val">要更新的值</param>
        private static void SetEntity<T>(ref T entity, PropertyInfo prop, object val)
        {
            string newVal;
            if (val == null)
                newVal = null;
            else
                newVal = string.IsNullOrWhiteSpace(val.TryString()) ? null : val.TryString().Trim();

            //可空bool类型
            if (prop.PropertyType == typeof(bool?))
            {
                if (newVal != null)
                    prop.SetValue(entity, newVal.TryBool(null));
                else
                    prop.SetValue(entity, newVal);
            }
            //可空int类型
            else if (prop.PropertyType == typeof(int?))
            {
                if (newVal != null)
                {
                    if (newVal == bool.TrueString)
                        prop.SetValue(entity, 1);
                    else if (newVal == bool.FalseString)
                        prop.SetValue(entity, 0);
                    else
                        prop.SetValue(entity, newVal.TryInt(null));
                }
                else
                    prop.SetValue(entity, newVal);
            }
            //可空decimal类型
            else if (prop.PropertyType == typeof(decimal?))
            {
                if (newVal != null)
                    prop.SetValue(entity, newVal.TryDecimal(null));
                else
                    prop.SetValue(entity, newVal);
            }
            //可空DateTime类型
            else if (prop.PropertyType == typeof(DateTime?))
            {
                if (newVal != null)
                    prop.SetValue(entity, newVal.TryDateTime(null));
                else
                    prop.SetValue(entity, newVal);
            }
            //非空bool类型
            else if (prop.PropertyType == typeof(bool))
            {
                prop.SetValue(entity, newVal.TryBool());
            }
            //非空int类型
            else if (prop.PropertyType == typeof(int))
            {
                prop.SetValue(entity, newVal.TryInt());
            }
            //非空decimal类型
            else if (prop.PropertyType == typeof(decimal))
            {
                prop.SetValue(entity, newVal.TryDecimal());
            }
            //非空DateTime类型
            else if (prop.PropertyType == typeof(DateTime))
            {
                prop.SetValue(entity, newVal.TryDateTime());
            }
            //字符串string类型
            else
            {
                prop.SetValue(entity, newVal.TryString());
            }
        }
        #endregion
    }
}
