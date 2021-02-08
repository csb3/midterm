const express = require('express');
const router  = express.Router();
const queries = require('../db/queries');
const { templateVars } = require('../testingData');

// helper function for constructing search queries
const checkModifications = function(modified) {
  if (modified) {
    return 'AND';
  } else {
    return 'WHERE';
  }
};

// for debugging only, prints out the parameterized query with all parameters filled in
const printQuery = function(queryString, queryParams) {
  let newString = queryString;
  let varCount = 0;
  while (newString.includes('$')) {
    varCount++;
    if (typeof(queryParams[varCount - 1]) === 'number') {
      newString = newString.replace(`$${varCount}`, queryParams[varCount - 1]);
    } else {
      newString = newString.replace(`$${varCount}`, `'${queryParams[varCount - 1]}'`);
    }
  }
  // PRINT THE QUERY
  console.log('------------------------ QUERY START');
  console.log(newString.split('  ').join('')); // REMOVE EXTRA SPACES
  console.log('------------------------ QUERY END');
};

module.exports = (db) => {

  router.post("/create", (req, res) => {
    db.query(queries.createListing)
      .then(data => {
        // create a new listing
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.get("/search", (req, res) => {
    // fetch all the search options
    const { name, city, minPrice, maxPrice } = req.query;

    // track modifications to the search query
    let modifications = false;

    // add queryParams as we go along
    let queryParams = [];

    // base query
    let queryString = `
    SELECT *
    FROM listings
    JOIN favorites ON favorites.listing_id = listing.id
    WHERE sold_date is NULL
    AND deleted = false`;

    // dynamic additions based on search parameters
    if (name) {
      queryParams.push(`%${name}%`);
      queryString += `${checkModifications(modifications)} name LIKE $${queryParams.length}\n`;
      modifications = true;
    }

    if (maxPrice) {
      queryParams.push(maxPrice);
      queryString += `${checkModifications(modifications)} price <= $${queryParams.length}\n`;
      modifications = true;
    }

    if (minPrice) {
      queryParams.push(minPrice);
      queryString += `${checkModifications(modifications)} price >= $${queryParams.length}\n`;
      modifications = true;
    }

    if (city) {
      queryParams.push(`%${city}%`);
      queryString += `${checkModifications(modifications)} city LIKE $${queryParams.length}\n`;
      modifications = true;
    }

    // finish off query
    const limits = 12;
    queryParams.push(limits);
    queryString += `ORDER BY creation_date DESC LIMIT $${queryParams.length};`;

    // print out the final query that will be run, for debugging only
    printQuery(queryString, queryParams);

    db.query(queries.search, queryParams)
      .then(data => {
        templateVars.recentListings = data.rows;
        templateVars.showFeatured = false;
        res.render('index', templateVars);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.get("/addFavorite", (req, res) => {
    db.query(queries.addToFavorites)
      .then(data => {
        // add to favorites
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.get("/removeFavorite", (req, res) => {
    db.query(queries.removeFavorite)
      .then(data => {
        // remove from favorites
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.get("/browse/:listingID", (req, res) => {
    db.query(queries.specificListing, [req.params.listingID])
      .then(data => {
        templateVars.item = data.rows[0];
        res.render('listing', templateVars);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  return router;
};
