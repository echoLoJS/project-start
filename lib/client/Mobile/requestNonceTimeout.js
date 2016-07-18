const requestNonceTimeout = callback => {
  imperio.socket.emit('updateNonceTimeouts', imperio.room);
  if (callback) callback();
};

module.exports = requestNonceTimeout;
