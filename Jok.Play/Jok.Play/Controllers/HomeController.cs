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
                LatestJS = Request.Url.AbsoluteUri + "scripts/v" + version + ".js",
                LatestCSS = Request.Url.AbsoluteUri + "styles/v" + version + ".css"
            }, JsonRequestBehavior.AllowGet);
        }
    }
}
