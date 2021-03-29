$(document).ready(function () {
   
    $("button").click(function () {

        if (($("#ErrorEmail").html().length == 0) && ($("#ErrorPassword").html().length == 0) && ($("#email").val().length > 0) && ($("#password").val().length > 0)) {

            $("#form").submit();

        }


    });
    if (($("#email").val().length > 0)) {

        $("#ErrorEmail").html("");

    }
    if (($("#password").val().length > 0)) {


        $("#ErrorPassword").html("");

    }
    $("#email").focus(function () {

        $("#ErrorEmail").html("");
        $("#ServerError").html("");
    });
    $("#email").focusout(function () {
        if ($("#email").val().length == 0) {

            $("#ErrorEmail").html("You can't leave this empty");

        }
        else if (!isValidEmailAddress($("#email").val())) {

            $("#ErrorEmail").html("Please enter valid email");

        }
        else {


            $("#ErrorEmail").html("");
        }


    });
    $("#email").keyup(function () {

        if ($("#email").val().length == 0) {

            $("#ErrorEmail").html("You can't leave this empty");

        }
        else if (!isValidEmailAddress($("#email").val())) {

            $("#ErrorEmail").html("Please enter valid email");

        }
        else {

            $("#ErrorEmail").html("");
        }

    });

    $("#password").focus(function () {

        $("#ErrorPassword").html("");
        $("#ServerError").html("");
    });
    $("#password").focusout(function () {
        if ($("#password").val().length == 0) {

            $("#ErrorPassword").html("You can't leave this empty");

        }
        else if ($("#password").val().length < 6) {
            $("#ErrorPassword").html("Min 6 character");

        }
        else {

            $("#ErrorPassword").html("");
        }


    });
    $("#password").keyup(function () {

        if ($("#password").val().length == 0) {

            $("#ErrorPassword").html("You can't leave this empty");

        }
        else if ($("#password").val().length < 6) {
            $("#ErrorPassword").html("Min 6 character");

        }
        else {


            $("#ErrorPassword").html("");
        }

    });
    $(document).keyup(function (event) {
        if (event.which === 13) {
            if (($("#ErrorEmail").html().length == 0) && ($("#ErrorPassword").html().length == 0) && ($("#email").val().length > 0) && ($("#password").val().length > 0)) {
                $("#form").submit();

            }

        }
    });
});
function isValidEmailAddress(emailAddress) {
    var pattern = new RegExp(/^(("[\w-+\s]+")|([\w-+]+(?:\.[\w-+]+)*)|("[\w-+\s]+")([\w-+]+(?:\.[\w-+]+)*))(@((?:[\w-+]+\.)*\w[\w-+]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][\d]\.|1[\d]{2}\.|[\d]{1,2}\.))((25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\.){2}(25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\]?$)/i);
    return pattern.test(emailAddress);
};
