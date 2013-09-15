var jok = jok || {};
var game = game || {};


(function () {

    var userAgent = navigator.userAgent.toLowerCase();
    var isMobileDevice = (userAgent.indexOf('iphone') > -1 || userAgent.indexOf('iphone') > -1 || userAgent.indexOf('iphone') > -1);

    jok.config = jok.config || {};

    var defaultConfig = {
        gameid: 0,
        channel: '',
        language: 'en_US',
        apiUrl: 'http://api.jok.ge/',
        pusherUrl: 'http://pusher.jok.io:80',
        smilesLocation: 'http://jok.ge/content/images/skype/',
        pluginUrl: 'http://play.jok.io',
        exitUrl: 'http://jok.ge',
        playUrl: window.location,
        authorizationUrl: 'http://jok.ge/joinus?returnUrl=' + window.location,
        isMobileDevice: isMobileDevice,
        checkFriendText: '[cmd:CheckFriendsStatus]',
        isVIPMember: false,
        buzzText: '[cmd:Buzz]',
        audios: '/audios'
    }

    for (prop in defaultConfig) {
        jok.config[prop] = jok.config[prop] || defaultConfig[prop];
    }

})();

var clickEvent = jok.config.isMobileDevice ? 'touchstart' : 'click';

jok.players = {};

jok.init = function () {

    var toggleFullScreen = function () {

        var isInFullScreen =
            (document.fullScreenElement && document.fullScreenElement !== null) ||    // alternative standard method  
            (document.mozFullScreen || document.webkitIsFullScreen);


        var el = document.documentElement
          , requestFullScreen = el.requestFullScreen
                             || el.webkitRequestFullScreen
                             || el.mozRequestFullScreen

          , exitFullScreen = document.cancelFullScreen
                          || document.webkitCancelFullScreen
                          || document.mozCancelFullScreen;


        if (!requestFullScreen || !exitFullScreen) return;

        if (!isInFullScreen)
            requestFullScreen.call(el);
        else
            exitFullScreen.call(document);
    }


    if ($.cookie('sidebar_open2') == '1') {
        $('#RightDoc').css('display', 'block');
        $('#RightDoc').css('right', '0px');
        $('#Root').css('right', '230px');
        $('body').css('margin-right', '230px');
    }

    $(document).on(clickEvent, '#RightDocOpener', function () {
        jok.openDockRight();
    });

    $(document).on(clickEvent, '#RightDocClose', function () {
        jok.closeDockRight();
    });

    $(document).on(clickEvent, '.player .rate .step1 button', function () {
        var userid = $(this).parent().parent().parent().parent().attr('data-userid');
        var rate = $(this).attr('data-value');
        var position = $(this).parent().parent().parent().attr('data-position');

        if (!userid || !rate) return;

        jok.rateUser(position, userid, rate);
    });

    $(document).on(clickEvent, '.player .rate .step2', function () {
        $(this).parent().hide('fast');
    });



    $(document).on(clickEvent, '#ExitButton', function () {
        window.location.assign(jok.config.exitUrl);
    });

    $(document).bind('touchmove', '#Root', function (e) {
        //e.preventDefault();
    });



    $(document).on(clickEvent, '.sendFriendRequestButton', function () {

        $(this).hide();

        var opponentUserID = $(this).attr('data-userid');
        if (!opponentUserID) return;

        jok.api.sendFriendRequest(opponentUserID);

        jok.chat.send(jok.texts.A026);
    });

    // addins
    $(document).on(clickEvent, '#FullScreen', toggleFullScreen);
    $(document).on(clickEvent, '#Addins > .item.full_screen', toggleFullScreen);

    $(document).on(clickEvent, '#Addins > .item > .bg', function () {
        $('#Addins > .item > #SmilesBox').toggle();
    });


    $(document).on(clickEvent, '.player .buzz', function () {
        jok.buzz();

        var _this = $(this);

        _this.hide();

        setTimeout(function () {
            _this.show();
        }, 30 * 1000);

        jok.chat.sendInternal(jok.config.buzzText);
        jok.chat.send('BUZZ!');
    });

    $(document).on(clickEvent, '#Notification .item.share_friends input', function () {
        $(this).select();
    });

    $('#Audios').append('<audio class="buzz" preload="auto"><source src="' + jok.config.pluginUrl + '/Content/Audios/buzz.mp3" /></audio>');


    if ($.cookie('isMusicPlaying') == '1') {
        $('.music_speakers').show();
    }


    jok.chat.init();
}

