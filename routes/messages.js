const { render } = require('ejs');
const express = require('express');
const router  = express.Router();
const queries = require('../db/queries');
const { alertMessages, evaluateAlert } = require('../lib/alertMessages');
// helper functions
const printQuery = require('../lib/printQuery');
const { checkPermission } = require('../lib/routeHelpers');

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

    const templateVars = {};

    const permission = checkPermission(req.session, false, templateVars, db);
    if (!permission) {
      return res.redirect('/?alert=401E');
    }

    const newMessage = req.body.message;
    const targetConv = req.body.item;
    const senderID = req.session.userID;

    // check if conversation already exists
    db.query(`SELECT *
    FROM conversations
    WHERE listing_id = $1
    AND buyer_id = $2
    ;`, [targetConv, senderID])
      .then((data)=>{
        if (data.rows.length !== 0) {
          // conversation exists, add new message to it. (proceed to next `then` statement)
          // console.log(`------------ Conversation (${targetConv}) exists.`);
          return data;
        } else {
          // conversation does not exist, create it. (find seller first)
          // console.log(`------------ Conversation (${targetConv}) does not exist, creating it now.`);
          return db.query('SELECT user_id FROM listings where id = $1', [targetConv])
            .then((data) => {
              const sellerID = data.rows[0].user_id;
              // console.log(sellerID, senderID);
              return db.query(queries.createConversation, [targetConv, senderID, sellerID]);
            });
        }
      })
      .then((data) => {
        // console.log(data);
        const recipientID = data.rows[0].seller_id;
        const conversationID = data.rows[0].id;
        // console.log('sending new message to', conversationID);

        return db.query(queries.createMessage, [conversationID, senderID, recipientID, newMessage]);
      })
      .then((data) => {
        // console.log('message sent');
        // printQuery(queries.fetchSingleMessage, [data.rows[0].id]);
        return db.query(queries.fetchSingleMessage, [data.rows[0].id]);
      })
      .then((data) => {
        // console.log(data.rows);
        const convertedMessageObj = reconstructMessageObjs(data.rows)[0];
        // console.log('-------> convertedObj', convertedMessageObj);
        const messageJSON = JSON.stringify(convertedMessageObj);
        // console.log('-------> messageJSON', messageJSON);
        res.setHeader('Content-Type', 'application/json');
        res.end(messageJSON);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.post("/conversation", (req, res) => {

    const templateVars = {};

    const permission = checkPermission(req.session, false, templateVars, db);
    if (!permission) {
      return res.redirect('/?alert=401F');
    }

    const conversationID = req.body.convID;
    db.query(queries.listMessages, [conversationID])
      .then((data) => {
        const messagesString = JSON.stringify(reconstructMessageObjs(data.rows));
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

    templateVars = {};

    const permission = checkPermission(req.session, false, templateVars, db);
    if (!permission) {
      return res.redirect('/?alert=401G');
    }

    db.query(queries.listConversations, [templateVars.user.ID, templateVars.user.ID])
      .then((data) => {
        const responseObj = JSON.stringify(reconstructConvoObjs(data.rows, templateVars.user.ID))
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
