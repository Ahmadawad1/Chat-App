function Search(insertedValue, id, type) {
    if (type == "AddSearch") {
        $("#SearchResultGroup").empty();
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
                    $("#SearchResultGroup").show();
                    if (result.list.length == 0) {
                        $("#SearchResultGroup").append("<li id='SearchItemGroup'><text style='margin:20px;color:white;'>Result Not Found</text></li>")

                    }
                    else {
                        for (var i = 0; i < result.list.length; i++) {
                            var name = result.list[i].name;
                            var contactID = result.list[i].id;
                            if (!IsExist(contactID)) {
                                $("#SearchResultGroup").append("<li id='SearchItemGroup' onclick='Chose(\"" + name + "\"," + contactID + ")'   ><img id='MessageImage' src='" + result.list[i].profileImage + "'/><text id='SearchTxt' >" + name + "</text></li>")
                            }
                            else continue;
                        }
                    }
                }
                else {
                    $("#SearchResultGroup").hide();
                }
            }

        });
    }
    else if (type == "Search") {
 
        $("#SearchResult").empty();
        var fd = new FormData();
        fd.append('insertedValue', insertedValue);
        fd.append('id', id);
        $.ajax({
            type: "POST",
            url: '/Dashboard/SearchGroups',
            contentType: false,
            processData: false,
            data: fd,
            success: function (result) {
                if (insertedValue.length > 0) {
                    $("#SearchResult").show();
                    if (result.list.length == 0) {
                        $("#SearchResult").append("<li id='SearchItem'><text style=''>Result Not Found</text><br><br><span style='margin-left:120px;color:#e46f6f;font-size:50px;' class='fa fa-frown'></span></li>")

                    }
                    else {
                        for (var i = 0; i < result.list.length; i++) {
                            var name = result.list[i].name;

                            $("#SearchResult").append("<li id='SearchItem' onclick='ViewConversation(\"" + result.list[i].groupGUID + "\"," + id + ")'   ><img id='MessageImage' src='" + result.list[i].groupImage + "'/><text id='SearchTxt' >" + name + "</text></li>")
                        }
                    }
                }
                else {
                    $("#SearchResult").hide();
                }
            }

        });
    }
    else if (type == "NewSearch")
    {
        $("#SearchNewResultGroup").empty();
        var fd = new FormData();
        fd.append('insertedValue', insertedValue);
        fd.append('id', id);
        var groupGUID = $("#GroupGUID").val();
        fd.append('guid', groupGUID);
        $.ajax({
            type: "POST",
            url: '/Dashboard/SearchNewMembers',
            contentType: false,
            processData: false,
            data: fd,
            success: function (result) {
                if (insertedValue.length > 0) {
                    $("#SearchNewResultGroup").show();
                    if (result.list.length == 0) {
                        $("#SearchNewResultGroup").append("<li id='SearchItemGroup'><text style='margin:20px;color:white;'>Result Not Found</text></li>")

                    }
                    else {
                        for (var i = 0; i < result.list.length; i++) {
                            var name = result.list[i].name;
                            var contactID = result.list[i].id;
                            if (!IsExist(contactID)) {
                                $("#SearchNewResultGroup").append("<li id='SearchItemGroup' onclick='Chose2(\"" + name + "\"," + contactID + ")'   ><img id='MessageImage' src='" + result.list[i].profileImage + "'/><text id='SearchTxt' >" + name + "</text></li>")
                            }
                            else continue;
                        }
                    }
                }
                else {
                    $("#SearchNewResultGroup").hide();
                }
            }

        });
    }


}




$(window).click(function (e) {
    if (e.target.id != 'SearchResult' && e.target.id != 'Search') {
        $("#SearchResult").hide();
    }
    else {
        $("#SearchResult").show();
    }
});
function ViewConversation(guid, myID) {
    $("#MessagesList").empty();

    $("#GroupGUID").val(guid);
   
    $("#MessagesList").append(' <li id="BeginChat"></li>');
    var formData = new FormData();
    formData.append('guid', guid);
    $.ajax(
        {
            type: "POST",
            url: '/Dashboard/GetGroupInfo',
            contentType: false,
            processData: false,
            data: formData,
            success: function (result) {

                ChangeHeader(result.name, result.image, result.membersCount,result.guid);
                FillMessages(result.guid, myID);
            }
            , error: function (xhr) {
                alert(xhr.responseText);
            }

        }
    );

}

