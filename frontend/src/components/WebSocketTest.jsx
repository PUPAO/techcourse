import { useEffect } from "react";

function App() {
  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080/connect");

    socket.onopen = () => {
      console.log("connected!");
      socket.send("Hello server!");
    };

    socket.onmessage = (message) => {
      console.log("Received from server:", message.data);
    };

    socket.onclose = () => {
      console.log("Socket closed!");
    };

    return () => socket.close();
  }, []);

  return <div>WebSocket Test</div>;
}

export default App;
