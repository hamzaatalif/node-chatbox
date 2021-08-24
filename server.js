const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");

const formatMessage = require("./utils/messages");

const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require("./utils/users");

const app = new express();
const server = http.createServer(app);
const io = socketio(server);

// set static folder

app.use(express.static(path.join(__dirname,"public")))

const botName = "Chat Bot";

// Run when a client connects

io.on("connection",(socket)=>{

    // get username and room

    socket.on("joinRoom",({username,room})=>{

        const user = userJoin(socket.id,username,room);

        socket.join(user.room)




        // only the user gets this message
        socket.emit("message",formatMessage(botName,"Welcome to chatbox!"));

        // broadcast when a user connects
        socket.broadcast.to(user.room).emit("message",formatMessage(botName,`${user.username} has joined the chat.`));        

        // send user info
        io.to(user.room).emit("roomUsers",{
            room: user.room,
            users: getRoomUsers(user.room)
        })
    })
        
    // Listen for chat message
    socket.on("chatMessage",(msg)=>{
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit("message",formatMessage(user.username,msg))
    })

    // This runs when a user disconnects
    socket.on("disconnect",()=>{
        const user = userLeave(socket.id);

        if (user) {
            // This emits the message to everyone but as the user has left the chat so it doesn't matter
            io.to(user.room).emit("message",formatMessage(botName,`${user.username} has left the chat.`))
            // send user info
            io.to(user.room).emit("roomUsers",{
                room: user.room,
                users: getRoomUsers(user.room)
            })
        }
        
    });
})

const port = process.env.PORT || 3000;

server.listen(port,()=>console.log(`Server is listening on ${port}...`));