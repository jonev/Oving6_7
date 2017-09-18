package entities;

import java.util.Comparator;

/**
 * @author jonev on 18.09.2017.
 */
public class UsersByScore implements Comparator<User> {
    public int compare(User o1, User o2) {
        if(o1.getScore() > o2.getScore()){
            return -1;
        } else if(o1.getScore() < o2.getScore()){
            return 1;
        } else {
            return 0;
        }
    }
}
