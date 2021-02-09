$(() => {
  //fakeConversation
  const convos = [
    conversation1 = {
      id: 1,
      username: 'Dave',
      item_pic: 'https://i.imgur.com/RTSFzpL.jpg',
      item_name: 'Dour Bread from the sidewalk'
    },

    conversation2 = {
      id: 2,
      username: 'Bob',
      item_pic: 'https://i.imgur.com/RTSFzpL.jpg',
      item_name: 'Rumbernuckel'
    },

    conversation3 = {
      id: 3,
      username: 'Jorn',
      item_pic: 'https://i.imgur.com/RTSFzpL.jpg',
      item_name: 'This is actually salmon'
    },

    conversation4 = {
      id: 4,
      username: 'Jamananana',
      item_pic: 'https://i.imgur.com/RTSFzpL.jpg',
      item_name: 'Wheat Bread'
    }
  ]

  const messages = [ {
    recipient: 'Dave',
    sender: 'Bob',
    message: "Hey I want your bread please"
    },

    {
      recipient: 'Bob',
      sender: 'Dave',
      message: 'Sure it is the amount on the posting'
    },

    {
      recipient: 'Dave',
      sender: 'Bob',
      message: 'Frankly that is unreasonable'
    }
  ];

  const user = {userID: 43, name: 'Bob'};


  const $navButton = $('.messages');

  $chatWindow = $(`<div id='chatWindow'>
  <i class="far fa-envelope"></i>
  </div>`)
  for (const instance of convos) {
    let $conversation = `
    <div id='${instance.id}' class="conversation">
      <img src="${instance.item_pic}">
      <h4>${instance.username}</h4>
      <p> Chatting about ${instance.item_name} </p>
    </div>`;

    $chatWindow.append($conversation);
    $('nav').on('click', '#' + instance.id, function (event) {
      console.log(event);
      $chatWindow.empty();
      for (const message of messages) {
        if(user.name === message.sender) {
          $chatWindow.append(`
          <div class='mes buy'>
            <p> <span class='sender'>${message.sender}</span>: ${message.message} </p>
          </div>
          `)
        } else {
          $chatWindow.append(`
          <div class='mes sell'>
            <p> <span class='sender'>${message.sender}</span>: ${message.message} </p>
          </div>
          `)
        }



      }
      $chatWindow.append(`
      <div class='controls'>
        <label for "newMessage">New Message:</label>
        <textarea name="newMessage" id="newMessage"></textarea>
        <button>Send</button>
        <button>Back</button>
      </div>
      `)
    });
  }


  $navButton.click(event => {
    if (!$('#chatWindow').length) {
      $('nav').append($chatWindow.hide());
    }
    $('#chatWindow').animate({
      height: "toggle",
    });
  });




});
