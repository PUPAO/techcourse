package racingGame.techcourse;

public class Car {

    private final String racer;
    private int distance;

    private static final int limitNameLength = 5;

    private Car(String racer) {
        this.racer = racer;
        this.distance = 0;
    }

    public static Car of(String racerName) {

        if (racerName.length() > limitNameLength) {
            throw new racingException("Your name is too long. Be careful not to exceed" + limitNameLength + " characters.");
        } else if (racerName.isEmpty()) {
            throw new racingException("There is no name. Please create a name.");
        }

        return new Car(racerName);
    }

    public int getDistance() {
        return distance;
    }

    public String getRacer() {
        return racer;
    }

    public void goForward() {
        distance++;
    }
}
