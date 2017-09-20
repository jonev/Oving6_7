package services;

import entities.*;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.*;

/**
 * Credit nilstes
 * @author jonev
 */
@Path("/Quiz/")
public class QuizMaster {
    private static ArrayList<User> activeUsers = new ArrayList<User>();
    private static HashMap<String, QuizInfo> activeQuizes = new HashMap<String, QuizInfo>();
    private Quiz newQuiz = null;

    public QuizMaster(){
        ArrayList<String> lstAnsweres = new ArrayList<String>();
        lstAnsweres.add("Ans1");
        lstAnsweres.add("Ans2");

        Quiz q = new Quiz();
        q.setName("Quiz1");
        q.setDescription("Desc quiz 1");
        q.setStartdate("1513080000");
        List<Question> lstq = new ArrayList<Question>();
        Question question = new Question();
        question.setQuestion("This is the question1");
        question.setAnswereAlternatives(lstAnsweres);
        lstq.add(question);
        lstAnsweres = new ArrayList<String>();
        lstAnsweres.add("Ans1");
        lstAnsweres.add("Ans2");
        lstAnsweres.add("Ans3");
        lstAnsweres.add("Ans4");
        lstAnsweres.add("Ans5");
        lstAnsweres.add("Ans6");
        question = new Question();
        question.setQuestion("This is the question2");
        question.setAnswereAlternatives(lstAnsweres);
        lstq.add(question);
        q.setQuestions(lstq);
        activeQuizes.put(q.getName(), q);
        q = new Quiz();
        q.setName("Quiz2");
        q.setDescription("Desc quiz 2");
        q.setStartdate("1513080000");
        lstq = new ArrayList<Question>();
        question = new Question();
        question.setQuestion("This is the question21");
        lstq.add(question);
        question = new Question();
        question.setQuestion("This is the question22");
        lstq.add(question);
        q.setQuestions(lstq);
        activeQuizes.put(q.getName(), q);
        // User u = new User();
        // u.setScore(1);
        // u.setUsername("ein");
        // activeUsers.add(u);
        // u = new User();
        // u.setScore(2);
        // u.setUsername("to");
        // activeUsers.add(u);
        // u = new User();
        // u.setScore(3);
        // u.setUsername("tre");
        // activeUsers.add(u);
    }

    @POST
    @Path("{username}")
    @Produces(MediaType.TEXT_PLAIN)
    public String createUsername(@PathParam("username") String username){
        User newUser = new User();
        newUser.setUsername(username);
        newUser.setScore(0);
        if (!activeUsers.contains(newUser)) {
            activeUsers.add(newUser);
            System.out.println("User added: " + username);
            return username;
        } else {
            return null;
        }
    }

    @POST
    @Path("createquiz")
    @Consumes(MediaType.APPLICATION_JSON)
    public boolean createQuiz(Quiz newQuiz){
        System.out.println(newQuiz.toString());
        if (!activeQuizes.containsKey(newQuiz.getName())) {
            activeQuizes.put(newQuiz.getName(), newQuiz);
            System.out.println(activeQuizes.keySet());
            return true;
        } else {
            return false;
        }
    }

    @POST
    @Path("addquestions")
    @Consumes(MediaType.APPLICATION_JSON)
    public boolean addQuestions(Quiz newQuiz){
        System.out.println(newQuiz.toString());
        if (!activeQuizes.containsKey(newQuiz.getName())) {
            activeQuizes.put(newQuiz.getName(), newQuiz);
            return true;
        } else {
            return false;
        }
    }

    @GET
    @Path("users")
    @Produces(MediaType.APPLICATION_JSON)
    public Collection<User> getUsers() {
        Collections.sort(activeUsers, new UsersByScore());
        return activeUsers;
    }

    @GET
    @Path("getquiz/{quizname}")
    @Produces(MediaType.APPLICATION_JSON)
    public Quiz getQuiz(@PathParam("quizname") String quizname) {
        return (Quiz)activeQuizes.get(quizname);
    }

    // @GET
    // @Path("getquizes")
    // @Produces(MediaType.APPLICATION_JSON)
    // public Collection<String> getQuizes() {
    //     return activeQuizes.keySet();
    // }

    @GET
    @Path("getquizes")
    @Produces(MediaType.APPLICATION_JSON)
    public Collection<QuizInfo> getQuizes() {
        return activeQuizes.values();
    }

}
