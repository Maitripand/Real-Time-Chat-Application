import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:5000");

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      if (msg.type === "history") {
        setMessages(msg.data);
      } else {
        setMessages(prev => [...prev, msg.data]);
      }
    };

    setSocket(ws);

    return () => ws.close();
  }, []);

  const sendMessage = () => {
    if (!input.trim()) return;

    const message = {
      text: input,
      time: new Date().toLocaleTimeString()
    };

    socket.send(JSON.stringify({
      type: "message",
      data: message
    }));

    setInput("");
  };

  return (
    <div className="container">
      <h2>💬 Chat App</h2>

      <div className="chat-box">
        {messages.map((m, i) => (
          <div key={i} className="msg">
            <p>{m.text}</p>
            <span>{m.time}</span>
          </div>
        ))}
      </div>

      <div className="input-area">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;
