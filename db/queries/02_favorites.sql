SELECT *
FROM listings
JOIN favorites on listings.id = favorites.listing_id
WHERE favorites.user_id = 1;
