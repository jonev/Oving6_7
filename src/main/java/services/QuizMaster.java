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
    private static HashMap<String, Quiz> ongoingOrFinishedQuizes = new HashMap<String, Quiz>();

    public QuizMaster(){
    }

    @POST
    @Path("deluser/{quizname}/{username}")
    public void delUser(@PathParam("quizname") String quizname, @PathParam("username") String username) {
        Quiz q = ongoingOrFinishedQuizes.get(quizname);
        User u = new User(username);
        q.delUser(u);
    }

    @POST
    @Path("createquiz")
    @Consumes(MediaType.APPLICATION_JSON)
    public boolean createQuiz(Quiz newQuiz){
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
        Quiz q = ongoingOrFinishedQuizes.get(quizname);
        Question qs = q.getQuestions().get(Integer.parseInt(questionnr));
        // calculate score
        int score = 0;
        for (int i = 0; i < qs.getCorrectAnswere().size(); i++) {
            String correctanswere = qs.getCorrectAnswere().get(i);
            String userstrie = ans.get(i);
            if(userstrie.equals(correctanswere)){
                score +=1;
            } else {
                score -=1;
            }
        }
        // update scoreboard
        User u = q.getUser(username);
        u.addScore(score);
        System.out.println("Users " + username + " Score " + u.getScore());
        return true;
    }

    @GET
    @Path("getnextquestion/{quizname}/{questionnr}")
    @Produces(MediaType.APPLICATION_JSON)
    public Question getNextQuestion(@PathParam("quizname") String quizname, @PathParam("questionnr") String questionnr) {
        return ongoingOrFinishedQuizes.get(quizname).getQuestions().get(Integer.parseInt(questionnr));

    }

    @GET
    @Path("getquizscoreboard/{quizname}")
    @Produces(MediaType.APPLICATION_JSON)
    public Collection<User> getQuizScoreboard(@PathParam("quizname") String quizname) {
        Quiz q = ongoingOrFinishedQuizes.get(quizname);
        Collection<User> us = null;
        if(q != null) us = q.getUsers();
        return us;
    }

    @GET
    @Path("getquiz/{quizname}/{username}")
    @Produces(MediaType.APPLICATION_JSON)
    public Quiz getQuiz(@PathParam("quizname") String quizname, @PathParam("username") String username) {
        Quiz q = ongoingOrFinishedQuizes.get(quizname);
        if(q.getUser(username) != null){
            return null; // username already taken
        }
        q.addUser(new User(username));
        return q;
    }

    @GET
    @Path("getquizes")
    @Produces(MediaType.APPLICATION_JSON)
    public Collection<Quiz> getQuizes() {
        return ongoingOrFinishedQuizes.values();
    }

}
