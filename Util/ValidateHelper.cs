using System;
using System.Text.RegularExpressions;

namespace Util
{
    /// <summary>
    /// 校验帮助类
    /// </summary>
    public class ValidateHelper
    {
        #region 正则表达式

        //数字类型
        const string numberReg = @"^[0-9]*$";
        //正整数类型
        const string positiveNumberReg = @"^\+?[1-9][0-9]*$";
        //浮点类型
        const string floatReg = @"^[0-9]+\.{0,1}[0-9]{0,9}$";
        //浮点类型（保留2位小数）
        const string float2Reg = @"^[0-9]+\.{0,1}([0-9]{1,2})?$";
        //浮点类型（保留3位小数）
        const string float3Reg = @"^[0-9]+\.{0,1}([0-9]{1,3})?$";
        //浮点类型（保留4位小数）
        const string float4Reg = @"^[0-9]+\.{0,1}([0-9]{1,4})?$";
        //邮箱地址
        const string emailReg = @"^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$";
        //座机号码
        const string telReg = @"^(\(\d{3,4}-)|\d{3.4}-\)?\d{7,8}$";
        //身份证号码
        const string idCardReg = @"^[A-Z0-9]{10,20}$";
        //QQ号码
        const string qqReg = @"[1-9][0-9]{4,}";
        //邮政编码
        const string postCodeReg = @"[1-9]\d{5}(?!\d)";
        //IP地址
        const string ipReg = @"\d+\.\d+\.\d+\.\d+";
        //手机号码
        const string mobileReg = @"^1\d{10}$";
        //日期格式 2000-01-01
        const string dateReg = @"^(\d{4})-(\d{2})-(\d{2})$";
        //url格式
        const string urlReg = @"^(http|https|ftp)\://([a-zA-Z0-9\.\-]+(\:[a-zA-Z0-9\.&amp;%\$\-]+)*@)*((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|localhost|([a-zA-Z0-9\-]+\.)*[a-zA-Z0-9\-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(\:[0-9]+)*(/($|[a-zA-Z0-9\.\,\?\'\\\+&amp;%\$#\=~_\-]+))*$";
        //中文、英文、数字格式
        const string normalReg = @"^[\u4e00-\u9fa5a-zA-Z0-9]+$";

        #endregion

