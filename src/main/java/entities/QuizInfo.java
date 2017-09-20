package entities;

public class QuizInfo {
    String name;
    String description;
    String startdate;

    public QuizInfo() {
    }

    public String getName() {
        return name;
    }

    public String getStartdate() {
        return startdate;
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


}
