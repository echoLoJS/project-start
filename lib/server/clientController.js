"use strict"; // eslint-disable-line
/* eslint-disable no-param-reassign */
const jwtController = require('./jwtController.js');
const clientController = {};

/**
 * If a token exists, extract the room id from the token and store it on cookie
 *   and set req.impirio's connected property to true
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @param {Object} connectRequests - a reference to the activeConnectRequests object
 */
clientController.handleGet = (req, res, connectRequests) => {
  if (req.useragent && req.useragent.isMobile) {
    // console.log(`request is from Mobile`);
    // check for token / room session
    const token = req.cookies.session;
    let roomId;
    if (token) {
      roomId = jwtController.getRoomIdFrom(token);
      res.cookie('roomId', roomId); // DEBUG this is for reference?
      req.imperio.connected = true;
    }
  }
};

/**
 * Verifies nonce sent in the req body a user configurable bodyTag
 * If nonce is valid, set corresponding room id to a cookie on response
 *   (this will initiate a socket connection when the browser gets the response)
 *   then sets req.imperio's connected property to true
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @param {Object} connectRequests - a reference to the activeConnectRequests object
 * @param {String} bodyTag - the key at which the nonce is attached to the request body
 */
clientController.handlePost = (req, res, connectRequests, bodyTag) => {
  const nonce = req.body[bodyTag];
  if (connectRequests.hasOwnProperty(nonce)) {
    const roomId = connectRequests[nonce].roomId;
    // console.log('the nonce exists and matches to roomId:', roomId);
    jwtController.createTokenFrom(roomId, res);
    res.cookie('roomId', roomId); // DEBUG this is for reference?
    req.imperio.connected = true;
  }
    // if incorrect then redirect to rootclient page with error message
};

module.exports = clientController;
