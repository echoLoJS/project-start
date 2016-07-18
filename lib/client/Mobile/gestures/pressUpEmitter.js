import Hammer from '../.././hammer.min.js';

const pressUpEmitter = (element, callback) => {
  const hammertime = new Hammer(element);
  hammertime.on('pressup', event => {
    event.type = 'pressUp';
    imperio.callbacks.pressUp = callback;
    if (imperio.connectionType === 'webRTC') {
      imperio.dataChannel.send(JSON.stringify(event));
    } else imperio.socket.emit('pressUp', imperio.room, event);
    if (callback) callback(event);
  });
};

module.exports = pressUpEmitter;
