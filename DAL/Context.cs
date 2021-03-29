using Microsoft.EntityFrameworkCore;

using System;
using System.Collections.Generic;
using System.Text;

namespace DAL
{
   public class Context:DbContext
    {
        public Context()
        {
        }

        public Context(DbContextOptions<Context> options):base(options)
        {
          
        }
        public virtual DbSet<Users> Users { set; get; }
        public virtual DbSet<Messages> Messages { set; get; }
        public virtual DbSet<Groups> Groups { set; get; }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
         
                optionsBuilder.UseSqlServer("Server=DESKTOP-EQD3NLB;Database=Chat;Integrated Security=SSPI;");

            }
        }
    }
}
