// QUERY TEMPLATES - parameterize as needed

const queries = {
  // USERS QUERIES
  fetchUser: `SELECT * FROM users
  WHERE id = $1;`,

  // MESSAGES QUERIES
  createConversation: `INSERT INTO conversations (listing_id, buyer_id, seller_id) VALUES ($1, $2, $3) RETURNING *;`,
  createMessage: `INSERT INTO messages (sender_id, recipient_id, content, timestamp) VALUES ($1, $2, $3, CURRENT_TIMESTAMP) RETURNING *;`, // SHOULD RETURN THE MESSAGE USING SQL 'RETURNING *'
  listMessages: `SELECT messages.*, conversations.*, x.user_name AS seller_user_name, y.user_name AS buyer_user_name
  FROM messages
  JOIN conversations ON conversation_id = conversations.id
  JOIN users x ON x.id = seller_id
  JOIN users y ON y.id = buyer_id
  WHERE conversations.id = $1
  ORDER BY timestamp;`,
  listConversations: `
  SELECT conversations.*, listings.photo_url, listings.name, x.user_name AS seller_user_name, y.user_name AS buyer_user_name
  FROM conversations
  JOIN listings ON conversations.listing_id = listings.id
  JOIN messages on messages.conversation_id = conversations.id
  JOIN users x ON x.id = seller_id
  JOIN users y ON y.id = buyer_id
  WHERE seller_id = $1 OR buyer_id = $1
  GROUP BY conversations.id, listings.photo_url, listings.name, seller_user_name, buyer_user_name
  ORDER BY MAX(messages.timestamp) DESC;`,

  // LISTINGS QUERIES
  createListing: `INSERT INTO listings (name, description, price, photo_url, creation_date, user_id, weight, city) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, $5, $6, $7) RETURNING *;`, // SHOULD RETURN THE NEW LISTING USING SQL 'RETURNING *'
  browseRecentListings: `SELECT * FROM listings
  WHERE deleted = false
  ORDER BY creation_date DESC
  LIMIT 12;`,
  specificListing: `SELECT listings.*, users.user_name FROM listings
  JOIN users ON listings.user_id = users.id
  WHERE listings.id = $1 AND deleted = false;`,
  browseMyListings: `SELECT *
  FROM listings
  WHERE user_id = $1 AND deleted = false;`,
  showFavorites: `SELECT *
  FROM favorites
  JOIN listings on listings.id = favorites.listing_id
  WHERE favorites.user_id = $1 AND listings.deleted = false
  ORDER BY favorites.id DESC;`,
  addToFavorites: `INSERT INTO favorites (listing_id, user_id) VALUES ($1, $2) RETURNING *;`,
  removeFavorite: `DELETE FROM favorites WHERE id = $1;`,
  showFeatured: `SELECT *
  FROM listings
  WHERE featured = true AND deleted = false
  ORDER BY creation_date DESC
  LIMIT 2;`,
  deleteListing: `UPDATE listings SET deleted = true WHERE id = $1 RETURNING *;`,
  markAsSold: `UPDATE listings SET sold_date = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *;`
};

module.exports = queries;

