using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using BAL;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace StudentPortal.Controllers
{
    public class DashboardController : Controller
    {
        Dashboard dashboard;
        private readonly IWebHostEnvironment webHostEnvironment;
        public DashboardController(IWebHostEnvironment hostEnvironment)
        {
            webHostEnvironment =hostEnvironment;
            dashboard = new Dashboard();
        }
        [HttpGet]
        public IActionResult Profile(int id)
        {
          
            ViewBag.UserInfo = dashboard.GetUserInfo(id);
            return View(dashboard.GetUserInfo(id));
        }
      
        [HttpPost]
        public IActionResult SaveChanges(int id)
        {
            
           ViewBag.ErrorInSaving= dashboard.SaveChanges(Request.Form["name"], Request.Form["email"], Request.Form["location"], Request.Form["phone"], Request.Form["bio"],Request.Form["Statue"] ,id);
            return RedirectToAction("Settings",new { id=id});
        }
        [HttpPost]
        public IActionResult ChangeImage(int id)
        {
            var image = Request.Form.Files["image"];

            dashboard.ChangeImage(GetPath(image), id);

            return RedirectToAction("Profile",new { id=id});
        }
        [HttpPost]
        public IActionResult ChangeGroupImage(string guid,int myID)
        {
            var image = Request.Form.Files["image"];

            dashboard.ChangeGroupImage(GetPath(image), guid);


            return RedirectToAction("Groups", new { id = myID });
        }
        [HttpPost]
        public IActionResult DeleteMember(int memberID,string memberGUID,int myID)
        {

            dashboard.DeleteMember(memberID,memberGUID);

            return RedirectToAction("Groups", new { id = myID });
        }
        [HttpPost]
        public JsonResult Search(string insertedValue,int id)
        {        
            return Json(new {list = dashboard.GetSearchResult(insertedValue, id)});
        }
        [HttpPost]
        public JsonResult SearchNewMembers(string insertedValue, int id,string guid)
        {
            return Json(new { list = dashboard.GetSearchNewResult(insertedValue, id,guid) });
        }
        [HttpPost]
        public JsonResult SearchGroups(string insertedValue, int id)
        {
            return Json(new { list = dashboard.GetSearchGroupsResult(insertedValue, id) });
        }
        [HttpPost]
        public JsonResult AddGroup(string groupName, int myID, string[] listOfIDs)
        {
            
                return Json(dashboard.AddGroup(groupName, myID, listOfIDs));


        }
        [HttpPost]
        public JsonResult AddMembers(string guid, int myID, string[] listOfIDs)
        {

            return Json(dashboard.AddMembers(guid, myID, listOfIDs));


        }
        public string GetPath(IFormFile image)
        {
            if (image == null) return null;
            else
            {
                string fileName = Path.GetFileName(image.FileName);
                string path = Path.Combine(webHostEnvironment.WebRootPath, "Images");
                string filePath = path + "\\" + fileName;
                using (FileStream output = System.IO.File.Create(filePath))
                {
                    image.CopyToAsync(output);
                }

                return "/Images/" + fileName;
            }
        }
        [HttpGet]
        public IActionResult Groups(int id)
        {
            ViewBag.GroupsList = dashboard.GetGroups(id);
            ViewBag.MyID = id; 
            ViewBag.LastMessagesGroups = dashboard.GetLastMessagesInGroups(id);
            ViewBag.UserInfo = dashboard.GetUserInfo(id);
            return View(dashboard.GetUserInfo(id));
        }
        [HttpGet]
        public IActionResult SignOut()
        {

            return RedirectToAction("SignIn", "Reg");
        }
        [HttpGet]
        public IActionResult Contacts(int id)
        {
            ViewBag.ContactList =dashboard.GetContacts(id);
            ViewBag.UserInfo = dashboard.GetUserInfo(id);
            ViewBag.RandomContacts = dashboard.GetRandomContacts(id);
            ViewBag.LastMessages = dashboard.GetLastMessages(id);
            ViewBag.MyID = id;
            return View(dashboard.GetUserInfo(id));
        }
        [HttpPost]
        public JsonResult GetContactInfo(int id)
        {
            var user = dashboard.GetUserInfo(id);

            return Json(new { id=user.ID,name = user.Name, statue = user.Status.ToString(), image = user.ProfileImage, bio = user.Bio,location=user.Location}) ;
        }
        [HttpPost]
        public JsonResult GetGroupInfo(string guid)
        {
            var group = dashboard.GetGroupInfo(guid);
            int members = dashboard.GetMembersCount(guid);
            return Json(new { guid = group.GroupGUID, name = group.Name, image = group.GroupImage,membersCount=members }) ;
        }
        [HttpPost]
        public JsonResult GetConversation(int id,int myID)
        {
            var conversation = dashboard.GetConversation(myID,id);

            return Json(new { messages=conversation.Messages, contact = conversation.Contact, myImage =conversation.MyImage });
        }
        [HttpPost]
        public JsonResult GetImage(int id)
        {


            return Json(new { image = dashboard.GetImage(id) }) ;
        }
        [HttpPost]
        public JsonResult GetMembers(string guid)
        {


            return Json(new { members = dashboard.GetMembers(guid) });
        }
        [HttpPost]
        public JsonResult GetGroupConversation(string guid, int myID)
        {
            var conversation = dashboard.GetGroupConversation(guid,myID);

            return Json(new { messages = conversation.Messages, myImage = conversation.MyImage });
        }
        [HttpGet]
        public IActionResult Settings(int id)
        {
            ViewBag.UserInfo = dashboard.GetUserInfo(id);
            return View(dashboard.GetUserInfo(id));
        }
    }
}
