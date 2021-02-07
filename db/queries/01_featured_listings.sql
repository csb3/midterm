SELECT *
FROM listings
WHERE featured = true
ORDER BY creation_date DESC
LIMIT 50;
