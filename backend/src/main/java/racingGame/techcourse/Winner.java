package racingGame.techcourse;

public class Winner {

    public StringBuilder calculateWinners(Car[] cars) {
        int bestRecord = findMaxRecord(cars);
        return getWinnerList(cars, bestRecord);
    }

    private static int findMaxRecord(Car[] playerList) {
        int max = Integer.MIN_VALUE;
        for (Car car : playerList) {
            max = Math.max(max, car.getDistance());
        }
        return max;
    }

    private static StringBuilder getWinnerList(Car[] playerList, int bestRecord) {
        StringBuilder winnerList = new StringBuilder();
        for (Car racer : playerList) {
            if (bestRecord != racer.getDistance()) {
                continue;
            }
            addWinnerList(racer, winnerList);
        }
        return winnerList;
    }

    private static void addWinnerList(Car racer, StringBuilder winnerList) {
        if (winnerList.isEmpty()) {
            winnerList.append(racer.getName());
        } else {
            winnerList.append(", ").append(racer.getName());
        }
    }
}
