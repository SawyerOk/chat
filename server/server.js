const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");

const publicPath = path.join(__dirname, "../public");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const { isRealString } = require("./utils/validation");
const { generateMessage } = require("./utils/message");
const { Users } = require("./utils/users");

const users = new Users();

app.use(express.static(publicPath));

io.on("connection", socket => {
  

  socket.on("createMessage", (message, callback) => {
    const user = users.getUser(socket.id);
    if (user && isRealString(message.text)) {
      io.emit("newMessage", generateMessage(user.name, message.text));
    }
    callback();
  });

  socket.on("join", (name, callback) => {
    if (!isRealString(name)) {
      return callback("Name are required");
    }
    if (name === "admin") {
      return callback("You cannot use name = admin");
    }
    if (users.userExist(name)) {
      return callback("Sorry, we already have users with this name ");
    }
    console.log(`${name} join to server`);
    users.addUser(socket.id, name);

    socket.emit("newMessage", generateMessage("Admin", `Welcome to chat, ${name}!`));
    socket.broadcast.emit(
      "newMessage",
      generateMessage("Admin", `${name} has joined`)
    );
    callback();
  });

  socket.on("disconnect", () => {
    const user = users.getUser(socket.id);
    
    if (user) {
      console.log(`${user.name} disconneted`);
      socket.broadcast.emit(
        "newMessage",
        generateMessage("Admin", `${user.name} has left`)
      );
    }
  });
});



server.listen(3000, () => {
  console.log(`Server is up on 3000`);
});
