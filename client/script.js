'use strict';

const joinRoomButton = document.querySelector("#join-button");
const messageInput = document.querySelector("#message-input");
const roomInput = document.querySelector("#room-input");
const form = document.querySelector("#form");

const socket = io("http://localhost:3000");
const userSocket = io("http://localhost:3000/user", {
  auth: { token: "leen" },
});

socket.on("connect", () => {
  displayMessage(`"You connected with: ${socket.id}`);
});
socket.on("pass-message", (message) => {
  displayMessage(message);
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value;
  const room = roomInput.value;

  if (message === "") return;
  displayMessage(message);
  socket.emit("send-message", message, room);

  messageInput.value = "";
});

joinRoomButton.addEventListener("click", () => {
  const room = roomInput.value;
  socket.emit("join-room", room, (message) => {
    displayMessage(message);
  });
});

function displayMessage(message) {
  const div = document.createElement("div");
  div.textContent = message;
  document.querySelector("#message-container").append(div);
}

let count = 0;
setInterval(() => {
  socket.volatile.emit("ping", count++);
}, 1000);

document.addEventListener("keydown", (e) => {
  if (e.target.matches("input")) return;

  if (e.key === "c") socket.connect();
  if (e.key === "d") socket.disconnect();
});