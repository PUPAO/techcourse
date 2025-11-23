package racingGame.techcourse;

import lombok.Data;

@Data
public class Round {

    private final int round;
    private String playerChoice;
    private String computerChoice;
    private String result;

    public Round(int round, String playerChoice, String computerChoice, String result) {
        this.round = round;
        this.playerChoice = playerChoice;
        this.computerChoice = computerChoice;
        this.result = result;
    }


}
