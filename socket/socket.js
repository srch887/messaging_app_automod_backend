const { Server } = require("socket.io");

let io;

function initSocket(server) {
    io = new Server(server, {
        cors: {
            origin: "http://localhost:3000", // Replace with your frontend's URL
            methods: ["GET", "POST"],
        },
    });

    // Handle WebSocket connections
    io.on("connection", (socket) => {
        console.log("A user connected");

        socket.on("disconnect", () => {
            console.log("A user disconnected");
        });
    });

    return io;
}

function getSocketIO() {
    if (!io) {
        throw new Error("Socket.io not initialized. Call initSocket first.");
    }
    return io;
}

module.exports = { initSocket, getSocketIO };