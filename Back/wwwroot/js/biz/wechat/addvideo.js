$(function () {
    //视频标签
    $("#js_tag_input").keyup(function (event) {
        if (event.keyCode == 13) {
            var $this = $(this);
            if ($this.val().length != 0) {
                var tipcon = '<span class="video_tag"> ' + $this.val() +
                '<i class="icon-remove"></i>' +
                '</span>';
                $('#js_tag_box').prepend(tipcon);
                $this.val("");
                //删除标签
                $(".icon-remove").on("click", function () {
                    $(this).parent().fadeOut();
                });
            } else {
                alert("请填写标签");
            }
        }
    });
});