package racingGame.techcourse;

import lombok.Data;

@Data
public class Car {

    private String name;
    private int distance;
    private int loseCount = 0;

    public Car() {}

    public void goForward() {
        distance++;
    }

    // 이겼을 때: 앞으로 가고 라운드 증가
    public void win() {
        distance++;
    }

    // 졌을 때: 패배 카운트 올리고 라운드 증가
    public void lose() {
        loseCount++;
        distance++;
    }

    // 비겼을 때: 라운드만 증가
    public void draw() {
        distance++;
    }

    // 3번 이상 지면 게임 종료
    public boolean isGameOver() {
        return loseCount >= 3;
    }
}
