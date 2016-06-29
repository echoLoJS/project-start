"use strict"; // eslint-disable-line
const express = require('express');
const app = express();
const server = require('http').Server(app); // eslint-disable-line
// const io = require('socket.io')(server);
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const useragent = require('express-useragent');
const echo = require('./../library/server/mainServer.js')(server); // ********
console.log('init method: ', echo.init);
console.log('return of init method: ', echo.init());
// const activeConnectRequests = {};
// const desktopController = require('./desktopController.js');
// const mobileController = require('./mobileController.js');

app.use(express.static(path.join(`${__dirname}/../client`)));
app.use(useragent.express()); // TODO tie this into our library somehow?
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.set('view engine', 'ejs');
// app.use((req, res, next) => { console.log('echo in middleware: ', echo); next(); });
app.use(echo.init()); // ***************************

/* ------------------
 * --    Routes    --
 * ------------------ */

// App will serve up different pages for client & desktop
app.get('/',
  (req, res) => {
    if (req.useragent && req.useragent.isDesktop) {
      res.sendFile(path.join(`${__dirname}/../client/browser.html`));
      // res.render(`../client/browser.html`);
    } else if (req.useragent && req.useragent.isMobile) {
      // TODO if token is on request, sent to tap in appropriate room
      res.render(`${__dirname}/../client/rootmobile`, { error: null });
      // res.sendFile(path.join(`${__dirname}/../client/mobile.html`));
    }
  }
);
app.post('/',
  (req, res) => {
    if (req.useragent && req.useragent.isMobile) {
      // TODO Validate nonce match, if it doesn't, serve rootmobile
      res.render(`${__dirname}/../client/tapmobile`, { error: null });
    } else {
      res.status(404)
         .render(`${__dirname}/../client/browser.html`, { error: 'NO POST' });
    }
  }
);
// 404 error on invalid endpoint
app.get('*', (req, res) => {
  res.status(404)
     .render(`${__dirname}/../client/rootmobile`,
             { error: 'Please enter code to connect to browser' });
});

/* ------------------
 * --   Sockets    --
 * ------------------ */

// io.on('connection', socket => {
//   console.log('A socket has a connection');
//   socket.on('createRoom', room => {
//     console.log(`Joined ${room}`);
//     // decrypt token?
//     socket.join(room);
//   });
//   socket.on('tap', room => {
//     console.log('Tap from mobile!');
//     io.sockets.in(room).emit('tap');
//   });
//   socket.on('disconnect', () => {
//     console.log('A user has disconnected');
//     io.emit('user disconnected');
//   });
//   socket.on('acceleration', (room, accObject) => {
//     console.log(accObject);
//     io.sockets.in(room).emit('acceleration', accObject);
//   });
//   socket.on('gyroscope', (room, gyroObject) => {
//     console.log(gyroObject);
//     io.sockets.in(room).emit('gyroscope', gyroObject);
//   });
// });

/* ------------------
 * --    Server    --
 * ------------------ */

server.listen(3000, () => {
  console.log('Listening on port 3000');
});
