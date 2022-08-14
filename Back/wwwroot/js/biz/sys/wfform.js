$(function () {
    //格式化列表table高度
    $.tableHeight(118);  
    //容器外的表单拖动效果
    $(".wf_form_ul").dragForm("span");
    //容器内的表单删除功能
    $(".iphone_con").delegate(".form-group .icon-remove-circle", "click", function (e) {
        e.stopPropagation();//阻止事件传播
        $(this).parent().remove();
    });
    //点击容器内的标点，编辑文案
    $(".iphone_con").delegate(".form-group", "click", function () {
        var $this = $(this); 
        
        $this.siblings().css("border", "1px solid #c7c7c9");
        $this.css("border", "1px solid #32a8ff");
    });
});

//获取元素到浏览器边上的距离
function getPosition(obj) {
    var l = 0;
    var t = 0;
    while (obj) {
        l += obj.offsetLeft;
        t += obj.offsetTop;
        obj = obj.offsetParent;
    }
    return { left: l, top: t };
}
//封装添加表单近容器的方法
$.fn.extend({
    dragForm: function (obj) {
        $this = $(this);
        $this.delegate(obj, "mousedown", function (md) {
            //阻止事件的默认动作
            md.preventDefault();
            var $this = $(this);
            var mouseX = md.pageX;//鼠标点中到浏览器左侧的实际距离（包括横向滚动条的距离）
            var mouseY = md.pageY;
            var temp = $(this).next()[0];
            var $temp = $(temp);
            var $temp_clone = $("<div class='temp'></div>").append($temp.clone().show());
            var half_temp_width = $temp.width() / 2;//单个表单的宽度的一半
            var half_temp_height = $temp.height() / 2;
            var $target = $('.iphone_con');//存放表单的容器
            var pos = getPosition(document.querySelector('.iphone_con'));
            var pos_left = pos.left;//获取容器到浏览器左侧的距离
            var pos_top = pos.top;//获取容器到浏览器顶端的距离
            var tops = [];
            var $target_form = $('.iphone_con .form-group');//容器内的表单
            var delayed = setTimeout(function () {
                //在body后面追加单个form表单
                $("body").append($temp_clone);
                $temp_clone.css({
                    "position": "absolute",
                    "left": mouseX - half_temp_width + "px",
                    "top": mouseY - half_temp_height + "px",
                    "opacity": "0.9"
                });

                //鼠标移动，浮层跟着移位
                $(document).delegate("body", "mousemove", function (mm) {
                    var mm_mouseX = mm.pageX;
                    var mm_mouseY = mm.pageY;
                    $temp_clone.css({
                        "left": mm_mouseX - half_temp_width + "px",
                        "top": mm_mouseY - half_temp_height + "px"
                    });
                    //假如鼠标移动位置在容器内就制造要插入的动作UI,但实际还没插入
                    if (mm_mouseX > pos_left &&
                        mm_mouseX < pos_left + $target.width() + half_temp_width &&
                        mm_mouseY > pos_top &&
                        mm_mouseY < pos_top + $target.height() + half_temp_height
                    ) {
                        console.log("在容器范围内部");
                        $target.css("background", "#e1e0e6");
                        $target_form.css("border-top", "1px solid #c7c7c9");
                        tops = $.grep($target_form, function (e) {
                            return ($(e).position().top - mm_mouseY + half_temp_height > 0);
                        });
                        if (tops.length > 0) {
                            $(tops[0]).css("border-top", "1px solid #32a8ff");
                            $($target_form[$target_form.length - 1]).css("border-bottom", "none");
                        } else {
                            if ($target_form.length > 0) {
                                $($target_form[$target_form.length - 1]).css("border-bottom", "1px solid #32a8ff");
                            }
                        }
                    } else {
                        $target.css("background", "#f0eff4");
                        $target_form.css({ "border": "1px solid #c7c7c9" });
                    }
                });
                //鼠标抬起
                $("body").delegate(".temp", "mouseup", function (mu) {
                    mu.preventDefault();

                    var mu_mouseX = mu.pageX;
                    var mu_mouseY = mu.pageY;

                    // acting only if mouse is in right place
                    if (mu_mouseX + half_temp_width > pos_left &&
                        mu_mouseX - half_temp_width < pos_left + $target.width() &&
                        mu_mouseY + half_temp_height > pos_top &&
                        mu_mouseY - half_temp_height < pos_top + $target.height()
                    ) {
                        $temp_clone.attr("style", null);
                        // where to add
                        if (tops.length > 0) {
                            $($temp_clone.html()).insertBefore(tops[0]);
                        } else {
                            $target.append($temp_clone.html());
                        }
                        $(".iphone_con").find("input,textarea,select").attr("disabled", "disabled");//禁用所有input表单
                    } else {
                        // no add 
                        tops = [];

                    }
                    $target_form.css({ "border": "1px solid #c7c7c9" });
                    //clean up & add popover
                    $target.css("background-color", "#f0eff4");
                    $(document).undelegate("body", "mousemove");
                    $("body").undelegate(".temp", "mouseup");
                    //$("#target .component").popover({ trigger: "manual" });
                    $temp_clone.remove();
                    //genSource();
                })
            }, 0);

            //鼠标抬起
            $(document).mouseup(function () {
                clearInterval(delayed);
                return false;
            });
            //鼠标离开
            $(this).mouseout(function () {
                clearInterval(delayed);
                return false;
            });
        });
    }
})