jok.getCookieDomain = function () {
    var firstIndex = window.location.host.indexOf('.');
    var lastIndex = window.location.host.lastIndexOf('.');
    var host = window.location.host;

    return (firstIndex != lastIndex) ? host.substring(firstIndex) : (lastIndex > -1 ? '.' + host : host);
}

jok.buzz = function () {
    $('#Game').effect('shake', { times: 3 }, 200);
    jok.audio.play('buzz');
}

jok.setPlayer = function (position, userid) {

    if (userid == null || userid == 0) {
        $('#Player' + position).hide();
        return;
    }

    jok.api.getUser(userid, function (isSuccess, user) {
        if (!isSuccess) return;

        jok.players[user.id] = user;

        var player = $('#Player' + position); // 1 or 2
        if (player.length == 0) return;

        player.find('.nick').html(user.nick);
        player.find('.avatar').attr('src', user.avatarUrl);
        player.show();

        player.attr('data-userid', user.id);

        if (user.id == jok.currentUserID) {
            jok.config.isVIP = user.isVIP;
            $('#SmilesBox .vip_smiles_container').attr('class', user.isVIP ? 'vip_smiles_container' : 'vip_smiles_container disabled');
            if (user.isVIP) {
                $('.player .buzz').show();
            }
            else {
                $('#Banner').show();
            }
        } else {
            jok.chat.check(user);

            if (user.isVIP) {
                player.find('.rate .step1 .fan').show();
            } else {
                player.find('.rate .step1 .fan').hide();
            }
        }

        var playerDetails = player.children('.details');
        if (playerDetails.length == 0) return;

        playerDetails.find('.info > .avatar').attr('src', user.avatarUrl);
        playerDetails.find('.info > .nick').html(user.nick);
        playerDetails.find('.stats .points .value').html(user.points);
        playerDetails.find('.stats .fans .value').html(user.fans);
        playerDetails.find('.stats .friends .value').html(user.friendsCount);

        if (user.isVIP)
            playerDetails.find('.stats .vip').show();
        else
            playerDetails.find('.stats .vip').hide();

        playerDetails.find('.actions > .sendFriendRequestButton').hide();
        playerDetails.find('.actions > .friend_status').html('');

        switch (user.friendStatus) {
            case 1:
                playerDetails.find('.actions > .friend_status').html('You are Friends');

                break;

            case 2:
                playerDetails.find('.actions > .sendFriendRequestButton').attr('data-userid', user.id);
                playerDetails.find('.actions > .sendFriendRequestButton').show();

                break;

            case 3:
                playerDetails.find('.actions > .friend_status').html('Waiting answer friend request');

                break;
        }
    });
}

jok.showUserRate = function (position) {
    $('#Player' + position + ' .rate .step1').show();
    $('#Player' + position + ' .rate .step2').hide();
    $('#Player' + position + ' .rate').attr('data-position', position);
    $('#Player' + position + ' .rate').show('fast');
}

jok.rateUser = function (position, userid, rate) {

    jok.api.rateUser(userid, jok.config.gameid, rate);

    $('#Player' + position + ' .rate .step1').hide();
    $('#Player' + position + ' .rate .step2').show();

    setTimeout(function () {
        $('#Player' + position + ' .rate').hide('fast');
    }, 4000);
}


jok.openDockRight = function () {
    $('#Root').animate({ right: 230 }, 'fast');
    $('body').animate({ marginRight: 230 }, 'fast');

    $('#RightDoc').css('display', 'block');
    $('#RightDoc').animate({ right: 0 }, 'fast');

    $.cookie('sidebar_open2', '1', { expires: 300, path: '/' });
}

jok.closeDockRight = function () {
    $('#Root').animate({ right: 0 }, 'normal');
    $('body').animate({ marginRight: 0 }, 'normal');

    $('#RightDoc').animate({ right: -230 }, 'normal', function () {
        $('#RightDoc').css('display', 'none');
    });

    $.cookie('sidebar_open2', '0', { expires: 300, path: '/' });
    $.removeCookie('sidebar_open2');
}

jok.currentUserID = undefined;