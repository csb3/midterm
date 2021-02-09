-- Drop and recreate Conversations table

DROP TABLE IF EXISTS conversations CASCADE;
CREATE TABLE conversations (
  id SERIAL PRIMARY KEY NOT NULL,
  listing_id INTEGER REFERENCES listings(id) ON DELETE CASCADE NOT NULL,
  buyer_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  seller_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL
);
