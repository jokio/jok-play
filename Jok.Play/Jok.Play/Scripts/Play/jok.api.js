
jok.api = {
    
    getUser: function (id, cb) {
        $.ajax({
            url: [jok.config.apiUrl, 'user/', id].join(''),
            type: 'GET',
            dataType: 'json',
            headers: {
                sid: $.cookie('sid')
            },
            success: function (user) {
                if (!cb) return;
                cb(true, user);
            },
            error: function () {
                if (!cb) return;
                cb(false);
            }
        });
    },

    sendFriendRequest: function (id) {
        $.ajax({
            url: [jok.config.apiUrl, 'user/', id, '/sendFriendRequest'].join(''),
            headers: {
                sid: $.cookie('sid')
            },
            type: 'GET',
            dataType: 'json'
        });
    },

    rateUser: function (id, gameid, rate) {
        $.ajax({
            url: [jok.config.apiUrl, 'user/', id, '/rate?gameid=', gameid, '&rate=', rate].join(''),
            headers: {
                sid: $.cookie('sid')
            },
            type: 'GET',
            dataType: 'json'
        });
    }
}
