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
    newObj.listingID = obj.listing_id;
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
    const targetConv = req.body.convID;
    const targetListing = req.body.listingID;
    const currentUserID = req.session.userID;

    console.log('target conv', targetConv);

    let sellerID = [];


    // find the seller (have to do this no matter what)
    db.query('SELECT user_id FROM listings where id = $1', [targetListing])
      .then((data) => { // this is the seller obj
        sellerID[0] = data.rows[0].user_id;
        console.log('the seller ID is', sellerID[0]);

        console.log(targetConv === 'no');

        if (targetConv === 'no') {
          console.log(`conversation does not exist, will create new conversation with listing ${targetListing}, current user: ${currentUserID}, seller: ${sellerID}`);
          return db.query(queries.createConversation, [targetListing, currentUserID, sellerID[0]]);
        } else {
          console.log(`conversation (${targetConv}) exists`);
          // pseudo conversation object containing ID only
          const convObj = {
            rows: [{ id: targetConv}]
          };
          return convObj;
        }
      })
      .then((data) => {

        const conversationID = data.rows[0].id;
        console.log(' adnt the seller id is ...', sellerID[0]);
        return db.query(queries.createMessage, [conversationID, currentUserID, sellerID[0], newMessage]);
      })
      .then((data) => {
        console.log('message sent');
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
        console.log('----------- raw messages', data.rows);
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
