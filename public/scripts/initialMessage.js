$(() => {

  const $toggleButton = $('.message');
  const $messageForm = $('.message form');
  const $sendButton = $('.message form button');

  $messageForm.hide();

  $toggleButton.click(event => {
    $('body, html').animate(
      {
        scrollTop: $toggleButton.offset().top
      }, 800
    );

    $messageForm.slideDown();
  });

  $sendButton.click(function (event) {
    event.preventDefault();
    const message = {
      listingID: $('main').attr('id'),
      message: $(this).siblings('#buyerMessage').val(),
      convID: 'no'
    }
    $.post('/api/messages/create', message)
      .done(res => {
        console.log('res',res);
        $messageForm.detach();
        $toggleButton.append('<h2>Message submitted successfully. The seller will be in contact shortly! </h2>');
      })
      .fail(err => {
        console.log('err', err);
        $messageForm.detach();
        $toggleButton.append('<h2>Message could not be sent. Please refresh the page and try again</h2>');
      });
  });
});
