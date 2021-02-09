-- Drop and recreate Listings table

DROP TABLE IF EXISTS listings CASCADE;
CREATE TABLE listings (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  photo_url VARCHAR(255) NOT NULL,
  creation_date TIMESTAMP,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  featured BOOLEAN DEFAULT FALSE,
  weight INTEGER NOT NULL,
  city VARCHAR(255) NOT NULL,
  sold_date TIMESTAMP DEFAULT NULL,
  deleted BOOLEAN DEFAULT FALSE
);
