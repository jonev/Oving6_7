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
    private static HashMap<String, User> activeUsers = new HashMap<String, User>();
    private static HashMap<String, Quiz> ongoingOrFinishedQuizes = new HashMap<String, Quiz>();

    public QuizMaster(){
        // ArrayList<String> lstAnsweres = new ArrayList<String>();
        // lstAnsweres.add("Ans1");
        // lstAnsweres.add("Ans2");
        // Quiz q = new Quiz();
        // q.setName("Quiz1");
        // q.setDescription("Desc quiz 1");
        // q.setStartdate("1513080000000");
        // List<Question> lstq = new ArrayList<Question>();
        // Question question = new Question();
        // question.setQuestion("This is the question1");
        // question.setAnswereAlternatives(lstAnsweres);
        // lstq.add(question);
        // lstAnsweres = new ArrayList<String>();
        // lstAnsweres.add("Ans1");
        // lstAnsweres.add("Ans2");
        // lstAnsweres.add("Ans3");
        // lstAnsweres.add("Ans4");
        // lstAnsweres.add("Ans5");
        // lstAnsweres.add("Ans6");
        // question = new Question();
        // question.setQuestion("This is the question2");
        // question.setAnswereAlternatives(lstAnsweres);
        // lstq.add(question);
        // q.setQuestions(lstq);
        // unstartedQuizes.put(q.getName(), q);
        // q = new Quiz();
        // q.setName("Quiz2");
        // q.setDescription("Desc quiz 2");
        // q.setStartdate("1513080000000");
        // lstq = new ArrayList<Question>();
        // question = new Question();
        // question.setQuestion("This is the question21");
        // lstq.add(question);
        // question = new Question();
        // question.setQuestion("This is the question22");
        // lstq.add(question);
        // q.setQuestions(lstq);
        // unstartedQuizes.put(q.getName(), q);
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
        if (!activeUsers.containsKey(newUser)) {
            activeUsers.put(username, newUser);
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
        //System.out.println(newQuiz.toString());
        if (!ongoingOrFinishedQuizes.containsKey(newQuiz.getName())) {
            ongoingOrFinishedQuizes.put(newQuiz.getName(), newQuiz);
            System.out.println("Created quiz " + newQuiz);
            return true;
        } else {
            return false;
        }
    }

    @POST
    @Path("questionanswers/{quizname}/{questionnr}/{username}")
    @Consumes(MediaType.APPLICATION_JSON)
    public boolean createQuiz(@PathParam("quizname") String quizname, @PathParam("questionnr") String questionnr, @PathParam("username") String username,  List<String> ans){
        // collect quiz
        Quiz q = ongoingOrFinishedQuizes.get(quizname);
        Question qs = q.getQuestions().get(Integer.parseInt(questionnr));
        // calculate score
        int score = 0;
        for (int i = 0; i < qs.getCorrectAnswere().size(); i++) {
            String correctanswere = qs.getCorrectAnswere().get(i);
            //System.out.println(correctanswere);
            String userstrie = ans.get(i);
            //System.out.println(userstrie);
            if((correctanswere.equals("0") && userstrie == null) || userstrie.equals(correctanswere)){
                score +=1;
            } else {
                score -=1;
            }
        }
        // System.out.println("score " + score);
        // update scoreboard
        User u = q.getUser(username);
        u.addScore(score);
        System.out.println("Users " + username + " Score " + u.getScore());
        return true;
    }

    @GET
    @Path("users")
    @Produces(MediaType.APPLICATION_JSON)
    public Collection<User> getUsers() {
        //Collections.sort(activeUsers, new UsersByScore());
        return activeUsers.values();
    }

    @GET
    @Path("getnextquestion/{quizname}/{questionnr}")
    @Produces(MediaType.APPLICATION_JSON)
    public Question getNextQuestion(@PathParam("quizname") String quizname, @PathParam("questionnr") String questionnr) {
        System.out.println("getnextquestion quizname " + quizname);
        System.out.println("getnextquestion qnr " + questionnr);
        Question q = null;
        try{
            q = ongoingOrFinishedQuizes.get(quizname).getQuestions().get(Integer.parseInt(questionnr));
        } catch (Exception e){
            e.printStackTrace();
        }
        return q;

    }

    @GET
    @Path("getquizscoreboard/{quizname}")
    @Produces(MediaType.APPLICATION_JSON)
    public Collection<User> getQuizScoreboard(@PathParam("quizname") String quizname) {
        //System.out.println(quizname);
        Quiz q = ongoingOrFinishedQuizes.get(quizname);
        // System.out.println(q);
        Collection<User> us = null;
        if(q != null) us = q.getUsers();
        //System.out.println(us);
        return us;
    }

    @GET
    @Path("getquiz/{quizname}/{username}")
    @Produces(MediaType.APPLICATION_JSON)
    public Quiz getQuiz(@PathParam("quizname") String quizname, @PathParam("username") String username) {
        System.out.println("Fetched quiz: " + quizname);
        System.out.println("adds user to scooreboard " + username);
        Quiz q = ongoingOrFinishedQuizes.get(quizname);
        q.addUser(new User(username));
        System.out.println(username + " added to " + quizname);
        return new Quiz(q); // light
    }

    @GET
    @Path("getquizes")
    @Produces(MediaType.APPLICATION_JSON)
    public Collection<Quiz> getQuizes() {
        if(ongoingOrFinishedQuizes.size() <= 0 )return null;
        Date dnow = new Date();
        ArrayList<Quiz> lstLightQuiz = new ArrayList<Quiz>();
        //System.out.println(dnow);
        for(Quiz q : ongoingOrFinishedQuizes.values()){ // deletes old quizes
            lstLightQuiz.add(new Quiz(q));
        }
        return lstLightQuiz;
    }

}
