var JP = window["JP"] || new EventEmitter();



JP.User = {
    ID: 32,
    IsVIPMember: true,
    Nick: 'PlayerX',
    LangID: 1
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

            $('#PlayerButton').addClass('opened');
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

            JP.UI.AddChatMessage(JP.User.ID, JP.User.Nick, text);

            JP.emit('ChatMessageSend', text);
        });


        $(document).on('keydown', '#ChatMessageInput', this.OnChatMessageInputKeyDown.bind(this));
        $(document).on('keydown', this.OnKeyDown.bind(this));

        this.InitChatAds();
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

            this.AddChatMessage(JP.User.ID, JP.User.Nick, text);
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
        this._AddChatLog(userid == JP.User.ID ? 3 : 1, userid, nick, msg, false);

    },

    SetSelector: function (selector, userid) {
        if (!$(selector).length) return;

        this.GetPlayer(userid, function (player) {
            if (!player) return;

            var uiPlayer = $(selector);


            if (!uiPlayer.hasClass('jok_player'))
                uiPlayer.addClass('jok_player');

            var avatar = uiPlayer.find('.avatar');
            if (!avatar.length)
                avatar = uiPlayer.append('<img class="avatar" />');

            avatar.attr('src', player.AvatarUrl);


            var nick = uiPlayer.find('.nick');
            if (!nick.length) {
                nick = uiPlayer.append('<div class="nick">');
                nick = nick.append('span');
            }

            nick.html(player.Nick);

            uiPlayer.find('.offline_title').length && uiPlayer.append('<div class="offline_title">');
            uiPlayer.find('.wins').length && uiPlayer.append('<div class="wins">');
            uiPlayer.find('.added_points').length && uiPlayer.append('<div class="added_points">');
            uiPlayer.find('.score').length && uiPlayer.append('<div class="score">');
            uiPlayer.find('.progressbar').length && uiPlayer.append('<div class="progressbar">');
            uiPlayer.find('.chat_bubble').length && uiPlayer.append('<div class="chat_bubble">');
            uiPlayer.find('.ready').length && uiPlayer.append('<div class="ready">');
            uiPlayer.find('.music_player').length && uiPlayer.append('<div class="music_player">');
            uiPlayer.find('.rate').length && uiPlayer.append('<div class="rate">');
            uiPlayer.find('.playing_music_channel').length && uiPlayer.append('<div class="playing_music_channel">');
        });
    },

    GetPlayer: function (userid, cb) {

        var cachedPlayer = JP.Players[userid];
        if (cachedPlayer) {
            if (cb) cb(cachedPlayer);
            return;
        }

        JP.API('user/info/' + userid + '?gameid=12&languageID=' + JP.Config.LangID + '&sid=' + $.cookie('sid'), function (result) {
            if (!result.IsSuccess) {
                if (cb) cb(null);
                return;
            }

            JP.Players[userid] = result;

            if (cb) cb(result);
        });
    },


    _ShowPlayerBubble: function (userid, msg) {

    },

    _AddChatLog: function (PlayerNo, userid, nick, msg, forceNewGroup) {

        var item = $('#RightPanel .chat_messages .buble').last();

        if (item.attr('data-userid') != userid || forceNewGroup) {
            item = $('<div class="buble color' + PlayerNo + '" data-userid="' + userid + '">');
            item.append('<span class="nick">' + nick + (userid == JP.User.ID ? '' : ':') + '</span>');
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
