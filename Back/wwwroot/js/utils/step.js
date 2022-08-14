(function ($, window, document, undefined) {
    function Step(el, opts) {
        this.$el = $(el);
        this.defaults = {
            stepCount: 3,
            stepTitles: ['标题一', '标题二', '标题三'],
            stepContent: '.eis-stepContents',
            stepDirection: 'x',
            showStepButton: false, 
            success: function () { },
            defaultsStep: ''//初始化步骤
        };
        this.settings = $.extend({}, this.defaults, opts);
    };
    Step.prototype = {
        init: function () {
            var that = this,
                $stepBox = that.$el;
            // 初始化步骤条
            $stepBox.addClass('eis-horizontal-steps');
            var stepHtml = $('<div class="eis-form-steps"></div>'),
                stepBarHtml = '';
            for (var i = 0; i < that.settings.stepCount; i++) {
                if (i === that.settings.stepCount - 1) {
                    stepBarHtml += '<div class="eis-form-step" style="width:' + (100 / that.settings.stepCount).toFixed(2) + '%">\n' +
                        '            <div class="eis-step-head">\n' +
                        '                <div class="eis-step-icon">\n' +
                        '                    <div class="step-icon-txt">' + (i + 1) + '</div>\n' +
                        '                </div>\n' +
                        '            </div>\n' +
                        '        </div>';
                } else {
                    stepBarHtml += '<div class="eis-form-step" style="width:' + (100 / that.settings.stepCount).toFixed(2) + '%">\n' +
                        '            <div class="eis-step-head">\n' +
                        '                <div class="eis-step-icon">\n' +
                        '                    <div class="step-icon-txt">' + (i + 1) + '</div>\n' +
                        '                </div>\n' +
                        '                <div class="eis-step-line">\n' +
                        '                </div>\n' +
                        '            </div>\n' +
                        '        </div>';
                }
            }
            stepHtml.append($(stepBarHtml));
            stepHtml.append($('<div class="eis-step-progress"></div>'));
            $stepBox.append(stepHtml);
            // 步骤内容填充到dom中
            var $stepContent = $stepBox.find(that.settings.stepContent);
            $stepBox.append($stepContent);
            $stepBox.find('.eis-stepContent').eq(0).show().siblings('.eis-stepContent').hide();
            _initStepLine();
            _initStepLineFun(that.settings.defaultsStep); 
            //处理步骤条
            function _initStepLine() {
                var $formStep = that.$el.find('.eis-form-steps'),
                    $formSteps = $formStep.find('.eis-form-step'),
                    $stepWidth = $formSteps.width(),
                    $stepProgress = $formStep.find('.eis-step-progress'),//步骤条
                    $stepIcon = $formSteps.find('.eis-step-icon');
                $stepProgress.width($stepIcon.width() - 2);
                $formSteps.eq(0).addClass('is-finish');
                $stepIcon.each(function (index,item) { 
                    $(item).on('click', function ( ) {
                        $stepProgress.width($stepIcon.width() - 2 + $stepWidth * index);
                        $(item).parent().parent().addClass('is-finish');
                        $(item).parent().parent().prevAll().addClass('is-finish');
                        $(item).parent().parent().nextAll().removeClass('is-finish'); 
                        that.settings.success(index + 1);
                    })
                })
            }
            function _initStepLineFun(i) {
                var $formStep = that.$el.find('.eis-form-steps'),
                    $formSteps = $formStep.find('.eis-form-step'),
                    $stepWidth = $formSteps.width(),
                    $stepProgress = $formStep.find('.eis-step-progress'),//步骤条
                    $stepIcon = $formSteps.find('.eis-step-icon');
                $stepProgress.width($stepIcon.width() - 2);
                $formSteps.eq(0).addClass('is-finish');  

                if (i == 0) {
                    $stepProgress.width();
                    $stepIcon.parent().parent().removeClass('is-finish')
                } else {
                    var index = i - 1;
                    $stepProgress.width($stepIcon.width() - 2 + $stepWidth * index);
                    $stepIcon.eq(index).parent().parent().addClass('is-finish');
                    $stepIcon.eq(index).parent().parent().prevAll().addClass('is-finish');
                    $stepIcon.eq(index).parent().parent().nextAll().removeClass('is-finish'); 
                }
            } 
        }
    };
    $.fn.extend({
        step: function (opt) {
            return this.each(function () {
                new Step($(this), opt).init();
            });
        }
    });
})(jQuery, window, document);