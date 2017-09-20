package entities;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * @author jonev
 */
public class Quiz extends QuizInfo{
    // private String name;
    // private String description;
    // private String startdate;
    private List<Question> questions;

    public Quiz() {
        questions = new ArrayList<Question>();
    }



    public List<Question> getQuestions() {
        return questions;
    }



    public void setQuestions(List<Question> questions) {
        this.questions = questions;
    }

    // public String toString(){
    //     String s = name + ", " + description + ", " + startdate;
    //     if(questions == null) return s;
    //     for (Question q : questions) {
    //         s += q.toString();
    //     }
    //     return s;
    // }
}
