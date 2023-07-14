// 브라우저에서 backend와 connection을 열어주는 socket을 선언한다.
const socket = new WebSocket(`ws://${window.location.host}`);
// html로부터 Element를 불러온다.
const messageList = document.querySelector("ul");
const messageForm = document.querySelector("#message");
const nickForm = document.querySelector("#nick");

socket.addEventListener("open", () => {
    // 브라우저에서 서버와 연결되었음을 출력
    console.log("Connected to Server ✅");
});

socket.addEventListener("message", (message) => {
    // 브라우저에서 소켓으로 부터 받은 데이터를 메시지로 출력
    const li = document.createElement("li");
    li.innerText = message.data;
    messageList.appendChild(li);
});

socket.addEventListener("close", () => {
    // 브라우저에서 서버와 연결이 끊겼음을 출력
    console.log("Disconnected from server ❌")
});

function makeMassage(type, payload) {
    // JSON object를 string타입으로 변환하는 함수
    // 이게 Serialization이 아닌가 싶음.
    // 이 서버는 JS로 만들었는데, 누군가는 GO를 이요해 서버에 접속하려 할 수 있기때문에 string으로 값을 전달해야한다.
    const msg = {type, payload};
    return JSON.stringify(msg);
}

function handleSubmit(event) {
    // 메시시 submit 이벤트에 작동하는 함수
    event.preventDefault();
    const input = messageForm.querySelector("input");
    socket.send(makeMassage("new_message", input.value));
    input.value = "";
}

function handleNickSave(event) {
    // 닉네임 submit 이벤트에 작동하는 함수
    event.preventDefault();
    const input = nickForm.querySelector("input");
    // 백엔드는 javascript object를 인식하지 못하기 때문
    socket.send(makeMassage("nickname", input.value));
} 

messageForm.addEventListener("submit", handleSubmit);
nickForm.addEventListener("submit", handleNickSave);