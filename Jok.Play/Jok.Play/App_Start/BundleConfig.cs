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
            bundles.Add(new ScriptBundle("~/bundles/js").Include(
                        "~/scripts/jquery-{version}.js",
                        "~/scripts/jquery.cookie.js",
                        "~/scripts/jquery-ui-{version}.js",
                        "~/scripts/jquery.signalR-1.0.1.js",
                        "~/scripts/createjs.preloadjs-0.2.0.js",
                        "~/scripts/createjs.soundjs-0.3.0.js",
                        "~/scripts/play/jok.js",
                        "~/scripts/jok.texts.js",
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

            bundles.Add(new StyleBundle("~/bundles/css").Include(
                        "~/styles/common.css",
                        "~/styles/buttons.css",
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
            ));


            // V1
            bundles.Add(new ScriptBundle("~/js/v1").Include(
                        "~/scripts/jquery-{version}.js",
                        "~/scripts/jquery.cookie.js",
                        "~/scripts/jquery-ui-{version}.js",
                        "~/scripts/jquery.signalR-1.0.1.js",
                        "~/scripts/createjs.preloadjs-0.2.0.js",
                        "~/scripts/createjs.soundjs-0.3.0.js",
                        "~/scripts/play/jok.js",
                        "~/scripts/jok.texts.js",
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

            bundles.Add(new StyleBundle("~/css/v1").Include(
                        "~/styles/common.css",
                        "~/styles/buttons.css",
                        "~/styles/loader.css",
                        "~/styles/players.css",
                        "~/styles/notifications.css",
                        "~/styles/addins.css",
                        "~/styles/addins/chat.css",
                        "~/styles/addins/fullscreen.css",
                        "~/styles/addins/emotions.css",
                        "~/styles/rightDoc.css",
                        "~/styles/game.css",
                        "~/styles/fm.css",
                        "~/Content/V1/_Defaults.Overrides.css"
            ));



            // V2
            bundles.Add(new ScriptBundle("~/js/v2").Include(
                        "~/Scripts/V2/JK.js",
                        "~/Scripts/V2/JK.Config.js",
                        "~/Scripts/V2/JK.UI.js",
                        "~/Scripts/V2/JK.Radio.js"
            ));

            bundles.Add(new StyleBundle("~/css/v2").Include(
                        "~/Content/V2/Jok.css",
                        "~/Content/V2/Jok.Notifications.css",
                        "~/Content/V2/Jok.Cubes.css",
                        "~/Content/V2/Jok.Emotions.css",
                        "~/Content/V2/Jok.SmilesBox.css",
                        "~/Content/V2/Jok.MusicPlayer.css"
            ));
        }
    }
}