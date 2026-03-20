const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 5000 });

let messages = [];

wss.on("connection", (ws) => {
  console.log("User connected");

  // Send old messages
  ws.send(JSON.stringify({
    type: "history",
    data: messages
  }));

  ws.on("message", (msg) => {
    const data = JSON.parse(msg);

    if (data.type === "message") {
      messages.push(data.data);

      // Broadcast to all users
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: "message",
            data: data.data
          }));
        }
      });
    }
  });

  ws.on("close", () => {
    console.log("User disconnected");
  });
});

console.log("Server running on ws://localhost:5000");
