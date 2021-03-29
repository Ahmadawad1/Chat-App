using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;


namespace DAL
{
   public class Messages
    {
        [Key]
        public int ID { set; get; }
        public int FromID { set; get; }
        public int ToID { set; get; }
        public string GroupGUID { set; get; }
        public string Body { set; get; }
        public string ImageUrl { set; get; }
        public int GroupOrSingle { set; get; }
        public string Date { set; get; }
        public int  MessageType { set; get; }

    }
}
