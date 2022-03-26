"use strict";

const { instrument } = require("@socket.io/admin-ui");
const io = require("socket.io")(3000 ,
    {

  cors: {
    origin: ["http://localhost:5500", "https://admin.socket.io/"],
  },
}
);

const userIo = io.of("/user");

userIo.use((socket, next) => {
  if (socket.handshake.auth.token) {
    socket.username = getUsernameFromToken(socket.handshake.auth.token);
    next();
  } else {
    next(new Error("please send a token"));
  }
});
userIo.on("connection", (socket) => {
  console.log("CONNECTED TO USER NAMESPACE", socket.username);
});

function getUsernameFromToken(token) {
  return token;
}

io.on("connection", (socket) => {
  console.log("CONNECTED", socket.id);
  socket.on("send-message", (message, room) => {
    console.log(message);
    if (room === "") {
      socket.broadcast.emit("pass-message", message);
    } else {
      socket.to(room).emit("pass-message", message);
    }
  });
  socket.on("join-room", (room, cb) => {
    socket.join(room);
    cb(`joined room: ${room}`);
  });

  socket.on("ping", (n) => console.log(n));
});

instrument(io, { auth: false });
