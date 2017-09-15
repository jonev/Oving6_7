package services;

import entities.Quiz;
import entities.User;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;

/**
 * Credit nilstes
 * @author jonev
 */
@Path("/Quiz/")
public class QuizMaster {
    private static HashMap<String, User> activeUsers = new HashMap<String, User>();
    private static HashMap<String, Quiz> activeQuizes = new HashMap<String, Quiz>();
    private Quiz newQuiz = null;

    public QuizMaster(){

    }

    @POST
    @Path("{username}")
    @Produces(MediaType.TEXT_PLAIN)
    public String createUsername(@PathParam("username") String username){
        if (!activeUsers.containsKey(username)) {
            User newUser = new User();
            newUser.setUsername(username);
            newUser.setScore(0);
           activeUsers.put(username, newUser);
            System.out.println("User added: " + username);
            return username;
        } else {
            return null;
        }
    }

    @POST
    @Path("createquiz")
    @Consumes(MediaType.TEXT_PLAIN)
    public boolean createQuiz(Quiz newQuiz){
        if (!activeQuizes.containsKey(newQuiz.getName())) {
            this.newQuiz = newQuiz;
            return true;
        } else {
            return false;
        }
    }

    @GET
    @Path("users")
    @Produces(MediaType.APPLICATION_JSON)
    public Collection<User> getUsers() {
        return activeUsers.values();
    }

}
