import { useEffect, useState } from "react";

const thStyle = {
  padding: "8px",
  borderBottom: "1px solid #ddd",
  textAlign: "center",
  fontWeight: "bold"
};

const tdStyle = {
  padding: "8px",
  borderBottom: "1px solid #ddd",
  textAlign: "center"
};


function MessageSender() {
  const [socket, setSocket] = useState(null);

  const [name, setName] = useState("");
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const [roundResult, setRoundResult] = useState(null);
  const [round, setRound] = useState(1);

  const [history, setHistory] = useState([]);

  useEffect(() => {
    return () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [socket]);

  // -----------------------
  // 이름 전송(LOGIN)
  // -----------------------
  const sendLogin = () => {
    if (!name.trim()) {
      alert("이름을 입력하세요!");
      return;
    }

    const ws = new WebSocket("ws://localhost:8080/game/racing");

    ws.onopen = () => {
      console.log("WebSocket connected!");
      setSocket(ws);

      ws.send(
        JSON.stringify({
          type: "LOGIN",
          name: name,
        }),
      );
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      console.log("Received:", msg);

      if (msg.type === "START") {
        setIsGameStarted(true);
        setIsFinished(false);

        setRound(1);
        setRoundResult(null);

        if (msg.logs) {
          setHistory(msg.logs);
        } else {
          setHistory([]);
        }
      }

      if (msg.type === "RESULT") {
        setRound(msg.round);
        setRoundResult({
          playerChoice: msg.playerChoice,
          computerChoice: msg.computerChoice,
          result: msg.result,
        });

        setHistory((prev) => [
          ...prev,
          {
            round: msg.round,
            playerChoice: msg.playerChoice,
            computerChoice: msg.computerChoice,
            result: msg.result,
          },
        ]);
      }

      if (msg.type === "FINISH") {
        alert(`게임 종료! 점수: ${msg.score}`);

        setIsFinished(true);

        ws.close();
        setSocket(null);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
      setSocket(null);
    };

    ws.onerror = (e) => {
      console.error("WebSocket error", e);
    };
  };

  // -----------------------
  // 가위바위보 선택(PLAY)
  // -----------------------
  const sendChoice = (choice) => {
    if (!socket || socket.readyState !== WebSocket.OPEN) return;

    socket.send(
      JSON.stringify({
        type: "PLAY",
        choice: choice,
      })
    );
  };

  // // -----------------------
  // // 게임 종료(END)
  // // -----------------------
  // const endGame = () => {
  //   if (!socket) return;

  //   socket.send(JSON.stringify({ type: "END" }));
  // };

  // -----------------------
  // 화면 렌더링
  // -----------------------
  if (!isGameStarted && !isFinished) {
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
          onClick={sendLogin}
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

  //
  // 2) 게임 화면 + 종료 화면 공통
  //
  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1>가위바위보 레이싱</h1>

      {!isFinished && <h3>현재 라운드: {round}</h3>}

      {isFinished && (
        <div style={{ fontSize: "20px", marginBottom: "20px", color: "red" }}>
          🎉 게임이 종료되었습니다!
        </div>
      )}

      {!isFinished && (
        <div style={{ marginBottom: "20px" }}>
          <button onClick={() => sendChoice("바위")}>바위</button>
          <button onClick={() => sendChoice("보")}>보</button>
          <button onClick={() => sendChoice("가위")}>가위</button>
        </div>
      )}

      {roundResult && (
        <div
          style={{
            marginTop: "15px",
            padding: "10px",
            border: "1px solid #ccc",
          }}
        >
          <p>내 선택: {roundResult.playerChoice}</p>
          <p>컴퓨터: {roundResult.computerChoice}</p>
          <p>결과: {roundResult.result}</p>
        </div>
      )}

      <div style={{ marginTop: "30px" }}>
        <h2>라운드 히스토리</h2>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "10px",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f2f2f2" }}>
              <th style={thStyle}>라운드</th>
              <th style={thStyle}>내 선택</th>
              <th style={thStyle}>컴퓨터 선택</th>
              <th style={thStyle}>결과</th>
            </tr>
          </thead>

          <tbody>
            {history
              .slice()
              .reverse()
              .map((h, index) => (
                <tr key={index}>
                  <td style={tdStyle}>{h.round}</td>
                  <td style={tdStyle}>{h.playerChoice}</td>
                  <td style={tdStyle}>{h.computerChoice}</td>
                  <td style={tdStyle}>{h.result}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {isFinished && (
        <button
          onClick={() => {
            // 화면 초기화
            setIsGameStarted(false);
            setIsFinished(false);
            setHistory([]);
            setRound(1);
            setRoundResult(null);
          }}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            background: "gray",
            color: "white",
            border: "none",
            borderRadius: "6px",
          }}
        >
          새 게임 시작
        </button>
      )}
    </div>
  );
}

export default MessageSender;
