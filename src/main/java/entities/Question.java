package entities;

import java.util.ArrayList;

/**
 * @author jonev
 */
public class Question {
    private String question;
    private ArrayList<String> answereAlternatives;
    private String correctAnswere;

    public Question() {
    }

    public String getQuestion() {
        return question;
    }


    public ArrayList<String> getAnswereAlternatives() {
        return answereAlternatives;
    }

    public void setCorrectAnswere(String correctAnswere) {
        this.correctAnswere = correctAnswere;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public void setAnswereAlternatives(ArrayList<String> answereAlternatives) {
        this.answereAlternatives = answereAlternatives;
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
