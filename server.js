const url = require("url");

const ws = require("ws");

const fs = require("fs");

const Cookies = require("cookies");

const Koa = require("koa");

const bodyParser = require("koa-bodyparser");

const router = require("koa-router")();

const WebSocketServer = ws.Server;

const app = new Koa();

// log request URL:
app.use(async (ctx, next) => {
  console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
  await next();
});

// parse user from cookie:
app.use(async (ctx, next) => {
  ctx.state.user = parseUser(ctx.cookies.get("name") || "");
  await next();
});

// parse request body:
app.use(bodyParser());

// router.get("/", async (ctx, next) => {
//   ctx.response.type = "text/html";
//   ctx.response.body = fs.readFileSync("./dist/ChatRoom/index.html");
// });

app.use(router.routes());

let server = app.listen(3000);

function parseUser(obj) {
  if (!obj) {
    return;
  }
  console.log("try parse: " + obj);
  let s = "";
  if (typeof obj === "string") {
    s = obj;
  } else if (obj.headers) {
    let cookies = new Cookies(obj, null);
    s = cookies.get("name");
  }
  if (s) {
    try {
      let user = JSON.parse(Buffer.from(s, "base64").toString());
      console.log(`User: ${user.name}, ID: ${user.id}`);
      return user;
    } catch (e) {
      // ignore
    }
  }
}

function createWebSocketServer(
  server,
  onConnection,
  onMessage,
  onClose,
  onError
) {
  let wss = new WebSocketServer({
    server: server
  });

  wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
      client.send(data);
    });
  };
  onConnection =
    onConnection ||
    function() {
      console.log("[WebSocket] connected.");
    };
  onMessage =
    onMessage ||
    function(msg) {
      console.log("[WebSocket] message received: " + msg);
    };
  onClose =
    onClose ||
    function(code, message) {
      console.log(`[WebSocket] closed: ${code} - ${message}`);
    };
  onError =
    onError ||
    function(err) {
      console.log("[WebSocket] error: " + err);
    };
  wss.on("connection", function(ws) {
    let location = url.parse(ws.upgradeReq.url, true);
    console.log("[WebSocketServer] connection: " + location.href);
    ws.on("message", onMessage);
    ws.on("close", onClose);
    ws.on("error", onError);
    if (location.pathname !== "/ws/chat") {
      // close ws:
      ws.close(4000, "Invalid URL");
    }
    // check user:
    let user = parseUser(ws.upgradeReq);
    if (!user) {
      ws.close(4001, "Invalid user");
    }
    ws.user = user;
    ws.wss = wss;
    onConnection.apply(ws);
  });
  console.log("WebSocketServer was attached.");
  return wss;
}

var messageIndex = 0;

function createMessage(type, user, data) {
  messageIndex++;
  return JSON.stringify({
    id: messageIndex,
    type: type,
    user: user,
    data: data
  });
}
function sendHistoryMessages(ws) {
  // let testString = 1;
  db.channel.forEach(function each(message) {
    ws.send(createMessage("chat", message.user, message.message));
    // testString = testString + 1;
  });
}

function onConnect() {
  let user = this.user;
  let msg = createMessage("join", user, `${user.name} joined.`);
  this.wss.broadcast(msg);
  // build user list:
  let users = this.wss.clients.map(function(client) {
    return client.user;
  });
  this.send(createMessage("list", user, users));

  sendHistoryMessages(this);
  // this.send(createMessage('chat',user,"test"));
}

function onMessage(message) {
  console.log(message);
  if (message && message.trim()) {
    let msg = createMessage("chat", this.user, message.trim());

    this.wss.broadcast(msg);
    let topush = {
      // type:"chat",
      user: this.user,
      message: message.trim()
    };
    db.channel.push(topush);
  }
}

function onClose() {
  let user = this.user;
  let msg = createMessage("left", user, `${user.name} is left.`);
  this.wss.broadcast(msg);
}

app.wss = createWebSocketServer(server, onConnect, onMessage, onClose);

console.log("app started at port 3000...");
