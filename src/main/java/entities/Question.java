package entities;

/**
 * Created by JoneSkole on 13.09.2017.
 */
public class Question {
    private int timeToAnswere;
    private String question;
    private String[] answereAlternatives;

    public Question() {
    }

    public int getTimeToAnswere() {
        return timeToAnswere;
    }

    public String getQuestion() {
        return question;
    }

    public String[] getAnswereAlternatives() {
        return answereAlternatives;
    }

    public void setTimeToAnswere(int timeToAnswere) {
        this.timeToAnswere = timeToAnswere;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public void setAnswereAlternatives(String[] answereAlternatives) {
        this.answereAlternatives = answereAlternatives;
    }
}
