/**
 * Created by JoneSkole on 13.09.2017.
 */

$(document).ready(function () {
    $("#username").val(localStorage["username"]);
    /*
    $("#formcreateusername").submit(function() {
        $.ajax({
            type: "POST",
            url: "rest/Auth/username",
            data: $(this).serialize(),
            success: function() {

            }
        })

    })
*/
    $("#btncreateusername").on("click", function () {
        var u = $("#username").val();
        if(u == null || u.length < 1) {
            localStorage.removeItem('username');
            return;
        }
        $.ajax({
            url: 'rest/Auth/' + u,
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            dataType: 'text',
            success: function(result) {
                console.info(result);
                if(result != null && result != undefined){
                    $("#divcreateusename").hide();
                    localStorage["username"] = result;
                }
            }
        });
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
        $("#divscoreboard").show();
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

