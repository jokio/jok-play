var JK;
(function (JK) {
    var Config = (function () {
        function Config() {
        }
        Config.init = function () {
            Config.isSoundEffectsAllowed = ($.cookie('SoundEffectsEnabled') != '0');
        };

        Config.getCookieDomain = function () {
            var host = window.location.hostname;

            var firstIndex = host.indexOf('.');
            var lastIndex = host.lastIndexOf('.');

            return (firstIndex != lastIndex) ? host.substring(firstIndex) : (lastIndex > -1 ? '.' + host : '');
        };
        Config.apiUrl = 'http://api.jok.io';
        Config.exitUrl = 'http://jok.io';
        Config.isSoundEffectsAllowed = true;
        return Config;
    })();
    JK.Config = Config;
})(JK || (JK = {}));
//# sourceMappingURL=JK.Config.js.map
