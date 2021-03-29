using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using BAL;
namespace StudentPortal.Controllers
{
    public class RegController : Controller
    {
        Registration registration;
       public RegController()
        {
            ViewBag.ErrorMessage = string.Empty;
            registration = new Registration();
        }
        [HttpGet]
        public IActionResult SignIn()
        {
            return View();
        }
        [HttpGet]
        public IActionResult Success()
        {
            return View();
        }
        [HttpPost]
        public IActionResult SignIn(string email,string password)
        {
            if (registration.VerifyUser(email, password))
            {
                return RedirectToAction("Profile", "Dashboard",new {id= registration.GetUserID(email) });
            }
            else 
            {
                ViewBag.ErrorMessage = "Incorrect Password or Email";
                return View();
            }
        }
      
        [HttpGet]
        public IActionResult SignUp()
        {
            return View();
        }
        [HttpPost]
        public IActionResult SignUp(string email,string fullname,string password)
        {
            try
            {
                registration.AddNewUser(email, fullname, password);
                return View("Success");
            }
            catch
            {
                ViewBag.Remote = "Email is already used";
                return View();
            }
            
           
        }
    }
}
