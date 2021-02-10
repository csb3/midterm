/*
Takes 4 arguments, i.e. checkPermission(req.session, 1, templateVars, db);
  1. userSession - always pass in the whole `req.session` object
  2. targetListingObj - pass the whole listing object as a query result. Pass `false` if not checking for permission
  3. templateVars - always pass in the `templateVars` object
*/
const checkPermission = (userSession, targetListing = false, templateVars) => {

  // manipulate templateVars
  if (userSession.userName) {
    // access <%- user %> as an object in ejs templates
    templateVars.user = {
      name: userSession.userName,
      ID: userSession.userID,
      city: userSession.city,
      admin: userSession.isAdmin
    };
  } else {
    // <% if(user) ... %> returns false
    templateVars.user = false;
  }

  if (targetListing && (templateVars.user !== false)) {
    if (targetListing.user_id === templateVars.user.ID && templateVars.admin) {
      return true;
    } else {
      return false;
    }
  }
};


const checkItem = (itemObj) => {

};
