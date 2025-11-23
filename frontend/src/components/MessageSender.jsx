import { useEffect, useState } from "react";

function MessageSender() {
  const [socket, setSocket] = useState(null);

  const [name, setName] = useState("");
  const [isGameStarted, setIsGameStarted] = useState(false);

  const [roundResult, setRoundResult] = useState(null);
  const [position, setPosition] = useState(0);
  const [round, setRound] = useState(1);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080/game/racing");

    ws.onopen = () => {
      console.log("WebSocket connected!");
      setSocket(ws);
    };

    ws.onmessage = function (event) {
      const msg = JSON.parse(event.data);

      console.log("Received:", msg);

      if (msg.type === "START") {
        setIsGameStarted(true);
      }

      if (msg.type === "RESULT") {
        setRound(msg.round);
        setPosition(msg.position);
        setRoundResult({
          playerChoice: msg.playerChoice,
          computerChoice: msg.computerChoice,
          result: msg.result,
        });
      }

      if (msg.type === "FINISH") {
        alert("게임 종료! 점수: " + msg.score);
        setIsGameStarted(false);
      }
    };

    ws.onclose = () => console.log("WebSocket disconnected");

    return () => ws.close();
  }, []);

  // -----------------------
  // 이름 전송(JOIN)
  // -----------------------
  const sendJoin = () => {
    if (!socket) {
      console.warn("WebSocket not connected yet");
      return;
    }

    if (!name.trim()) {
      alert("이름을 입력하세요!");
      return;
    }

    socket.send(
      JSON.stringify({
        type: "JOIN",
        name: name,
      })
    );
  };

  // -----------------------
  // 가위바위보 선택(PLAY)
  // -----------------------
  const sendChoice = (choice) => {
    if (!socket) return;

    socket.send(
      JSON.stringify({
        type: "PLAY",
        choice: choice,
      })
    );
  };

  // -----------------------
  // 게임 종료(END)
  // -----------------------
  const endGame = () => {
    if (!socket) return;

    socket.send(JSON.stringify({ type: "END" }));
  };

  // -----------------------
  // 화면 렌더링
  // -----------------------
  if (!isGameStarted) {
    return (
      <div style={{ padding: "30px" }}>
        <h2>이름 입력</h2>
        <input
          type="text"
          placeholder="이름 입력"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            padding: "10px",
            width: "200px",
            borderRadius: "6px",
            border: "1px solid #aaa",
          }}
        />
        <button
          onClick={sendJoin}
          disabled={!socket}
          style={{
            padding: "10px 20px",
            marginLeft: "10px",
            background: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "6px",
          }}
        >
          게임 시작
        </button>
      </div>
    );
  }

  // 게임 화면
  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1>가위바위보 레이싱</h1>

      <h3>현재 라운드: {round}</h3>
      <h3>현재 위치: {position}</h3>

      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => sendChoice("ROCK")}>바위</button>
        <button onClick={() => sendChoice("PAPER")}>보</button>
        <button onClick={() => sendChoice("SCISSORS")}>가위</button>
      </div>

      {roundResult && (
        <div style={{ marginTop: "15px", padding: "10px", border: "1px solid #ccc" }}>
          <p>내 선택: {roundResult.playerChoice}</p>
          <p>컴퓨터: {roundResult.computerChoice}</p>
          <p>결과: {roundResult.result}</p>
        </div>
      )}

      <button
        onClick={endGame}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          background: "red",
          color: "white",
          border: "none",
          borderRadius: "6px",
        }}
      >
        게임 종료
      </button>
    </div>
  );
}

export default MessageSender;
