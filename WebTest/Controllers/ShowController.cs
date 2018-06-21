using Newtonsoft.Json;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebTest.Common;
using WebTest.Models;

namespace WebTest.Controllers
{
    public class ShowController : BaseController
    {
        //
        // GET: /Show/
        YLMDBDBEntities db = new YLMDBDBEntities();

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Deviceid()
        {
            return View();
        }


        public ActionResult AddDeviceid(YLDeviceidData data)
        {
            ReturnResult result=new ReturnResult();
            YLDeviceidData model = new YLDeviceidData();
            model.Deviceid = data.Deviceid;
            model.DeviceidName = data.DeviceidName;
            model.AddTime = DateTime.Now.ToString("yyyy-MM-dd hh:mm:ss");
            try
            {
                db.YLDeviceidData.Add(model);
                db.SaveChanges();
                result.status = "200";
                result.msg = "成功！";
                result.data = "";
            }
            catch (Exception ex)
            {
                result.status = "2";
                result.msg = "失败！";
                result.data = "";
            }
            var json = JsonHelp.ObjectToString(result);
            return Content(json);
        }

        public ActionResult EditDeviceid(YLDeviceidData data)
        {
            ReturnResult result = new ReturnResult();
            var model = db.YLDeviceidData.Where(d=>d.Id==data.Id).SingleOrDefault();
            model.Deviceid = data.Deviceid;
            model.DeviceidName = data.DeviceidName;
            model.AddTime = DateTime.Now.ToString("yyyy-MM-dd hh:mm:ss");

            try
            {
                db.SaveChanges();
                result.status = "200";
                result.msg = "成功！";
                result.data = "";
            }
            catch (Exception)
            {
                result.status = "2";
                result.msg = "失败！";
                result.data = "";
            }
            var json = JsonHelp.ObjectToString(result);
            return Content(json);
        }


        public ActionResult GetDeviceidList()
        {
            Hashtable myResult = new Hashtable();
            int page = (Request["page"] + "") == "" ? 1 : Convert.ToInt32(Request["page"] + "");
            int rows = (Request["rows"] + "") == "" ? 10 : Convert.ToInt32(Request["rows"] + "");
            string strDeviceid = Request["Deviceid"] + "";
            string strDeviceidName = Request["DeviceidName"] + "";
            try
            {
                var list = db.YLDeviceidData.Where(d => 1 == 1);

                if (!string.IsNullOrEmpty(strDeviceid))
                {
                    list = list.Where(d => d.Deviceid.Contains(strDeviceid));
                }

                if (!string.IsNullOrEmpty(strDeviceidName))
                {
                    list = list.Where(d => d.DeviceidName.Contains(strDeviceidName));
                }

                var newdata = list.OrderByDescending(d => d.Id).Skip(rows * (page - 1)).Take(rows).ToList();
                int recordCount = newdata.Count();//记录数


                myResult.Add("rows", newdata);
                myResult.Add("total", recordCount);
            }
            catch (Exception)
            {
                myResult.Add("rows", "");
                myResult.Add("total", 0);
            }

            
            

            var json=JsonConvert.SerializeObject(myResult);
            return Content(json);
        }

    }
}
