

function Search(insertedValue,id)
{
    $("#SearchResult").empty();
    var fd = new FormData();
    fd.append('insertedValue', insertedValue);
    fd.append('id', id);
        $.ajax({
            type: "POST",
            url: '/Dashboard/Search',
            contentType: false,
            processData: false,
            data: fd,
            success: function (result) {
                if (insertedValue.length > 0) {
                    $("#SearchResult").show();
                    if (result.list.length == 0) {
                        $("#SearchResult").append("<li id='SearchItem'><text id='SearchTxt2'>Result Not Found</text><br><br><span style='margin-left:120px;color:#e46f6f;font-size:50px;' class='fa fa-frown'></span></li>")

                    }
                    else {
                        for (var i = 0; i < result.list.length; i++) {
                            var name = result.list[i].name;

                            $("#SearchResult").append("<li id='SearchItem' onclick='ViewConversation(" + result.list[i].id+","+id+")'   ><img id='MessageImage' src='" + result.list[i].profileImage + "'/><text id='SearchTxt' >" + name + "</text></li>")
                        }
                    }
                }
                else {
                    $("#SearchResult").hide();
                }
            }

        });
}

function Fill(name) {

    document.getElementById("Search").value = name;
}
$(window).click(function (e) {
    if (e.target.id != 'SearchResult' && e.target.id != 'Search') {
        $("#SearchResult").hide();
    }
    else {
        $("#SearchResult").show();
    }
});
function ViewConversation(id, myID) {
  
    $("#ContactID").val(id);
  
    $("#MessagesList").empty();
    $("#MessagesList").append(' <li id="BeginChat"></li>');
    var formData = new FormData();
    formData.append('id', id);
    $.ajax(
        {
            type: "POST",
            url: '/Dashboard/GetContactInfo',
            contentType: false,
            processData: false,
            data: formData,
            success: function (result) {
             
                ChangeHeader(result.name, result.image, result.bio, result.location,result.statue);
                FillMessages(result.id, myID);
            }
            , error: function (xhr) {
                alert(xhr.responseText);
            }

        }
    );
}

function ChangeHeader(name, image, bio, loc,statue)
{
    if (statue == "0") {
        $("#StatueCircle").css("color", "green");
        $("#StatueCircle2").css("color", "green");
        $("#Statue2").html("Active");
    }
    else if (statue=="1") {
        $("#StatueCircle").css("color", "darkorange");
        $("#StatueCircle2").css("color", "darkorange");
        $("#Statue2").html("Unavailable");
    }
    $("#CurrentChatName").html(name);
    $("#CurrentChatName2").html(name);
    $("#CurrentChatBio").html('" '+bio+' "');
    $("#CurrentChatLocation").html(loc);  
    $("#CurrentChatImage").attr({ "src": image });
    $("#CurrentChatImage2").attr({ "src": image });
}
function FillMessages(id, myID)
{
    var formData = new FormData();
    formData.append('id', id);
    formData.append('myID', myID);
   
    $.ajax(
        {
            type: "POST",
            url: '/Dashboard/GetConversation',
            contentType: false,
            processData: false,
            data: formData,
            success: function (result) {
                $("#LunchDiv").hide();
                $("#ChatDiv").show();
                $("#BeginChat").remove(); $("#BigImage").remove();
                $("#CurrentChatHeader").show();
                $("#CurrentChatFooter").show();
                if (result.messages.length == 0)
                {
                    $("#MessagesList").append('<li id="BeginChat">'+'Begin a Conversation'+'</li><br><br><span  class="fa fa-comments" id="BigImage" style="font-size:150px;margin-left:40%;color:white"></span>');

                }
                else
                {
                   
                    for (var i = 0; i < result.messages.length; i++) {

                        if (result.messages[i].fromID == myID) {
                            $("#MessagesList").append(
                                '<li id="FromMe"><div data-offset="' + result.messages[i].id + '" id="DDLMsgBars"> <a id = "DDLMsgItem" href = "#" > <span id="DDLIcons" class="fa fa-copy"></span> Copy</a><a id="DDLMsgItem" href="#"><span id="DDLIcons" class="fa fa-save"></span> Save</a><a id="DDLMsgItem" href="#"><span id="DDLIcons" class="fa fa-forward"></span> Forward</a><a id="DDLMsgItem" href="#"><span id="DDLIcons" class="fa fa-trash"></span> Delete</a></div ><span id="MessageBars" onclick="ShowMenu(' + result.messages[i].id + ')"  class="fa fa-ellipsis-v" ></span><label id="MessageFromMe"><label>  ' + result.messages[i].body + '</label><br /><span id="ClockIcon" class="fa fa-clock"></span><label id="Time"> ' + result.messages[i].date + '</label></label><img id="MessageImage" src="' + result.myImage + '" /></li >'
                            );
                        }
                        else if (result.messages[i].fromID == id) {
                            $("#MessagesList").append(
                                '<li id="ToMe"><img id="MessageImage" src="' + result.contact.profileImage + '" /><label id="MessageToMe"><label>  ' + result.messages[i].body + '</label><br /><span id="ClockIcon" class="fa fa-clock"></span><label id="Time"> ' + result.messages[i].date + '</label></label><span id="MessageBars2" data-offset="' + result.messages[i].id + '" onclick="ShowMenu(' + result.messages[i].id + ')"  class="fa fa-ellipsis-v" ></span><div data-offset="' + result.messages[i].id +'" id="DDLMsgBars2"> <a id = "DDLMsgItem" href = "#" > <span id="DDLIcons" class="fa fa-copy"></span> Copy</a><a id="DDLMsgItem" href="#"><span id="DDLIcons" class="fa fa-save"></span> Save</a><a id="DDLMsgItem" href="#"><span id="DDLIcons" class="fa fa-forward"></span> Forward</a><a id="DDLMsgItem" href="#"><span id="DDLIcons" class="fa fa-trash"></span> Delete</a></div ></li > '
                            );
                        }
                    }
                }
            }
            , error: function (xhr) {
                alert(xhr.responseText);
            }

        }
    );
}
function ShowMenu(id) {
   
    $("div[data-offset=" + id + "]").toggle();
}
function Lunch() {
    $("#LunchDiv").show();
    $("#ChatDiv").hide();
    $("#CurrentChatHeader").hide();
    $("#CurrentChatFooter").hide();
}