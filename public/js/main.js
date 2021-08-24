const chatFrom = document.querySelector("#chat-form");
const socket = io();



socket.on("message",(message)=>{
    console.log(message);
    outputMessage(message);
})

// Message submit

chatFrom.addEventListener("submit",(e)=>{
    e.preventDefault();

    const msg = e.target.elements.msg.value;

    // console.log(msg);
    // emiting the message to server
    socket.emit("chatMessage",msg);
})

// output message to dom

function outputMessage(message){
    const div = document.createElement("div");
    div.classList.add("message");
    div.innerHTML = `<p class="meta">Mary <span>9:15pm</span></p>
    <p class="text">
        ${message}
    </p>`;
    document.querySelector(".chat-messages").appendChild(div);
}