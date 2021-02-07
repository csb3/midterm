// QUERY TEMPLATES

const queries = {
  // USERS QUERIES
  createUser: ``, // SHOULD RETURN USER USING SQL 'RETURNING *'
  makeAdmin: ``,
  loginUser: ``,
  logoutUser: ``,

  // MESSAGES QUERIES
  createMessage: ``, // SHOULD RETURN THE MESSAGE USING SQL 'RETURNING *'
  listMessages: ``,
  listConversations: ``,

  // LISTINGS QUERIES
  createListing: ``, // SHOULD RETURN THE NEW LISTING USING SQL 'RETURNING *'
  browseAllListings: ``,
  browseListing: ``,
  search: ``,
  addToFavorites: ``,
  removeFavorite: ``,
  showFeatured: ``
}

module.exports = queries;

