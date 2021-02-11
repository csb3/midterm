const alertMessages = {

  // LISTINGS ROUTE
  '401A': '<i class="fas fa-exclamation-triangle"></i> Only admins have permission to post new listings. Sorry. More bread for you I guess.',
  '401B': '<i class="fas fa-exclamation-triangle"></i> Oops, you need to be logged in to view your favorites.',
  '401C': '<i class="fas fa-exclamation-triangle"></i> Oops, you need to be logged in to check your favorites.',
  '401D': '<i class="fas fa-exclamation-triangle"></i> Oops, you need to be logged in to add/remove favorites.',

  '404A': '<i class="fas fa-exclamation-triangle"></i> The listing does not exist. Maybe someone ate this delicious loaf.',

  '200A': '<i class="fas fa-check-circle"></i> SUCCESS: Listing deleted. Mmm someone\'s going to have a good time!',
  '200B': '<i class="fas fa-check-circle"></i> SUCCESS: Listing marked as sold. Lucky buyer!',

  '201A': '<i class="fas fa-check-circle"></i> New listing created! Remember to buy fresh, sell stale!',

  // MESSAGES ROUTE
  '401E': '<i class="fas fa-exclamation-triangle"></i> You must be logged in to view messages',
  '401F': '<i class="fas fa-exclamation-triangle"></i> You must be logged in to view conversatoins',
  '401G': '<i class="fas fa-exclamation-triangle"></i> You must be logged in to send messages',

  // USERS ROUTE
  '200C': '<i class="fas fa-check-circle"></i> Welcome back! Hope you sell some bread!',
  '200D': '<i class="fas fa-check-circle"></i> Logged out, please come again!'
};

const evaluateAlert = function(templateVars, alertMessages, req) {
  if (req.query.alert) {
    templateVars.alert.display = true;
    templateVars.alert.message = alertMessages[req.query.alert];
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
