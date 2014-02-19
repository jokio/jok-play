/// <reference path="jk.config.ts" />

module JK {

    var playersCache;


    export function api(action, cb) {

        if ($.cookie('sid'))
            action += ((action.indexOf('?') > -1) ? '&' : '?') + 'sid=' + $.cookie('sid');


        $.ajax({
            url: [JK.Config.apiUrl, action].join(''),
            type: 'GET',
            dataType: 'json',
            success: function (result) {
                if (!cb) return;
                cb(result);
            },
            error: function () {
                if (!cb) return;
                cb(false);
            }
        });
    }

    export function getPlayer(userid: number, cb) {

        var cachedPlayer = playersCache[userid];
        if (cachedPlayer) {
            if (cb) cb(cachedPlayer);
            return;
        }

        JK.api('user/info/' + userid + '?gameid=12', function (result) {
            if (!result.IsSuccess) {
                if (cb) cb({});
                return;
            }

            playersCache[userid] = result;

            if (cb) cb(result);
        });
    }
}