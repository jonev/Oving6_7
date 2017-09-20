/**
 * @author jonev on 13.09.2017.
 */
var numberofquestions;
var numberofansweres;
var activequiz;
var answeringquiz = false;
$(document).ready(function () {
    numberofquestions = 1;
    activequiz = null;

    function testalert(element) {
        alert("test");
    }

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
    }

    $('#tablequizes')
        .on('dbl-click-row.bs.table', function (e, row, $element) {
            console.log(e);
            console.log(row);
            console.log($element);
            fetchQuiz(row.name);
        });


    function fetchQuizes() {
        $.ajax({
            url: 'rest/Quiz/getquizes',
            type: 'GET',
            datatype: 'json',
            success: function (data) {
                // console.info(data);
                $('#tablequizes').bootstrapTable('load', data);
            },
            error: function (result) {
                console.info(result.responseText);
            }
        });
    }

    function fetchQuiz(quizname) {
        $.ajax({
            url: 'rest/Quiz/getquiz/' + quizname,
            type: 'GET',
            datatype: 'json',
            success: function (data, result) {
                console.info(result.responseText);
                console.info(data);
                activequiz = data;
                startQuiz();

            },
            error: function (result) {
                console.info(result.responseText);
            }
        });
    }

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
            // $("<div class='form-group'> " +
            //     "<label class='col-lg-2 control-label'>" + activequiz.name +
            //     "</label>" +
            //     "</div>")
            //     .appendTo("#formactivequiz");
            answeringquiz = true;
            $("#activequizname").text(activequiz.name);
        });
    }

    // exit active quiz
    $("#btnexitquiz").on('click', function () {
        activequiz = null;
        answeringquiz = false;
        $("#divactivequiz").hide();
        $("#divoverview").show(function () {
            intervallupdatequizes = setInterval(fetchQuizes, 5000);
        });
    });


    $("#btncreateusername").on('click', function () {
        var u = $("#username").val();
        if(u == null || u.length < 1) {
            localStorage.removeItem('username');
            return;
        }
        $.ajax({
            url: 'rest/Quiz/' + u,
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            dataType: 'text',
            success: function(result) {
                if(result != null && result != undefined){
                    $("#divcreateusename").hide();
                    localStorage["username"] = result;
                    $("#divoverview").show();
                }
            },
            error: function (result) {
                console.info(result.responseText);
            }
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
            startdate: "" + moment($('#quizstart').val(), "YYYY-MM-SS HH-mm").valueOf(),
            questions: []
        };
        $.each($("#divquestions"), function (i, l) {
            $('.col-lg-10', l).each(function (j, k) {
                var anscount = 0;
                $('.form-control', k).each(function (o, p) {
                    if(p.getAttribute('data-type') == "q"){
                        jsonQuestion.questions[j] = {"question": $(p).val()};
                        jsonQuestion.questions[j]['answereAlternatives'] = [];
                    }
                    if(p.getAttribute('data-type') == "a"){
                        jsonQuestion.questions[j]['answereAlternatives'][anscount] = $(p).val();
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
            "<div id='divquestion" + numberofquestions + "' class='col-lg-10'>" +
                "<div class='row'>" +
                    "<input type='text' class='form-control' ondblclick='testalert(this);' data-type='q' data-cor='false' placeholder='Enter question'>" +
                "</div>" +
                "<div class='row'>" +
                    "<input type='text' class='form-control' data-type='a' data-cor='false' placeholder='Enter answer'>" +
                "</div>" +
                "<div class='row'>" +
                    "<input type='text' class='form-control' data-type='a' data-cor='false' class='form-control' placeholder='Enter answer'>" +
                "</div>"
         + "</div>").appendTo("#divquestions");
        var btnAddAnswer = $('<button/>',
            {
                type: 'button',
                text: 'Add answer',
                click: function () {
                    //console.info("trykket");
                    var extraanswer = "<div class='row'>" + "<input type='text' data-cor='false' class='form-control' data-type='a' placeholder='Enter answer'>" + "</div>";
                    $(extraanswer).insertBefore(this);
                }
            });
        $(btnAddAnswer).appendTo("#divquestion" + numberofquestions + "");
        numberofquestions++;
    });



    var intervallupdatescoreboard;
    var intervallupdatequizes;

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
        if(localStorage["username"] == null || localStorage["username"] == undefined || localStorage["username"] == ""){
            return false;
        }
        return true;
    }



});

