using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace DAL
{

   public class Groups
    {
        [Key]
        public int ID { set; get; }
        public string Name { set; get; }
        public string GroupImage { set; get; }
       public string GroupGUID { set; get; }
        public int MemberID { set; get; }
    }
}
