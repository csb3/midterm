SELECT messages.*, conversations.*, x.user_name AS seller_user_name, y.user_name AS buyer_user_name
FROM messages
JOIN conversations ON conversation_id = conversations.id
JOIN users x ON x.id = seller_id
JOIN users y ON y.id = buyer_id
WHERE conversations.id = 1
ORDER BY timestamp;
