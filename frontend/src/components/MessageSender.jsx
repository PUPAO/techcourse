import { useEffect, useState } from "react";

function MessageSender() {
  const [socket, setSocket] = useState(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080/connect");

    ws.onopen = () => {
      console.log("WebSocket connected!");
      setSocket(ws);
    };

    ws.onmessage = (msg) => {
      setMessages((prev) => [...prev, msg.data]);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => ws.close();
  }, []);

  const sendMessage = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(input);
      setInput("");
    }
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1>WebSocket Chat Test</h1>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          value={input}
          placeholder="Send message..."
          onChange={(e) => setInput(e.target.value)}
          style={{
            padding: "10px",
            width: "250px",
            marginRight: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            padding: "10px 20px",
            backgroundColor: "#4CAF50",
            border: "none",
            borderRadius: "5px",
            color: "white",
            cursor: "pointer",
          }}
        >
          SEND
        </button>
      </div>

      <h3>Received Messages:</h3>
      <ul style={{ paddingLeft: "20px" }}>
        {messages.map((msg, index) => (
          <li key={index} style={{ marginBottom: "8px" }}>
            {msg}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MessageSender;
