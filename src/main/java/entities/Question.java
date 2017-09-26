package entities;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.ArrayList;

/**
 * @author jonev
 */
public class Question {
    private String question;
    private ArrayList<String> answereAlternatives;
    private ArrayList<String> correctAnswere;
    private String timeToAnswere;

    public Question() {
    }

    public String getQuestion() {
        return question;
    }


    public ArrayList<String> getAnswereAlternatives() {
        return answereAlternatives;
    }

    public void setCorrectAnswere(ArrayList<String> correctAnswere) {
        this.correctAnswere = correctAnswere;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    // different name from get to avoid sending the correct answers to the client
    public ArrayList<String> collectCorrectAnswere() {
        return correctAnswere;
    }

    public void setAnswereAlternatives(ArrayList<String> answereAlternatives) {
        this.answereAlternatives = answereAlternatives;
    }

    public String getTimeToAnswere() {
        return timeToAnswere;
    }

    public void setTimeToAnswere(String timeToAnswere) {
        this.timeToAnswere = timeToAnswere;
    }

    public String toString(){
        String s = question;
        if(answereAlternatives == null) return s;
        int i = 0;
        for (String a: answereAlternatives) {
            s += ", " + a + " correct: " + correctAnswere.get(i);
            i++;
        }

        return s;
    }

}
