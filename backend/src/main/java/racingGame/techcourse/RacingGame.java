package racingGame.techcourse;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import racingGame.techcourse.io.Input;
import racingGame.techcourse.io.Output;

public class RacingGame {
    private static final int FORWARD_THRESHOLD = 4;
    private static final int MINIMUM_NUMBER = 0;
    private static final int MAXIMUM_NUMBER = 9;

    private final Input input;
    private final Output output;

    public RacingGame(Input input, Output output) {
        this.input = input;
        this.output = output;
    }

    public void run() {
        output.askCarsName();
        String roster = input.getRacerList();

        output.askDelimiterAddition();
        String choice = input.getYesOrNo();

        StringBuilder defaultDelimiter = new StringBuilder("[,");
        if (choice.equals("yes")) {
            appendExtraDelimiters(defaultDelimiter);
        }
        defaultDelimiter.append("]");

        String[] tempRosterList = roster.split(defaultDelimiter.toString());

        String[] players = cleanRosterList(tempRosterList);

        validateDuplicate(players);

        Car[] playerList = createCars(players);

        output.askRoundNumber();
        Round round = input.getRound();

        // 경기 중
        playing(round, playerList);

        // 우승자 출력
        Winner winner = new Winner();
        StringBuilder winnerList = winner.calculateWinners(playerList);
        output.showWinner(winnerList);
    }

    private static String[] cleanRosterList(String[] tempRosterList) {
        List<String> cleaned = new ArrayList<>();
        for (String name : tempRosterList) {
            String trimmed = name.trim();
            if (!trimmed.isEmpty()) {
                cleaned.add(trimmed);
            }
        }
        String[] players = cleaned.toArray(new String[0]);
        return players;
    }

    private void appendExtraDelimiters(StringBuilder defaultDelimiter) {
        output.showAddDelimiter();
        String appendDelimiter = input.getDelimiter();
        for (char c : appendDelimiter.toCharArray()) {
            if ("\\.^$|?*+()[]{}".indexOf(c) == -1) {
                defaultDelimiter.append(c);
            } else {
                defaultDelimiter.append("\\").append(c);
            }
        }
        defaultDelimiter.append(appendDelimiter);
    }

    private void playing(Round round, Car[] playerList) {
        for (int i = 0; i < round.getRound(); i++) {
            for (Car racer : playerList) {
                forwardOrNot(racer);
            }
//            output.showRoundResult(playerList);
        }
    }

    private static void forwardOrNot(Car racer) {
        int value = 10/*Randoms.pickNumberInRange(MINIMUM_NUMBER, MAXIMUM_NUMBER)*/;
        if (value >= FORWARD_THRESHOLD) {
            racer.goForward();
        }
    }

    private Car[] createCars(String[] racerList) {
        Car[] racer = new Car[racerList.length];
        for (int i = 0; i < racerList.length; i++) {
//            racer[i] = Car.of(racerList[i]);
        }
        return racer;
    }

    private void validateDuplicate(String[] names) {
        Set<String> unique = new HashSet<>();
        for (String name : names) {
            if (!unique.add(name)) {
                throw new racingException("Duplicate racer name: " + name);
            }
        }
    }
}
