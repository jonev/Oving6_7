package services;

import com.sun.org.apache.xpath.internal.SourceTree;
import entities.Session;
import entities.User;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import java.util.Date;

import static jdk.nashorn.internal.runtime.regexp.joni.Config.log;

/**
 * Credit nilstes
 * @author jonev
 */
 @Path("/Auth/")
 public class Authentication {

    @Context private HttpServletRequest request;
/*
    @POST
    @Path("/username")
    public String authenticate(data) {

        // Implementation of your authentication logic
        if (true) { // todo sjekke om username finnes fra før
            request.getSession(true);
            // Set the session attributes as you wish
            request.setAttribute("username", username);
            return "Username: " + username;
        } else {
            return "Username already exist...";
        }

    }
    */
    @POST
    @Path("{username}")
    @Produces(MediaType.TEXT_PLAIN)
    public String createUsername(@PathParam("username") String username){
        if (true) { // todo sjekke om username finnes fra før
            request.getSession(true);
            // Set the session attributes as you wish
            request.setAttribute("username", username);
            return username;
        } else {
            return null;
        }
    }


}
