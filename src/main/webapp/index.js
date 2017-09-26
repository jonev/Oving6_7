/**
 * @author jonev on 13.09.2017.
 */
var numberofquestions;
var activequiz;
var anseringquestion;
var focuquizname;
var currentusername;
var currenttimetoanswere;
var questionstarttime;


function markAsCorectAnswere(element) {
    if($(element).attr("data-cor") == "false"){
        $(element).attr("data-cor", "true");
    } else {
        $(element).attr("data-cor", "false");
    }
}

function answerdelete(obj) {
    $(obj).parent().closest('div').remove()
}

$(document).ready(function () {
    // inits
    numberofquestions = 1;
    anseringquestion = -1;
    currenttimetoanswere = 0;
    questionstarttime = 0;
    activequiz = null;

    $(function () {
        moment.locale('en', {
            week: { dow: 1 } // Monday is the first day of the week
        });
        $('#divquizstart').datetimepicker({
            format:"YYYY-MM-DD HH:mm"
        });
    });

    $.fn.dataTable.ext.errMode = 'throw';
    $('#tablequizes').DataTable( {
        ajax: {
            url: 'rest/Quiz/getquizes',
            dataSrc: ''
        },
        columns: [
            { data: 'name' },
            { data: 'description' },
            { data: 'startdate' },
            { data: 'status' }
        ],
        order: [[ 3, 'asc' ], [ 2, 'asc' ],  [ 0, 'asc' ]]
    });
    var functablequizscoreboard = $('.tablequizesscoreboard').DataTable( {
        ajax: {
            url: 'rest/Quiz/getquizscoreboard/' + focuquizname,
            dataSrc: ''
        },
        columns: [
            { data: 'username' },
            { data: 'score' }
        ]
    });
    // -- init done

    // AJAX
    // GET
    function fetchQuizes() {
        $('#tablequizes').DataTable().ajax.reload();
    }
    function updateScorbardIntervall() {
        if(focuquizname && focuquizname.length > 0){
            functablequizscoreboard.ajax.url('rest/Quiz/getquizscoreboard/' + focuquizname).load();
        }
    }
    function fetchQuiz(quizname, username) {
        $.ajax({
            url: 'rest/Quiz/getquiz/' + quizname + "/" + username,
            type: 'GET',
            datatype: 'json',
            success: function (data) {
                if(data == null){
                    alert("Nickname is already taken");
                    return;
                }
                activequiz = data;
                questionstarttime = activequiz.startdateAsDate;
                currenttimetoanswere = 0;
                anseringquestion = -1;
                startQuiz();
            },
            error: function (result) {
                console.info(result.responseText);
            }
        });
    }
    function fetchQuestion(quizname, qnr) {
        $.ajax({
            url: 'rest/Quiz/getnextquestion/' + quizname + "/" + qnr,
            type: 'GET',
            datatype: 'json',
            success: function (data) {
                addQuestionToHTML(data);
                currenttimetoanswere = parseInt(data.timeToAnswere)*1000;
            },
            error: function (result) {
                console.info(result.responseText);
            }
        });
    }
    // POST
    function createQuiz(jsonQuiz) {
        $.ajax({
            url: 'rest/Quiz/createquiz',
            type: 'POST',
            data: JSON.stringify(jsonQuiz),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function(data, result) {
                if(data == true){
                    console.info("Quiz created Success: " + data + ", " + result.responseText);
                    $("#divquestions").empty();
                    $("#quizname").val("");
                    $("#quizdescription").val("");
                } else {
                    alert("Quiz name already taken");
                }
            },
            error: function (result) {
                console.info("Error: " + result.responseText);
            }
        });
    }
    function markQuizAsFinished(quizname) {
        $.ajax({
            url: 'rest/Quiz/closequiz/' + quizname,
            type: 'POST',
            success: function () {
                exitQuiz();
            },
            error: function (result) {
                console.info(result.responseText);
            }
        });
    }
    function postQuestionAnswers(answers, qnr,  username) {
        $.ajax({
            url: 'rest/Quiz/questionanswers/' + activequiz.name + "/" + qnr + "/" + username,
            type: 'POST',
            data: JSON.stringify(answers),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function(result) {
                console.info(result.responseText);
            },
            error: function (result) {
                console.info(result.responseText);
            }
        });
    }
    function delUser(quizname, username) {
        $.ajax({
            url: 'rest/Quiz/deluser/' + quizname + "/" + username,
            type: 'POST',
            success: function () {
                exitQuiz();
            },
            error: function (result) {
                console.info(result.responseText);
            }
        });
    }

    // AJAX done

    // Logic/intervalls
    var intervallupdatequizscoreboard = setInterval(updateScorbardIntervall, 5000);
    var intervallupdatequizes = intervallupdatequizes = setInterval(fetchQuizes, 5000);

    var ans;
    function addQuestionToHTML(data) {
        ans = new Array(data.answereAlternatives.length);
        for(i = 0; i < ans.length; i++){
            ans[i] = "0";
        }
        $('#divactivequizquestion').empty();
        $("<div class='row'><div class='col'><h3>" + data.question + "</h3></div></div>").appendTo("#divactivequizquestion");
        $(data.answereAlternatives).each(function (index) {
            $("<div class='row'><div class='col' id='divactivequizquestionans" + index + "'></div></div>").appendTo("#divactivequizquestion");
            var btnAddAnswer = $('<button/>',
                {
                    type: 'button',
                    text: this,
                    class: "btn btn-secondary btn-lg btn-block",
                    click: function () {
                        if(ans[index] == 1){
                            ans[index] = 0;
                            $(this).removeClass('btn-primary');
                            $(this).addClass('btn-secondary');
                        } else {
                            ans[index] = 1;
                            $(this).removeClass('btn-secondary');
                            $(this).addClass('btn-primary');
                        }
                    }
                });
            $(btnAddAnswer).appendTo("#divactivequizquestionans" + index);
        })
    }

    // tables
    var tablequizes = $('#tablequizes').DataTable();
    $('#tablequizes').on('dblclick', 'tr', function () {
        var data = tablequizes.row( this ).data();
        var d = new Date();
        if(Number(data.startdateAsDate) < d.getTime()){
            alert("the quiz has already started");
            return;
        }
        focuquizname = data.name;
        $("#divcreateusename").show();
        $("#divoverview").hide(function () {
            window.clearInterval(intervallupdatequizes);
        });
        $("#divcreatequiz").hide();

    } );
    $('#tablequizes').on('click', 'tr', function () {
        var data = tablequizes.row( this ).data();
        focuquizname = data.name;
        $('#pchosenquiz').text("For quiz: " + focuquizname);
        functablequizscoreboard.ajax.url('rest/Quiz/getquizscoreboard/' + focuquizname).load();
    } );
    // -- tables done

    function quizInterval1sek() {
        if(activequiz){
            // load question
            var d = new Date();
            var timetoanswere = parseInt(((questionstarttime + currenttimetoanswere) - d.getTime())/1000);
            $('#activequiztimetoanswere').text(timetoanswere);
            if(questionstarttime <= d.getTime() && anseringquestion < 0){
                $('#activequizstart').text("Ongoing");
                console.info("Fetching FIRST question");
                anseringquestion++;
                fetchQuestion(activequiz.name, anseringquestion);
            } else if((questionstarttime + currenttimetoanswere) <= d.getTime() && anseringquestion >= 0){
                console.info("Posting questionAnswers");
                postQuestionAnswers(ans, anseringquestion, currentusername);
                anseringquestion++;
                if(anseringquestion < activequiz.nrOfQuestions ){
                    console.info("Fetching new question nr: " + anseringquestion);
                    questionstarttime += currenttimetoanswere;
                   fetchQuestion(activequiz.name, anseringquestion);
                }else {
                    console.info("Exiting quiz");
                    $('#divactivequizquestion').empty();
                    markQuizAsFinished(activequiz.name);
                }
            }
        }
    }

    var intervalFetchUpdateActiveQuiz;
    function startQuiz() {
        $("#divcreateusename").hide();
        $("#divoverview").hide(function () {
            window.clearInterval(intervallupdatequizes);
        });
        $("#divcreatequiz").hide();
        $("#divactivequiz").show(function () {
            $("#activequizname").text(activequiz.name);
            $("#activequizstart").text(activequiz.startdate);
            intervalFetchUpdateActiveQuiz = setInterval(quizInterval1sek, 1000);
        });
    }

    // exit active quiz
    $("#btnexitquiz").on('click', function () {
        delUser(activequiz.name, currentusername);
    });

    function exitQuiz() {
        activequiz = null;
        currentusername = null;
        $('#navid').text("");
        $("#divactivequiz").hide(function () {
            window.clearInterval(intervalFetchUpdateActiveQuiz);
        });
        $("#divoverview").show(function () {
            intervallupdatequizes = setInterval(fetchQuizes, 5000);
        });
    }


    $("#btncreateusername").on('click', function () {
        var n = $("#username").val();
        if(n == null || n.length < 1) {
            alert("Nickname must me more than 1 character")
        }
        $('#navid').text(n);
        currentusername = n;
        fetchQuiz(focuquizname, currentusername);
    });

    $("#btncreatequiz").on('click', function () {
        var name = $("#quizname").val(); // collecting value from html object
        var desc = $("#quizdescription").val(); // collecting value from html object

        // if the quiz does not have a name and a description the metod exits
        if(name == undefined || name == null || name.length < 2|| desc == undefined || desc == null || desc.length < 2) {
            alert("Quiz name and description must be more than 2 characters");
            return;
        }


        // validate start time for quiz, so the user cant make an quiz that is has already been
        // if the start time i less than 2 minutes untill. It is set to now + 2 minutes
        var qd = moment($('#quizstart').val(), "YYYY-MM-DD HH:mm").valueOf();
        var dn = new Date();
        if(qd < (dn.getTime()+120000)){
            qd = (dn.getTime()+120000);
        }

        // building json object according to my class structure on the server
        var jsonQuizObj = { // be aware of the "{" - this means new object
            name: name,
            description: desc,
            startdate: "" + qd,
            questions: [] // "[]" - means array
        };
        $.each($("#divquestions"), function (i, l) {
            $('.col-lg-10', l).each(function (j, k) {
                var anscount = 0;
                $('.q', k).each(function (o, p) {
                    if(p.getAttribute('data-type') == "q"){
                        jsonQuizObj.questions[j] = {"question": $(p).val()}; // be aware of the "{ - }" this means new object - results in object of questions
                        jsonQuizObj.questions[j]['answereAlternatives'] = []; // each question contains a array of answeraltenatives
                        jsonQuizObj.questions[j]['correctAnswere'] = []; // each question contains an array of wich answeres are correct
                        return;
                    }
                    if(p.getAttribute('data-type') == "a"){ // the atribute "data-type" is not default - i made it, add the tag, and its working
                        if(p.hasAttribute('data-cor') && p.getAttribute('data-cor') == "true"){
                            jsonQuizObj.questions[j]['correctAnswere'][anscount] = "1";
                            return;
                        } else if(p.hasAttribute('data-cor') && p.getAttribute('data-cor') == "false") {
                            jsonQuizObj.questions[j]['correctAnswere'][anscount] = "0";
                            return;
                        }
                        jsonQuizObj.questions[j]['answereAlternatives'][anscount] = $(p).val(); // collects the aswere alternative
                        anscount++;
                    }
                    if(p.getAttribute('data-type') == "t"){ // the atribute "data-type" is not default - i made it, add the tag, and its working
                        jsonQuizObj.questions[j]['timeToAnswere'] = $(p).val();
                    }
                })
            })
        });
        // validation of the quiz
        if(jsonQuizObj.questions.length < 1){
            alert("A quiz needs minimum one question");
            return;
        }
        var exitfunc = false;
        $.each(jsonQuizObj.questions, function (k, v) {
            if(v.question.length < 1){
                alert("Empty question");
                exitfunc = true;
                return;
            }
            if(v.timeToAnswere < 1 || !$.isNumeric(v.timeToAnswere)){
                alert("Error on time to answer");
                exitfunc = true;
                return;
            }
            if(v.answereAlternatives < 1){
                alert("Aquestion need to have at least one answer");
                exitfunc = true;
                return;
            }
            $.each(v.answereAlternatives, function (j, w) {
                if(w.length < 1){
                    alert("Empty answer alternative");
                    exitfunc = true;
                }
            })
        });

        if(exitfunc) return;
        createQuiz(jsonQuizObj);
    });

    $("#btnaddquestion").on('click', function () {
        $("<label for='question" + numberofquestions + "' class='col-lg-2 control-label'>Question" + numberofquestions + "</label>" +
            "<div id='divquestion" + numberofquestions + "' data-qnr='" + numberofquestions + "' data-corans='' class='col-lg-10'>" +
                "<div class='row' id='divquestion" + numberofquestions + "btn'>" +
                "</div>" +
                "<div class='row'>" +
                    "<input type='text' class='form-control q' data-type='q' placeholder='Enter question'>" +
                "</div>" +
                "<div class='row'>" +
                    "<input type='text' class='form-control q' data-type='t' placeholder='Enter time to answer the question in sec'>" +
                "</div>" +
                "<div class='input-group'>" +
                    "<span class='input-group-addon'>" +
                        "<input type='checkbox' class='q' data-type='a' onclick='markAsCorectAnswere(this)' data-cor='false'>" +
                    "</span>" +
                    "<input type='text' data-type='a' class='form-control q' placeholder='Enter answer'>" +
                    "<span class='input-group-btn'>" +
                        "<button class='btn btn-secondary' type='button' onclick='answerdelete(this)'>X</button>" +
                    "</span>" +
                "</div>" +
                "<div class='input-group'>" +
                    "<span class='input-group-addon'>" +
                        "<input type='checkbox' class='q' data-type='a' onclick='markAsCorectAnswere(this)' data-cor='false'>" +
                    "</span>" +
                    "<input type='text' data-type='a'  class='form-control q' placeholder='Enter answer'>" +
                    "<span class='input-group-btn'>" +
                        "<button class='btn btn-secondary' type='button' onclick='answerdelete(this)'>X</button>" +
                    "</span>" +
                "</div>" +
         + "</div>").appendTo("#divquestions");
        var btnAddAnswer = $('<button/>',
            {
                type: 'button',
                text: 'Add answer',
                class: '"btn btn-primary"',
                click: function () {
                    var extraanswer = "<div class='input-group'>" +
                        "<span class='input-group-addon'>" +
                        "<input type='checkbox' class='q' data-type='a' onclick='markAsCorectAnswere(this)' data-cor='false'>" +
                        "</span>" +
                        "<input type='text' data-type='a'  class='form-control q' placeholder='Enter answer'>" +
                        "<span class='input-group-btn'>" +
                        "<button class='btn btn-secondary' type='button' onclick='answerdelete(this)'>X</button>" +
                        "</span>" +
                        "</div>";
                    $($(this).parent().parent()).append(extraanswer);
                }
            });
        $(btnAddAnswer).appendTo("#divquestion" + numberofquestions + "btn");
        numberofquestions++;
    });

    // navigation
    $("#navoverview").on("click", function(){
        if($('#divactivequiz').is(":visible")){
            alert("You have to exit quiz to access the overview");
            return;
        }
        $("#divcreateusename").hide();
        $("#divoverview").show(function () {
            fetchQuizes();
            window.clearInterval(intervallupdatequizes);
            intervallupdatequizes = setInterval(fetchQuizes, 5000);
        });
        $("#divcreatequiz").hide();
    });

    $("#navcreatequiz").on("click", function(){
        if($('#divactivequiz').is(":visible")){
            alert("You have to exit quiz to create quiz");
            return;
        }
        $("#divcreateusename").hide();
        $("#divoverview").hide(function () {
            window.clearInterval(intervallupdatequizes);
        });
        $("#divcreatequiz").show();
    });
});

