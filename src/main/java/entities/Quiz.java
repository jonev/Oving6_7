package entities;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * @author jonev
 */
public class Quiz {
    private String name;
    private String description;
    private String startdate;
    private List<Question> questions;

    public Quiz() {
        questions = new ArrayList<Question>();
    }

    public String getName() {
        return name;
    }

    public String getStartdate() {
        return startdate;
    }

    public String getDescription() {
        return description;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setStartdate(String startdate) {
        this.startdate = startdate;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<Question> getQuestions() {
        return questions;
    }



    public void setQuestions(List<Question> questions) {
        this.questions = questions;
    }

    public String toString(){
        String s = name + ", " + description + ", " + startdate;
        if(questions == null) return s;
        for (Question q : questions) {
            s += q.toString();
        }
        return s;
    }
}
