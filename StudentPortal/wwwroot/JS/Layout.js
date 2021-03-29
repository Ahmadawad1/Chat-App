var currentUrl = window.location.href;
var d = new Date();

var m = addZero(d.getHours());
var s = addZero(d.getMinutes());
var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();
if (currentUrl.indexOf('Contact') > -1) {     
    connection.on("ReceiveMessage", function (sender, message, myImage) {
        var myID = $("#myID").val();
            if (sender == myID) {
              
                $("#MessagesList").append(
                    '<li id="FromMe"><div data-offset="' + myID + '" id="DDLMsgBars"> <a id = "DDLMsgItem" href = "#" > <span id="DDLIcons" class="fa fa-copy"></span> Copy</a><a id="DDLMsgItem" href="#"><span id="DDLIcons" class="fa fa-save"></span> Save</a><a id="DDLMsgItem" href="#"><span id="DDLIcons" class="fa fa-forward"></span> Forward</a><a id="DDLMsgItem" href="#"><span id="DDLIcons" class="fa fa-trash"></span> Delete</a></div ><span id="MessageBars" onclick="ShowMenu(' + myID + ')"  class="fa fa-ellipsis-v" ></span><label id="MessageFromMe"><label>  ' + message + '</label><br /><span id="ClockIcon" class="fa fa-clock"></span><label id="Time"> ' + m + ':' + s + '</label></label><img id="MessageImage" src="' + myImage + '" /></li >'
                );
                $("#BeginChat").hide();
                $("#BigImage").remove();
              
            }
            else  {
                var contactID2 = $("#ContactID").val();
                GetImage(message, contactID2, m, s);
            }

        });
    connection.start().then(function () {
        $("#SendBtn").click(function () {
            var msg = $('#InsertionField').val();
            var contactID = $("#ContactID").val();
            var myID = $("#myID").val();
            if (msg.length > 0) {

                        connection.invoke("SendMessage", myID, contactID, msg).catch(function (err) {
                            return console.error(err.toString());
                        });
                $('#InsertionField').val('').focus();
                    }
                });
              
            })

    }
    else
    {
    
    connection.on("ReceiveMessage", function (sender, message, myImage) {
        var myID = $("#myID").val();
        if (sender == myID) {

            $("#MessagesList").append(
                '<li id="FromMe"><div data-offset="' + myID + '" id="DDLMsgBars"> <a id = "DDLMsgItem" href = "#" > <span id="DDLIcons" class="fa fa-copy"></span> Copy</a><a id="DDLMsgItem" href="#"><span id="DDLIcons" class="fa fa-save"></span> Save</a><a id="DDLMsgItem" href="#"><span id="DDLIcons" class="fa fa-forward"></span> Forward</a><a id="DDLMsgItem" href="#"><span id="DDLIcons" class="fa fa-trash"></span> Delete</a></div ><span id="MessageBars" onclick="ShowMenu(' + myID + ')"  class="fa fa-ellipsis-v" ></span><label id="MessageFromMe"><label>  ' + message + '</label><br /><span id="ClockIcon" class="fa fa-clock"></span><label id="Time"> ' + m + ':' + s + '</label></label><img id="MessageImage" src="' + myImage + '" /></li >'
            );
            $("#BeginChat").hide();
            $("#BigImage").remove();

        }
        else {
            var groupGUID = $("#GroupGUID").val();
           
            GetImageGroup(message,sender, groupGUID, m, s);
        }

    });
    connection.start().then(function () {
        $("#SendBtn").click(function () {
            var msg = $('#InsertionField').val();
            var groupGUID = $("#GroupGUID").val();
            var myID = $("#myID").val();
            if (msg.length > 0) {

                connection.invoke("SendMessageGroup", myID, groupGUID, msg).catch(function (err) {
                    return console.error(err.toString());
                });
                $('#InsertionField').val('').focus();
            }
        });

    })
    }

function GetImage(message, contactID, m, s) {
  
    var fd = new FormData();
    fd.append('id', contactID);
   
    $.ajax({
        type: "POST",
        url: '/Dashboard/GetImage',
        contentType: false,
        processData: false,
        data: fd,
        success: function (result) {
           
            $("#MessagesList").append(
                '<li id="ToMe"><img id="MessageImage" src="' + result.image + '" /><label id="MessageToMe"><label>  ' + message + '</label><br /><span id="ClockIcon" class="fa fa-clock"></span><label id="Time"> ' + m + ':' + s + '</label></label><span id="MessageBars2" data-offset="' + contactID + '" onclick="ShowMenu(' + contactID + ')"  class="fa fa-ellipsis-v" ></span><div data-offset="' + contactID + '" id="DDLMsgBars2"> <a id = "DDLMsgItem" href = "#" > <span id="DDLIcons" class="fa fa-copy"></span> Copy</a><a id="DDLMsgItem" href="#"><span id="DDLIcons" class="fa fa-save"></span> Save</a><a id="DDLMsgItem" href="#"><span id="DDLIcons" class="fa fa-forward"></span> Forward</a><a id="DDLMsgItem" href="#"><span id="DDLIcons" class="fa fa-trash"></span> Delete</a></div ></li > '
            );
          
            $("#BeginChat").hide();
            $("#BigImage").remove();
        },
        error: function () {
            console.log('Error in GetImage');
        }
    });
 
}
function GetImageGroup(message, contactID,guid, m, s) {

    var fd = new FormData();
    fd.append('id', contactID);

    $.ajax({
        type: "POST",
        url: '/Dashboard/GetImage',
        contentType: false,
        processData: false,
        data: fd,
        success: function (result) {

            $("#MessagesList").append(
                '<li id="ToMe"><img id="MessageImage" src="' + result.image + '" /><label id="MessageToMe"><label>  ' + message + '</label><br /><span id="ClockIcon" class="fa fa-clock"></span><label id="Time"> ' + m + ':' + s + '</label></label><span id="MessageBars2" data-offset="' + contactID + '" onclick="ShowMenu(' + contactID + ')"  class="fa fa-ellipsis-v" ></span><div data-offset="' + contactID + '" id="DDLMsgBars2"> <a id = "DDLMsgItem" href = "#" > <span id="DDLIcons" class="fa fa-copy"></span> Copy</a><a id="DDLMsgItem" href="#"><span id="DDLIcons" class="fa fa-save"></span> Save</a><a id="DDLMsgItem" href="#"><span id="DDLIcons" class="fa fa-forward"></span> Forward</a><a id="DDLMsgItem" href="#"><span id="DDLIcons" class="fa fa-trash"></span> Delete</a></div ></li > '
            );

            $("#BeginChat").hide();
            $("#BigImage").remove();
        },
        error: function () {
            console.log('Error in GetImage');
        }
    });

}
function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}
function htmlEncode(value) {
        var encodedValue = $('<div />').text(value).html();
        return encodedValue;
    }
var showInfo = false;
function ShowContactInfo() {
  
    if (showInfo) {
        $("#ChatDiv").css("width", "70%");
        $("#ChatUserIcon[name='info']").css("margin-left", "25%");
        $("#DDLUserInfo").hide(200);
        showInfo = false;
    }
    else {
        $("#ChatDiv").css("width", "50%");
        $("#DDLUserInfo").show(700);
        showInfo = true; $("#ChatUserIcon[name='info']").css("margin-left", "2%");
    }
} 

function TriggerInput() {
    $("#FileInput").click();
}
function FillTxt() {
    $("#InsertionField").val($("#FileInput").val())
}