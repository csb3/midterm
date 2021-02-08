const { render } = require('ejs');
const express = require('express');
const router  = express.Router();
const queries = require('../db/queries');

module.exports = (db) => {

  router.post("/create", (req, res) => {
    const newMessage = req.body.buyerMessage;
    db.query(queries.createConversation)
      // create a new conversation first
      .then((data) => {
        // create a new message to add to the conversation
        return db.query(queries.createMessage);
      })
      .then((data) => {
        // this message can be returned to the UI to be rendered onto the page
        const sentMessage = data.rows[0];
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: sentMessage }));
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
