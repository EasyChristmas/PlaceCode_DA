$(function () {
    //工单提问点击展开 
    var accordion_head = $('.accordion > li > a'),
        accordion_body = $('.accordion li > .sub-menu');
    //accordion_head.first().addClass('active').next().slideDown('normal');
    accordion_head.on('click', function (event) {

        // Disable header links
        event.preventDefault();
        // Show and hide the tabs on click
        if ($(this).attr('class') != 'active') {
            accordion_body.slideUp('normal');
            $(this).next().stop(true, true).slideToggle('normal');
            accordion_head.removeClass('active');
            $(this).addClass('active');
            accordion_head.children("i").removeClass("icon-caret-down").addClass("icon-caret-right");
            $(this).children("i").removeClass("icon-caret-right").addClass("icon-caret-down");
        }
    });

    $(".btnsubmit").on("click", function () {
        $(".from-db").show();
    });

    var add_rr_a = $(".add_rr_a > li > a");
    add_rr_a.on("click", function () {
        $(".form_add_rr").show();
    })
});