/**
 * @author jonev on 13.09.2017.
 */
var numberofquestions;
var numberofansweres;
$(document).ready(function () {
    numberofquestions = 1;
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

    function fetchQuizes() {
        $.ajax({
            url: 'rest/Quiz/getquizes',
            type: 'GET',
            datatype: 'json',
            success: function (data) {
                $('#tablequizes').bootstrapTable('load', data);
            },
            error: function (result) {
                console.info(result.responseText);
            }
        });
    }


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
                console.info("Success: " + result);
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

        jsonQuestion.questions[0] = "{\"question\":\"the question\"}";
        jsonQuestion.questions[1] = "{\"question\":\"the question2\"}";
        var question = [];
        var answers = new Array();
        /*
        $.each($("#divquestions"), function (i, l) {
            $('.col-lg-10', l).each(function (j, k) {
                var currentQ;
                var anscount = 0;
                answers[j] = new Array();
                $('.form-control', k).each(function (o, p) {
                    if(p.getAttribute('data-type') == "q"){
                        question[j] = $(p).val();
                        currentQ = $(p).val();

                        //jsonQuestion.questions = [];
                         //jsonQuestion.questions.push('question:' + $(p).val());
                        //jsonQuestion[j]["answereAlternatives"] = [];
                        jsonQuestion.questions[j] = [];
                        jsonQuestion.questions[j][o] = "{question:" + $(p).val() + "}";
                        //jsonQuestion.questions[j].push("question:" + $(p).val());
                        //console.info($(p).val());
                        //console.info($(p).val());
                    }
                    if(p.getAttribute('data-type') == "a"){
                        //answers[j][anscount] = $(p).val();
                        //jsonQuestion[j]["answereAlternatives"][anscount] = $(p).val();
                        //console.info($(p).val());
                        anscount++;
                    }

                })
            })
        });
        */
        console.info(jsonQuestion);
        console.info(JSON.stringify(jsonQuestion));
        $.ajax({
            url: 'rest/Quiz/createquiz',
            type: 'POST',
            data: JSON.stringify(jsonQuestion),
            //    name: name,
            //    description: desc,
            //    startdate: "" + moment($('#quizstart').val(), "YYYY-MM-SS HH-mm").valueOf(),
            //),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function(result) {
                console.info("Success: " + result.responseText);
            },
            error: function (result) {
                console.info("Error: " + result.responseText);
            }
        });
    });

    $("#btnaddquestion").on('click', function () {

        $("<label for='question" + numberofquestions + "' class='col-lg-2 control-label'>Question" + numberofquestions + "</label>" +
            "<div id='divquestion" + numberofquestions + "' class='col-lg-10'>" +
            "<input type='text' class='form-control' data-type='q' placeholder='Enter question'>" +
            "<input type='text' class='form-control' data-type='a' placeholder='Enter answer'>" +
            "<input type='text' data-type='a' class='form-control' placeholder='Enter answer'>")
            .appendTo("#divquestions");
        //<button id='btnaddanswer" + numberofquestions + "'  type='button' class='btn btn-primary'>Add answer</button></div>").appendTo("#divquestions");
        // $("#btnaddanswer" + numberofquestions).on('click'), function () {
        //     $("<input type='text' class='form-control' id='answer" + numberofquestions + "' placeholder='Enter answer'>").appendTo("#question" + numberofquestions);
        // };
        var test = $('<button/>',
            {
                type: 'button',
                text: 'Add answer',
                click: function () {
                    console.info("trykket");
                    var extraanswer = "<input type='text' class='form-control' data-type='a' placeholder='Enter answer'>";
                    //$(extraanswer).appendTo($(this).parent());
                    $(extraanswer).insertBefore(this);
                }
            });
        $(test).appendTo("#divquestion" + numberofquestions + "");


        //$("#btnaddanswer" + numberofquestions + "").on('click', function ()
        //{
        //    var test = $('<button/>',
        //        {
        //            id: "#btnaddanswer" + numberofquestions + "",
        //            text: 'Add answer',
        //            click: function () { alert('hi'); }
        //        });
        //    var parent = $('<tr><td></td></tr>').children().append(test).end();
        //    $("question" + numberofquestions + " tr:last").before(parent);
        //});
        numberofquestions++;
    });

    var intervallupdatescoreboard;
    var intervallupdatequizes;

    $("#navoverview").on("click", function(){
        if(!usernamealocated()) return;
        $("#divcreateusename").hide();
        $("#divoverview").show(function () {
            intervallupdatequizes = setInterval(fetchQuizes, 5000);
        });
        $("#divscoreboard").hide(function () {
            window.clearInterval(intervallupdatescoreboard);
        });
        $("#divcreatequiz").hide();
    });
    $("#navquizscoreboard").on("click", function(){
        if(!usernamealocated()) return;
        $("#divcreateusename").hide();
        $("#divoverview").hide(function () {
            window.clearInterval(fetchQuizes);
        });
        $("#divscoreboard").show(function () {
            intervallupdatescoreboard = setInterval(fetchScoreboard, 5000);

        });
        $("#divcreatequiz").hide();
    });
    $("#navcreatequiz").on("click", function(){
        if(!usernamealocated()) return;
        $("#divcreateusename").hide();
        $("#divoverview").hide(function () {
            window.clearInterval(fetchQuizes);
        });
        $("#divscoreboard").hide(function () {
            window.clearInterval(intervallupdatescoreboard);
        });
        $("#divcreatequiz").show();
    });

    $("#navcreateusername").on("click", function(){
        $("#divcreateusename").show();
        $("#divoverview").hide(function () {
            window.clearInterval(fetchQuizes);
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

