package entities;
/**
 * @author jonev
 */
public class User {
    private String username;
    private int score;

    public User() {
    }

    public User(User newUser){
        username = newUser.username;
        score = 0;
    }
    public User(String username){
        this.username = username;
        score = 0;
    }

    public String getUsername() {
        return username;
    }

    public int getScore() {
        return score;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public boolean equals(Object o){
        if(o == null) return false;
        if(!(o instanceof User)) return false;
        if(this == o) return true;
        User in = (User)o;
        return username.equals(in.username);
    }

}

