using DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;

namespace BAL
{
   public class Registration
    {
        Context context;
      public Registration()
        {
            context = new Context();
           
        }
        public bool VerifyUser(string email,string password)
        {
            if (context.Users.SingleOrDefault(x => x.Email == email) != null)
            {
                var user = context.Users.SingleOrDefault(x => x.Email == email);
                if (user.Password == HashPassword(password))
                {
                    return true;
                }
                else
                { 
                    return false; 
                }
            }
            else
            {
                return false;
            }
        }
        public int GetUserID(string email)
        {
            return context.Users.SingleOrDefault(x => x.Email == email).ID;
        }
        public void AddNewUser(string email,string name,string password)
        {
           
            Users user = new Users();
            user.Email = email.ToLower();
            user.Name = name;
            user.ProfileImage = "/Images/user.png";
            user.Phone = "No Phone Number";
            user.Location = "No Location";
            user.Bio = "No Bio";
            user.Password = HashPassword(password);
            user.Status = (int)Enum.Status.Active;
            context.Users.Add(user);
            context.SaveChanges();
        }
        public string HashPassword(string password)
        {
            MD5 md5 = new MD5CryptoServiceProvider();          
            md5.ComputeHash(ASCIIEncoding.ASCII.GetBytes(password));
            byte[] result = md5.Hash;
            StringBuilder strBuilder = new StringBuilder();
            for (int i = 0; i < result.Length; i++)
            {
                strBuilder.Append(result[i].ToString("x2"));
            }
            return strBuilder.ToString();
        }

    }
}
