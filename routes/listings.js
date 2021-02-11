const express = require('express');
const router  = express.Router();
const queries = require('../db/queries');
const { alertMessages, evaluateAlert } = require('../lib/alertMessages');
// helper functions
const printQuery = require('../lib/printQuery');
const { checkPermission } = require('../lib/routeHelpers');


module.exports = (db) => {

  router.get("/create", (req, res) => {

    const templateVars = { alertMessages, alert: { display: false} };
    evaluateAlert(templateVars, alertMessages, req);

    const permission = checkPermission(req.session, false, templateVars, db);
    if (!permission) {
      return res.redirect('/?alert=401A');
    }
    res.render('create', templateVars);
  });

  router.post("/create", (req, res) => {

    const templateVars = {};

    const permission = checkPermission(req.session, false, templateVars, db);
    if (!permission) {
      return res.redirect('/?alert=401A');
    }

    let { name, description, price, photo_url, user_id, weight, city } = req.body;
    user_id = user_id ? user_id : req.session.userID;
    price = Math.floor(price * 100);

    db.query(queries.createListing, [name, description, price, photo_url, user_id, weight, city])
      .then(data => {
        res.redirect(`/api/listings/browse/${data.rows[0].id}?alert=201A`);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.get("/search", (req, res) => {

    const templateVars = { alertMessages, alert: { display: false} };
    evaluateAlert(templateVars, alertMessages, req);

    checkPermission(req.session, false, templateVars, db);

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
    // printQuery(queryString, queryParams);

    templateVars.pageTitle = 'Search Results';

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

  router.get("/favorites", (req, res) => {

    const templateVars = { alertMessages, alert: { display: false} };
    evaluateAlert(templateVars, alertMessages, req);

    const permission = checkPermission(req.session, false, templateVars, db);
    if (!permission) {
      return res.redirect('/?alert=401B');
    }

    // print out the final query that will be run, for debugging only
    // printQuery(queries.showFavorites, [req.session.userID]);

    templateVars.pageTitle = 'Favorites';

    db.query(queries.showFavorites, [req.session.userID])
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

  router.post("/checkFavorite", (req, res) => {

    const templateVars = {};

    const permission = checkPermission(req.session, false, templateVars, db);
    if (!permission) {
      return res.redirect('/?alert=401C');
    }

    const listingID = req.body.listingID;

    db.query(`SELECT * FROM favorites WHERE user_id=$1 AND listing_id=$2`, [templateVars.user.ID, listingID])
      .then((data) => {
        if (data.rows.length !== 0) {
          res.status(200).json({ favorited: true });
        } else {
          res.status(200).json({ favorited: false });
        }
      })
      .catch((err) => {
        console.log(err);
      });

  });

  router.post("/addFavorite", (req, res) => {

    const templateVars = {};

    const permission = checkPermission(req.session, false, templateVars, db);
    if (!permission) {
      return res.redirect('/?alert=401D');
    }

    const listingID = req.body.listingID;

    db.query(queries.addToFavorites, [listingID, templateVars.user.ID])
      .then(data => {
        res.status(200).json({ status: true });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.post("/removeFavorite", (req, res) => {

    templateVars = {};

    const permission = checkPermission(req.session, false, templateVars, db);
    if (!permission) {
      return res.redirect('/?alert=401D');
    }

    const listingID = req.body.listingID;

    db.query(queries.removeFavorite, [listingID, templateVars.user.ID])
      .then((data) => {
        res.status(200).json({ status: true });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.get("/browse/:listingID", (req, res) => {

    const templateVars = { alertMessages, alert: { display: false} };
    evaluateAlert(templateVars, alertMessages, req);

    checkPermission(req.session, false, templateVars, db); // just assigns templateVars

    db.query(queries.specificListing, [req.params.listingID])
      .then(data => {
        if (data.rows.length !== 0) {
          templateVars.item = data.rows[0];
          res.render('listing', templateVars);
        } else {
          res.redirect('/?alert=404A');
        }
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.post("/browse/:listingID/delete", (req, res) => {

    templateVars = {};

    checkPermission(req.session, req.params.listingID, templateVars, db)
      .then((data) => {
        console.log(data);
        if (data.permission) {
          console.log('LISTING DELETED');
          return db.query(queries.deleteListing, [req.params.listingID]);
        } else {
          return console.log('ERROR: YOU DO NOT HAVE PERMISSION TO DELETE THIS LISTING.');
        }
      })
      .then(() => {
        res.redirect('/?alert=200A');
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.post("/browse/:listingID/markSold", (req, res) => {

    const templateVars = {};

    checkPermission(req.session, req.params.listingID, templateVars, db)
      .then((data) => {
        console.log(data);
        if (data.permission) {
          return db.query(queries.markAsSold, [req.params.listingID]);
        } else {
          return console.log('ERROR: YOU DO NOT HAVE PERMISSION TO MARK THIS LISTING AS SOLD.');
        }
      })
      .then((data) => {
        templateVars.item = data.rows[0];
        res.redirect('/api/listings/browse/' + templateVars.item.id + '?alert=200B');
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  return router;
};