        /// <summary>
        /// 校验对象实体
        /// </summary>
        /// <param name="source">实体对象</param>
        /// <returns>返回校验结果</returns>
        public static ValidateResult Validate(object source)
        {
            var sourceType = source.GetType();
            var sourceProperties = sourceType.GetProperties();
            var result = new ValidateResult() { IsValid = true };

            //遍历实体属性
            foreach (var property in sourceProperties)
            {
                //获取校验特性
                var attributes = property.GetCustomAttributes(typeof(ValidateAttribute), true);
                ValidateAttribute attribute = null;
                if (attributes.Length > 0)
                    attribute = attributes[0] as ValidateAttribute;
                if (attribute == null) continue;

                var value = property.GetValue(source, null);

                //属性是否为空
                var propertyIsNull = value == null || value.ToString() == string.Empty;

                #region 输入长度、值区间、值比较校验
                if (attribute.Type.IndexOf("length-") == 0)
                {
                    var length = Convert.ToInt32(attribute.Type.Split('-')[1]);
                    if (propertyIsNull || value.ToString().Length > length)
                    {
                        result.IsValid = false;
                        result.Message = $"参数：{property.Name}必须为{length}个字符以内的字符串，且不允许为空";
                    }
                }
                else if (attribute.Type.IndexOf("lengthNull-") == 0)
                {
                    var length = Convert.ToInt32(attribute.Type.Split('-')[1]);
                    if (!propertyIsNull && value.ToString().Length > length)
                    {
                        result.IsValid = false;
                        result.Message = $"参数：{property.Name}格式有误，必须为{length}个字符以内的字符串";
                    }
                }
                else if (attribute.Type.IndexOf("range{") == 0)
                {
                    var tmpStr = attribute.Type.Split('{')[1].Split('}')[0].Split(',');
                    var min = Convert.ToDecimal(tmpStr[0]);
                    var max = Convert.ToDecimal(tmpStr[1]);
                    try
                    {
                        if (propertyIsNull || Convert.ToDecimal(value) < min || Convert.ToDecimal(value) > max)
                        {
                            result.IsValid = false;
                            result.Message = $"参数：{property.Name}必须为{min}-{max}之间的数值，且不允许为空";
                        }
                    }
                    catch (Exception)
                    {
                        result.IsValid = false;
                        result.Message = $"参数：{property.Name}格式异常，必须为{min}-{max}之间的数值，且不允许为空";
                    }
                }
                else if (attribute.Type.IndexOf("rangeNull{") == 0)
                {
                    var tmpStr = attribute.Type.Split('{')[1].Split('}')[0].Split(',');
                    var min = Convert.ToDecimal(tmpStr[0]);
                    var max = Convert.ToDecimal(tmpStr[1]);
                    try
                    {
                        if (!propertyIsNull && (Convert.ToDecimal(value) < min || Convert.ToDecimal(value) > max))
                        {
                            result.IsValid = false;
                            result.Message = $"参数：{property.Name}格式有误，必须为{min}-{max}之间的数值";
                        }
                    }
                    catch (Exception)
                    {
                        result.IsValid = false;
                        result.Message = $"参数：{property.Name}格式异常，必须为{min}-{max}之间的数值";
                    }
                    
                }
                else if (attribute.Type.IndexOf("min-") == 0)
                {
                    var max = Convert.ToInt32(attribute.Type.Split('-')[1]);
                    try
                    {
                        if (propertyIsNull || Convert.ToInt32(value) > max)
                        {
                            result.IsValid = false;
                            result.Message = $"参数：{property.Name}必须为小于{max}的数值，且不允许为空";
                        }
                    }
                    catch (Exception)
                    {
                        result.IsValid = false;
                        result.Message = $"参数：{property.Name}格式异常，必须为小于{max}的数值，且不允许为空";
                    }
                }
                else if (attribute.Type.IndexOf("dateMin-") == 0)
                {
                    var index = attribute.Type.IndexOf('-');
                    var maxDate = Convert.ToDateTime(attribute.Type.Substring(index + 1));
                    try
                    {
                        if (propertyIsNull || Convert.ToDateTime(value) > maxDate)
                        {
                            result.IsValid = false;
                            result.Message = $"参数：{property.Name}必须为小于{maxDate}的日期格式，且不允许为空";
                        }
                    }
                    catch (Exception)
                    {
                        result.IsValid = false;
                        result.Message = $"参数：{property.Name}格式异常，必须为小于{maxDate}的日期格式，且不允许为空";
                    }
                    
                }
                #endregion

                else
                {
                    #region 常规校验
                    switch (attribute.Type)
                    {
                        case "requried":
                            if (propertyIsNull)
                            {
                                result.IsValid = false;
                                result.Message = $"参数：{property.Name}为必填参数";
                            }
                            break;
                        case "number":
                            if (propertyIsNull || !Regex.IsMatch(value.ToString(), numberReg))
                            {
                                result.IsValid = false;
                                result.Message = $"参数：{property.Name}必须为0或正整数，且不允许为空";
                            }
                            break;
                        case "numberNull":
                            if (!propertyIsNull && !Regex.IsMatch(value.ToString(), numberReg))
                            {
                                result.IsValid = false;
                                result.Message = $"参数：{property.Name}格式有误，必须为0或正整数";
                            }
                            break;
                        case "positiveNumber":
                            if (propertyIsNull || !Regex.IsMatch(value.ToString(), positiveNumberReg))
                            {
                                result.IsValid = false;
                                result.Message = $"参数：{property.Name}必须为正整数，且不允许为空";
                            }
                            break;
                        case "positiveNumberNull":
                            if (!propertyIsNull && !Regex.IsMatch(value.ToString(), positiveNumberReg))
                            {
                                result.IsValid = false;
                                result.Message = $"参数：{property.Name}格式有误，必须为正整数";
                            }
                            break;
                        case "float":
                            if (propertyIsNull || !Regex.IsMatch(value.ToString(), floatReg))
                            {
                                result.IsValid = false;
                                result.Message = $"参数：{property.Name}必须为浮点类型，且不允许为空";
                            }
                            break;
                        case "floatNull":
                            if (!propertyIsNull && !Regex.IsMatch(value.ToString(), floatReg))
                            {
                                result.IsValid = false;
                                result.Message = $"参数：{property.Name}格式有误，必须为浮点类型";
                            }
                            break;
                        case "float2":
                            if (propertyIsNull || !Regex.IsMatch(value.ToString(), float2Reg))
                            {
                                result.IsValid = false;
                                result.Message = $"参数：{property.Name}必须为浮点类型，保留两位小数，且不允许为空";
                            }
                            break;
                        case "float2Null":
                            if (!propertyIsNull && !Regex.IsMatch(value.ToString(), float2Reg))
                            {
                                result.IsValid = false;
                                result.Message = $"参数：{property.Name}格式有误，必须为浮点类型，保留两位小数";
                            }
                            break;
                        case "float3":
                            if (propertyIsNull || !Regex.IsMatch(value.ToString(), float3Reg))
                            {
                                result.IsValid = false;
                                result.Message = $"参数：{property.Name}必须为浮点类型，保留三位小数，且不允许为空";
                            }
                            break;
                        case "float3Null":
                            if (!propertyIsNull && !Regex.IsMatch(value.ToString(), float3Reg))
                            {
                                result.IsValid = false;
                                result.Message = $"参数：{property.Name}格式有误，必须为浮点类型，保留三位小数";
                            }
                            break;
                        case "float4":
                            if (propertyIsNull || !Regex.IsMatch(value.ToString(), float4Reg))
                            {
                                result.IsValid = false;
                                result.Message = $"参数：{property.Name}必须为浮点类型，保留四位小数，且不允许为空";
                            }
                            break;
                        case "float4Null":
                            if (!propertyIsNull && !Regex.IsMatch(value.ToString(), float4Reg))
                            {
                                result.IsValid = false;
                                result.Message = $"参数：{property.Name}格式有误，必须为浮点类型，保留四位小数";
                            }
                            break;
                        case "email":
                            if (propertyIsNull || !Regex.IsMatch(value.ToString(), emailReg))
                            {
                                result.IsValid = false;
                                result.Message = $"参数：{property.Name}必须为邮箱格式，且不允许为空";
                            }
                            break;
                        case "emailNull":
                            if (!propertyIsNull && !Regex.IsMatch(value.ToString(), emailReg))
                            {
                                result.IsValid = false;
                                result.Message = $"参数：{property.Name}格式有误，必须为邮箱格式";
                            }
                            break;
                        case "tel":
                            if (propertyIsNull || !Regex.IsMatch(value.ToString(), telReg))
                            {
                                result.IsValid = false;
                                result.Message = $"参数：{property.Name}必须为电话座机格式，且不允许为空";
                            }
                            break;
                        case "telNull":
                            if (!propertyIsNull && !Regex.IsMatch(value.ToString(), telReg))
                            {
                                result.IsValid = false;
                                result.Message = $"参数：{property.Name}格式有误，必须为电话座机格式";
                            }
                            break;
                        case "idCard":
                            if (propertyIsNull || !Regex.IsMatch(value.ToString(), idCardReg))
                            {
                                result.IsValid = false;
                                result.Message = $"参数：{property.Name}必须为身份证号码格式，且不允许为空";
                            }
                            break;
                        case "idCardNull":
                            if (!propertyIsNull && !Regex.IsMatch(value.ToString(), idCardReg))
                            {
                                result.IsValid = false;
                                result.Message = $"参数：{property.Name}格式有误，必须为身份证号码格式";
                            }
                            break;
                        case "qq":
                            if (propertyIsNull || !Regex.IsMatch(value.ToString(), qqReg))
                            {
                                result.IsValid = false;
                                result.Message = $"参数：{property.Name}必须为QQ格式，且不允许为空";
                            }
                            break;
                        case "qqNull":
                            if (!propertyIsNull && !Regex.IsMatch(value.ToString(), qqReg))
                            {
                                result.IsValid = false;
                                result.Message = $"参数：{property.Name}格式有误，必须为QQ格式";
                            }
                            break;
                        case "postCode":
                            if (propertyIsNull || !Regex.IsMatch(value.ToString(), postCodeReg))
                            {
                                result.IsValid = false;
                                result.Message = $"参数：{property.Name}必须为邮政编码格式，且不允许为空";
                            }
                            break;
                        case "postCodeNull":
                            if (!propertyIsNull && !Regex.IsMatch(value.ToString(), postCodeReg))
                            {
                                result.IsValid = false;
                                result.Message = $"参数：{property.Name}格式有误，必须为邮政编码格式";
                            }
                            break;
                        case "ip":
                            if (propertyIsNull || !Regex.IsMatch(value.ToString(), ipReg))
                            {
                                result.IsValid = false;
                                result.Message = $"参数：{property.Name}必须为IP格式，且不允许为空";
                            }
                            break;
                        case "ipNull":
                            if (!propertyIsNull && !Regex.IsMatch(value.ToString(), ipReg))
                            {
                                result.IsValid = false;
                                result.Message = $"参数：{property.Name}格式有误，必须为IP格式";
                            }
                            break;
                        case "mobile":
                            if (propertyIsNull || !Regex.IsMatch(value.ToString(), mobileReg))
                            {
                                result.IsValid = false;
                                result.Message = $"参数：{property.Name}必须为手机号码格式，且不允许为空";
                            }
                            break;
                        case "mobileNull":
                            if (!propertyIsNull && !Regex.IsMatch(value.ToString(), mobileReg))
                            {
                                result.IsValid = false;
                                result.Message = $"参数：{property.Name}格式有误，必须为手机号码格式";
                            }
                            break;
                        case "url":
                            if (propertyIsNull || !Regex.IsMatch(value.ToString(), urlReg))
                            {
                                result.IsValid = false;
                                result.Message = $"参数：{property.Name}必须为url格式，且不允许为空";
                            }
                            break;
                        case "urlNull":
                            if (!propertyIsNull && !Regex.IsMatch(value.ToString(), urlReg))
                            {
                                result.IsValid = false;
                                result.Message = $"参数：{property.Name}格式有误，必须为url格式";
                            }
                            break;
                        case "date":
                            if (propertyIsNull || !Regex.IsMatch(value.ToString(), dateReg))
                            {
                                result.IsValid = false;
                                result.Message = $"参数：{property.Name}必须为日期格式，且不允许为空";
                            }
                            break;
                        case "tag":
                            if (propertyIsNull || !Regex.IsMatch(value.ToString(), normalReg))
                            {
                                result.IsValid = false;
                                result.Message = $"参数：{property.Name}必须为中文、英文或者数字，且不允许为空";
                            }
                            break;
                    }
                    #endregion
                }


                if (!result.IsValid) return result;
            }
            return result;
        }