$(document).ready(function () {
    //实现从右侧到左侧的移动效果、鼠标按下
    $("form").delegate(".component", "mousedown", function (md) {
        //移除弹出的修改层
        $(".popover").remove();
        //阻止事件的默认动作
        md.preventDefault();
        var tops = [];
        var mouseX = md.pageX;
        var mouseY = md.pageY;
        var $temp;
        var timeout;
        var $this = $(this);
        var delays = {
            main: 0,
            form: 120
        }
        var type;

        if ($this.parent().parent().parent().parent().attr("id") === "components") {
            type = "main";
        } else {
            type = "form";
        }

        var delayed = setTimeout(function () {
            if (type === "main") {
                $temp = $("<form class='form-horizontal span6' id='temp'></form>").append($this.clone());
            } else {
                if ($this.attr("id") !== "legend") {
                    $temp = $("<form class='form-horizontal span6' id='temp'></form>").append($this);
                }
            }
            //选中的单个表单制造浮层效果
            $("body").append($temp);

            $temp.css({
                "position": "absolute",
                "top": mouseY - ($temp.height() / 2) + "px",
                "left": mouseX - ($temp.width() / 2) + "px",
                "opacity": "0.9"
            }).show()

            var half_box_height = ($temp.height() / 2);
            var half_box_width = ($temp.width() / 2);
            var $target = $("#target");//最终放置表单的容器
            var tar_pos = $target.position();//容器的位置
            var $target_component = $("#target .component");//容器内的单独表单
            //鼠标悬停
            $(document).delegate("body", "mousemove", function (mm) {

                var mm_mouseX = mm.pageX;
                var mm_mouseY = mm.pageY;

                $temp.css({
                    "top": mm_mouseY - half_box_height + "px",
                    "left": mm_mouseX - half_box_width + "px"
                });
                //假如鼠标移动位置在容器内就制造要插入的动作UI,但实际还没插入
                if (mm_mouseX > tar_pos.left &&
                    mm_mouseX < tar_pos.left + $target.width() + $temp.width() / 2 &&
                    mm_mouseY > tar_pos.top &&
                    mm_mouseY < tar_pos.top + $target.height() + $temp.height() / 2
                ) {
                    $("#target").css("background-color", "#fafdff");
                    $target_component.css({ "border-top": "1px solid white", "border-bottom": "none" });
                    tops = $.grep($target_component, function (e) {
                        return ($(e).position().top - mm_mouseY + half_box_height > 0 && $(e).attr("id") !== "legend");
                    });
                    if (tops.length > 0) {
                        $(tops[0]).css("border-top", "1px solid #22aaff");
                    } else {
                        if ($target_component.length > 0) {
                            $($target_component[$target_component.length - 1]).css("border-bottom", "1px solid #22aaff");
                        }
                    }
                } else {
                    $("#target").css("background-color", "#fff");
                    $target_component.css({ "border-top": "1px solid white", "border-bottom": "none" });
                    $target.css("background-color", "#fff");
                }
            });
            //鼠标抬起，假如在容器范围内抬起鼠标，就插入
            $("body").delegate("#temp", "mouseup", function (mu) {
                mu.preventDefault();

                var mu_mouseX = mu.pageX;
                var mu_mouseY = mu.pageY;
                var tar_pos = $target.position();

                $("#target .component").css({ "border-top": "1px solid white", "border-bottom": "none" });

                // acting only if mouse is in right place
                if (mu_mouseX + half_box_width > tar_pos.left &&
                    mu_mouseX - half_box_width < tar_pos.left + $target.width() &&
                    mu_mouseY + half_box_height > tar_pos.top &&
                    mu_mouseY - half_box_height < tar_pos.top + $target.height()
                ) {
                    $temp.attr("style", null);
                    // where to add
                    if (tops.length > 0) {
                        $($temp.html()).insertBefore(tops[0]);
                    } else {
                        $("#target fieldset").append($temp.append("\n\n\ \ \ \ ").html());
                    }
                } else {
                    // no add
                    $("#target .component").css({ "border-top": "1px solid white", "border-bottom": "none" });
                    tops = [];
                }

                //clean up & add popover
                $target.css("background-color", "#fff");
                $(document).undelegate("body", "mousemove");
                $("body").undelegate("#temp", "mouseup");
                $("#target .component").popover({ trigger: "manual" });
                $temp.remove();
                genSource();
            });
        }, delays[type]);
        //鼠标抬起
        $(document).mouseup(function () {
            clearInterval(delayed);
            return false;
        });
        //鼠标离开
        $(this).mouseout(function () {
            clearInterval(delayed);
            return false;
        });
    });
    //生成容器内部最终的form html元素
    var genSource = function () {
        var $temptxt = $("<div>").html($("#build").html());
        //scrubbbbbbb
        $($temptxt).find(".component").attr({
            "title": null,
            "data-original-title": null,
            "data-type": null,
            "data-content": null,
            "rel": null,
            "trigger": null,
            "style": null
        });
        $($temptxt).find(".valtype").attr("data-valtype", null).removeClass("valtype");
        $($temptxt).find(".component").removeClass("component");
        $($temptxt).find("form").attr({ "id": null, "style": null });
        $("#source").val($temptxt.html().replace(/\n\ \ \ \ \ \ \ \ \ \ \ \ /g, "\n"));
    }

    //activate legend popover
    //$("#target .component").popover({ trigger: "manual" });
    //popover on click event 点击容器内的单个表单，出现编辑页面
    $("#target").delegate(".component", "click", function (e) {
        e.preventDefault();
        $(".popover").hide();
        var $active_component = $(this);
        $active_component.popover("show");
        var valtypes = $active_component.find(".valtype");
        $.each(valtypes, function (i, e) {
            var valID = "#" + $(e).attr("data-valtype");
            var val;
            if (valID === "#placeholder") {
                val = $(e).attr("placeholder");
                $(".popover " + valID).val(val);
            } else if (valID === "#checkbox") {
                val = $(e).attr("checked");
                $(".popover " + valID).attr("checked", val);
            } else if (valID === "#option") {
                val = $.map($(e).find("option"), function (e, i) { return $(e).text() });
                val = val.join("\n")
                $(".popover " + valID).text(val);
            } else if (valID === "#checkboxes") {
                val = $.map($(e).find("label"), function (e, i) { return $(e).text().trim() });
                val = val.join("\n")
                $(".popover " + valID).text(val);
            } else if (valID === "#radios") {
                val = $.map($(e).find("label"), function (e, i) { return $(e).text().trim() });
                val = val.join("\n");
                $(".popover " + valID).text(val);
                $(".popover #name").val($(e).find("input").attr("name"));
            } else if (valID === "#inline-checkboxes") {
                val = $.map($(e).find("label"), function (e, i) { return $(e).text().trim() });
                val = val.join("\n")
                $(".popover " + valID).text(val);
            } else if (valID === "#inline-radios") {
                val = $.map($(e).find("label"), function (e, i) { return $(e).text().trim() });
                val = val.join("\n")
                $(".popover " + valID).text(val);
                $(".popover #name").val($(e).find("input").attr("name"));
            } else if (valID === "#button") {
                val = $(e).text();
                var type = $(e).find("button").attr("class").split(" ").filter(function (e) { return e.match(/btn-.*/) });
                $(".popover #color option").attr("selected", null);
                if (type.length === 0) {
                    $(".popover #color #default").attr("selected", "selected");
                } else {
                    $(".popover #color #" + type[0]).attr("selected", "selected");
                }
                val = $(e).find(".btn").text();
                $(".popover #button").val(val);
            } else {
                val = $(e).text();
                $(".popover " + valID).val(val);
            }
        });

        $(".popover").delegate(".btn-danger", "click", function (e) {
            e.preventDefault();
            $active_component.popover("hide");
        });

        $(".popover").delegate(".btn-info", "click", function (e) {
            e.preventDefault();
            var inputs = $(".popover input");
            inputs.push($(".popover textarea")[0]);
            $.each(inputs, function (i, e) {
                var vartype = $(e).attr("id");
                var value = $active_component.find('[data-valtype="' + vartype + '"]')
                if (vartype === "placeholder") {
                    $(value).attr("placeholder", $(e).val());
                } else if (vartype === "checkbox") {
                    if ($(e).is(":checked")) {
                        $(value).attr("checked", true);
                    }
                    else {
                        $(value).attr("checked", false);
                    }
                } else if (vartype === "option") {
                    var options = $(e).val().split("\n");
                    $(value).html("");
                    $.each(options, function (i, e) {
                        $(value).append("\n      ");
                        $(value).append($("<option>").text(e));
                    });
                } else if (vartype === "checkboxes") {
                    var checkboxes = $(e).val().split("\n");
                    $(value).html("\n      <!-- Multiple Checkboxes -->");
                    $.each(checkboxes, function (i, e) {
                        if (e.length > 0) {
                            $(value).append('\n      <label class="checkbox">\n        <input type="checkbox" value="' + e + '">\n        ' + e + '\n      </label>');
                        }
                    });
                    $(value).append("\n  ")
                } else if (vartype === "radios") {
                    var group_name = $(".popover #name").val();
                    var radios = $(e).val().split("\n");
                    $(value).html("\n      <!-- Multiple Radios -->");
                    $.each(radios, function (i, e) {
                        if (e.length > 0) {
                            $(value).append('\n      <label class="radio">\n        <input type="radio" value="' + e + '" name="' + group_name + '">\n        ' + e + '\n      </label>');
                        }
                    });
                    $(value).append("\n  ")
                    $($(value).find("input")[0]).attr("checked", true)
                } else if (vartype === "inline-checkboxes") {
                    var checkboxes = $(e).val().split("\n");
                    $(value).html("\n      <!-- Inline Checkboxes -->");
                    $.each(checkboxes, function (i, e) {
                        if (e.length > 0) {
                            $(value).append('\n      <label class="checkbox inline">\n        <input type="checkbox" value="' + e + '">\n        ' + e + '\n      </label>');
                        }
                    });
                    $(value).append("\n  ")
                } else if (vartype === "inline-radios") {
                    var radios = $(e).val().split("\n");
                    var group_name = $(".popover #name").val();
                    $(value).html("\n      <!-- Inline Radios -->");
                    $.each(radios, function (i, e) {
                        if (e.length > 0) {
                            $(value).append('\n      <label class="radio inline">\n        <input type="radio" value="' + e + '" name="' + group_name + '">\n        ' + e + '\n      </label>');
                        }
                    });
                    $(value).append("\n  ")
                    $($(value).find("input")[0]).attr("checked", true)
                } else if (vartype === "button") {
                    var type = $(".popover #color option:selected").attr("id");
                    $(value).find("button").text($(e).val()).attr("class", "btn " + type);
                } else {
                    $(value).text($(e).val());
                }
                $active_component.popover("hide");
                genSource();
            });
        });
    });
    //$("#navtab").delegate("#sourcetab", "click", function (e) {
    //    genSource();
    //});
});