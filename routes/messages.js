const { render } = require('ejs');
const express = require('express');
const router  = express.Router();
const queries = require('../db/queries');
const printQuery = require('../lib/printQuery');

const reconstructConvoObjs = function(objArray, currentUserID) {
  let newArr = [];
  for (let obj of objArray) {
    let newObj = {};
    if (obj.buyer_id === currentUserID) {
      newObj.username = obj.seller_user_name;
    } else {
      newObj.username = obj.buyer_user_name;
    }
    newObj.item_pic = obj.photo_url;
    newObj.item_name = obj.name;
    newObj.id = obj.id;
    newArr.push(newObj);
  }
  return newArr;
};

const reconstructMessageObjs = function(messageArray) {
  let newArr = [];
  for (let obj of messageArray) {
    let newObj = {};
    newObj.recipient = obj.recipient_name;
    newObj.sender = obj.sender_name;
    newObj.message = obj.content;
    newObj.conversationID = obj.conversation_id;
    newArr.push(newObj);
  }
  return newArr;
};

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
              // console.log(sellerID, senderID);
              return db.query(queries.createConversation, [targetListing, senderID, sellerID]);
            })
        }
      })
      .then((data) => {
        console.log('sending new message');

        const recipientID = data.rows[0].seller_id;
        const conversationID = data.rows[0].id;

        return db.query(queries.createMessage, [conversationID, senderID, recipientID, newMessage]);
      })
      .then((data) => {
        console.log('message sent, returning JSON');

        // convert message
        console.log(data.rows);
        const reconstructedMessageObj = reconstructMessageObjs(data.rows)[0];
        const sentMessage = JSON.stringify(reconstructedMessageObj);

        console.log('---------------->', sentMessage);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: sentMessage }));
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.post("/conversation", (req, res) => {
    const conversationID = req.body.convID;
    // console.log('----------CONVERSATION ID:' ,conversationID);
    printQuery(queries.listMessages, [conversationID]);
    db.query(queries.listMessages, [conversationID])
      .then((data) => {
        const messagesString = JSON.stringify(reconstructMessageObjs(data.rows));
        // console.log(data.rows);
        res.setHeader('Content-Type', 'application/json');
        res.end(messagesString);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.post("/conversations", (req, res) => {
    const currentUserID = req.session.userID;

    printQuery(queries.listConversations, [currentUserID, currentUserID]);
    db.query(queries.listConversations, [currentUserID, currentUserID])
      .then((data) => {
        const responseObj = JSON.stringify(reconstructConvoObjs(data.rows, currentUserID))
        // console.log("Conversations count:", data.rowCount);
        res.setHeader('Content-Type', 'application/json');
        res.end(responseObj);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  return router;
};
