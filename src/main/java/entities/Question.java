package entities;

/**
 * @author jonev
 */
public class Question {
    private String question;
    //private String[] answereAlternatives;

    public Question() {
    }

    public String getQuestion() {
        return question;
    }

    // public String[] getAnswereAlternatives() {
    //     return answereAlternatives;
    // }

    public void setQuestion(String question) {
        this.question = question;
    }

    // public void setAnswereAlternatives(String[] answereAlternatives) {
    //     this.answereAlternatives = answereAlternatives;
    // }

    // public String toString(){
    //     String s = question;
    //     if(answereAlternatives == null) return s;
    //     for (String a: answereAlternatives) {
    //         s += ", " + a;
    //     }
    //     return s;
    // }

}
