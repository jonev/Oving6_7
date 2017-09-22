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

    public ArrayList<String> getCorrectAnswere() {
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
        for (String a: answereAlternatives) {
            s += ", " + a;
        }
        return s;
    }

}
