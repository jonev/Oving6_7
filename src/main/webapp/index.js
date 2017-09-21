/**
 * @author jonev on 13.09.2017.
 */
var numberofquestions;
var numberofansweres;
var activequiz;
var answeringquiz = false;
var anseringquestion = 0;
var focuquizname;
var currentusername;


function markAsCorectAnswere(element) {
    if($(element).attr("data-cor") == "false"){
        $(element).attr("data-cor", "true");
        $(element).css('background-color', 'Aquamarine');
    } else {
        $(element).attr("data-cor", "false");
        $(element).css('background-color', 'white');
    }
}

$(document).ready(function () {
    // inits
    numberofquestions = 1;
    activequiz = null;

    if(usernamealocated()){
        $("#divoverview").show();
    } else {
        $("#divcreateusename").show();
    }

    $(function () {
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
            { data: 'startdate' }
        ]
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
    function updateScorbardIntervall() {
        functablequizscoreboard.ajax.url('rest/Quiz/getquizscoreboard/' + focuquizname).load();
    }
    function fetchScoreboard() {
        $.ajax({
            url: 'rest/Quiz/users',
            type: 'GET',
            datatype: 'json',
            success: function (data) {
                $('#tablescoreboard').bootstrapTable('load', data);
            },
            error: function (result) {
                console.info(result.responseText);
            }
        });
    };

    function fetchQuizes() {
        $('#tablequizes').DataTable().ajax.reload();
    }
    function fetchQuiz(quizname, username) {
        $.ajax({
            url: 'rest/Quiz/getquiz/' + quizname + "/" + username,
            type: 'GET',
            datatype: 'json',
            success: function (data, result) {
                console.info(result.responseText);
                console.info(data);
                var d = new Date();
                if(Number(data.startdateAsDate) > d.getTime()) {
                    activequiz = data;
                    startQuiz();
                }

            },
            error: function (result) {
                console.info(result.responseText);
            }
        });
    }

    function fetchQuestion(qnr) {
        $.ajax({
            url: 'rest/Quiz/getnextquestion/' + activequiz.name + "/" + qnr,
            type: 'GET',
            datatype: 'json',
            success: function (data, result) {
                console.info(result.responseText);
                console.info(data);
                addQuestionToHTML(data);

            },
            error: function (result) {
                console.info(result.responseText);
            }
        });
    }
    function postQuestionAnswers(answers) {
        $.ajax({
            url: 'rest/Quiz/questionanswers/' + activequiz.name + "/" + anseringquestion,
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



    var ans;
    function addQuestionToHTML(data) {
        ans = new Array(data.answereAlternatives.size);
        $("<div class='row'><div class='col'><label>" + data.question + "</label></div></div>").appendTo("#divactivequizquestion");
        $(data.answereAlternatives).each(function (index, obj) {
            console.info(this);
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
                        //console.info(this);
                    }
                });
            $(btnAddAnswer).appendTo("#divactivequizquestionans" + index);
        })
    }

    $("#testknapp").on('click', function () {
        fetchQuestion(0);
    });
    $("#testknapp2").on('click', function () {
        postQuestionAnswers(ans);
    });

    // tables
    var table = $('#tablequizes').DataTable();
    $('#tablequizes tbody').on('dblclick', 'tr', function () {
        var data = table.row( this ).data();
        console.info(data.name);
        fetchQuiz(data.name, currentusername);
    } );
    $('#tablequizes tbody').on('click', 'tr', function () {
        var data = table.row( this ).data();
        focuquizname = data.name;
        console.info("Single" + data.name);
        //fetchQuizScoreboard(data.name);
        intervallupdatequizscoreboard = setInterval(updateScorbardIntervall, 5000);
        functablequizscoreboard.ajax.url('rest/Quiz/getquizscoreboard/' + focuquizname).load();

    } );
    // -- tables done

    function quizInterval1sek() {
        if(activequiz){
            // load question
            // console.info(activequiz);
            var d = new Date();
            if(Number(activequiz.startdateAsDate) < d.getTime()){
                $('#activequizstart').text("Ongoing");
            }
            if(anseringquestion == 0 && Number(activequiz.startdateAsDate)+(anseringquestion*5000) < d.getTime()){
                fetchQuestion(anseringquestion);
                anseringquestion++;
            }
        }
    }

    var intervalFetchUpdateActiveQuiz;
    function startQuiz() {
        $("#divcreateusename").hide();
        $("#divoverview").hide(function () {
            window.clearInterval(intervallupdatequizes);
        });
        $("#divscoreboard").hide(function () {
            window.clearInterval(intervallupdatescoreboard);
        });
        $("#divcreatequiz").hide();
        $("#divactivequiz").show(function () {
            answeringquiz = true;
            $("#activequizname").text(activequiz.name);
            $("#activequizstart").text(activequiz.startdate);
            intervalFetchUpdateActiveQuiz = setInterval(quizInterval1sek, 1000);
        });
    }

    // exit active quiz
    $("#btnexitquiz").on('click', function () {
        activequiz = null;
        answeringquiz = false;
        $("#divactivequiz").hide(function () {
            window.clearInterval(intervalFetchUpdateActiveQuiz);
        });
        $("#divoverview").show(function () {
            intervallupdatequizes = setInterval(fetchQuizes, 5000);
        });
    });


    $("#btncreateusername").on('click', function () {
        if($("#username").val() == null || $("#username").val().length < 1) {
            return;
        }
        currentusername = $("#username").val();
        $("#divcreateusename").hide();
        $("#divoverview").show(function () {
            fetchQuizes();
            intervallupdatequizes = setInterval(fetchQuizes, 5000);
        });
    });

    $("#btncreatequiz").on('click', function () {
        var name = $("#quizname").val();
        var desc = $("#quizdescription").val();

        if(name == undefined || name == null || name.length < 2|| desc == undefined || desc == null || desc.length < 2) {
            return;
        }
        var jsonQuestion = {
            name: name,
            description: desc,
            startdate: "" + moment($('#quizstart').val(), "YYYY-MM-DD HH:mm").valueOf(),
            questions: [],
        };
        $.each($("#divquestions"), function (i, l) {
            $('.col-lg-10', l).each(function (j, k) {
                var anscount = 0;
                $('.form-control', k).each(function (o, p) {
                    if(p.getAttribute('data-type') == "q"){
                        jsonQuestion.questions[j] = {"question": $(p).val()};
                        jsonQuestion.questions[j]['answereAlternatives'] = [];
                        jsonQuestion.questions[j]['correctAnswere'] = [];
                    }
                    if(p.getAttribute('data-type') == "a"){
                        jsonQuestion.questions[j]['answereAlternatives'][anscount] = $(p).val();
                        if(p.getAttribute('data-cor') == "true"){
                            jsonQuestion.questions[j]['correctAnswere'][anscount] = "1";
                        } else {
                            jsonQuestion.questions[j]['correctAnswere'][anscount] = "0";
                        }
                        anscount++;
                    }
                })
            })
        });

        // console.info(jsonQuestion);
        // console.info(JSON.stringify(jsonQuestion));
        $.ajax({
            url: 'rest/Quiz/createquiz',
            type: 'POST',
            data: JSON.stringify(jsonQuestion),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function(data, result, jqXHR) {
                console.info("Success: " + data + ", " + result.responseText);
                if(data){
                    $("#divquestions").empty();
                    $("#quizname").val("");
                    $("#quizdescription").val("");

                }
            },
            error: function (result) {
                console.info("Error: " + result.responseText);
            }
        });
    });

    $("#btnaddquestion").on('click', function () {
        $("<label for='question" + numberofquestions + "' class='col-lg-2 control-label'>Question" + numberofquestions + "</label>" +
            "<div id='divquestion" + numberofquestions + "' data-qnr='" + numberofquestions + "' data-corans='' class='col-lg-10'>" +
                "<div class='row' id='divquestion" + numberofquestions + "btn'>" +
                "</div>" +
                "<div class='row'>" +
                    "<input type='text' class='form-control' data-type='q' placeholder='Enter question'>" +
                "</div>" +
                "<div class='row'>" +
                    "<input type='text' class='form-control' ondblclick='markAsCorectAnswere(this);' data-type='a' data-cor='false' placeholder='Enter answer'>" +
                "</div>" +
                "<div class='row'>" +
                    "<input type='text' class='form-control' ondblclick='markAsCorectAnswere(this);' data-type='a' data-cor='false' class='form-control' placeholder='Enter answer'>" +
                "</div>"
         + "</div>").appendTo("#divquestions");
        var btnAddAnswer = $('<button/>',
            {
                type: 'button',
                text: 'Add answer',
                class: '"btn btn-primary"',
                click: function () {
                    //console.info("trykket");
                    var extraanswer = "<div class='row'>" + "<input type='text' ondblclick='markAsCorectAnswere(this);' data-cor='false' class='form-control' data-type='a' placeholder='Enter answer'>" + "</div>";
                    $($(this).parent().parent()).append(extraanswer);
                    //console.info($(this).parent().parent());
                }
            });
        $(btnAddAnswer).appendTo("#divquestion" + numberofquestions + "btn");
        numberofquestions++;
    });



    var intervallupdatescoreboard;
    var intervallupdatequizscoreboard;
    var intervallupdatequizes;

    // navigation
    $("#navoverview").on("click", function(){
        if(answeringquiz || !usernamealocated()) return;
        $("#divcreateusename").hide();
        $("#divoverview").show(function () {
            fetchQuizes();
            intervallupdatequizes = setInterval(fetchQuizes, 5000);
        });
        $("#divscoreboard").hide(function () {
            window.clearInterval(intervallupdatescoreboard);
        });
        $("#divcreatequiz").hide();
    });
    $("#navquizscoreboard").on("click", function(){
        if(answeringquiz ||!usernamealocated()) return;
        $("#divcreateusename").hide();
        $("#divoverview").hide(function () {
            window.clearInterval(intervallupdatequizes);
        });
        $("#divscoreboard").show(function () {
            intervallupdatescoreboard = setInterval(fetchScoreboard, 5000);

        });
        $("#divcreatequiz").hide();
    });
    $("#navcreatequiz").on("click", function(){
        if(answeringquiz ||!usernamealocated()) return;
        $("#divcreateusename").hide();
        $("#divoverview").hide(function () {
            window.clearInterval(intervallupdatequizes);
        });
        $("#divscoreboard").hide(function () {
            window.clearInterval(intervallupdatescoreboard);
        });
        $("#divcreatequiz").show();
    });
    $("#navcreateusername").on("click", function(){
        $("#divcreateusename").show();
        $("#divoverview").hide(function () {
            window.clearInterval(intervallupdatequizes);
        });
        $("#divscoreboard").hide(function () {
            window.clearInterval(intervallupdatescoreboard);
        });
        $("#divcreatequiz").hide();
    });

    function usernamealocated() {
        if(currentusername){
            return true;
        }
        return false;
    }
});

