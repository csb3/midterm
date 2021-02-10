const express = require('express');
const router  = express.Router();
const queries = require('../db/queries');
const templateVars = {};
// helper funcitons
const printQuery = require('../lib/printQuery');
const { checkPermission, checkItem } = require('../lib/routeHelpers');

module.exports = (db) => {

  router.post("/create", (req, res) => {

    const permission = checkPermission(req.session, false, templateVars, db);

    if (!permission) {
      console.log('ERROR: USER IS NOT AN ADMIN, NO PERMISSION TO CREATE LISTINGS');
      return res.redirect('/');
    }

    let { name, description, price, photo_url, user_id, weight, city } = req.body;
    user_id = user_id ? user_id : req.session.userID;
    price = Math.floor(price * 100);

    db.query(queries.createListing, [name, description, price, photo_url, user_id, weight, city])
      .then(data => {
        console.log('New listing created');
        res.redirect(`/api/listings/browse/${data.rows[0].id}`);
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
    let queryString = `SELECT listings.*, favorites.user_id AS favorited
    FROM listings
    LEFT OUTER JOIN favorites ON favorites.listing_id = listings.id
    WHERE sold_date is NULL
    AND deleted = false\n`;

    // dynamic additions based on search parameters
    if (name) {
      queryParams.push(`%${name.toLowerCase()}%`);
      queryString += `AND name ILIKE $${queryParams.length}\n`;
      modifications = true;
    }

    if (maxPrice) {
      queryParams.push(Math.floor(Number(maxPrice) * 100));
      queryString += `AND price <= $${queryParams.length}\n`;
      modifications = true;
    }

    if (minPrice) {
      queryParams.push(Math.floor(Number(minPrice) * 100));
      queryString += `AND price >= $${queryParams.length}\n`;
      modifications = true;
    }

    if (city) {
      queryParams.push(`%${city.toLowerCase()}%`);
      queryString += `AND city ILIKE $${queryParams.length}\n`;
      modifications = true;
    }

    // finish off query
    const limits = 12;
    queryParams.push(limits);
    queryString += ` ORDER BY creation_date DESC LIMIT $${queryParams.length};`;

    // print out the final query that will be run, for debugging only
    printQuery(queryString, queryParams);

    db.query(queryString, queryParams)
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

    const permission = checkPermission(req.session, false, templateVars, db);
    if (!permission) {
      console.log('ERROR: YOU MUST BE LOGGED IN TO ADD/REMOVE FAVORITES.');
      return res.redirect('/');
    }

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

    const permission = checkPermission(req.session, false, templateVars, db);
    if (!permission) {
      console.log('ERROR: YOU MUST BE LOGGED IN TO ADD/REMOVE FAVORITES.');
      return res.redirect('/');
    }

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
    checkPermission(req.session, false, templateVars, db); // just assigns templateVars
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

  router.post("/browse/:listingID/delete", (req, res) => {
    templateVars.user = {userID: req.session.userID, isAdmin: req.session.isAdmin};
    db.query(queries.deleteListing, [req.params.listingID])
      .then(() => {
        res.redirect('/');
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.post("/browse/:listingID/markSold", (req, res) => {
    templateVars.user = {userID: req.session.userID, isAdmin: req.session.isAdmin};
    db.query(queries.markAsSold, [req.params.listingID])
      .then((data) => {
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
