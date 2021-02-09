-- Drop and recreate Messages table

DROP TABLE IF EXISTS messages CASCADE;
CREATE TABLE messages (
  id SERIAL PRIMARY KEY NOT NULL,
  conversation_id INTEGER REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  recipient_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  content TEXT,
  timestamp TIMESTAMP NOT NULL
);
