$(() => {

  const $navButton = $('.messages');
  const $chatWindow = generateChatWindow();


  $navButton.click(event => {
    if (!$('#chatWindow').length) {
      fillWindow($chatWindow, convos, generateConversations);
      $('nav').append($chatWindow.hide());
    }
      $('#chatWindow').animate({
        height: "toggle",
      });
  });
});
