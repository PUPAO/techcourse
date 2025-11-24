import { useEffect, useState } from "react";

const thStyle = {
  padding: "8px",
  border: "1px solid #ddd",
  textAlign: "center",
  fontWeight: "bold"
};

const tdStyle = {
  padding: "8px",
  borderBottom: "1px solid #ddd",
  textAlign: "center"
};

const btnStyle = {
  padding: "8px",
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

    const ws = new WebSocket("wss://racing-game-711287690194.asia-northeast3.run.app/game/racing");

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

      <div style={{ marginTop: "10px", fontSize: "18px" }}>
        <strong>현재 라운드: {round}</strong>
        <div style={{ marginTop: "5px", fontSize: "22px", letterSpacing: "3px" }}>
          🚗{"-".repeat(round)}💨
        </div>
      </div>

      {isFinished && (
        <div style={{ fontSize: "20px", marginBottom: "20px", color: "red" }}>
          🎉 게임이 종료되었습니다!     
              <button
                onClick={() => {
                  setIsGameStarted(false);
                  setIsFinished(false);
                  setHistory([]);
                  setRound(1);
                  setRoundResult(null);
                }}
                style={{
                  padding: "8px 16px",
                  background: "gray",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "16px",
                  cursor: "pointer",
                }}
              >
                새 게임 시작
              </button>
        </div>
      )}

      {roundResult && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            background: "white",
            padding: "12px 16px",
            borderRadius: "10px",
            border: "1px solid #ccc",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            zIndex: 200,
            width: "160px"
          }}
        >
          <p><strong>내 선택:</strong> {roundResult.playerChoice}</p>
          <p><strong>컴퓨터:</strong> {roundResult.computerChoice}</p>
          <p><strong>결과:</strong> {roundResult.result}</p>
        </div>
      )}

      <div>
        <h2>라운드 히스토리</h2>
        <div
          style={{
            maxHeight: "55vh",
            overflowY: "auto",
            border: "1px solid #ddd",

          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
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
      </div>

      {!isFinished && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: "20px",
            background: "white",
            padding: "10px 20px",
            borderRadius: "10px",
            boxShadow: "0px 2px 8px rgba(0,0,0,0.2)",
            zIndex: 100,
          }}
        >
          <button style={btnStyle} onClick={() => sendChoice("바위")}>바위</button>
          <button style={btnStyle} onClick={() => sendChoice("보")}>보</button>
          <button style={btnStyle} onClick={() => sendChoice("가위")}>가위</button>
        </div>
      )}

    </div>
  );
}

export default MessageSender;
