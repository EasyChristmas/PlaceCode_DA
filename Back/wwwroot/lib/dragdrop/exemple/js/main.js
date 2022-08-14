$(function(){
  $('.block1')
    .dragdrop()
    .on('dragend', function (e, data) {
      $(this).css({left: data.position.x, top: data.position.y})
    });

  $('.block2')
    .dragdrop({makeClone: true})
    .on('dragend', function (e, data) {
      $(this).css({left: data.sourcePosition.x, top: data.sourcePosition.y})
    });

  $('.block3')
    .dragdrop({
      waitStart: 500,
      dragClass: 'drag'
    })
    .on('dragend', function (e, data) {
      $(this).css({left: data.position.x, top: data.position.y})
    });

  $('.block4')
    .dragdrop({makeClone: true})
    .on('dragbegin', function () {
      $(this).find('div').text('dragbegin');
    })
    .on('dragend', function () {
      $(this).find('div').text('dragstop');
    })
    .on('drag', function () {
      $(this).find('div').text('drag');
    });


});