        /// <summary>
        /// 是否为日期型字符串
        /// </summary>
        /// <param name="strSource">日期字符串(2008-05-08)</param>
        /// <returns></returns>
        public static bool IsDate(string strSource)
        {
            return Regex.IsMatch(strSource, numberReg);
        }

        /// <summary>
        /// 是否为数字字符串
        /// </summary>
        /// <param name="strSource"></param>
        /// <returns></returns>
        public static bool IsNumber(string strSource)
        {
            return Regex.IsMatch(strSource, @"^((((1[6-9]|[2-9]\d)\d{2})-(0?[13578]|1[02])-(0?[1-9]|[12]\d|3[01]))|(((1[6-9]|[2-9]\d)\d{2})-(0?[13456789]|1[012])-(0?[1-9]|[12]\d|30))|(((1[6-9]|[2-9]\d)\d{2})-0?2-(0?[1-9]|1\d|2[0-9]))|(((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))-0?2-29-))$");
        }
    }

    /// <summary>
    /// 校验返回结果
    /// </summary>
    public class ValidateResult
    {
        /// <summary>
        /// 是否合法有效
        /// </summary>
        public bool IsValid { get; set; }

        /// <summary>
        /// 消息（校验为非法无效数据时查看）
        /// </summary>
        public string Message { get; set; }
    }

    /// <summary>
    /// 校验特性
    /// </summary>
    public class ValidateAttribute : Attribute
    {
        public ValidateAttribute(string type)
        {
            Type = type;
        }

        public string Type { get; set; }
    }
}
