$(() => {

  const $navButton = $('.messages');
  const $chatWindow = generateChatWindow();


  $navButton.click(event => {
    if (!$('#chatWindow').length) {
      $.get('/api/messages/conversations')
        .done((conversations) => {
          fillWindow($chatWindow, conversations, generateConversations);
          $('nav').append($chatWindow.hide());
        })
        .fail(err => {
          console.error(err);
          $('nav').append($chatWindow.append(`<h2>Failed to get conversations, please try again later</h2>`).hide());
        })
      .always(() =>{
        $('#chatWindow').animate({
          height: "toggle",
        });
      })
    } else {
      $('#chatWindow').animate({
        height: "toggle",
      });
    }
  });
});
