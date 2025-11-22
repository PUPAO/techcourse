package racingGame.techcourse.io;

import racingGame.techcourse.Round;

public interface Input {
    String getRacerList();
    String getYesOrNo();
    String getDelimiter();
    Round getRound();
}