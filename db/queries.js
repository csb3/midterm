// QUERY TEMPLATES - parameterize as needed

const queries = {
  // USERS QUERIES
  createUser: ``, // SHOULD RETURN USER USING SQL 'RETURNING *'
  makeAdmin: ``,
  fetchUser: `SELECT * FROM users
  WHERE id = $1`,

  // MESSAGES QUERIES
  createMessage: ``, // SHOULD RETURN THE MESSAGE USING SQL 'RETURNING *'
  createConversation: ``, // creates a ew message
  listMessages: `SELECT *
  FROM messages
  JOIN conversations ON conversation_id = conversations.id
  WHERE conversations.id = 1
  ORDER BY timestamp;`,
  listConversations: `SELECT *
  FROM conversations
  WHERE seller_id = 1 OR buyer_id = 1;`,

  // LISTINGS QUERIES
  createListing: ``, // SHOULD RETURN THE NEW LISTING USING SQL 'RETURNING *'
  browseRecentListings: `SELECT * FROM listings
  ORDER BY id
  LIMIT 50`,
  specificListing: `SELECT * FROM listings
  WHERE id = $1;`,
  browseMyListings: `SELECT *
  FROM listings
  WHERE user_id = 1 AND deleted = false;`,
  search: ``,
  showFavorites: `SELECT *
  FROM listings
  JOIN favorites on listings.id = favorites.listing_id
  WHERE favorites.user_id = 1;`,
  addToFavorites: ``,
  removeFavorite: ``,
  showFeatured: `SELECT *
  FROM listings
  WHERE featured = true
  ORDER BY creation_date DESC
  LIMIT 50;`
}

module.exports = queries;