function ChangeHeader(name, image, membersCount,guid) {

    $("#StatueCircle").hide();
    $("#StatueCircle2").hide();
  
    $("#Statue2").html(membersCount + " Members");
   
    $("#DDLChatItem[name='BlockLink']").replaceWith('<a id="DDLChatItem" name="LeaveLink" href="#">  <span class="fa fa-sign-out-alt IconsChat"></span>&nbsp;&nbsp;<label id="UserSettings">Leave</label></a>');
    $("#DeleteLink").show();

    $("#AddMember").show();
    $("#CurrentChatName").html(name);
    $("#CurrentChatName2").html(name);
    $("#DDLUserItem").hide();
    $("#DDLUserItem[name='hide']").hide();
    $("#LocationIcon").hide();
    $("#CurrentChatImage").attr({ "src": image });
    $("#CurrentChatImage2").attr({ "src": image });
    $("#CurrentChatImage2").click(function () {

        GroupImage(guid);
    });
}

function FillMessages(guid, myID) {
    var formData = new FormData();
    formData.append('guid', guid);
    formData.append('myID', myID);

    $.ajax(
        {
            type: "POST",
            url: '/Dashboard/GetGroupConversation',
            contentType: false,
            processData: false,
            data: formData,
            success: function (result) {
                $("#LunchDiv").hide();
                $("#ChatDiv").show(); $("#BeginChat").remove(); $("#BigImage").remove();
                $("#CurrentChatHeader").show();
                $("#CurrentChatFooter").show();
                if (result.messages.length == 0) {
                    $("#MessagesList").append('<li id="BeginChat">' + 'Begin a Conversation' + '</li><br><br><span id="BigImage" class="fa fa-comments" style="font-size:150px;margin-left:40%;color:white"></span>');
                }
                else {

                    for (var i = 0; i < result.messages.length; i++) {

                        if (result.messages[i].fromID == myID) {
                            $("#MessagesList").append(
                                '<li id="FromMe"><div data-offset="' + result.messages[i].id + '" id="DDLMsgBars"> <a id = "DDLMsgItem" href = "#" > <span id="DDLIcons" class="fa fa-copy"></span> Copy</a><a id="DDLMsgItem" href="#"><span id="DDLIcons" class="fa fa-save"></span> Save</a><a id="DDLMsgItem" href="#"><span id="DDLIcons" class="fa fa-forward"></span> Forward</a><a id="DDLMsgItem" href="#"><span id="DDLIcons" class="fa fa-trash"></span> Delete</a></div ><span id="MessageBars" onclick="ShowMenu(' + result.messages[i].id + ')"  class="fa fa-ellipsis-v" ></span><label id="MessageFromMe"><label>  ' + result.messages[i].body + '</label><br /><span id="ClockIcon" class="fa fa-clock"></span><label id="Time"> ' + result.messages[i].date + '</label></label><img id="MessageImage" src="' + result.myImage + '" /></li >'
                            );
                        }
                        else {

                            GetImage(result.messages[i].fromID, result.messages[i].body, result.messages[i].date,result.messages[i].id );
                            
                         
                        }
                    }
                }
            }
            , error: function (xhr) {
                alert(xhr.responseText);
            }

        }
    );
    $("#GroupMembers").empty();
    GetMembers(guid,myID);
}
function GetMembers(guid,myID)
{
    $("#GroupMembers").show();
    var fd = new FormData();
    fd.append('guid', guid);
    $.ajax({
        type: "POST",
        url: '/Dashboard/GetMembers',
        contentType: false,
        processData: false,
        data: fd,
        success: function (result) {
            for (var i = 0; i < result.members.length; i++) {
                var image = result.members[i].profileImage;
                var name = result.members[i].name;
                var memberID = result.members[i].id;
                if (memberID != myID) {
                    $("#GroupMembers").append(
                        '<li name="MemberLi" id="MembersItem"><img   id="MemberImage" src="' + image + '" /> <label id="MemberName">' + name + '<span  onclick="DeleteMember(' + memberID + ',\'' + name + '\',\'' + guid + '\')"  id="DeleteMember" class="fa fa-times"></span> </label></li>'
                    );
                }
            }
        }
    });
}
function GroupImage(guid) {
  
    $("#GroupImageGuid").val(guid);
    $("#GroupImageModal").modal();
}
function DeleteMember(memberID,name,guid)
{
    $("#exampleModalLongTitle[name='DeleteNameHeader']").html('Deleting ' + name);
    $("#MemberIDToDelete").val(memberID);
    $("#MemberIDToDeleteGuid").val(guid);
    $("#DeleteMemberModal").modal();
}
function GetImage(senderID, msg, date, msgID)
{
 
    var fd = new FormData();
    fd.append('id', senderID);
    $.ajax({
        type: "POST",
        url: '/Dashboard/GetImage',
        contentType: false,
        processData: false,
        data: fd,
        success: function (result) {

            $("#MessagesList").append(

                '<li id="ToMe"><img id="MessageImage" src="' + result.image + '" /><label id="MessageToMe"><label>  ' + msg + '</label><br /><span id="ClockIcon" class="fa fa-clock"></span><label id="Time"> ' + date + '</label></label><span id="MessageBars2" data-offset="' + msgID + '" onclick="ShowMenu(' + msgID + ')"  class="fa fa-ellipsis-v" ></span><div data-offset="' + msgID + '" id="DDLMsgBars2"> <a id = "DDLMsgItem" href = "#" > <span id="DDLIcons" class="fa fa-copy"></span> Copy</a><a id="DDLMsgItem" href="#"><span id="DDLIcons" class="fa fa-save"></span> Save</a><a id="DDLMsgItem" href="#"><span id="DDLIcons" class="fa fa-forward"></span> Forward</a><a id="DDLMsgItem" href="#"><span id="DDLIcons" class="fa fa-trash"></span> Delete</a></div ></li > '
            );
        }
    });

}
function IsExist(contactID)
{
    var isExist = false;
    $("#ChosenMembers").find("li").each(function () {
        if (this.id == contactID) isExist = true;
    });
    return isExist;
}
function Chose(name, id) {
   
    $("#ChosenMembers").append("<li id='"+id+"' class='ChosenMember'><span id='X' onclick='Unchose("+id+")' class='fa fa-times'></span><label id='ChosenName'>"+name+"</label></li>");

    $("#SearchResultGroup").hide();
    
}
function Chose2(name, id) {
    $("#ChosenNewMembers").append("<li id='" + id + "' class='ChosenMember'><span id='X' onclick='Unchose(" + id + ")' class='fa fa-times'></span><label id='ChosenName'>" + name + "</label></li>");

   
    $("#SearchNewResultGroup").hide();
}
function Unchose(id) {
    $("#" + id).remove();
}
function AddGroup(myID) {
    var groupName = $("#GroupName").val();
    if (groupName.length == 0)
    {
        $("#GroupError").html("Please insert the group name");
    }
    else
    {
        $("#GroupError").html("");   
        var itemsCount = document.getElementById("ChosenMembers").childElementCount;       
        if (itemsCount<=1) { $("#GroupError").html("Choose at least two members"); }
        else
        {
            var fd = new FormData();
            fd.append('groupName', groupName);
            fd.append('myID', myID);
            var listOfIDs = [];
            $("#ChosenMembers").find("li").each(function () {
                listOfIDs.push(this.id);
            });
            fd.append('listOfIDs', JSON.stringify(listOfIDs));
            $.ajax({
                type: "POST",
                url: '/Dashboard/AddGroup',
                contentType: false,
                processData: false,
                data: fd,
                success: function (result) {
                    $("#Dismiss").click();
                    $("#ContactsList").append('<li id="ContactsItem"> <div id="ContactsImageDiv"><img id="ContactsImage" src="/Images/user.png" /></div><div id="NameAndMsg"><label id="ContactsName">' + groupName + '</label><br /><label id="LastMsgName">Start Conversation</label></div><div id="LastMsgDateDiv"><label id="LastMsgDate">~</label></div></li>');
                },
                error: function () {
                    console.log("Something went wrong");
                }
            });
          
        }
    }
}

function AddMember(myID) {

    var groupGUID = $("#GroupGUID").val();
  
        $("#GroupError2").html("");
        var itemsCount = document.getElementById("ChosenNewMembers").childElementCount;
        if (itemsCount < 1) { $("#GroupError2").html("Choose at least one members"); }
        else {
            var fd = new FormData();
            fd.append('guid', groupGUID);
            fd.append('myID', myID);
            var listOfIDs = [];
            $("#ChosenNewMembers").find("li").each(function () {
                listOfIDs.push(this.id);
            });
            fd.append('listOfIDs', JSON.stringify(listOfIDs));
            $.ajax({
                type: "POST",
                url: '/Dashboard/AddMembers',
                contentType: false,
                processData: false,
                data: fd,
                success: function (result) {
                    $("#Dismiss2").click();
                },
                error: function () {
                    console.log("Something went wrong");
                }
            });

        }
    
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