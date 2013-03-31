using System.Web;
using System.Web.Optimization;

namespace Jok.Play
{
    public class BundleConfig
    {
        // For more information on Bundling, visit http://go.microsoft.com/fwlink/?LinkId=254725
        public static void RegisterBundles(BundleCollection bundles)
        {
            // Play
            bundles.Add(new ScriptBundle("~/js").Include(
                        "~/scripts/jquery-{version}.js",
                        "~/scripts/jquery.cookie.js",
                        "~/scripts/jquery-ui-{version}.js",
                        "~/scripts/jquery.signalR-1.0.0-rc2.js",
                        "~/scripts/createjs.preloadjs-0.2.0.js",
                        "~/scripts/createjs.soundjs-0.3.0.js",
                        "~/scripts/play/jok.js",
                        "~/scripts/jok.socket.io.js",
                        "~/scripts/FM/mediaelement.js",
                        "~/scripts/FM/jok.audio.js",
                        "~/scripts/FM/plugin.js",
                        "~/scripts/jok.ui-builder.js",
                        "~/scripts/play/jok.api.js",
                        "~/scripts/play/jok.chat.js",
                        "~/scripts/play/jok.audio.js",
                        "~/scripts/play/loader.js"
            ));

            bundles.Add(new StyleBundle("~/css").Include(
                        "~/styles/common.css",
                        "~/styles/loader.css",
                        "~/styles/players.css",
                        "~/styles/notifications.css",
                        "~/styles/addins.css",
                        "~/styles/addins/chat.css",
                        "~/styles/addins/fullscreen.css",
                        "~/styles/addins/emotions.css",
                        "~/styles/rightDoc.css",
                        "~/styles/game.css",
                        "~/styles/fm.css"
                        //"http://jok.ge/styles/jok.buttons.css"
            ));








            //bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
            //            "~/Scripts/jquery-{version}.js"));

            //bundles.Add(new ScriptBundle("~/bundles/jqueryui").Include(
            //            "~/Scripts/jquery-ui-{version}.js"));

            //bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
            //            "~/Scripts/jquery.unobtrusive*",
            //            "~/Scripts/jquery.validate*"));

            //// Use the development version of Modernizr to develop with and learn from. Then, when you're
            //// ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            //bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
            //            "~/Scripts/modernizr-*"));

            //bundles.Add(new StyleBundle("~/Content/css").Include("~/Content/site.css"));

            //bundles.Add(new StyleBundle("~/Content/themes/base/css").Include(
            //            "~/Content/themes/base/jquery.ui.core.css",
            //            "~/Content/themes/base/jquery.ui.resizable.css",
            //            "~/Content/themes/base/jquery.ui.selectable.css",
            //            "~/Content/themes/base/jquery.ui.accordion.css",
            //            "~/Content/themes/base/jquery.ui.autocomplete.css",
            //            "~/Content/themes/base/jquery.ui.button.css",
            //            "~/Content/themes/base/jquery.ui.dialog.css",
            //            "~/Content/themes/base/jquery.ui.slider.css",
            //            "~/Content/themes/base/jquery.ui.tabs.css",
            //            "~/Content/themes/base/jquery.ui.datepicker.css",
            //            "~/Content/themes/base/jquery.ui.progressbar.css",
            //            "~/Content/themes/base/jquery.ui.theme.css"));

        }
    }
}