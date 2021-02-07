SELECT *
FROM listings
WHERE city LIKE '%Vancouver%'
AND price < 10000
AND price > 5
AND sold_date IS NULL
AND name LIKE '%h%'
AND deleted = false
ORDER BY creation_date DESC;
