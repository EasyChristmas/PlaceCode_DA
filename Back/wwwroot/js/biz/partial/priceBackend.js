
$(function () {
    //直客投顾费率价格变更
    $("#backEndJsonList").on("change", "input[data-title='channelPrice']", function () {
        $("#channelPriceChangeNofity").show();
        $("#channelPriceChangeNofity").attr("enb", "true");
        $("#channelPriceChangeNofity").css("border", "none");
        $("#channelPriceChangeNofity").attr("class", "btn btn-orange fl animated shake");
    });

    //直客投顾费率变更通知
    $("[id=channelPriceChangeNofity]").click(function () {
        var obj = $(this);
        if ($(obj).text() == "通知发送中...") {
            $.tips("求别狂点..!", $(obj), 1500);
        }
        else if ($(obj).attr("enb") == "true") {
            $(obj).attr("enb", "false");
            $(obj).text("通知发送中...");
            $.post({
                url: "product/backEndChannelPriceNotify",
                data: { id: $("#productId").val() },
                success: function (res) {
                    $.tips("已发送，" + res+"人收到通知！", $(obj), 1500);
                    $(obj).attr("enb", "true");
                    $(obj).text("Y价格变更通知");
                },
                error: function () {
                    $.tips("通知失败，请稍后重试", $(obj), 1500);
                    $(obj).attr("enb", "true");
                    $(obj).text("Y价格变更通知");
                }
            });
        }
        else
            $.tips("价格更新后才能发送通知", $(obj), 1500);
    });
});