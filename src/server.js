import http from "http";
import WebSocket, { WebSocketServer } from 'ws';
import express from "express";

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

const handleListen = () => console.log(`Listening on http://localhost:3000`);

// http서버를 websocket서버에 넘겨줌으로써 http와 ws 둘 다 사용 가능한 형태이다.
// ws만 사용해도 무방하다.
// 이렇게 같은 포트에 두 서버를 올리는 이유는 먼저 http로 보이게 하고
// 그 위에 ws를 올리기 위해서이다.
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

function handleConnection(socket) {
    // socket은 나(서버)와 브라우저 사이의 연결이다.
    console.log(socket);
}

// on method는 socket으로부터 backend에 연결된 사람의 정보를 제공해준다.
wss.on("connection", handleConnection);

server.listen(3000, handleListen);