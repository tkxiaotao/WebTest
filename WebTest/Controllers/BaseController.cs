using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace WebTest.Controllers
{
    public class BaseController : Controller
    {
        protected override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            base.OnActionExecuting(filterContext);
            var username=filterContext.HttpContext.Session["name"];
            if (username == null)
            {
                //如果没有登录，则跳至登陆页
                filterContext.Result = Redirect("/Login/Index");
            }
        }

    }
}
