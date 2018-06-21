using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebTest.Models;

namespace WebTest.Controllers
{
    public class LoginController : Controller
    {
        //
        // GET: /Login/
        YLMDBDBEntities db = new YLMDBDBEntities();

        
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult LoginInfo()
        {
            int str = 0;
            string uid = Request["UId"].ToString();
            string pwd = Request["Pwd"].ToString();
            if (string.IsNullOrEmpty(uid))
            {
                str = -1;
            }
            else if (string.IsNullOrEmpty(pwd))
            {
                str = 0;
            }
            else if (!string.IsNullOrEmpty(uid) && !string.IsNullOrEmpty(pwd))
            {
                try
                {
                    var model = db.User.Where(d => d.LoginName == uid && d.Password == pwd).SingleOrDefault();
                    Session["name"] = uid;
                    str = 1;
                }
                catch (Exception)
                {
                    str = 2;
                }
                
            }
            else
            {
                str = -2;
            }
            return Content(str.ToString());
        }

    }
}
