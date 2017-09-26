package entities;

import com.fasterxml.jackson.annotation.JsonIgnore;

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
    private String status;

    public Quiz() {
        questions = new ArrayList<Question>();
        users = new ArrayList<User>();
    }

    public String getName() {
        return name;
    }

    public String getNrOfQuestions(){
        nrOfQuestions = questions.size();
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

    // different name from get to avoid sending all the questions to the client
    public List<Question> collectQuestions() {
        return questions;
    }

    public List<User> getUsers() {
        return users;
    }

    public User getUser(String username){
        for(User u : users){
            if(u.getUsername().equals(username)){
                return u;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void addUser(User u){
        if(users.contains(u)) return;
        users.add(u);
    }

    public void delUser(User u){
        users.remove(u);
    }

    public String toString(){
        String s = "Name: " + name + ", desc: " + description + ", start: " + startdate + " q: ";
        if(questions == null) return s;
        for (Question q : questions) {
            s += q.toString();
        }
        return s;
    }
}
