SELECT listings.photo_url, listings.name, x.user_name AS seller_user_name, y.user_name AS buyer_user_name
FROM conversations
JOIN listings ON conversations.listing_id = listings.id
JOIN users x ON x.id = seller_id
JOIN users y ON y.id = buyer_id
WHERE conversations.id = 1;
