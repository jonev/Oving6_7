package entities;

import java.text.SimpleDateFormat;
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
    private List<User> users;
    private int nrOfQuestions;

    public Quiz() {
        questions = new ArrayList<Question>();
        users = new ArrayList<User>();
    }

    public Quiz(Quiz light) {
        nrOfQuestions = light.questions.size();
        questions = new ArrayList<Question>();
        users = new ArrayList<User>();
        name = light.name;
        description = light.description;
        startdate = light.startdate;
    }

    public String getName() {
        return name;
    }

    public String getNrOfQuestions(){
        return nrOfQuestions + "";
    }

    public String getStartdate() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm");
        Date d = new Date(Long.parseLong(startdate));
        return sdf.format(d);
    }

    public Date getStartdateAsDate() {
        return new Date(Long.parseLong(startdate));
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

    public List<User> getUsers() {
        return users;
    }

    public User getUser(String username){
        for (int i = 0; i < users.size(); i++) {
            if(users.get(i).getUsername().equals(username)){
                return users.get(i);
            }
        }
        return null;
    }

    public void setUsers(List<User> users) {
        this.users = users;
    }

    public void setQuestions(List<Question> questions) {
        this.questions = questions;
        this.nrOfQuestions = questions.size();
    }

    public void addUser(User u){
        if(users.contains(u)) return;
        users.add(u);
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
