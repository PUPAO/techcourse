package racingGame.techcourse.webSocket;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.json.JSONObject;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import racingGame.techcourse.Car;
import racingGame.techcourse.MoveRule;
import racingGame.techcourse.Round;

@Component
public class GameWebSocketHandler extends TextWebSocketHandler {

    private final Map<String, Car> players = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        players.put(session.getId(), new Car());
        System.out.println("Connected : " + session.getId());
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        JSONObject json = new JSONObject(message.getPayload());
        String type = json.getString("type");

        if ("JOIN".equals(type)) {
            handleJoin(session, json);
        } else if ("PLAY".equals(type)) {
            handlePlay(session, json);
        } else if ("END".equals(type)) {
            handleEnd(session);
        }
    }

    private void handleJoin(WebSocketSession session, JSONObject json) throws IOException {
        Car state = players.get(session.getId());
        state.setName(json.getString("name"));

        JSONObject res = new JSONObject();
        res.put("type", "START");
        res.put("message", "게임 시작!");
        session.sendMessage(new TextMessage(res.toString()));
    }

    private void handlePlay(WebSocketSession session, JSONObject json) throws IOException {
        Car car = players.get(session.getId());

        String playerChoice = json.getString("choice");
        String computerChoice = MoveRule.randomHand();

        String result = MoveRule.calculate(playerChoice, computerChoice);

        if (result.equals("WIN")) {
            car.win();
        } else if (result.equals("LOSE")) {
            car.lose();
        } else {
            car.draw();
        }

        JSONObject res = new JSONObject();
        res.put("type", "RESULT");
        res.put("playerChoice", playerChoice);
        res.put("computerChoice", computerChoice);
        res.put("result", result);
        res.put("round", car.getRound());

        session.sendMessage(new TextMessage(res.toString()));

        if (car.isGameOver()) {
            JSONObject finish = new JSONObject();
            finish.put("type", "FINISH");
            finish.put("score", car.getRound());
            finish.put("name", car.getName());
            session.sendMessage(new TextMessage(finish.toString()));
        }
    }

    private void handleEnd(WebSocketSession session) throws IOException {
        Car state = players.get(session.getId());

        // DB 저장 로직 수행
        int score = state.getRound();

        JSONObject res = new JSONObject();
        res.put("type", "FINISH");
        res.put("score", score);

        session.sendMessage(new TextMessage(res.toString()));

        players.remove(session.getId());
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        players.remove(session.getId());
        System.out.println("Disconnect: " + session.getId() + " / " + status);

    }
}