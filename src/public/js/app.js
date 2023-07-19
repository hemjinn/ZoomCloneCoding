// front-end단에서 Io 설치
const socket = io();

// pug 단
const welcome = document.querySelector("#welcome");
const room = document.querySelector("#room");
const nameForm = welcome.querySelector("#name");
const enterForm = welcome.querySelector("#enter");
const msgForm = room.querySelector("form");

// 변수 단
room.hidden = true;

let roomValue = "";

// func 단
function handelMsgSubmit(event) {
    // 메시지 전송 fn
    event.preventDefault();
    const msgInput = msgForm.querySelector("input");
    socket.emit("sendMessage", msgInput.value, roomValue, () => {
        addMessage(`You: ${msgInput.value}`);
    });
}

function addMessage(msg) {
    // 채팅창에 메시지를 보여주는 fn
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = msg;
    ul.appendChild(li);
}

function enterRoom() {
    // room에 입장 후 fn
    welcome.hidden = true;
    room.hidden = false;
    const h1Room = room.querySelector("h1");
    h1Room.innerText = `Room Name: ${roomValue}`;
    msgForm.addEventListener("submit", handelMsgSubmit);
}

function handleEnterSubmit(event) {
    // room에 입장을 submit 했을 때 fn
    event.preventDefault();
    const enterInput = enterForm.querySelector("input");
    roomValue = enterInput.value;
    socket.emit("enterRoom", roomValue, enterRoom);
    enterInput.value = "";
}

function handleNameSubmit(event) {
    // room에서 사용할 name설정 fn
    event.preventDefault();
    const nameInput = nameForm.querySelector("input");
    const h1Name = welcome.querySelector("h1");
    h1Name.innerText = `Welcome ${nameInput.value}`;
    const nameValue = nameInput.value;
    socket.emit("name", nameValue);
    nameInput.value = "";
}

// event생성 단
enterForm.addEventListener("submit", handleEnterSubmit);
nameForm.addEventListener("submit", handleNameSubmit);

// socket 통신 단
socket.on("welcome", socketName => {
    addMessage(`${socketName} joined!`);
});
socket.on("sendMessage", msg => {
    addMessage(msg);
});