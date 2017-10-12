const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const {isRealString} = require('./utils/validation');
const {generateMessage} = require('./utils/message');
const {Users} = require('./utils/users')

const users = new Users();

io.on('connection', (socket) => {
    console.log('a user connected');



      socket.on('createMessage', (message, callback)=>{
        var user = users.getUser(socket.id);
        console.log('Mes on server');
        if(user && isRealString(message.text)){
            console.log('emitted');
            io.emit('newMessage', generateMessage(user.name, message.text));
        }
        callback();
    });

    socket.on('join', (name, callback) => {
        if (!isRealString(name)) {
            return callback('Name are required');
        }
        if (users.userExist(name)){
            return callback('Sorry, we already have users with this name ');
        }
        
        users.addUser(socket.id, name);
        console.log(users);

        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat'));
        socket.broadcast.emit('chat message', generateMessage('Admin', `${name} has joined`));
        callback();

    });

    socket.on('disconnect',()=>{
        users.removeUser(socket.id);
      });
  });


app.use(express.static(publicPath))

server.listen(3000, ()=>{
    console.log(`Server is up on 3000`);
});