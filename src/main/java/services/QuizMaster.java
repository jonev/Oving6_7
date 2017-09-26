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
    private static HashMap<String, Quiz> quizes = new HashMap<String, Quiz>();

    public QuizMaster(){
    }

    @POST
    @Path("deluser/{quizname}/{username}")
    public void delUser(@PathParam("quizname") String quizname, @PathParam("username") String username) {
        Quiz q = quizes.get(quizname);
        User u = new User(username);
        q.delUser(u);
    }

    @POST
    @Path("closequiz/{quizname}")
    public void delUser(@PathParam("quizname") String quizname) {
        Quiz q = quizes.get(quizname);
        if(!q.getStatus().equals("Finished")){
            q.setStatus("3 - Finished");
        }
    }

    @POST
    @Path("createquiz")
    @Consumes(MediaType.APPLICATION_JSON)
    public boolean createQuiz(Quiz newQuiz){
        if (!quizes.containsKey(newQuiz.getName())) {
            newQuiz.setStatus("1 - Upcoming");
            quizes.put(newQuiz.getName(), newQuiz);
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
        Quiz q = quizes.get(quizname);
        Question qs = q.collectQuestions().get(Integer.parseInt(questionnr));
        // calculate score
        int score = 0;
        for (int i = 0; i < qs.collectCorrectAnswere().size(); i++) {
            String correctanswere = qs.collectCorrectAnswere().get(i);
            String userstrie = ans.get(i);
            if(userstrie.equals(correctanswere)){
                score +=1; // one correct ticke off of correct not ticked off answer gives 1
            } else {
                score -=1; // one wrong ticked og not right ticked off answer gives -1
            }
        }
        // update scoreboard
        User u = q.getUser(username);
        u.addScore(score);
        return true;
    }

    @GET
    @Path("getnextquestion/{quizname}/{questionnr}")
    @Produces(MediaType.APPLICATION_JSON)
    public Question getNextQuestion(@PathParam("quizname") String quizname, @PathParam("questionnr") String questionnr) {
        Quiz q = quizes.get(quizname);
        if(Integer.parseInt(questionnr) == 0){
            q.setStatus("2 - Ongoing");
        }
        return q.collectQuestions().get(Integer.parseInt(questionnr));

    }

    @GET
    @Path("getquizscoreboard/{quizname}")
    @Produces(MediaType.APPLICATION_JSON)
    public Collection<User> getQuizScoreboard(@PathParam("quizname") String quizname) {
        Quiz q = quizes.get(quizname);
        Collection<User> us = null;
        if(q != null) us = q.getUsers();
        return us;
    }

    @GET
    @Path("getquiz/{quizname}/{username}")
    @Produces(MediaType.APPLICATION_JSON)
    public Quiz getQuiz(@PathParam("quizname") String quizname, @PathParam("username") String username) {
        Quiz q = quizes.get(quizname);
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
        return quizes.values();
    }

}
