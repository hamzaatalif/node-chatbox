const chatFrom = document.querySelector("#chat-form");
const chatMessages = document.querySelector(".chat-messages")
const socket = io();



socket.on("message",(message)=>{
    console.log(message);
    outputMessage(message.username,message.text,message.time);

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

function outputMessage(username,message,time){
    const div = document.createElement("div");
    div.classList.add("message");
    div.innerHTML = `<p class="meta">${username} <span>${time}</span></p>
    <p class="text">
        ${message}
    </p>`;
    document.querySelector(".chat-messages").appendChild(div);
}