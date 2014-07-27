var JP = window["JP"] || new EventEmitter();



JP.CurrentUser = {
    //UserID: 32,
    //IsVIPMember: true,
    //Nick: 'PlayerX',
    //LangID: 2
}

JP.Players = {};

JP.UI = {

    messagesAfterAds: 0,


    Init: function () {

        $(document).on('click', '#ChatButton', function () {

            JP.UI.ToggleRightPanel();
        });

        $(document).on('click', '#SettingsModal .disable_audio_effects', function () {

            JP.Config.AudioEffectsEnabled = false;
            JP.Config.Save();
            JP.Config.Refresh();
        });

        $(document).on('click', '#SettingsModal .enable_audio_effects', function () {

            JP.Config.AudioEffectsEnabled = true;
            JP.Config.Save();
            JP.Config.Refresh();
        });

        $(document).on('click', '#SettingsModal .clear_chat', function () {

            $('#RightPanel .chat_messages .bubles_container').empty();
            $('#SettingsModal').modal('hide');
        });

        $(document).on('click', '#PlayerButton', function () {

            if (JP.Config.PlayerIsActive) return;

            JP.Config.PlayerIsActive = true;

            $.radio.play();

            $('#PlayerButton').addClass('opened');
        });

        $(document).on('contextmenu', '#ProfileModal,#SettingsModal', function () {
            return false;
        });

        $(document).on('contextmenu', function () {
            $('#SmilesBoxModal').modal();
            return false;
        });

        $(document).on('click', '#SmilesBoxModal div:not(.disabled) .item', function () {
            $('#SmilesBoxModal').modal('hide');

            var text = $(this).attr('data-name');
            if (!text || text == '') return;

            text = '(' + text + ')';

            JP.UI.AddChatMessage(JP.CurrentUser.UserID, JP.CurrentUser.Nick, text);

            JP.emit('ChatMessageSend', text);
        });

        $(document).on('click', '#RightPanel .chat_messages .buble a.ads', function () {
            JP.UI._RemoveChatLog(-2);
        });

        $(document).on('click', '#MusicPlayer .item', function () {

            if (JP.UI.sendMusicChannelInfoTimeout)
                clearTimeout(JP.UI.sendMusicChannelInfoTimeout);

            JP.UI._BroadcastListeningMusic();
        });

        $(document).on('click', '.jok_player .playing_music_channel', function () {
            var channelid = $(this).attr('data-channelid');
            if (!channelid) return;

            var id;
            $.radio._activeChannels.forEach(function (c, i) {
                if (c.channelid == channelid)
                    id = i;
            });
            if (!id && id != 0) return;

            $.radio.play(id);

            JP.UI._BroadcastListeningMusic();
        });

        $(document).on('click', '.jok_player .avatar', function () {

            var userid = $(this).parent().data('userid');
            if (!userid) return;

            JP.UI.PlayerProfile(userid);
        });

        $(document).on('click', '.jok_player .nick .nick_inner', function () {

            var userid = $(this).parent().parent().data('userid');
            if (!userid) return;

            JP.UI.PlayerProfile(userid);
        });

        $(document).on('click', '#ProfileModal button.invite_friend', function () {

            var userid = $('#ProfileModal').data('userid');
            if (!userid) return;

            $(this).hide();
            $('#ProfileModal button.friend_request_sent').show();

            JP.API('/User/SendFriendRequest/' + userid);
        });


        $(document).on('keydown', '#ChatMessageInput', this.OnChatMessageInputKeyDown.bind(this));
        $(document).on('keydown', this.OnKeyDown.bind(this));

        this.InitChatAds();


        JP.API('/User/InfoBySID?sid=' + $.cookie('sid'), function (user) {

            if (!user || !user.IsSuccess) {
                $('#Game').hide();
                $('#Authorization').show();
                return;
            }

            JP.CurrentUser = user;
        });
    },

    OnKeyDown: function (e) {

        if (e.keyCode == 13 /*Enter*/) {

            if (!JP.Config.RightPanelIsOpen)
                this.ToggleRightPanel();

            $('#ChatMessageInput').select();
        }

        if (e.keyCode == 27/*Esc*/) {

            if (JP.Config.RightPanelIsOpen)
                this.ToggleRightPanel();
        }
    },

    OnChatMessageInputKeyDown: function (e) {

        if (e.keyCode == 13 /*Enter*/) {

            var text = $('#ChatMessageInput').val();
            if (!text) return;

            this.AddChatMessage(JP.CurrentUser.UserID, JP.CurrentUser.Nick, text);
            $('#ChatMessageInput').val('');

            JP.emit('ChatMessageSend', text);
        }
    },

    ToggleRightPanel: function () {
        $('#Jok').toggleClass('panel_open');

        JP.Config.RightPanelIsOpen = $('#Jok').hasClass('panel_open');
        JP.Config.Save();
    },

    InitChatAds: function () {
        if (this.chatAdsInterval) {
            clearInterval(this.chatAdsInterval);
            this.chatAdsInterval = undefined;
        }
        else {

            setTimeout(this._ShowAds.bind(this), 2 * 1000);

            this.chatAdsInterval = setInterval((function () {

                if (this.messagesAfterAds > 0)
                    this._ShowAds();

            }).bind(this), 5 * 60 * 1000);
        }
    },

    AddChatMessage: function (userid, nick, msg) {

        if (!msg) return;

        msg = msg.replace(/(<([^>]+)>)/ig, ""); // Remove html tags
        msg = JP.Chat.ReplaceSmiles(msg);      // Convert images

        this._ShowPlayerBubble(userid, msg);
        this._AddChatLog(userid == JP.CurrentUser.UserID ? 3 : 1, userid, nick, msg, false);

    },

    SetPlayer: function (selector, userid, cb) {
        if (!$(selector).length) return;

        this.GetPlayer(userid, function (player) {
            if (!player) return;

            var uiPlayer = $(selector);


            uiPlayer.attr('data-userid', userid);

            if (!uiPlayer.hasClass('jok_player')) {
                uiPlayer.addClass('jok_player');
            }

            var avatar = uiPlayer.find('.avatar');
            if (!avatar.length) {
                uiPlayer.append('<img class="avatar" />');
                avatar = uiPlayer.find('.avatar');
            }

            avatar.attr('src', player.AvatarUrl);


            var nick = uiPlayer.find('.nick');
            if (!nick.length) {
                uiPlayer.append('<div class="nick"><div class="nick_inner"><span></span><div class="bitting"></div></div></div>');
            }
            nick = uiPlayer.find('span');

            nick.html(player.Nick);


            !uiPlayer.find('.offline_title').length && uiPlayer.append('<div class="offline_title">Offline</div>');
            !uiPlayer.find('.wins').length && uiPlayer.append('<div class="wins">');
            !uiPlayer.find('.added_points').length && uiPlayer.append('<div class="added_points">');
            !uiPlayer.find('.score').length && uiPlayer.append('<div class="score">');
            !uiPlayer.find('.progressbar').length && uiPlayer.append('<div class="progressbar">');
            !uiPlayer.find('.chat_bubble').length && uiPlayer.append('<div class="chat_bubble">');
            !uiPlayer.find('.ready').length && uiPlayer.append('<div class="ready">');
            !uiPlayer.find('.music_player').length && uiPlayer.append('<div class="music_player">');
            !uiPlayer.find('.rate').length && uiPlayer.append('<div class="rate">');
            !uiPlayer.find('.playing_music_channel').length && uiPlayer.append('<div class="playing_music_channel">');

            cb && cb();
        });
    },

    GetPlayer: function (userid, cb) {

        var cachedPlayer = JP.Players[userid];
        if (cachedPlayer) {
            if (cb) cb(cachedPlayer);
            return;
        }

        JP.API('user/info/' + userid + '?gameid=12&languageID=' + JP.CurrentUser.LangID + '&sid=' + $.cookie('sid'), function (result) {
            if (!result.IsSuccess) {
                if (cb) cb(null);
                return;
            }

            JP.Players[userid] = result;

            if (cb) cb(result);
        });
    },

    PlayerProfile: function (userid) {

        this.GetPlayer(userid, function (player) {

            $('#ProfileModal').attr('data-userid', player.UserID);
            $('#ProfileModal .avatar').attr('src', player.AvatarUrl);
            $('#ProfileModal .nick').html(player.Nick);

            if (player.Game) {
                $('#ProfileModal .level_name').html(player.Game.FromLevelName);
                $('#ProfileModal .cups .golden span').html(player.Game.CupCountGold);
                $('#ProfileModal .cups .silver span').html(player.Game.CupCountSilver);
                $('#ProfileModal .cups .bronze span').html(player.Game.CupCountBronze);
                $('#ProfileModal .cups div').show();
            }
            else {
                $('#ProfileModal .level_name').html('New');
                $('#ProfileModal .cups div').hide();
            }

            $('#ProfileModal .modal-footer button').hide();

            if (userid == JP.CurrentUser.UserID) {
                $('#ProfileModal button.yourself').show();
            }
            else {

                //$('#ProfileModal button.report').show();

                switch (player.RelationStatusID2) {

                    case 2 /*Accepted*/:
                        $('#ProfileModal button.your_friend').show();
                        break;

                    case 3 /*Rejected*/:
                        break;

                    case 4/*Pending*/:
                        $('#ProfileModal button.friend_request_sent').show();
                        break;

                    case 1 /*New*/:
                    default:
                        $('#ProfileModal button.invite_friend').show();
                        break;
                }
            }

            $('#ProfileModal').modal();
        });
    },

    PlayerActivate: function (userid, durationInSec) {

        $('.jok_player').removeClass('active');

        var user = $('.jok_player[data-userid=' + userid + ']');
        if (!user.length) return;

        var bitting = user.find('.nick .bitting');
        if (!bitting.length) return;

        user.addClass('active');

        bitting.css('right', 0);

        bitting.stop(true);
        bitting.animate({ right: bitting.width() }, durationInSec * 1000, 'swing', function () {
            bitting.css('right', 0);
            user.removeClass('active');
        });
    },

    UpdateUserListeningStatus: function (userid, isListening, channelID) {
        var player = $('.jok_player[data-userid=' + userid + ']');
        if (!player.length) return;

        if (!isListening) {
            player.find('.music_speakers').hide('fast');
            player.find('.playing_music_channel').hide();
            return;
        }

        player.find('.music_speakers').show('fast');

        var title = '';
        $.radio._activeChannels.forEach(function (c) {
            if (c.channelid == channelID)
                title = c.channel;
        });

        if (!title) return;

        player.find('.playing_music_channel').attr('data-channelid', channelID);
        player.find('.playing_music_channel').html(title);
        player.find('.playing_music_channel').show();
    },


    _ShowPlayerBubble: function (userid, msg) {

        var plChat = $('.jok_player[data-userid=' + userid + '] .chat_bubble');
        if (!plChat.length) return;


        var hideTimeout = plChat.attr('data-hide-timeout');
        if (hideTimeout)
            clearTimeout(hideTimeout);

        plChat.find('.inner').html(msg);
        plChat.css('opacity', 0);
        plChat.css('display', 'block');
        plChat.fadeTo(400, 1);
        hideTimeout = setTimeout(function () {

            plChat.fadeTo(400, 0, function () {
                plChat.hide();
            });

        }, (userid == JP.CurrentUser.UserID) ? 1000 : 9000);

        plChat.attr('data-hide-timeout', hideTimeout);
    },

    _AddChatLog: function (PlayerNo, userid, nick, msg, forceNewGroup) {

        var item = $('#RightPanel .chat_messages .buble').last();

        if (item.attr('data-userid') != userid || forceNewGroup) {
            item = $('<div class="buble color' + PlayerNo + '" data-userid="' + userid + '">');
            item.append('<span class="nick">' + nick + (userid == JP.CurrentUser.UserID ? '' : ':') + '</span>');
        }

        item.append('<div>' + msg + '</span>');

        var container = $('#RightPanel .chat_messages .bubles_container');
        container.append(item);
        container.animate({ scrollTop: container[0].scrollHeight }, "normal");

        this.messagesAfterAds++;
    },

    _ShowAds: function () {

        JP.API('/ads/getnext', (function (data) {
            if (!data || !data.IsSuccess) return;

            var ads = $('<a href="' + data.Link + '" target="_blank" class="ads">');
            ads.append('<img src="' + data.ImageUrl + '" alt="ads" /><br/>');
            ads.append('<span>' + data.Description + '</span>');

            ads = $('<p style="text-align: center; margin-right: 8px; margin-bottom: 0px;">').append(ads);


            this._RemoveChatLog(-2);
            this._AddChatLog('J', -2, 'Jok Ads', $('<div>').append(ads).html(), true);
            this.messagesAfterAds = 0;

        }).bind(this));
    },

    _RemoveChatLog: function (userid) {

        $('#RightPanel .chat_messages .buble[data-userid=' + userid + ']').remove();
    },

    _BroadcastListeningMusic: function () {

        JP.UI.sendMusicChannelInfoTimeout = setTimeout(function () {

            var channelid;
            try {
                channelid = $.radio._activeChannels[$.radio._itemid].channelid;
            }
            catch (err) { }

            JP.emit('MusicPlayerStateChanged', $.radio.isPlaying, channelid);
        }, 100);
    },

}



