/// <reference path="jk.config.ts" />
var JK;
(function (JK) {
    var playersCache;

    function api(action, cb) {
        if ($.cookie('sid'))
            action += ((action.indexOf('?') > -1) ? '&' : '?') + 'sid=' + $.cookie('sid');

        $.ajax({
            url: [JK.Config.apiUrl, action].join(''),
            type: 'GET',
            dataType: 'json',
            success: function (result) {
                if (!cb)
                    return;
                cb(result);
            },
            error: function () {
                if (!cb)
                    return;
                cb(false);
            }
        });
    }
    JK.api = api;

    function getPlayer(userid, cb) {
        var cachedPlayer = playersCache[userid];
        if (cachedPlayer) {
            if (cb)
                cb(cachedPlayer);
            return;
        }

        JK.api('user/info/' + userid + '?gameid=12', function (result) {
            if (!result.IsSuccess) {
                if (cb)
                    cb({});
                return;
            }

            playersCache[userid] = result;

            if (cb)
                cb(result);
        });
    }
    JK.getPlayer = getPlayer;
})(JK || (JK = {}));
//# sourceMappingURL=JK.js.map
