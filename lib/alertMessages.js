const alertMessages = {

  // LISTINGS ROUTE
  '401A': "ERROR: Only admins have permission to post new listings. Sorry. More bread for you I guess.",
  '401B': 'ERROR: YOU MUST BE LOGGED IN TO VIEW YOUR FAVORITES.',
  '401C': 'ERROR: YOU MUST BE LOGGED IN TO CHECK FAVORITES.',
  '401D': 'ERROR: YOU MUST BE LOGGED IN TO ADD/REMOVE FAVORITES.',

  '404A': 'ERROR: THE LISTING DOES NOT EXIST',

  '200A': 'SUCCESS: Listing deleted.',
  '200B': 'SUCCESS: Listing marked as sold.',

  '201A': "SUCCESS: New listing created! Hope you sell some bread!",

  // MESSAGES ROUTE
  '401E': 'ERROR: YOU MUST BE LOGGED IN TO SEND MESSAGES',
  '401F': 'ERROR: YOU MUST BE LOGGED IN TO VIEW CONVERSATIONS',
  '401G': 'ERROR: YOU MUST BE LOGGED IN TO SEND MESSAGES',

  // USERS ROUTE
  '200C': 'Welcome back! Hope you sell some bread!',
  '200D': 'Logged out, please come again!'
};

const evaluateAlert = function(templateVars, alertMessages, req) {
  if (req.query.alert) {
    templateVars.alert.display = true;
    templateVars.alert.message = alertMessages[req.query.alert];
    console.log(req.query.alert);
    if (req.query.alert[0] === '2') {
      templateVars.alert.picture = '/images/happybread.jpg';
    } else {
      templateVars.alert.picture = '/images/sadbread.jpg';
    }
  }
};

module.exports = {
  alertMessages,
  evaluateAlert
}
