// QUERY TEMPLATES - parameterize as needed

const queries = {
  // USERS QUERIES
  fetchUser: `SELECT * FROM users
  WHERE id = $1;`,

  // MESSAGES QUERIES
  createConversation: `INSERT INTO conversations (listing_id, buyer_id, seller_id) VALUES ($1, $2, $3) RETURNING *;`,
  createMessage: `INSERT INTO messages (sender_id, recipient_id, content, timestamp) VALUES ($1, $2, $3, $4) RETURNING *;`, // SHOULD RETURN THE MESSAGE USING SQL 'RETURNING *'
  listMessages: `SELECT *
  FROM messages
  JOIN conversations ON conversation_id = conversations.id
  WHERE conversations.id = $1
  ORDER BY timestamp;`,
  listConversations: `SELECT *
  FROM conversations
  WHERE seller_id = $1 OR buyer_id = $1;`,

  // LISTINGS QUERIES
  createListing: `INSERT INTO listings (name, description, price, photo_url, creation_date, user_id, weight, city) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;`, // SHOULD RETURN THE NEW LISTING USING SQL 'RETURNING *'
  browseRecentListings: `SELECT * FROM listings
  WHERE deleted = false
  ORDER BY creation_date DESC
  LIMIT 12;`,
  specificListing: `SELECT *, users.user_name FROM listings
  JOIN users ON listings.user_id = users.id
  WHERE listings.user_id = $1 AND deleted = false;`,
  browseMyListings: `SELECT *
  FROM listings
  WHERE user_id = $1 AND deleted = false;`,
  showFavorites: `SELECT *
  FROM listings
  JOIN favorites on listings.id = favorites.listing_id
  WHERE favorites.user_id = $1 AND deleted = false;`,
  addToFavorites: `INSERT INTO favorites (listing_id, user_id) VALUES ($1, $2) RETURNING *;`,
  removeFavorite: `DELETE FROM favorites WHERE id = $1;`,
  showFeatured: `SELECT *
  FROM listings
  WHERE featured = true AND deleted = false
  ORDER BY creation_date DESC
  LIMIT 2;`
};

module.exports = queries;

