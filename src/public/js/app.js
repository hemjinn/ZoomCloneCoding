// front-end단에서 Io 설치
const socket = io();

const welcome = document.querySelector("#welcome");
const form = welcome.querySelector("form");
const room = document.querySelector("#room");

room.hidden = true;

let roomName;

function showRoom() {
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName}`;
}

function handleRoomEnter(event) {
    event.preventDefault();
    const input = form.querySelector("input");
    // send대신 emit을 쓴다. 1.emit은 특정 이벤트를 emit 해준다.
    // 2.emit을 하면 argument를 줄 수 있는데 이것은 object가 될 수 있다. 전 처럼 string만 전송할 필요가 없다.
    // 3.emit의 마지막 argument에는 콜백함수가 들어갈 수 있다.
    socket.emit("enterRoom", { payload: input.value }, showRoom);
    roomName = input.value;
    input.value = "";
}

form.addEventListener("submit", handleRoomEnter);