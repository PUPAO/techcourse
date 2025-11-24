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

    public void win() {
        round++;
    }

    public void lose() {
        loseCount++;
        round++;
    }

    public void draw() {
        round++;
    }

    public boolean isGameOver() {
        return loseCount >= 3;
    }
}
