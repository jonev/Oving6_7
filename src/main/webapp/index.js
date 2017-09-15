/**
 * Created by JoneSkole on 13.09.2017.
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
        $('#divquizstart').datetimepicker();
    });

    function fetchScoreboard() {
        $.ajax({
            url: 'rest/Quiz/users',
            type: 'GET',
            datatype: 'json',
            success: function (data) {
                $('#tablescoreboard').bootstrapTable('load', data);
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
                console.info("Error: " + result);
            }
        });
    });

    $("#btncreatequiz").on('click', function () {
        var name = $("#quizname").val();
        var desc = $("#quizdescription").val();

        if(name == undefined || name == null || name.length < 2|| desc == undefined || desc == null || desc.length < 2) {
            return;
        }
        var question;
        var answers = [];
        $.each($("#divquestions"), function (i, l) {
            $('.col-lg-10', l).each(function (j, k) {
                var anscount = 0;
                $('.form-control', k).each(function (o, p) {
                    if(p.getAttribute('data-type') == "q"){
                        question = $(p).val();
                        console.info($(p).val());
                    }
                    if(p.getAttribute('data-type') == "a"){
                        answers.push($(p).val());
                        console.info($(p).val());
                        anscount++;
                    }

                })
            })
        });
        // $.each($("#divquestions.col-lg-10.form-control"), function (i, l) {
        //     console.info("h2");
        // });
        return;
        $.ajax({
            url: 'rest/Quiz/createquiz',
            type: 'POST',
            data: JSON.stringify({
                name: name,
                description: desc,
                startDate: $("#quizstart").val()

            }),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function(result) {
                console.info("Success: " + result);
            },
            error: function (result) {
                console.info("Error: " + result);
            }
        });
    });

    $("#btnaddquestion").on('click', function () {

        $("<label for='question" + numberofquestions + "' class='col-lg-2 control-label'>Question" + numberofquestions + "</label><div id='divquestion" + numberofquestions + "' class='col-lg-10'><input type='text' class='form-control' data-type='q' placeholder='Enter question'><input type='text' class='form-control' data-type='a' placeholder='Enter answer'><input type='text' data-type='a' class='form-control' placeholder='Enter answer'>").appendTo("#divquestions");
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

    $("#navoverview").on("click", function(){
        if(!usernamealocated()) return;
        $("#divcreateusename").hide();
        $("#divoverview").show();
        $("#divscoreboard").hide();
        $("#divcreatequiz").hide();
    });
    $("#navquizscoreboard").on("click", function(){
        if(!usernamealocated()) return;
        $("#divcreateusename").hide();
        $("#divoverview").hide();
        $("#divscoreboard").show(function () {
            fetchScoreboard();
        });
        $("#divcreatequiz").hide();
    });
    $("#navcreatequiz").on("click", function(){
        if(!usernamealocated()) return;
        $("#divcreateusename").hide();
        $("#divoverview").hide();
        $("#divscoreboard").hide();
        $("#divcreatequiz").show();
    });

    $("#navcreateusername").on("click", function(){
        $("#divcreateusename").show();
        $("#divoverview").hide();
        $("#divscoreboard").hide();
        $("#divcreatequiz").hide();
    });

    function usernamealocated() {
        if(localStorage["username"] == null || localStorage["username"] == undefined || localStorage["username"] == ""){
            return false;
        }
        return true;
    }



});

