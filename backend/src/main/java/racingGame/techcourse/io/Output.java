package racingGame.techcourse.io;

import racingGame.techcourse.Car;

public interface Output {
    void askCarsName();
    void askRoundNumber();
    void showRoundResult(Car[] playerList);
    void showWinner(StringBuilder winnerList);
    void askDelimiterAddition();
    void showAddDelimiter();
}
