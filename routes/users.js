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

  router.get("/login/:userID", (req, res) => {
    const targetID = req.params.userID;
    db.query('SELECT * FROM users WHERE id = $1 LIMIT 1;', [targetID])
      .then(
        (data) => {
          if (data.rows[0] !== undefined) {
            req.session.userEmail = data.rows[0].email;
            res.redirect('/');
          }
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.get("/logout", (req, res) => {
    // clear login cookie
    req.session = null;
    res.redirect('/');
  });


  return router;
};
