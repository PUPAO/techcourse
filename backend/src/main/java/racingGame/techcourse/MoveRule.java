package racingGame.techcourse;

import java.util.Random;

public class MoveRule {

    private static final String[] HANDS = {"바위", "보", "가위"};

    public static String randomHand() {
        return HANDS[new Random().nextInt(3)];
    }

    public static String calculate(String p, String c) {
        int player = indexOf(p);
        int computer = indexOf(c);

        if (player == computer) return "DRAW";

        // (나 - 컴퓨터 + 3) % 3 == 1 → WIN
        if ((player - computer + 3) % 3 == 1) return "WIN";

        return "LOSE";
    }

    private static int indexOf(String value) {
        for (int i = 0; i < HANDS.length; i++) {
            if (HANDS[i].equals(value)) return i;
        }
        return -1;
    }
}
