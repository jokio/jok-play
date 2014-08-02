using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Optimization;

namespace Jok.Play.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            var version = "2.0.0";

            return Json(new
            {
                Name = "Jok.Play",
                Version = version,
                Description = "Plugin for Realtime multiplayer games.",
                Repo = "https://github.com/jokio/jok-play",
                Latest = new
                {
                    JS = Request.Url.ToString() + "js/v2",
                    CSS = Request.Url.ToString() + "css/v2"
                }
            }, JsonRequestBehavior.AllowGet);
        }

        [OutputCache(Duration = 0)]
        public ActionResult JS()
        {
            return Redirect(Request.Url.Scheme + "://" + Request.Url.Host + ":" + Request.Url.Port + Scripts.Url("~/bundles/js"));
        }

        [OutputCache(Duration = 0)]
        public ActionResult CSS()
        {
            return Redirect(Request.Url.Scheme + "://" + Request.Url.Host + ":" + Request.Url.Port + Styles.Url("~/bundles/css"));
        }

        public ActionResult Demo(string id = "V1")
        {
            if (id != "V1" && id != "V2")
                id = "V1";

            return View("Demo" + id);
        }


        public ActionResult Github(string visitUrl)
        {
            if (String.IsNullOrEmpty(visitUrl))
                visitUrl = "https://github.com/jokio/jok-play";

            ViewBag.VisitUrl = visitUrl;

            return View();
        }
    }
}
