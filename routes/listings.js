const express = require('express');
const router  = express.Router();
const queries = require('../db/queries');
const { templateVars } = require('../testingData');

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

  router.get("/:listingID", (req, res) => {
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

  router.get("/search", (req, res) => {
    db.query(queries.search)
      .then(data => {
        // search
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
  return router;
};
