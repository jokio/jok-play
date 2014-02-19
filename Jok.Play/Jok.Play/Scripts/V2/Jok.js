Jok.getCookieDomain = function () {
    var host = window.location.hostname;

    var firstIndex = host.indexOf('.');
    var lastIndex = host.lastIndexOf('.');

    return (firstIndex != lastIndex) ? host.substring(firstIndex) : (lastIndex > -1 ? '.' + host : '');
}