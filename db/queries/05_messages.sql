SELECT *
FROM messages
JOIN conversations ON conversation_id = conversations.id
WHERE conversations.id = 1
ORDER BY timestamp;
