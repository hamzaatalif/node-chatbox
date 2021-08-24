const chatFrom = document.querySelector("#chat-form");
const chatMessages = document.querySelector(".chat-messages")
const roomName = document.querySelector("#room-name");
const usersList = document.querySelector("#users");


const socket = io();


// Get username and room from URL

const {username, room} = Qs.parse(location.search,{
    ignoreQueryPrefix: true,
})


// Join chatroom

socket.emit("joinRoom",{username,room});

// Get room and users

socket.on("roomUsers",({room,users})=>{
    outputRoomName(room);
    outputUsers(users);
})


socket.on("message",(message)=>{
    console.log(message);
    outputMessage(message);

    // scroll down to latest message
    chatMessages.scrollTop = chatMessages.scrollHeight;
})

// Message submit

chatFrom.addEventListener("submit",(e)=>{
    e.preventDefault();

    const msg = e.target.elements.msg.value;

    // console.log(msg);
    // emiting the message to server
    socket.emit("chatMessage",msg);

    // clear input

    e.target.elements.msg.value = "";
    e.target.elements.msg.focus();
})

// output message to dom

function outputMessage(message){
    const div = document.createElement("div");
    div.classList.add("message");
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector(".chat-messages").appendChild(div);
}


// Add room name to dom

function outputRoomName(room) {
    roomName.innerText = room;
}


// Add users to dom

function outputUsers(users) {
    usersList.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join("")}
    `;
}