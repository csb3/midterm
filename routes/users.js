const express = require('express');
const router  = express.Router();
const queries = require('../db/queries');

module.exports = (db) => {

  router.get("/create", (req, res) => {
    db.query(queries.createUser)
      .then(data => {
        // pass
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.get("/makeAdmin", (req, res) => {
    db.query(queries.makeAdmin)
      .then(data => {
        // pass
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.get("/login", (req, res) => {
    // create cookie
  });

  router.get("/logout", (req, res) => {
    // delete cookie
  });


  return router;
};
