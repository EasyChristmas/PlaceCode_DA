//**********插件参数说明*************
//data-upload-automatic 自动绑定上传事件，true：采用默认自动上传，其他：自定义绑定上传事件,需在业务代码绑定事件处理。
//data-plugin-name 插件的名称，singleUpload：单个上传, multiUpload：多个上传
//data-upload-path 上传到服务器的文件夹
//data-upload-showFileName 是否显示文件名（针对多上传），true：显示文件名 其他：不显示文件名
//data-upload-maxCount 最多上传数量（针对多上传）
//data-upload-isRename 是否重命名，默认重命名  默认为true：表示重命名（Guid） ，false：不重命名，取上传文件名
//data-upload-isEdit 是否可以编辑文件
//data-upload-title 图片点击放大展示的文字标题
//name 对应数据库字段的值，用于提交表单使用
//data-fileTyle 单个上传判断上传的文件类型 img为图片

$(function () {
    //初始化加载上传控件的样式
    $("div[data-plugin-name]").each(function () {
        var pluginName = $(this).attr("data-plugin-name") || '';
        if (pluginName == 'multiUpload' || pluginName == 'singleUpload') {
            $(this).loadUploadFileHtml(pluginName);
        }
    });
    //自动上传，采用默认回调的业务
    $("div[data-upload-automatic='true']").each(function () {
        var $this = $(this);
        var maxFileSize = $this.attr("data-plugin-filesize") || '';
        var pluginName = $this.attr("data-plugin-name") || '';
        var fileType = $this.attr("data-fileType") || '';
        if (pluginName == 'multiUpload') {
            $this.multiUpload({
                success: function (e, result) {
                    //文件上传成功业务回调,返回上传结果
                    if ("function" == typeof uploadAutomaticSuccess) {
                        uploadAutomaticSuccess(result);
                    }
                }
            });
        }
        else if (pluginName == 'singleUpload') {
            $this.singleUpload({
                maxFileSize: maxFileSize,//大小 
                fileType: fileType,//文件类型
                success: function (e, result) {
                }
            });
        }
    });
});

//单个文件移除回调
//function singleCloseSuccess(p) {
//    console.log(p);
//    console.log('单个文件移除回调');
//}
////多个文件移除回调
//function multiCloseSuccess(p) {
//    console.log(p);
//    console.log(p.attr("data-upload-value"));
//    console.log('多个文件移除回调');
//}

jQuery.extend({
    //关闭上传文件
    removeFile: function (elem) {
        var $this = $(elem);
        //插件div
        var parentDiv = $this.parent().parent();
        $this.parent().remove();
        //关闭单个文件
        if (parentDiv.attr("data-plugin-name") == 'singleUpload') {
            parentDiv.find('div[class="filess-all fl r-add-shttp mr20"]').show();
            //单文件关闭成功业务回调,返回插件的div对象
            if ("function" == typeof singleCloseSuccess) {
                singleCloseSuccess(parentDiv);
            }
        }
        //关闭多个文件
        else {
            var maxCount = parentDiv.attr("data-upload-maxCount");
            if (maxCount) {
                var imgCount = parentDiv.find("img").length;
                if (imgCount < parseInt(maxCount))
                    parentDiv.find('div[class="filess-all fl r-add-shttp mr20"]').show();
            }
            //重新加载上传文件的json值
            parentDiv.loadUploadValue();
            //多文件关闭成功业务回调,返回插件的div对象
            if ("function" == typeof multiCloseSuccess) {
                multiCloseSuccess(parentDiv, $this);
            }
        }
    }
});

