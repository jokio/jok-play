﻿using System.Web;
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
                        "~/scripts/V2/json2.js",
                        "~/scripts/V2/jquery-{version}.js",
                        "~/scripts/V2/jquery.cookie.js",
                        "~/scripts/V2/jquery-ui.custom.js",
                        "~/scripts/V2/EventEmitter.js",
                        "~/scripts/V2/bootstrap.js",
                        "~/Scripts/V2/JP.js",
                        "~/Scripts/V2/JP.ML.js",
                        "~/Scripts/V2/JP.Chat.js",
                        "~/Scripts/V2/JP.Audio.js",
                        "~/scripts/V2/FM/mediaelement.js",
                        "~/scripts/V2/FM/plugin.js",
                        "~/scripts/V2/FastClick.js",
                        "~/scripts/V2/ZeroClipboard.js"
            ));
            
            bundles.Add(new StyleBundle("~/css/v2").Include(
                        "~/Content/V2/font-awesome.css",
                        "~/Content/V2/bootstrap.css",
                        "~/Content/V2/bootstrap.overrides.css",
                        "~/Content/V2/Jok.css",
                        "~/Content/V2/Jok.Player.css",
                        "~/Content/V2/Jok.Chat.css",
                        "~/Content/V2/Jok.Notifications.css",
                        "~/Content/V2/Jok.Cubes.css",
                        "~/Content/V2/Jok.Emotions.css",
                        "~/Content/V2/Jok.SmilesBox.css",
                        "~/Content/V2/Jok.MusicPlayer.css"
            ));
        }
    }
}