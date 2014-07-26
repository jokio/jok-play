
module JK {

    export class Config {
        public static apiUrl = 'http://api.jok.io';
        public static exitUrl = 'http://jok.io';
        public static isSoundEffectsAllowed = true;

        public static init() {
            Config.isSoundEffectsAllowed = ($.cookie('SoundEffectsEnabled') != '0');
        }

        public static getCookieDomain() {
            var host = window.location.hostname;

            var firstIndex = host.indexOf('.');
            var lastIndex = host.lastIndexOf('.');

            return (firstIndex != lastIndex) ? host.substring(firstIndex) : (lastIndex > -1 ? '.' + host : '');
        }
    }

}