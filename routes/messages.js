const express = require('express');
const router  = express.Router();
const queries = require('../db/queries');

module.exports = (db) => {

  router.get("/create", (req, res) => {
    db.query(queries.createMessage)
      .then(data => {
        // do something with the new message
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.get("/conversation", (req, res) => {
    db.query(queries.listMessages)
      .then(data => {
        // list all messages in a conversation
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.get("/conversations", (req, res) => {
    db.query(queries.listConversations)
      .then(data => {
        // list all conversations (no individual messages)
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  return router;
};
