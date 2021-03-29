using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace DAL
{
   public class Users
    {
        [Key]
        public int ID { set; get; }
        public string Name { set; get; }
        public string Email { set; get; }
        public string Phone { set; get; }
        public string Password { set; get; }
        public string Location { set; get; }
        public string Bio { set; get; }
        public string ProfileImage { set; get; }
        public int Status { set; get; }

    }
}
