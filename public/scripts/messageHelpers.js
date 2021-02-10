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
];

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



// Helper functions for the messaging script
const fillWindow = (window, object, generatorFunction, optionalParam) => {
  window.empty();
  window.append(generatorFunction(object, optionalParam));
};

const generateChatWindow = () => {
  $chatWindow = $(`<div id='chatWindow'>
  </div>`);
  return $chatWindow;
};


const generateConversations = (elements) => {
  let $conversation = `<i class="far fa-envelope"></i>`;
  for (const instance of elements) {
    $conversation += `
    <div id='${instance.id}' class="conversation">
      <img src="${instance.item_pic}">
      <h4>${instance.username}</h4>
      <p> Chatting about ${instance.item_name} </p>
    </div>`;

    $('nav').on('click', '#' + instance.id, {id: instance.id, buyer: instance.username}, function (event) {
      const listingID = event.data.id;
      const buyer = event.data.buyer;
      $.post('/api/messages/conversation', data = {convID: listingID})
        .done(mess => {
          fillWindow($chatWindow, mess, generateAllMessages, buyer);
        })
        .fail(err => {
          $chatWindow.empty();
          console.error(err);
          $chatWindow.append(`<h2>Could not load messages, please try again later`);
        });

    });
  }

  return $conversation;
};

const generateControls = (convID) => {
  return `
  <div class='controls'>
    <label for "newMessage">New Message:</label>
    <input type="hidden" value="${convID}" id="convID">
    <textarea name="newMessage" id="newMessage"></textarea>
    <button class='send'>Send</button>
    <button class='back'>Back</button>
  </div>
  `;
};

const generateAllMessages = (elements, currentUser) => {
  let $allMessages = `<div class='messageContainer'>`;
  // console.log(elements);
  const conversationID = elements[0].conversationID;
  for (const message of elements) {
    if (currentUser === message.sender) {
      $allMessages +=`
      <div class='mes sell'>
        <p><span class='sender'>${message.sender}</span>${message.message} </p>
      </div>
      `;
    } else {
      $allMessages += `
      <div class='mes buy'>
        <p><span class='sender'>${message.sender}</span>${message.message} </p>
      </div>
      `;
    }
  }

  $allMessages += `</div>`;

  $('nav').off();
  $('nav').on('click', '.back', function(event) {
    $.post('/api/messages/conversations')
      .done((conversations) => {
        fillWindow($chatWindow, conversations, generateConversations);
        $('nav').append($chatWindow);
      })
      .fail(err => {
        console.error(err);
        $('nav').append($chatWindow.append(`<h2>Failed to get conversations, please try again later</h2>`).hide());
      });
  });

  $('nav').on('click', '.send', function(event) {

    $.post('/api/messages/create', { message: $('#newMessage').val(), item: $('#convID').val() } )
      .done((message) => {
        $('.messageContainer').append(`<div class='mes buy'>
          <p><span class='sender'>${message.sender}</span>${message.message}</p>
          </div>`);
        $('#newMessage').val('');
      })
      .fail(err => {
        console.error(err);
        $('nav').append($chatWindow.append(`<h2>Couldn't send message, please try again later</h2>`).hide());
      });
  });

  $allMessages += generateControls(conversationID);
  return $allMessages;
};





