/*
Takes 4 arguments, i.e. checkPermission(req.session, 1, templateVars, db);
  1. userSession - always pass in the whole `req.session` object
  2. targetListingID - . Pass `false` if not checking for permission
  3. templateVars - always pass in the `templateVars` object
  4. db - pass in the db object so queries can be run

Returns a promise with
{
  listingObj, // the entire listing as an object
  permission // true or false
}

Usage:
  checkPermission(req.session, 1, templateVars, db)
    .then((data) => {
      res.render('mytemplate', templateVars);
    })
    .catch((err) => {
      console.log(err);
    });
*/

const checkPermission = (userSession, targetListingID = false, templateVars, db) => {

  // manipulate templateVars
  if (userSession.userName) {
    // access <%- user %> as an object in ejs templates
    templateVars.user = {
      name: userSession.userName,
      ID: userSession.userID,
      city: userSession.userCity,
      admin: userSession.isAdmin
    };
  } else {
    // <% if(user) ... %> returns false in ejs templates
    templateVars.user = false;
  }

  // fetch the target listing and check to see if
  if (targetListingID) {
    return targetListing = db.query(`SELECT * FROM listings WHERE id=$1;`, [targetListingID])
      .then((data) => {
        if (data.rows.length !== 0) {
          let output = {
            listingObj: data.rows[0]
          };
          if ((output.listingObj.user_id === templateVars.user.ID) && templateVars.admin) {
            output.permission = true;
          } else {
            output.permission = false;
          }
          return output;
        } else {
          return {listingObj: false};
        }
      })
      .catch(err => console.log(err));
  }
};


const checkItem = (itemObj) => {

};

module.exports = {
  checkPermission,
  checkItem
};
