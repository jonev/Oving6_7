package entities;

import java.util.Date;

/**
 * @author jonev
 */
public class Quiz {
    private String name;
    private String description;
    private Date starDate;

    public Quiz() {
    }

    public String getName() {
        return name;
    }

    public Date getStarDate() {
        return starDate;
    }

    public String getDescription() {
        return description;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setStarDate(Date starDate) {
        this.starDate = starDate;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
