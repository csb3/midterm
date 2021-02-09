SELECT conversations.*, listings.photo_url, listings.name, x.user_name AS seller_user_name, y.user_name AS buyer_user_name
FROM conversations
JOIN listings ON conversations.listing_id = listings.id
JOIN messages on messages.conversation_id = conversations.id
JOIN users x ON x.id = seller_id
JOIN users y ON y.id = buyer_id
WHERE seller_id = 1 OR buyer_id = 1
GROUP BY conversations.id, listings.photo_url, listings.name, seller_user_name, buyer_user_name
ORDER BY MAX(messages.timestamp) DESC;
