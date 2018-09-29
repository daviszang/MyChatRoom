#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require("./app");
var debug = require("debug")("mean-angular6:server");
var http = require("http");
const Channel = require("./models/channel");
const User = require("./models/user");

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * use socket.io
 */
var io = require("socket.io")(server);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
}

//socket
io.on("connection", function(socket) {
  console.log("Connected client on port %s.", "3000");
  socket.emit("message", "log in");
  //client event hi
  let token = socket.handshake.query.token;
  let groupId = token.substr(0, 24);
  let channelId = token.substr(24, 48);
  console.log(channelId);
  Channel.findById(channelId,function(err, data) {
    if (err) console.log(err);
    else {
      console.log("History:");
      // console.log(data);
      // console.log(data);
      for (let msg of data.conversation) {
        User.findById(msg.author, (err, user) => {
          let tosendmsg = {
            content: msg.content,
            fromId: msg.author,
            type: 2,
            time:msg.time,
            from: user.username,
            group: groupId,
            channel: channelId
          };
          // console.log(msg);
          // console.log(tosendmsg);
          socket.emit("message", tosendmsg);
          
        });
      }
    }
  });
  socket.on("message", function(data) {
    Channel.updateOne(
      { _id: channelId },
      {
        $push: {
          conversation: {
            author: data.fromId,
            content: data.content
          }
        }
      },
      function(err, numAffected) {
        if (err) console.log(err);
        console.log(numAffected);
      }
    );
    socket.join(token);
    console.log("[From client:] #");
    console.log(data);
    socket.emit("message", data);
    socket.broadcast.to(token).emit("message", data);
  });

  //断开事件
  socket.on("disconnect", function(data) {
    console.log("断开", data);
    //socket.broadcast用于向整个网络广播(除自己之外)
    //socket.broadcast.emit('c_leave','某某人离开了')
  });
});
console.log("listening in http://localhost:3000/");
