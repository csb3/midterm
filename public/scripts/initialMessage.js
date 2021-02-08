$(() => {

  const $toggleButton = $('.message');
  const $messageForm = $('.message form');
  const $sendButton = $('.message form button');

  $messageForm.hide();

  $toggleButton.click(event => {
    $messageForm.slideDown();
  });

  $sendButton.click(function (event) {
    event.preventDefault();
    const message = $(this).siblings('#buyerMessage').val();
    $.post('/', message)
      .done(res => {
        $messageForm.detach();
        $toggleButton.append('<h2>Message submitted successfully. The seller will be in contact shortly! </h2>');
      })
      .fail(err => {
        $messageForm.detach();
        $toggleButton.append('<h2>Message could not be sent. Please refresh the page and try again</h2>');
      });
  });
});
