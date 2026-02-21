const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

// Armazenamento em memória: { socketId: { username, latitude, longitude } }
let users = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("send-location", (data) => {
    users[socket.id] = {
      username: data.username || "Anónimo",
      latitude: data.latitude,
      longitude: data.longitude,
    };
    io.emit("update-users", users);
  });

  socket.on("disconnect", () => {
    delete users[socket.id];
    io.emit("update-users", users);
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
