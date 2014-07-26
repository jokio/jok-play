
Jok.Players = {};

Jok.SetPlayerPositionUI = function (position, resultsPosition, userid, clearResults, cb) {

    var p = $('#PositionSelection .player_position.player' + position);
    if (!p) return;

    if (!userid) {
        p.find('.used .avatar').attr('src', '');
        p.find('.used .nick').html('');
        p.removeClass('selected');

        if (clearResults)
            $('#RightPanel .results thead tr td:nth-child(' + (resultsPosition + 1) + ') div').html('');

        if (cb) cb({});

        return;
    }

    Jok.GetPlayer(userid, function (player) {
        if (!player.IsSuccess) {
            if (cb) cb({});
            return;
        }

        player.Position = resultsPosition;

        p.find('.used .avatar').attr('src', player.AvatarUrl);
        p.find('.used .nick').html(player.Nick);
        p.addClass('selected');

        $('#RightPanel .results thead tr td:nth-child(' + (resultsPosition + 1) + ') div').html(player.Nick);

        if (cb) cb(player);
    });
}

Jok.SetPlayerUI = function (userid, isOnline, position, virtualPosition) {

    var p = $('#PL' + virtualPosition);
    if (!p) return;

    if (!userid) {

        p.find('.mini_results').hide();
        p.find('.avatar').attr('src', '');
        p.find('.nick').html('');
        p.removeClass('active');
        p.removeClass('offline');

        $('#RightPanel .results thead tr td:nth-child(' + (position + 1) + ') div').html('');

        return;
    }


    $('#DownCubes .player' + virtualPosition).attr('data-pos', position);
    p.attr('data-pos', position);
    p.attr('data-userid', userid);
    p.find('.mini_results').show();
    p.find('.mini_results span').html('');


    Jok.GetPlayer(userid, function (player) {
        if (!player.IsSuccess) return;

        player.Position = position;

        if (isOnline)
            p.removeClass('offline');
        else
            p.addClass('offline');

        if (virtualPosition == 1)
            p.find('.nick').html('<span>' + player.Nick + '</span>');
        else
            p.find('.nick').html(player.Nick);


        p.find('.avatar').attr('src', player.AvatarUrl);

        $('#RightPanel .results thead tr td:nth-child(' + (position + 1) + ') div').html(player.Nick);
    });
}



Jok.GetPlayer = function (userid, cb) {

    var cachedPlayer = Jok.Players[userid];
    if (cachedPlayer) {
        if (cb) cb(cachedPlayer);
        return;
    }

    Jok.API('user/info/' + userid + '?gameid=12', function (result) {
        if (!result.IsSuccess) {
            if (cb) cb({});
            return;
        }

        Jok.Players[userid] = result;

        if (cb) cb(result);
    });
}