import http from "http";
import WebSocket, { WebSocketServer } from 'ws';
import express from "express";

// 채팅로그에 타임스태프 구현
function realTime() {
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return `[${hours}:${minutes}:${seconds}]`;
}
// 1. 앱을 만든다.
const app = express();

// 2. 앱에 관련 설정 속성들을 만든다.
// view engine을 pug로 설정
app.set("view engine", "pug");
// Express에 template가 어디 있는지 지정해준다.
app.set("views", __dirname + "/views");

// 3. 공통 미들웨어를 만든다.
// public url을 생성해서 유저에게 파일을 공유해준다.
app.use("/public", express.static(__dirname + "/public"));

// 4. 라우터들을 만든다. 홈을 렌더링 함.
// "/" 주소에서 home.pug를 render 해주는 route handler를 만든다.
app.get("/", (req, res) => res.render("home"));
app.get("/*", (_, res) => res.render("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

// http서버를 websocket서버에 넘겨줌으로써 http와 ws 둘 다 사용 가능한 형태이다.
// ws만 사용해도 무방하다.
// 이렇게 같은 포트에 두 서버를 올리는 이유는 먼저 http로 보이게 하고
// 그 위에 ws를 올리기 위해서이다.
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// 서버에 접속한 이용자 수를 체크하기 위해 fake DB를 하나 만든다.
const sockets = [];

// on method는 socket으로부터 backend에 연결된 사람의 정보를 제공해준다.
// socket은 나(서버)와 브라우저 사이의 연결이다.
wss.on("connection", (socket) => {
    // edge, chrome 등 연결된 브라우저의 socket을 sockets array에 넣어줌으로써
    // sockets에 있는 모든 곳에 전달해 줄 수 있게된다.
    sockets.push(socket);
    // 연결 전 닉네임이 주어지지 않은 사용자들의 초기 닉네임값 설정
    socket["nickname"] = "Unknown";
    console.log("Connected to Browser ✅");
    socket.on("close", () => {
        console.log("Disconnection from the Browser ❌");
    });
    socket.on("message", (msg) => {
        // 브라우저에서 서버로 보낸 메시지를 받아서 브라우저로 출력시킨다.
        const parsedMsg = JSON.parse(msg);
        switch (parsedMsg.type) {
            case "new_message":
                sockets.forEach((aSocket) => aSocket.send(`${realTime()} ${socket.nickname}: ${parsedMsg.payload}`));
                break;
            case "nickname":
                // socket이 누구야? -> nickname을 socket안에 넣어줘야함.
                // socket은 기본적으로 객체기 때문에 새로운 item을 추가할 수 있다.
                socket["nickname"] = parsedMsg.payload; 
                break;
        }
    });
});

server.listen(3000, handleListen);

// text에 서로의 닉네임을 붙혀서 누가 어떤 대화를 하는지 표시하고 싶어서 닉네임을 back-end단에 저장해주어야하는데
// 같은 text 타입이라 닉네임과 메시지가 구별이 안된다.
// 사용하는 text의 타입을 '메시지'용도와 '닉네임'용도로 나눈다.
{
    type: "message";
    payload: "hello everyone!";
}

{
    type:"nickname";
    payload:"hemjin";
}