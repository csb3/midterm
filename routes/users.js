const { Template } = require('ejs');
const express = require('express');
const router  = express.Router();
const queries = require('../db/queries');
// const alertMessages = require('./lib/alertMessages');
const templateVars = {};
// helper functions
const printQuery = require('../lib/printQuery');
const { checkPermission } = require('../lib/routeHelpers');

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
            req.session.userName = data.rows[0].user_name;
            req.session.userID = data.rows[0].id;
            req.session.userCity = data.rows[0].city;
            req.session.isAdmin = data.rows[0].is_admin;
            res.redirect('/?alert=200C');
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
    res.redirect('/?alert=200D');
  });

  router.get("/internal", (req, res) => {
    let templateVars = {};

    if (req.session.userID) {
      templateVars = { loggedIn: true };
    } else {
      templateVars = { loggedIn: false };
    }
    res.render('internal', templateVars);
  });


  return router;
};
