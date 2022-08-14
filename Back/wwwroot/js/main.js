require.config({
    paths: {
        "jquery": "../lib/jquery/dist/jquery.min",
        "jquery_ui": "../lib/jquery-ui/jquery-ui",
        "boot": "../lib/bootstrap/dist/js/bootstrap",
        "boot_datepicker": "../lib/bootstrap-datepicker/dist/js/bootstrap-datepicker",
        "sweetalert": "../lib/sweetalert/dist/sweetalert",
        "ko": "../lib/knockout.js/knockout",
        "ko_mapping": "../lib/knockout.js/knockout.mapping-latest",
        "select2": "../lib/select2/dist/js/select2",
        "switchery": "../lib/switchery/dist/switchery",
        "icheck": "../lib/icheck/icheck",
        "summernote": "../lib/summernote/dist/summernote",
        "summernote_cn": "../lib/summernote/lang/summernote-zh-cn",
        "underscore": "../lib/underscore/underscore-min",
        "pnotify": "../lib/pnotify/dist/pnotify",
        "pnotify_buttons": "../lib/pnotify/dist/pnotify.buttons",
        "mapping": "../lib/knockout.js/mapping",
        "swiper": "../lib/swiper/dist/js/swiper",
        "boot_dialog": "plugins/bootstrap-dialog/bootstrap-dialog",
        "layer": "plugins/layer/layer",
        "jquery_form": "plugins/jqueryformext/jquery.form",
        "jquery_formext": "plugins/jqueryformext/jquery.formext",
        "jquery_validate": "plugins/jqueryformext/jquery.validate",
        "jquery_metadata": "plugins/jqueryformext/jquery.metadata",
        "boot_datetimepicker": "plugins/bootstrap-datetimepicker-master/js/bootstrap-datetimepicker.min",
        "boot_datetimepicker_cn": "plugins/bootstrap-datetimepicker-master/js/locales/bootstrap-datetimepicker.zh-cn",
        "": "plugins/fileupload/jquery.ui.widget",
        "": "plugins/fileupload/jquery.iframe-transport",
        "": "plugins/fileupload/jquery.fileupload",
        "": "plugins/fileupload",
        "validate": "base/a_validate",
        "global": "base/b_global",
        "ui": "base/c_ui",
        "data": "base/d_data",
        "util": "base/e_util",
        "enum": "biz/enum",
        "": "plugins/softbar/softbar_didi/javascripts/jquery.json.min",
        "": "plugins/softbar/softbar_didi/javascripts/global",
        "": "plugins/softbar/softbar_didi/javascripts/app",
        "": "plugins/softbar/softbar_didi/javascripts/softphonebar",
        "": "plugins/softbar/softbar_didi/javascripts/phone",
        "": "plugins/softbar/softbar_didi/javascripts/utils",
        "": "plugins/softbar/softbar_didi/javascripts/cnToSpell",
        "": "callcenter"


    }
});

requirejs(['jquery'], function ($) {
    //写一段代码验证jquery是否被正确引入
    //将body背景颜色变为红色
    $('body').css('background-color', 'red');
});