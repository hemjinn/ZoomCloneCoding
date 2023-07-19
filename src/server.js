import http from "http";
import { Server } from 'socket.io';
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

const handleListen = () => console.log(`Listening on http://localhost:3001`);

const httpServer = http.createServer(app);
// socket.io 설치
// 브라우저가 주는 websocket은 socket IO와 호환이 안된다. 왜? socket IO의 기능이 훨씬 많기때문.
// 그래서 socket IO를 브라우저에도 설치를 한다. -> home.pug에 script 추가
const wsServer = new Server(httpServer);

function publicRooms() {
    const {
        sockets: {
            adapter: { sids, rooms },
        },
    } = wsServer;
    const publicRooms = [];
    rooms.forEach((_, key) => {
        if (sids.get(key) === undefined) {
            publicRooms.push(key);
        }
    })
}

wsServer.on("connection", socket => {
    // socket.on안에 이벤트를 넣어주면 된다.
    // 두번 째 arg는 emit된 콜백함수를 불러온다. 서버는 백엔드에서 함수를 호출하지만, 함수는 프론트에서 실행된다.
    socket["name"] = "Unknown";
    socket.onAny((event) => {
        console.log(wsServer.sockets.adapter);
        console.log(`Socket Event: ${event}`);
    })
    socket.on("name", (nameValue) => {
        socket["name"] = nameValue;
    });
    socket.on("enterRoom", (roomName, done) => {
        socket.join(roomName);
        done();
        socket.to(roomName).emit("welcome", socket.name);
    });
    socket.on("sendMessage", (msg, roomName, done) => {
        socket.to(roomName).emit("sendMessage", `${realTime()} ${socket.name}: ${msg}`);
        done();
    });
});

httpServer.listen(3001, handleListen);