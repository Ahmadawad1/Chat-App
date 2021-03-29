$(document).ready(function () {
    $("#nameLabel").html("");
    $("#emailLabel").html("");
    $("input[name='fullname']").focus(function () {
        $("#nameLabel").html('');
    });
    $("input[name='email']").focus(function () {
        $("#emailLabel").html('');
    });
    $("input[name='password']").focus(function () {
        $("#passwordLabel").html('');
    }); $("input[name='confirm']").focus(function () {
        $("#confirmLabel").html('');
    });
    $("input").focusout(function () {
        Validate();
    });
    $("input").keyup(function () {
        Validate();
    });
    $("button").click(function () {
        Validate();
        if (($("#emailLabel").html().length == 0) && ($("#nameLabel").html().length == 0) && ($("#passwordLabel").html().length == 0) && ($("#confirmLabel").html().length == 0))
        {
            $("#form").submit();
        }
    });

    function Validate() {
        if ($("#fullname").val().length == 0) {
            $("#nameLabel").html("You can't leave this empty")
        }
      
        else {
            $("#nameLabel").html("")
        }
        if ($("#email").val().length == 0) {
            $("#emailLabel").html("You can't leave this empty")
        }
        else if (!isValidEmailAddress($("#email").val())) {
            $("#emailLabel").html("Please enter valid email")
        }
        
        else {
            $("#emailLabel").html("");
        }
        if ($("#password").val().length == 0) {
            $("#passwordLabel").html("You can't leave this empty")
        }
        else if ($("#password").val().length < 6) {
            $("#passwordLabel").html("Min 6 character")
        }
        else {
            $("#passwordLabel").html("")
        }
        if ($("#confirm").val().length == 0) {
            $("#confirmLabel").html("You can't leave this empty")
        }
        else if ($("#confirm").val().length < 6) {
            $("#confirmLabel").html("Min 6 character")
        }
        else if ($("#confirm").val() != $("#password").val()) {
            $("#confirmLabel").html("Password don't match")
        }
        else {
            $("#confirmLabel").html("")
        }
    }
   

    $(document).keyup(function (event) {
        if (event.which === 13) {
            Validate();
            if (($("#emailLabel").html().length == 0) && ($("#nameLabel").html().length == 0) && ($("#passwordLabel").html().length == 0) && ($("#confirmLabel").html().length == 0)) {

                $("#form").submit();

            }
        }
    });


});

function isValidEmailAddress(emailAddress) {
    var pattern = new RegExp(/^(("[\w-+\s]+")|([\w-+]+(?:\.[\w-+]+)*)|("[\w-+\s]+")([\w-+]+(?:\.[\w-+]+)*))(@((?:[\w-+]+\.)*\w[\w-+]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][\d]\.|1[\d]{2}\.|[\d]{1,2}\.))((25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\.){2}(25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\]?$)/i);
    return pattern.test(emailAddress);
};
function isValidName(name) {
    var pattern = new RegExp(/^[a-zA-Z0-9]{4,20}$/);
    return pattern.test(name);
};