jQuery.fn.extend({
    //上传
    upload: function (options) {
        var defaults =
        {
            url: "/upload/UploadFile",
            data: {},
            success: false
        };
        var opts = $.extend(defaults, options);
        //上传图片
        return this.fileupload({
            autoUpload: true, //是否自动上传
            url: opts.url, //上传地址
            formData: opts.data, //上传参数
            limitMultiFileUploadSize: opts.maxFileSize,//大小 
            dataType: 'json',
            done: opts.success,
            start: opts.start,
            acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i
        });
    },
    //单个上传
    singleUpload: function (options) {
        var $this = $(this);
        var defaults = {
            url: "/upload/UploadFile",
            data: {
                path: $this.attr("data-upload-path") || "",
                isRename: $this.attr("data-upload-isRename") || true,
                fileType: $this.fileType
            },
            success: false
        };
        var opts = $.extend(defaults, options);

        //开始上传
        return $this.find('div[class="filess-all fl r-add-shttp mr20"] input').upload({
            url: opts.url,
            data: opts.data,
            maxFileSize: opts.maxFileSize,//大小
            fileType: opts.fileType,//上传文件类型
            success: function (e, result) {
                $this.find('div[ class="loading_updata pa"]').hide();
                //判断上传的文件和设置的文件大小比较
                var fileSize = result.files[0].size;
                if (opts.maxFileSize > 0 && opts.maxFileSize < fileSize) {
                    $.alert("亲，图片太大，请压缩以后再传 O(∩_∩)O~");
                    return;
                };
                //判断上传的文件为图片格式
                var fileType = result.files[0].name;
                if (!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(fileType) && opts.fileType == 'img') {
                    $.alert("图片类型必须是.gif,jpeg,jpg,png中的一种");
                    return;
                } else {
                    result = result.result;
                    //业务回掉函数
                    if (typeof opts.success == 'function')
                        opts.success(e, result);

                    if (result.isSuccess) {
                        //加载上传文件的html
                        $this.appendUploadFileHtml({
                            url: result.data,
                            guid: result.guid,
                            fileName: result.fileName,
                            fileSize: fileSize || 0,
                            isSingle: true,
                            isDelete: opts.isDelete
                        });
                    }
                    else {
                        $.errorMsg(result.errMsg);
                    }
                }
            },
            start: function () {
                $this.find('div[ class="loading_updata pa"]').show();
            }
        });
    },
    //多个上传
    multiUpload: function (options) {
        var $this = $(this);
        var defaults = {
            url: "/upload/UploadFile",
            data: {
                path: $this.attr("data-upload-path") || "",
                isRename: $this.attr("data-upload-isRename") || true,
                fileType: $this.attr('data-fileTyle') || ''
            },
            success: false
        };
        var opts = $.extend(defaults, options);

        //开始上传
        return $this.find('div[class="filess-all fl r-add-shttp mr20"] input').upload({
            url: opts.url,
            data: opts.data,
            success: function (e, result) {
                $this.find('div[ class="loading_updata pa"]').hide();
                var fileName = result.files[0].name;
                result = result.result;

                var uploadFileType = fileName.substr(fileName.lastIndexOf(".")).toUpperCase().substr(1);

                if (opts.data.fileType) {
                    if (opts.data.fileType.indexOf(uploadFileType) != -1) {
                        console.log('开始上传')
                    } else {
                        $.alert("上传格式有误");
                        return false;
                    }
                }

                if (result.isSuccess) {
                    //加载上传文件的html
                    $this.appendUploadFileHtml({
                        url: result.data,
                        guid: result.guid,
                        fileName: fileName,
                        isSingle: false,
                    });

                    //重新加载上传文件的json值
                    $this.loadUploadValue();

                    //业务回掉函数
                    opts.success(e, result);
                }
                else {
                    $.errorMsg(result.errMsg);
                }

            },
            start: function () {
                $this.find('div[ class="loading_updata pa"]').show();
            }
        });
    },
    //加载上传文件的样式
    loadUploadFileHtml: function (pluginName) {
        //多文件上传的html格式
        var html = '<div class="filess-all fl r-add-shttp mr20">';
        if (pluginName == "multiUpload") {
            html += '<input type="file" multiple="multiple"  class="filess" title="">';
        } else {
            html += '<input type="file"  class="filess" title="">';
        }

        html += '<div class="loading_updata pa" style="display: none;"><i class="icon-spinner icon-spin"></i></div>';
        html += '</div>';
        $(this).html(html);
    },
    //追加上传文件的html 
    //url：上传文件的路径 ,guid唯一标识， fileName 文件名， isSingle 是否单个上传
    appendUploadFileHtml: function (options) {
        var defaults =
        {
            url: "",
            guid: "",
            fileName: "",
            isSingle: "",
            isDelete: true
        };
        var opts = $.extend(defaults, options);

        var $this = $(this);
        //最大文件上传数量
        var maxCount = $this.attr("data-upload-maxCount");
        //是否显示文件名称
        var showFileName = $this.attr("data-upload-showFileName");
        //是否可以编辑
        var isEdit = $this.attr("data-upload-isEdit");
        //点击图片放大显示标题
        var imgTitle = $this.attr("data-upload-title");
        var titleString = '';
        if (imgTitle) {
            titleString = 'data-title="' + imgTitle + '"';
        }

        var showUrl = '';
        var html = '<div class="example-image-link dib fl mr20">';
        //文件后缀
        var postfix = opts.url.substring(opts.url.lastIndexOf('.') + 1);
        //图片文件
        if (postfix == "png" || postfix == "jpg" || postfix == "jpeg" || postfix == "gif") {
            //是图片
            showUrl = $.getFileUrl(opts.url);
            html += '<a data-lightbox="example-set" href="' + $.getFileUrl(opts.url) + '" ' + titleString + '>';
        }
        //已知文件
        else if (postfix == "doc" || postfix == "docx"
            || postfix == "pdf"
            || postfix == "ppt" || postfix == "pptx"
            || postfix == "txt"
            || postfix == "xls" || postfix == "xlsx"
            || postfix == "zip") {
            showUrl = '/images/icon/' + postfix + '.png';
            html += '<a target="view_window" href="' + $.getFileUrl(opts.url) + '" ' + titleString + '>';
        }
        //未知文件
        else {
            showUrl = '/images/icon/default.png';
            html += '<a target="view_window" href="' + $.getFileUrl(opts.url) + '" ' + titleString + '>';
        }
        //如果是单个上传，保存时则直接提交img
        if (opts.isSingle) {
            html += '<img class="idimg" src="' + showUrl + '" data-src="' + opts.url + '" name="' + $this.attr("name") + '" fileName="' + opts.fileName + '" fileSize="' + opts.fileSize + '" data-form="true">';
        }
        else {
            html += '<img class="idimg" src="' + showUrl + '" data-src="' + opts.url + '" guid=' + opts.guid + ' fileName="' + opts.fileName + '">';
        }
        html += ' </a>';
        if (showFileName != undefined && showFileName != null && showFileName == "true")
            html += '<p class="col000 txtcut">' + opts.fileName + '</p>';
        if (opts.isDelete != "false" && opts.isDelete != false)
            html += '<span style="cursor:pointer" class="update_remove" onclick="$.removeFile(this);" ><i class="icon-remove"></i> </span>';
        html += '</div>';
        $this.append(html);

        //单个上传，则上传成功隐藏Upload控件
        if (opts.isSingle) {
            $this.find('div[class="filess-all fl r-add-shttp mr20"]').hide();
        }
        else {
            //文件数量达到设定最大数量则隐藏
            if (maxCount != undefined && maxCount != null) {
                if ($this.find("img").length >= parseInt(maxCount)) {
                    $this.find('div[class="filess-all fl r-add-shttp mr20"]').hide();
                }
            }
        }
        if (isEdit != undefined && isEdit == "false") {
            $this.find('div[class="filess-all fl r-add-shttp mr20"],.update_remove').hide();
        }
    },
    //重新加载上传文件的json值
    loadUploadValue: function () {
        var $this = $(this);
        //文件url的json格式，guid,name,file,postfix
        var jsonVal = '';
        $this.find("img").each(function (index, item) {
            var val = $(item).attr("data-src");
            var guid = $(item).attr("guid");
            var name = $(item).attr("fileName");
            var file = val;
            if (!val) return false;
            var postfix = val.substring(val.lastIndexOf('.') + 1);
            if (index == 0) {
                jsonVal += '[';
            }
            else {
                jsonVal += ','
            }
            jsonVal += '{"guid":"' + guid + '","name":"' + name + '","file":"' + file + '","postfix":"' + postfix + '"}'
        });
        if (jsonVal.length > 0)
            jsonVal += ']';

        $this.attr('data-upload-value', jsonVal);
    }
});