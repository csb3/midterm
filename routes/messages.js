const { render } = require('ejs');
const express = require('express');
const router  = express.Router();
const queries = require('../db/queries');

module.exports = (db) => {

  router.post("/create", (req, res) => {

    const newMessage = req.body.message;
    const targetListing = req.body.item;
    const senderID = req.session.userID;

    db.query(`SELECT *
    FROM conversations
    WHERE listing_id = $1
    AND buyer_id = $2;`, [targetListing, senderID])
      .then((data)=>{
        if (data.rows.length !== 0) {
          // conversation exists, add new message to it. (next then statement)
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
        const recipientID = data.rows[0].seller_id;
        return db.query(queries.createMessage, [senderID, recipientID, newMessage]);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });

    // check if a conversation already exists

    // create a conversation if a conversation does not exist

    //
    // db.query(queries.createConversation, [])
    //   // create a new conversation first
    //   .then((data) => {
    //     // create a new message to add to the conversation
    //     return db.query(queries.createMessage);
    //   })
    //   .then((data) => {
    //     // this message can be returned to the UI to be rendered onto the page
    //     const sentMessage = data.rows[0];
    //     res.setHeader('Content-Type', 'application/json');
    //     res.end(JSON.stringify({ message: sentMessage }));
    //   })
    //   .catch(err => {
    //     res
    //       .status(500)
    //       .json({ error: err.message });
    //   });
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
