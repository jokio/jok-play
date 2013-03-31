using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Jok.Play.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            var version = "0.1";

            return Json(new
            {
                Name = "Jok.Play",
                Version = version,
                Description = "Plugin for Realtime multiplayer games.",
                Repo = "https://github.com/playerx/jok-play",
                Latest = new
                {
                    js = Request.Url.AbsoluteUri + "js",
                    css = Request.Url.AbsoluteUri + "css"
                }
            }, JsonRequestBehavior.AllowGet);
        }
    }
}