JP.Config = {

    ApiUrl: 'https://api.jok.io/',

    AudioEffectsEnabled: true,
    PlayerIsActive: false,
    RightPanelIsOpen: false,

    Init: function () {
        this.AudioEffectsEnabled = localStorage['JP_AudioEffectsEnabled'] == 1;
        this.RightPanelIsOpen = localStorage['JP_RightPanelIsOpen'] == 1;

        this.Refresh();
    },

    Save: function () {
        localStorage['JP_AudioEffectsEnabled'] = this.AudioEffectsEnabled ? 1 : 0;
        localStorage['JP_RightPanelIsOpen'] = this.RightPanelIsOpen ? 1 : 0;
    },

    Refresh: function () {
        $('#SettingsModal .disable_audio_effects').hide();
        $('#SettingsModal .enable_audio_effects').hide();

        if (this.AudioEffectsEnabled)
            $('#SettingsModal .disable_audio_effects').show();
        else
            $('#SettingsModal .enable_audio_effects').show();

        if (this.RightPanelIsOpen) {
            !$('#Jok').hasClass('panel_open') && $('#Jok').addClass('panel_open');
        } else {
            $('#Jok').hasClass('panel_open') && $('#Jok').removeClass('panel_open');
        }
    },

    GetCookieDomain: function () {
        var host = window.location.hostname;

        var firstIndex = host.indexOf('.');
        var lastIndex = host.lastIndexOf('.');

        return (firstIndex != lastIndex) ? host.substring(firstIndex) : (lastIndex > -1 ? '.' + host : '');
    }
}


JP.API = function (action, cb) {
    $.ajax({
        url: [JP.Config.ApiUrl, action].join(''),
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


$(function () {

    JP.UI.Init();
    JP.Config.Init();
    JP.Chat.Init();
});
