package racingGame.techcourse.io;
import racingGame.techcourse.Car;

public class OutputDisplay implements Output{

    @Override
    public void askCarsName() {
        System.out.println("Enter the name of the car you want to race. (Names are separated by commas)");
    }

    @Override
    public void askRoundNumber() {
        System.out.println("How many times can I try?");
    }

    @Override
    public void showRoundResult(Car[] playerList) {
        for (Car racer : playerList) {
            System.out.println(racer.getName() + " : " + "-".repeat(racer.getDistance()));
        }
    }

    @Override
    public void showWinner(StringBuilder winnerList) {
        System.out.println("Final racingGame.techcourse.Winner : " + winnerList);
    }

    @Override
    public void askDelimiterAddition() {
        System.out.println("The default delimiter is a comma. Would you like to add a delimiter? (If so, enter yes.)");
    }

    @Override
    public void showAddDelimiter() {
        System.out.println("Please enter the delimiter you want to add.");
    }
}
