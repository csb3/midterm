SELECT users.user_name
FROM users
JOIN listings ON listings.user_id = users.id
WHERE listings.user_id = 1
GROUP BY users.user_name;
