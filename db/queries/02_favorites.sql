SELECT *
FROM favorites
JOIN listings on listings.id = favorites.listing_id
WHERE favorites.user_id = 1
ORDER BY favorites.id DESC;
