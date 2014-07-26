
Jok.API = function(action, cb) {
    $.ajax({
        url: [Jok.Config.ApiUrl, action].join(''),
        type: 'GET',
        dataType: 'json',
        headers: {
            sid: $.cookie('sid')
        },
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