const { render } = require('ejs');
const express = require('express');
const router  = express.Router();
const queries = require('../db/queries');

module.exports = (db) => {

  router.post("/create", (req, res) => {

    const newMessage = req.body.message;
    const targetListing = req.body.item;
    const senderID = req.session.userID;

    // check if conversation already exists
    db.query(`SELECT *
    FROM conversations
    WHERE listing_id = $1
    AND buyer_id = $2;
    `, [targetListing, senderID])
      .then((data)=>{
        if (data.rows.length !== 0) {
          // conversation exists, add new message to it. (proceed to next `then` statement)
          console.log('------------ Conversation exists.');
          return data;
        } else {
          // conversation does not exist, create it. (find seller first)
          console.log('------------ Conversation does not exist, creating it now.');
          return db.query('SELECT user_id FROM listings where id = $1', [targetListing])
            .then((data) => {
              const sellerID = data.rows[0].user_id;
              console.log(sellerID, senderID);
              return db.query(queries.createConversation, [targetListing, senderID, sellerID]);
            })
        }
      })
      .then((data) => {
        console.log('sending new message');
        const recipientID = data.rows[0].seller_id;
        return db.query(queries.createMessage, [senderID, recipientID, newMessage]);
      })
      .then((data) => {
        console.log('message sent, returning JSON');
        const sentMessage = JSON.stringify(data.rows[0]);
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
