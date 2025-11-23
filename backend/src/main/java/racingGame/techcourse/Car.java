package racingGame.techcourse;

import java.util.ArrayList;
import java.util.List;
import lombok.Data;

@Data
public class Car {

    private String name;
    private int round;
    private int loseCount = 0;
    private List<Round> logs = new ArrayList<>();

    public Car() {}

    public void goForward() {
        round++;
    }

    // 이겼을 때: 앞으로 가고 라운드 증가
    public void win() {
        round++;
    }

    // 졌을 때: 패배 카운트 올리고 라운드 증가
    public void lose() {
        loseCount++;
        round++;
    }

    // 비겼을 때: 라운드만 증가
    public void draw() {
        round++;
    }

    // 3번 이상 지면 게임 종료
    public boolean isGameOver() {
        return loseCount >= 3;
    }
}
