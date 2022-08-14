/// 处理常用的数据js
$.Data = {
    //绑定省市区
    bindSSQ: function (options, callBack) {
        var self = this;
        var defaults = {
            province: '',
            city: '',
            area: ''
        };
        var opts = $.extend(defaults, options);
        if (opts.province) {
            self.bindProvince({
                province: opts.province,
                defValue: opts.defValue
            });
        }
        if (opts.city) {
            $("#" + opts.city).html("");
            $("#" + opts.city).append('<option value>市</option>');
            $("#" + opts.province).change(function () {
                var valP = $("#" + opts.province).val() || -1;
                self.bindCity({
                    city: opts.city,
                    area: opts.area,
                    parentId: valP
                }, callBack);
            });
        }
        if (opts.area) {
            $("#" + opts.area).html("");
            $("#" + opts.area).append('<option value>区</option>');
            $("#" + opts.city).change(function () {
                var valC = $("#" + opts.city).val() || -1;
                self.bindArea({
                    area: opts.area,
                    parentId: valC,
                }, callBack);
            });
        }
    },
    //绑定省份
    bindProvince: function (options) {
        var defaults = {
            province: '',
            parentId: 1,
            defValue: ''
        };
        var opts = $.extend(defaults, options);
        var data = _.where($.parseJSON($("#areaData").val()), { parentId: parseInt(opts.parentId) });
        var optionStr = '<option value>省</option>';
        $(data).each(function (index, item) {
            if (item.id == opts.defValue) {
                optionStr += "<option value='" + item.id + "' selected='selected'>" + item.name + "</option>";
            } else {
                optionStr += '<option value=' + item.id + '>' + item.name + '</option>';
            }
        });
        $("#" + opts.province).html(optionStr);
        //$.get({
        //    url: 'common/area?parentId=' + opts.parentId,
        //    async: false,
        //    success: function (data) {
        //        var optionStr = '<option value>省</option>';
        //        $(data).each(function (index, item) {
        //            if (item.id == opts.defValue) {
        //                optionStr += "<option value='" + item.id + "' selected='selected'>" + item.name + "</option>";
        //            } else {
        //                optionStr += '<option value=' + item.id + '>' + item.name + '</option>';
        //            }
        //        });
        //        $("#" + opts.province).html(optionStr);
        //    }
        //});
    },
    //绑定城市
    bindCity: function (options, callBack) {
        var defaults = {
            city: '',
            area: '',
            parentId: -1,
            defValue: ''
        };
        var opts = $.extend(defaults, options);
        var data = _.where($.parseJSON($("#areaData").val()), { parentId: parseInt(opts.parentId) });
        var optionStr = '<option value>市</option>';
        $(data).each(function (index, item) {
            if (item.id == opts.defValue) {
                optionStr += "<option value='" + item.id + "' selected='selected'>" + item.name + "</option>";
            } else {
                optionStr += '<option value=' + item.id + '>' + item.name + '</option>';
            }
        });
        $("#" + opts.city).html(optionStr);
        if (opts.area) {
            $("#" + opts.area).html('<option value>区</option>');
        }

        if (typeof (callBack) == "function")
            callBack();
        //$.get({
        //    url: 'common/area?parentId=' + opts.parentId,
        //    async: false,
        //    success: function (data) {
        //        var optionStr = '<option value>市</option>';
        //        $(data).each(function (index, item) {
        //            if (item.id == opts.defValue) {
        //                optionStr += "<option value='" + item.id + "' selected='selected'>" + item.name + "</option>";
        //            } else {
        //                optionStr += '<option value=' + item.id + '>' + item.name + '</option>';
        //            }
        //        });
        //        $("#" + opts.city).html(optionStr);
        //        if (opts.area) {
        //            $("#" + opts.area).html('<option value>区</option>');
        //        }

        //        if (typeof (callBack) == "function")
        //            callBack();
        //    }
        //});
    },
    //绑定区域
    bindArea: function (options, callBack) {
        var defaults = {
            area: '',
            parentId: -1,
            defValue: ''
        };
        var opts = $.extend(defaults, options);
        var data = _.where($.parseJSON($("#areaData").val()), { parentId: parseInt(opts.parentId) });
        var optionStr = '<option value>区</option>';
        $(data).each(function (index, item) {
            if (item.id == opts.defValue) {
                optionStr += "<option value='" + item.id + "' selected='selected'>" + item.name + "</option>";
            } else {
                optionStr += '<option value=' + item.id + '>' + item.name + '</option>';
            }
        });
        $("#" + opts.area).html(optionStr);
        if (typeof (callBack) == "function")
            callBack();
        //$.get({
        //    url: 'common/area?parentId=' + opts.parentId,
        //    async: false,
        //    success: function (data) {
        //        var optionStr = '<option value>区</option>';
        //        $(data).each(function (index, item) {
        //            if (item.id == opts.defValue) {
        //                optionStr += "<option value='" + item.id + "' selected='selected'>" + item.name + "</option>";
        //            } else {
        //                optionStr += '<option value=' + item.id + '>' + item.name + '</option>';
        //            }
        //        });
        //        $("#" + opts.area).html(optionStr);
        //        if (typeof (callBack) == "function")
        //            callBack();
        //    }
        //});
    },
    //加载省市区
    //  provinceId:省份编号
    //  cityId:城市编号
    //  areaId:区域编号
    //  callBack：回调函数
    loadSSH: function (options, callBack) {
        var opts = {
            province: options.province || '',
            provinceId: options.provinceId || -1,
            city: options.city || '',
            cityId: options.cityId || -1,
            area: options.area || '',
            areaId: options.areaId || -1
        };
        if (opts.province) {
            this.bindProvince({
                province: opts.province,
                defValue: opts.provinceId
            });
        }
        if (opts.city) {
            this.bindCity({
                city: opts.city,
                area: opts.area,
                parentId: opts.provinceId,
                defValue: opts.cityId
            }, callBack);
        }
        if (opts.area) {
            this.bindArea({
                area: opts.area,
                parentId: opts.cityId,
                defValue: opts.areaId,
            });
        }
    },
    //绑定用户(select2组件的使用此方法)
    bindUserSelect2: function (options) {
        var defaults = {
            selId: "",
            defaultValue: '',
            showDefault: true,
            multipleSelect: false,
            data: {}
        };
        var opts = $.extend(defaults, options);
        $.get({
            url: 'user/getUserName',
            success: function (result) {
                var data = result.data;
                $("#" + opts.selId).empty();
                if (opts.showDefault) {
                    $("#" + opts.selId).append('<option value="">-</option>');
                }
                var optionStr = "";
                var multipleValues = [];
                if (opts.multipleSelect) {
                    multipleValues = opts.defaultValue.split(',');
                }
                $(data).each(function (index, item) {
                    //是否默认选中
                    var isSelected = false;
                    if (opts.multipleSelect) {
                        isSelected = multipleValues.contains(item.id);
                    } else {
                        isSelected = item.id == opts.defaultValue;
                    }

                    if (isSelected) {
                        optionStr += "<option value='" + item.id + "' selected='selected'>" + item.realName + "</option>";
                    } else {
                        optionStr += "<option value='" + item.id + "'>" + item.realName + "</option>";
                    }
                });
                $("#" + opts.selId).append(optionStr);
                if (opts.defaultValue) {
                    if (opts.multipleSelect) {
                        $("#" + opts.selId).val(multipleValues).trigger("change");
                    } else {
                        $("#" + opts.selId).val(opts.defaultValue).trigger("change");
                    }
                }
            }
        });
    },
    //绑定虚拟货币
    bindCoin: function (options) {
        var defaults = {
            selId: "",
            defaultValue: "",
        };
        var opts = $.extend(defaults, options);
        $.get({
            url: 'blockchain/coin',
            success: function (data) {
                var optionStr = "";
                $("#" + opts.selId + " option:gt(0)").remove();
                $(data).each(function (index, item) {
                    if (item.id == opts.defaultValue) {
                        optionStr += "<option value='" + item.id + "' selected='selected'>" + item.name + "</option>";
                    } else {
                        optionStr += "<option value='" + item.id + "'>" + item.name + "</option>";
                    }
                });
                $("#" + opts.selId).append(optionStr);
            }
        });
    },
    //绑定矿池
    bindMiningPool: function (options) {
        var defaults = {
            selId: "",
            defaultValue: "",
        };
        var opts = $.extend(defaults, options);
        $.get({
            url: 'miningPool',
            success: function (result) {
                var data = result.data;
                var optionStr = "";
                $("#" + opts.selId + " option:gt(0)").remove();
                $(data).each(function (index, item) {
                    if (item.id == opts.defaultValue) {
                        optionStr += "<option value='" + item.id + "' selected='selected'>" + item.poolName + " - " + item.coinName + "</option>";
                    } else {
                        optionStr += "<option value='" + item.id + "'>" + item.poolName + " - " + item.coinName + "</option>";
                    }
                });
                $("#" + opts.selId).append(optionStr);
            }
        });
    },
    //绑定项目
    bindProject: function (options) {
        var defaults = {
            selId: "",
            defaultValue: "",
        };
        var opts = $.extend(defaults, options);
        $.get({
            url: 'project/getNameList',
            success: function (result) {
                var data = result;
                var optionStr = "";
                $("#" + opts.selId + " option:gt(0)").remove();
                $(data).each(function (index, item) {
                    if (item.id == opts.defaultValue) {
                        optionStr += "<option value='" + item.id + "' selected='selected'>" + item.name + "</option>";
                    } else {
                        optionStr += "<option value='" + item.id + "'>" + item.name + "</option>";
                    }
                });
                $("#" + opts.selId).append(optionStr);
            }
        });
    },
    //绑定后台用户
    bindAdmin: function (options) {
        var defaults = {
            selId: "",
            defaultValue: '',
            showDefault: true,
            multipleSelect: false,
            data: {}
        };
        var opts = $.extend(defaults, options);
        var queryString = $.param(opts, true);
        $.get({
            url: 'oa/admin/getAdminNames?' + queryString,
            success: function (result) {
                var data = result.data;
                $("#" + opts.selId).empty();
                if (opts.showDefault) {
                    $("#" + opts.selId).append('<option value="">-</option>');
                }
                var optionStr = "";
                var multipleValues = [];
                if (opts.multipleSelect) {
                    multipleValues = opts.defaultValue.split(',');
                }
                $(data).each(function (index, item) {
                    //是否默认选中
                    var isSelected = false;
                    if (opts.multipleSelect) {
                        isSelected = multipleValues.contains(item.id);
                    } else {
                        isSelected = item.id == opts.defaultValue;
                    }

                    if (isSelected) {
                        optionStr += "<option value='" + item.id + "' selected='selected'>" + item.realName + "</option>";
                    } else {
                        optionStr += "<option value='" + item.id + "'>" + item.realName + "</option>";
                    }
                });
                $("#" + opts.selId).append(optionStr);
                if (opts.defaultValue) {
                    if (opts.multipleSelect) {
                        $("#" + opts.selId).val(multipleValues).trigger("change");
                    } else {
                        $("#" + opts.selId).val(opts.defaultValue).trigger("change");
                    }
                }
            }
        });
    },
    //绑定产品
    bindProduct: function (options) {
        var defaults = {
            selId: "",
            defaultValue: '',
            showDefault: true,
            multipleSelect: false,
            data: {}
        };
        var opts = $.extend(defaults, options);
        var queryString = $.param(opts, true);
        $.get({
            url: 'product/getNameList?' + queryString,
            success: function (result) {
                var data = result.data;
                $("#" + opts.selId).empty();
                if (opts.showDefault) {
                    $("#" + opts.selId).append('<option value="">-</option>');
                }
                var optionStr = "";
                var multipleValues = [];
                if (opts.multipleSelect) {
                    multipleValues = opts.defaultValue.split(',');
                }
                $(data).each(function (index, item) {
                    //是否默认选中
                    var isSelected = false;
                    if (opts.multipleSelect) {
                        isSelected = multipleValues.contains(item.id);
                    } else {
                        isSelected = item.id == opts.defaultValue;
                    }

                    if (isSelected) {
                        optionStr += "<option value='" + item.id + "' selected='selected'>" + item.sTitle + "</option>";
                    } else {
                        optionStr += "<option value='" + item.id + "'>" + item.sTitle + "</option>";
                    }
                });
                $("#" + opts.selId).append(optionStr);
                if (opts.defaultValue) {
                    if (opts.multipleSelect) {
                        $("#" + opts.selId).val(multipleValues).trigger("change");
                    } else {
                        $("#" + opts.selId).val(opts.defaultValue).trigger("change");
                    }
                }
            }
        });
    },
    //绑定供应商
    bindSupplier: function (options) {
        var defaults = {
            selId: "",
            defaultValue: '',
            showDefault: true,
            multipleSelect: false,
            data: {}
        };
        var opts = $.extend(defaults, options);
        var queryString = $.param(opts, true);
        $.get({
            url: 'product/supplier/getNameList?' + queryString,
            success: function (result) {
                var data = result.data;
                $("#" + opts.selId).empty();
                if (opts.showDefault) {
                    $("#" + opts.selId).append('<option value="">-</option>');
                }
                var optionStr = "";
                var multipleValues = [];
                if (opts.multipleSelect) {
                    multipleValues = opts.defaultValue.split(',');
                }
                $(data).each(function (index, item) {
                    //是否默认选中
                    var isSelected = false;
                    if (opts.multipleSelect) {
                        isSelected = multipleValues.contains(item.id);
                    } else {
                        isSelected = item.id == opts.defaultValue;
                    }

                    if (isSelected) {
                        optionStr += "<option value='" + item.id + "' selected='selected'>" + item.name + "</option>";
                    } else {
                        optionStr += "<option value='" + item.id + "'>" + item.name + "</option>";
                    }
                });
                $("#" + opts.selId).append(optionStr);
                if (opts.defaultValue) {
                    if (opts.multipleSelect) {
                        $("#" + opts.selId).val(multipleValues).trigger("change");
                    } else {
                        $("#" + opts.selId).val(opts.defaultValue).trigger("change");
                    }
                }
            }
        });
    },
    //绑定设备
    bindDevice: function (options) {
        var defaults = {
            selId: "",
            defaultValue: "",
            isBindValue: false,
            multipleSelect: false,
            data: {}
        };
        var opts = $.extend(defaults, options);
        $.get({
            url: 'product/device/getNameList',
            data: options.data,
            success: function (data) {
                $("#" + opts.selId).empty();
                $("#" + opts.selId).append('<option value="">-</option>');
                var optionStr = "";
                var multipleValues = [];
                if (opts.multipleSelect) {
                    multipleValues = opts.defaultValue.split(',');
                }
                $(data.data).each(function (index, item) {
                    var value = opts.isBindValue ? item.value : item.text;
                    if (item.id == opts.defaultValue) {
                        optionStr += "<option value='" + value + "' selected='selected'>" + item.text + "</option>";
                    } else {
                        optionStr += "<option value='" + value + "'>" + item.text + "</option>";
                    }
                });
                if (optionStr != "")
                    $("#" + opts.selId).append(optionStr);
                if (opts.defaultValue) {
                    if (opts.multipleSelect) {
                        $("#" + opts.selId).val(multipleValues).trigger("change");
                    } else {
                        $("#" + opts.selId).val(opts.defaultValue).trigger("change");
                    }
                }
            }
        });
    },
    //绑定跳板机
    bindBoardMachine: function (options) {
        var defaults = {
            selId: "",
            defaultValue: "",
            isBindValue: true,
            multipleSelect: false,
            data: {}
        };
        var opts = $.extend(defaults, options);
        $.get({
            url: 'product/boardmachine',
            data: options.data,
            success: function (data) {
                $("#" + opts.selId).empty();
                $("#" + opts.selId).append('<option value="">-</option>');
                var optionStr = "";
                var multipleValues = [];
                if (opts.multipleSelect) {
                    multipleValues = opts.defaultValue.split(',');
                }
                $(data.data).each(function (index, item) {
                    var value = opts.isBindValue ? item.id : item.name;
                    if (item.id == opts.defaultValue) {
                        optionStr += "<option value='" + value + "' selected='selected'>" + item.name+" - "+item.ip+"（外网Ip）" + "</option>";
                    } else {
                        optionStr += "<option value='" + value + "'>" + item.name + " - " + item.ip + "（外网Ip）" +  "</option>";
                    }
                });
                if (optionStr != "")
                    $("#" + opts.selId).append(optionStr);
                if (opts.defaultValue) {
                    if (opts.multipleSelect) {
                        $("#" + opts.selId).val(multipleValues).trigger("change");
                    } else {
                        $("#" + opts.selId).val(opts.defaultValue).trigger("change");
                    }
                }
            }
        });
    },
    /**
     * 交易管理
     */
    //
    //人民币金额转大写
    numToCny: function (num) {
        var strOutput = "";
        var strUnit = "仟佰拾亿仟佰拾万仟佰拾元角分";
        num += "00";
        var intPos = num.indexOf('.');
        if (intPos >= 0)
            num = num.substring(0, intPos) + num.substr(intPos + 1, 2);
        strUnit = strUnit.substr(strUnit.length - num.length);
        for (var i = 0; i < num.length; i++)
            strOutput += "零壹贰叁肆伍陆柒捌玖".substr(num.substr(i, 1), 1) + strUnit.substr(i, 1);
        return strOutput.replace(/零角零分$/, '整').replace(/零[仟佰拾]/g, '零').replace(/零{2,}/g, '零').replace(/零([亿|万])/g, '$1').replace(/零+元/, '元').replace(/亿零{0,3}万/, '亿').replace(/^元/, "零元");
    },
    outputmoney: function (number) {
        var arr = number.toString().split(".");
        var f = null;
        if (arr.length > 1)
            f = arr[1];
        if (isNaN(number) || number == "") return "0";
        number = arr[0];
        if (number < 0)
            return '-' + $.Data.outputdollars(Math.floor(Math.abs(number) - 0) + '') + $.Data.outputcents(Math.abs(number) - 0);
        else {
            if (f)
                return $.Data.outputdollars(Math.floor(number - 0) + '') + '.' + f;
            else
                return $.Data.outputdollars(Math.floor(number - 0) + '')
        }

    },
    outputcents: function (amount) {
        amount = Math.round(((amount) - Math.floor(amount)) * 100);
        return (amount < 10 ? '.0' + amount : '.' + amount);

    },
    //格式化金额
    outputdollars: function (number) {
        if (number.length <= 3)
            return (number == '' ? '0' : number);
        else {
            var mod = number.length % 3;
            var output = (mod == 0 ? '' : (number.substring(0, mod)));
            for (i = 0; i < Math.floor(number.length / 3); i++) {
                if ((mod == 0) && (i == 0))
                    output += number.substring(mod + 3 * i, mod + 3 * i + 3);
                else
                    output += ',' + number.substring(mod + 3 * i, mod + 3 * i + 3);
            }
            return (output);
        }
    },

    showUserRole: function (role, adminId) {

        //if (role == 1 || role == 2 || role == 3 || role == 21 || role == 22 || role == 31 || role == 13) {
        //    $("select[name='role']").attr("disabled", "disabled");
        //} else {
        //    $("select[name='role'] option[value='1']").remove();
        //    $("select[name='role'] option[value='2']").remove();
        //    $("select[name='role'] option[value='3']").remove();
        //    $("select[name='role'] option[value='21']").remove();
        //    $("select[name='role'] option[value='22']").remove();
        //    $("select[name='role'] option[value='31']").remove();
        //    $("select[name='role'] option[value='13']").remove();
        //    $("select[name='role']").removeAttr("disabled");
        //}

        //只有客服,和服务经理是自己的会员才允许修改Role
        if ($("#currentRole").val() != 'Cs' && adminId != parseInt($("#currentUserId").val()))
            $("select[name='role']").attr("disabled", "disabled");
    },

    //绑定担保公司
    bindGuaranteeCompany: function (defaultValue) {
        $.get({
            url: 'touyi/company?type=4',
            success: function (data) {
                var option = '';
                $(data.data).each(function (index, item) {
                    if (item.id == defaultValue) {
                        option += "<option value='" + item.id + "' selected='selected'>" + item.name + "</option>";
                    } else {
                        option += "<option value='" + item.id + "'>" + item.name + "</option>";
                    }
                });
                $("#selGuaranteeCompany").append(option);
            }
        });
    },


};


