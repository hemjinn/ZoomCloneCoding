// front-end단에서 Io 설치
const socket = io();

const welcome = document.querySelector("#welcome");
const room = document.querySelector("#room");
const welcomeForm = welcome.querySelector("#enter");

room.hidden = true;

let roomName;

function handleMessageSubmit(event) {
    event.preventDefault();
    const input = room.querySelector("#msg input");
    const value = input.value;
    socket.emit("new_message", input.value, roomName, () => {
        addMessage(`You: ${value}`);
    });
    input.value = "";
}

function handleNickSubmit(event) {
    event.preventDefault();
    const h3 = welcome.querySelector("h3");
    const nameInput = welcome.querySelector("#name input");
    socket.emit("nickname", nameInput.value);
    h3.innerText = `Welcome ${nameInput.value}`;
    nameInput.value = "";
}

function addMessage(msg) {
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = msg;
    ul.appendChild(li);
}

function showRoom() {
    // 채팅방에 입장
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName}`;
    const msgFormInRoom = room.querySelector("#msg form");
    msgFormInRoom.addEventListener("submit", handleMessageSubmit);
}

function handleRoomEnter(event) {
    event.preventDefault();
    const nameForm = welcome.querySelector("#name form");
    const enterInput = welcome.querySelector("#enter input");
    // send대신 emit을 쓴다. 1.emit은 특정 이벤트를 emit 해준다.
    // 2.emit을 하면 argument를 줄 수 있는데 이것은 object가 될 수 있다. 전 처럼 string만 전송할 필요가 없다.
    // 3.emit의 마지막 argument에는 콜백함수가 들어갈 수 있다.
    roomName = enterInput.value;
    nameForm.addEventListener("submit", handleNickSubmit);
    socket.emit("enterRoom", enterInput.value, showRoom);
    enterInput.value = "";
}

welcomeForm.addEventListener("submit", handleRoomEnter);

socket.on("welcome", (user) => {
    addMessage(`${user} joined!`);
});

socket.on("bye", (leftUser) => {
    addMessage(`${leftUser} left 😥`);
});

socket.on("new_message", addMessage);