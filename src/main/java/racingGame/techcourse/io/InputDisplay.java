package racingGame.techcourse.io;

import java.util.Scanner;
import racingGame.techcourse.Round;
import racingGame.techcourse.racingException;

public class InputDisplay implements Input {
    Scanner sc = new Scanner(System.in);
    @Override
    public String getRacerList() {
        String roster = sc.toString();

        if (roster.isEmpty()) {
            throw new racingException("You must enter at least one name.");
        }
        return roster;
    }

    @Override
    public String getYesOrNo() {
        return sc.toString().trim().toLowerCase();
    }

    @Override
    public String getDelimiter() {
        return sc.toString().trim();
    }

    @Override
    public Round getRound() {
        String input = sc.toString();
        return Round.of(input);
    }

}