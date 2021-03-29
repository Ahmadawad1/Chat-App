using DAL;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StudentPortal.SignalR.Hubs
{
    public class ChatHub : Hub
    {
        Context context;
        public ChatHub()
        {
            context = new Context();
        }
       
        public async Task SendMessage(string myID,  string contactID, string msg)
        {
            SaveMesssage(Convert.ToInt32(myID), msg,contactID,true);
            await Clients.All.SendAsync("ReceiveMessage", myID, msg,GetImage(Convert.ToInt32(myID)));

        }
        public async Task SendMessageGroup(string myID, string groupGUID, string msg)
        {
            SaveMesssage(Convert.ToInt32(myID), msg, groupGUID,false);
            await Clients.All.SendAsync("ReceiveMessage", myID, msg, GetImage(Convert.ToInt32(myID)));

        }
        private string GetImage(int id)
        {
            return context.Users.Single(x => x.ID == id).ProfileImage;
        }
        private void SaveMesssage(int from, string msg, string to,bool isContact)
        {
            if (isContact)
            {
                Messages message = new Messages();
                message.FromID = from;
                message.ToID = Convert.ToInt32(to);
                message.GroupOrSingle = 0;
                message.MessageType = 0;
                message.Body = msg;
                message.Date = DateTime.Now.ToString();
                context.Messages.Add(message);
                context.SaveChanges();
            }
            else
            {
                Messages message = new Messages();
                message.FromID = from;
                message.ToID = 0;
                message.GroupOrSingle = 1;
                message.MessageType = 0;
                message.Body = msg;
                message.GroupGUID = to;
                message.Date = DateTime.Now.ToString();
                context.Messages.Add(message);
                context.SaveChanges();
            }
        }



    }
}
