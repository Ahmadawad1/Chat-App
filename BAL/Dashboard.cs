using DAL;
using Nancy.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace BAL
{
  public  class Dashboard
    {
        Context context;
        public Dashboard()
        {
            context = new Context();

        }
        public Users GetUserInfo(int id)
        {
            return context.Users.SingleOrDefault(x=>x.ID==id);
        }
        public Groups GetGroupInfo(string guid)
        {
            return context.Groups.FirstOrDefault(x=>x.GroupGUID==guid);
        }
        public int GetMembersCount(string guid)
        {
            return context.Groups.Where(x => x.GroupGUID == guid).Count();
        }
        public void DeleteMember(int id, string guid)
        {
            var member = context.Groups.Single(x=>x.MemberID==id && x.GroupGUID==guid);
            context.Groups.Remove(member);
            context.SaveChanges();
        }
        public string AddGroup(string groupName, int myID, string []listOfIDs)
        {
            try
            {
                string guid = Guid.NewGuid().ToString();
                JavaScriptSerializer ser = new JavaScriptSerializer();

                var ids = ser.Deserialize<List<string>>(listOfIDs[0]);
                ids.Add(myID.ToString());
                for (int i = 0; i < ids.Count; i++)
                {
                    Groups group = new Groups();
                    group.Name = groupName;
                    group.GroupGUID = guid;
                    group.MemberID = Convert.ToInt32(ids[i]);
                    group.GroupImage = "/Images/user.png";
                    context.Groups.Add(group);
                   
                }

                context.SaveChanges();
                return "Group was added";
            }
            catch(Exception ex)
            {
                return ex.Message;
            }

        }
        public string AddMembers(string guid, int myID, string[] listOfIDs)
        {
            try
            {
              
                JavaScriptSerializer ser = new JavaScriptSerializer();

                var ids = ser.Deserialize<List<string>>(listOfIDs[0]);
               
                for (int i = 0; i < ids.Count; i++)
                {
                    Groups group = new Groups();
                    group.Name =context.Groups.First(x=>x.GroupGUID==guid).Name;
                    group.GroupGUID = guid;
                    group.MemberID = Convert.ToInt32(ids[i]);
                    group.GroupImage = "/Images/user.png";
                    context.Groups.Add(group);

                }

                context.SaveChanges();
                return "Member was Added";
            }
            catch (Exception ex)
            {
                return ex.Message;
            }

        }
        public void ChangeGroupImage(string path, string guid)
        {
         var li=   context.Groups.Where(x => x.GroupGUID == guid).ToList();
            foreach (var i in li)
            {
                i.GroupImage = path;
            }
            context.SaveChanges();
        }
        public void ChangeImage(string path, int id)
        {
              context.Users.Single(x => x.ID==id).ProfileImage = path;
            context.SaveChanges();
        }
        public List<Users> GetSearchResult(string insertedValue,int id)
        {
            return context.Users.Where(x => x.Name.Contains(insertedValue) && x.ID!=id).ToList();
        }

        public List<Users> GetSearchNewResult(string insertedValue, int id,string guid)
        {
            var groupMembers = context.Groups.Where(x=>x.GroupGUID==guid).ToList();
            List<Users> users = new List<Users>();
            List<int> membersIDs = new List<int>();
            foreach(var i in groupMembers)
            {
                membersIDs.Add(i.MemberID);
            }
            return context.Users.Where(x => x.Name.Contains(insertedValue) && x.ID != id && !membersIDs.Contains(x.ID)).ToList();
        }
        public List<Groups> GetSearchGroupsResult(string insertedValue, int id)
        {
            return context.Groups.Where(x => x.Name.Contains(insertedValue) && x.MemberID == id).ToList();
        }
        public string SaveChanges(string username,string email,string location,string phone,string bio,string statue,int id)
        {
            var user = context.Users.SingleOrDefault(x => x.ID ==id);
            if ((context.Users.SingleOrDefault(x => x.Email== email && x.ID != id) ==null))
            {
                user.Name = username;
                user.Email = email;
                user.Bio = bio;
                user.Location = location;
                user.Phone = phone;

                if (statue == "Active") user.Status = 0;
                else user.Status = 1;
                context.SaveChanges();
                return "OK";
            }
            else
            {
                return "Email is already used";
            }
        }
        public List<Users> GetRandomContacts(int id)
        {
            var rand = new Random();
            List<Users> randomContacts = new List<Users>();
            int counter = 0;
           while(true)
            {
            int randomID = rand.Next(1, 101);
                if (randomID != id && context.Users.Any(x=>x.ID==randomID))
                {
                    var randomUser = context.Users.SingleOrDefault(x => x.ID == randomID);
                    if (randomContacts.Contains(randomUser))
                    {
                   
                    }
                    else
                    {
                        randomContacts.Add(randomUser);
                        counter++;
                    }
                }
                if (counter == 4) break;
            }
            return randomContacts;

        }
        public List<LastMessageInfoGroup> GetLastMessagesInGroups(int id)
        {
            List<LastMessageInfoGroup> li = new List<LastMessageInfoGroup>();
           var groups= context.Groups.Where(x => x.MemberID == id).ToList();
            foreach (var i in groups)
            {
                LastMessageInfoGroup lmi = new LastMessageInfoGroup();
                lmi.GUID = i.GroupGUID;
                lmi.Msg = GetLMGroup(i.GroupGUID,"Body");
                lmi.Date = Convert.ToDateTime(GetLMGroup(i.GroupGUID,"Date")).ToString("HH:mm");
                li.Add(lmi);
            }
            return li;

        }
        public string GetLMGroup(string groupGUID,string required)
        {
            try
            {
                if (required == "Body")
                {
                    List<Messages> li = new List<Messages>();
                    li = context.Messages.Where(x => x.GroupGUID == groupGUID).ToList();
                    li.Sort((m1, m2) => DateTime.Compare(Convert.ToDateTime(m1.Date), Convert.ToDateTime(m2.Date)));
                    return li.Last().Body;
                }
                else if (required == "Date")
                {
                    List<Messages> li = new List<Messages>();
                    li = context.Messages.Where(x => x.GroupGUID == groupGUID).ToList();
                    li.Sort((m1, m2) => DateTime.Compare(Convert.ToDateTime(m1.Date), Convert.ToDateTime(m2.Date)));
                    return li.Last().Date;
                }
                else
                {
                    return null;
                }
            }
            catch (Exception ex)
            {
                return null;
            }
        }
            public List<LastMessageInfo> GetLastMessages(int id)
        {
            List<LastMessageInfo> li = new List<LastMessageInfo>();
            List<int> ids = new List<int>();
            var msg = context.Messages.Where(x => x.ToID == id).ToList();
            foreach (var i in msg)
            {
                if (ids.Contains(i.FromID)) continue;
                ids.Add(i.FromID);
            }
            var m = context.Messages.Where(x => x.FromID == id).ToList();
            foreach (var i in m)
            {
                if (ids.Contains(i.ToID)) continue;
                ids.Add(i.ToID);
            }  
            foreach (var i in ids)
            {
                LastMessageInfo lmi = new LastMessageInfo();
                lmi.ID = i;
                lmi.Msg = GetLM(i, id);
                lmi.Date = Convert.ToDateTime(GetLMDate(i,id)).ToString("HH:mm");
               li.Add(lmi);
            }
           
            return li;
        }
        public string GetLM(int contactID,int myID)
        {
            List<Messages> li = new List<Messages>();
            var to_me = context.Messages.Where(x => x.ToID == myID && x.FromID == contactID).ToList();
            var from_me = context.Messages.Where(x => x.FromID == myID && x.ToID == contactID).ToList();
            foreach (var i in to_me)
            {
                Messages message = new Messages();

                message.Body = i.Body;
                message.Date = i.Date;
                message.FromID = contactID;
                message.ToID = myID;
                li.Add(message);
            }
            foreach (var i in from_me)
            {
                Messages message = new Messages();

                message.Body = i.Body;
                message.Date = i.Date;
                message.FromID = myID;
                message.ToID = contactID;
                li.Add(message);
            }
           li.Sort((m1, m2) => DateTime.Compare(Convert.ToDateTime(m1.Date), Convert.ToDateTime(m2.Date)));
            return li.Last().Body;
        }
     
        public string GetLMDate(int contactID, int myID)
        {
            List<Messages> li = new List<Messages>();
            var to_me = context.Messages.Where(x => x.ToID == myID && x.FromID == contactID).ToList();
            var from_me = context.Messages.Where(x => x.FromID == myID && x.ToID == contactID).ToList();
            foreach (var i in to_me)
            {
                Messages message = new Messages();

                message.Body = i.Body;
                message.Date = i.Date;
                message.FromID = contactID;
                message.ToID = myID;
                li.Add(message);
            }
            foreach (var i in from_me)
            {
                Messages message = new Messages();

                message.Body = i.Body;
                message.Date = i.Date;
                message.FromID = myID;
                message.ToID = contactID;
                li.Add(message);
            }
            li.Sort((m1, m2) => DateTime.Compare(Convert.ToDateTime(m1.Date), Convert.ToDateTime(m2.Date)));
            return li.Last().Date;
        }
        public List<Users> GetContacts(int id)
        {
            List<int> ids = new List<int>();
            var msg = context.Messages.Where(x => x.ToID == id).ToList();
            foreach (var i in msg)
            {
                if (ids.Contains(i.FromID)) continue;
                ids.Add(i.FromID);
            }
            var m = context.Messages.Where(x => x.FromID == id).ToList();
            foreach (var i in m)
            {
                if (ids.Contains(i.ToID)) continue;
                ids.Add(i.ToID);
            }
            List<Users> users = new List<Users>();
            foreach (var i in ids)
            {
                users.Add(context.Users.SingleOrDefault(X => X.ID == i));
            }
            return users;
        }
        public List<Groups> GetGroups(int id)
        {

            return context.Groups.Where(x=>x.MemberID==id).ToList();
        }
        public string GetImage(int id)
        {

            return context.Users.Single(x => x.ID == id).ProfileImage;
        }
        public List<Users> GetMembers(string guid)
        {
            List<Users> users = new List<Users>();

            var groups = context.Groups.Where(x => x.GroupGUID == guid).ToList() ;
            foreach(var i in groups)
            {
                users.Add(context.Users.Single(x => x.ID == i.MemberID));
            }
            return users;
        }
        public Conversation GetConversation(int myID, int contactID)
        {
            List<Messages> li = new List<Messages>();
            var to_me = context.Messages.Where(x => x.ToID == myID && x.FromID == contactID).ToList();
            var from_me = context.Messages.Where(x => x.FromID == myID && x.ToID == contactID).ToList();
            foreach (var i in to_me)
            {
                Messages message = new Messages();
                message.ID = i.ID;
                message.Body = i.Body;
                message.Date = i.Date;
                message.FromID = contactID;
                message.ToID = myID;
                li.Add(message);
            }
            foreach (var i in from_me)
            {
                Messages message = new Messages();
                message.ID = i.ID;
                message.Body = i.Body;
                message.Date = i.Date;
                message.FromID = myID;
                message.ToID = contactID;
                li.Add(message);
            }
            Conversation conversation = new Conversation();
           

                conversation.Messages = li;

           conversation.Messages.Sort((m1, m2) => DateTime.Compare(Convert.ToDateTime(m1.Date), Convert.ToDateTime(m2.Date)));
            foreach (var i in li)
            {

                i.Date = Convert.ToDateTime(i.Date).ToString("HH:mm");            }
            conversation.Contact = context.Users.Single(x => x.ID == contactID);
            conversation.MyImage = context.Users.Single(x => x.ID == myID).ProfileImage;
            return conversation;
        }
        public Conversation GetGroupConversation(string guid, int myID)
        {
            List<Messages> li = new List<Messages>();
            var to_me = context.Messages.Where(x => x.GroupGUID == guid && x.FromID != myID).ToList();
            var from_me = context.Messages.Where(x => x.GroupGUID == guid && x.FromID == myID).ToList();
            foreach (var i in to_me)
            {
                Messages message = new Messages();
                message.ID = i.ID;
                message.Body = i.Body;
                message.Date = i.Date;
                message.FromID = i.FromID;
                message.ToID = myID;
                li.Add(message);
            }
            foreach (var i in from_me)
            {
                Messages message = new Messages();
                message.ID = i.ID;
                message.Body = i.Body;
                message.Date = i.Date;
                message.FromID = myID;
                message.ToID =i.ToID;
                li.Add(message);
            }
            Conversation conversation = new Conversation();

            conversation.Messages = li;
            conversation.Messages.Sort((m1, m2) => DateTime.Compare(Convert.ToDateTime(m1.Date), Convert.ToDateTime(m2.Date)));
            foreach (var i in li)
            {
                i.Date = Convert.ToDateTime(i.Date).ToString("HH:mm");
            }
          
            conversation.MyImage = context.Users.Single(x => x.ID == myID).ProfileImage;
            return conversation;
        }
    }
    public class Conversation
    {
        
        public Users Contact { set; get; }
        public List<Messages> Messages { set; get; }
        public string MyImage { set; get; }
    }
    public class LastMessageInfo
    {
        public int ID { set; get; }
        public string Msg { set; get; }
        public string Date { set; get; }

    }
    public class LastMessageInfoGroup
    {
        public string GUID { set; get; }
        public string Msg { set; get; }
        public string Date { set; get; }
    }
}
