﻿var JP = window["JP"] || new EventEmitter();



JP.CurrentUser = {
    //UserID: 32,
    //IsVIP: true,
    //Nick: 'PlayerX',
    //LangID: 2
}

JP.Players = {};

JP.GetPlayer = function (userid, cb, force) {

    var cachedPlayer = JP.Players[userid];
    if (!force && cachedPlayer) {
        if (cb) cb(cachedPlayer);
        return;
    }

    JP.API('user/info/' + userid + '?gameid=' + JP.Config.GameID + '&languageID=' + JP.CurrentUser.LanguageID + '&sid=' + $.cookie('sid'), function (result) {
        if (!result.IsSuccess) {
            if (cb) cb(null);
            return;
        }

        JP.Players[userid] = result;

        if (cb) cb(result);
    });
},

JP.SendChatMessage = function (message) {

    var isSuccess = JP.UI.AddChatMessage(JP.CurrentUser.UserID, JP.CurrentUser.Nick, message);
    if (isSuccess)
        JP.emit('SendChatMessage', message);
}


JP.UI = {

    messagesAfterAds: 0,

    Init: function () {

        $('body').hide();
        $('body').fadeTo(0, 0);

        FastClick.attach(document.body);

        var sid = JP.Config.GetQueryVariable('sid', 36);
        if (sid)
            $.cookie('sid', sid, { expire: 1200 });

        JP.API('/User/InfoBySID?sid=' + $.cookie('sid'), function (user) {

            if (!user || !user.IsSuccess) {

                JP.ML.Init('en');
                JP.UI.Load();

                $('#Game').hide();
                $('#Authorization').show();
                return;
            }

            JP.CurrentUser = user;

            var lang = 'en';

            if (user.LanguageID == 1)
                lang = 'ge';

            if (user.LanguageID == 3)
                lang = 'ru';


            JP.ML.Init(lang);
            JP.UI.Load();

            if (user.IsVIP) {
                $('#SmilesBoxModal .vip_smiles_container').removeClass('disabled');
            }
        });
    },

    InitDom: function () {

        var loginHref = location.href.replace(new RegExp('sid=', 'g'), 'sid_old=');

        var jok = $('<div id="Jok">');
        jok.append('<div id="Background"></div>');
        jok.append('<div id="Background2"></div>');
        jok.append('<div id="ExitButton"> <div class="circle"> <i class="fa fa-angle-left"></i> </div> ' + JP.ML.Exit + ' </div>');
        jok.append('<div id="ChatButton"> ' + JP.ML.Chat + ' <div class="circle"> <i class="fa fa-comment-o"></i> </div> </div>');
        jok.append('<div id="ConfigButton" data-toggle="modal" data-target="#SettingsModal"> ' + JP.ML.GameSettings + ' <div class="circle"> <i class="fa fa-umbrella"></i> </div> </div>');
        jok.append('<div id="PlayerButton"> <div class="circle player_circle"> <i class="glyphicon glyphicon-music main_icon"></i> </div> <span class="title"> ' + JP.ML.MusicPlayer + ' </span> <div id="MusicPlayer" class="jokfm_plugin"> <div> <span class="item previous_button"><i class="fa fa-backward"></i></span> <span class="item play_button"><i class="fa fa-play"></i></span> <span class="item stop_button"><i class="fa fa-stop"></i></span> <span class="item next_button"><i class="fa fa-forward"></i></span> </div> <div class="active_channel"></div> </div> </div>');
        jok.append('<div id="Authorization"> <img src="http://jok.io/content/images/portal/joklogo2.png" /> <br /> <br /> <ul class="social_connect"> <li class="click_navigate"> <a href="http://jok.io/portal/joinus/facebook?returnUrl=' + loginHref + '"> <img src="http://jok.io/content/images/social/fb.png" /> ' + JP.ML.LoginWithFacebook + ' </a> </li> <li class="click_navigate"> <a href="http://jok.io/portal/joinus/twitter?returnUrl=' + loginHref + '"> <img src="http://jok.io/content/images/social/twitter.png" /> ' + JP.ML.LoginWithTwitter + ' </a> </li> <li class="click_navigate"> <a href="http://jok.io/portal/joinus/odnoklasniki?returnUrl=' + loginHref + '"> <img src="http://jok.io/content/images/social/odno.png" /> ' + JP.ML.LoginWithOdno + ' </a> </li> <li class="click_navigate"> <a href="http://jok.io/portal/joinus/vkontaqte?returnUrl=' + loginHref + '"> <img src="http://jok.io/content/images/social/vk.png" /> ' + JP.ML.LoginWithVK + ' </a> </li> <li class="click_navigate"> <a href="http://jok.io/portal/joinus/google?returnUrl=' + loginHref + '"> <img src="http://jok.io/content/images/social/google.png" /> ' + JP.ML.LoginWithGoogle + ' </a> </li> </ul> </div>');
        jok.append('<div id="Notification"> <div class="item message"></div> <div class="item invite_friend">' + JP.ML.InviteFriend + '<br /><br /><div class="input-group"><input type="text" class="form-control" id="InviteFriendLinkInput" value="' + JP.Config.PlayUrl + '"><div class="input-group-btn"><button type="button" class="btn btn-default" data-clipboard-target="InviteFriendLinkInput">' + JP.ML.CopyLink + '</button></div></div></div> </div>');
        jok.append('<div id="SettingsModal" class="modal " tabindex="-1" role="dialog" aria-labelledby="SettingsModal" aria-hidden="true"> <div class="modal-dialog"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">' + JP.ML.CloseSettings + '</span></button> <h3 class="modal-title" id="SettingsModal"><i class="fa fa-umbrella"></i> ' + JP.ML.GameSettings + '</h3> </div> <div class="modal-body"> <button class="btn btn-default btn-block btn-lg disable_audio_effects"><i class="glyphicon glyphicon-volume-up" style="float:left;"></i> ' + JP.ML.DisableAudioEffects + '</button> <button class="btn btn-default btn-block btn-lg enable_audio_effects"><i class="glyphicon glyphicon-volume-off" style="float:left;"></i> ' + JP.ML.EnableAudioEffects + '</button> <button class="btn btn-default btn-block btn-lg clear_chat"><i class="fa fa-comment-o" style="float:left;"></i> ' + JP.ML.ClearChat + '</button> </div> </div> </div> </div>');
        jok.append('<div id="RightPanel"> <div class="chat_messages"> <div class="bubles_container"> </div> </div> <div class="chat_input"> <input id="ChatMessageInput" type="text" placeholder="' + JP.ML.ChatInputPlaceholder + '" disabled maxlength="100" /> </div> </div>');
        jok.append('<div id="SmilesBoxModal" class="modal " tabindex="-1" role="dialog" aria-labelledby="SmilesBoxModal" aria-hidden="true"> <div class="modal-dialog"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">' + JP.ML.CloseEmotions + '</span></button> <h3 class="modal-title"><i class="fa fa-smile-o"></i> ' + JP.ML.SendEmotions + '</h3> </div> <div class="modal-body"> <div class="smiles_container"> </div> <div class="headline vip"> <span>' + JP.ML.VIPEmotions + '</span> </div> <div class="vip_smiles_container disabled"> </div> </div> </div> </div> </div>');
        jok.append('<div id="ProfileModal" class="modal " tabindex="-1" role="dialog" aria-labelledby="ProfileModal" aria-hidden="true"> <div class="modal-dialog"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">' + JP.ML.CloseProfile + '</span></button> <h3 class="modal-title"><span class="nick">Nick Here</span></h3> </div> <div class="modal-body"> <img src="" class="avatar" /> <div class="cups"> <div class="golden"> <span>0</span> <i class="fa fa-trophy"></i> </div> <div class="silver"> <span>10</span> <i class="fa fa-trophy"></i> </div> <div class="bronze"> <span>0</span> <i class="fa fa-trophy"></i> </div> </div> <div class="level_name"></div> </div> <div class="modal-footer"> <div class="btn-group" style="float:left;"> <button class="btn btn-danger dropdown-toggle report" data-toggle="dropdown" style="min-width: 119px;">Report <span class="caret"></span></button> <ul class="dropdown-menu" role="menu"> <li><a href="#" class="report_option" data-reason="1">Cheating</a></li> <li><a href="#" class="report_option" data-reason="1">Bad words in chat</a></li> <li class="divider"></li> <li><a href="#" class="report_option" data-reason="1">Just don\'t like</a></li> </ul> </div> <button class="btn btn-default yourself" disabled>' + JP.ML.RealtionStatusYou + '</button> <button class="btn btn-default your_friend" disabled>' + JP.ML.RealtionStatusFriend + '</button> <button class="btn btn-default friend_request_sent" disabled>' + JP.ML.RealtionStatusFriendRequestSent + '</button> <button class="btn btn-success send_friend_request">' + JP.ML.RealtionStatusStranger + '</button> </div> </div> </div> </div>');
        jok.append('<div id="AdsModal" class="modal" tabindex="-1" role="dialog" aria-labelledby="AdsModal" aria-hidden="true"><div class="modal-dialog"><div class="modal-content"><div class="modal-body"><div class="ads_close"><button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only"></span></button></div><img src="" class="ads_image" /><div class="ads_title"></div></div></div></div></div>');

        $('body').prepend(jok);
    },

    Load: function () {

        JP.Config.Init();


        this.InitDom();

        $(document).on('click', '#ExitButton', function () {

            JP.emit('BeforeExit');
            document.location.assign(JP.Config.ExitUrl);
        });

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

            JP.UI._BroadcastListeningMusic();
        });

        $(document).on('contextmenu', '#ProfileModal,#SettingsModal,#AdsModal', function () {
            return false;
        });

        $(document).on('contextmenu', function (e) {

            if (e && e.target && e.target.tagName == "INPUT" && e.target.type == "text") {
                return true;
            }

            if (JP.CurrentUser.UserID)
                $('#SmilesBoxModal').modal();
            return false;
        });

        $(document).on('click', '#SmilesBoxModal .smiles_container .item, #SmilesBoxModal .vip_smiles_container:not(.disabled) .item', function () {
            $('#SmilesBoxModal').modal('hide');

            var text = $(this).attr('data-name');
            if (!text || text == '') return;

            text = '(' + text + ')';

            JP.SendChatMessage(text);
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

        $(document).on('click', '#ProfileModal button.send_friend_request', function () {

            var userid = $('#ProfileModal').data('userid');
            if (!userid) return;

            $(this).hide();
            $('#ProfileModal button.friend_request_sent').show();

            JP.API('/User/SendFriendRequest/' + userid, function () {

                JP.GetPlayer(userid, function (user) {
                    JP.emit('UserRelationsUpdate');
                }, true);

            });
            JP.SendChatMessage(JP.ML.FriendRequestMessage);
        });

        $(document).on('click', '#Notification .item.invite_friend input', function () {
            $(this).select();
        });

        $(document).on('keydown', '#Notification .item.invite_friend input', function () {
            return false;
        });

        $(document).on('click', '#AdsModal .ads_title,#AdsModal .ads_image', function () {
            var link = $(this).data('link');
            if (link)
                window.open(link);

            $('#AdsModal').modal('hide');
        });



        $(document).on('keydown', '#ChatMessageInput', this.OnChatMessageInputKeyDown.bind(this));
        $(document).on('keydown', this.OnKeyDown.bind(this));



        // Clipboard stuff
        ZeroClipboard.config({
            trustedDomains: ["*"],
            swfPath: JP.Config.JPUrl + 'Scripts/V2/ZeroClipboard.swf'
        });


        $('#Notification .item.invite_friend button.btn').parent().hide();
        $('#Notification .item.invite_friend button.btn').parent().parent().attr('class', '');

        var client = new ZeroClipboard($('#Notification .item.invite_friend button.btn')[0]);

        client.on('ready', function () {
            $('#Notification .item.invite_friend button.btn').parent().show();
            $('#Notification .item.invite_friend button.btn').parent().parent().attr('class', 'input-group');
        });

        client.on('aftercopy', function () {
            $('#Notification .item.invite_friend button.btn').html('<i class="fa fa-check"></i>');

            setTimeout(function () {
                $('#Notification .item.invite_friend button.btn').html(JP.ML.CopyLink);
            }, 5000);
        });




        JP.Audio.Init();


        if (JP.CurrentUser.UserID) {
            JP.Config.Load();
            JP.Chat.Init();
            JP.FM.Init();

            this.InitChatAds();

            JP.emit('Ready');
        }

        $('body').show();
        $('body').fadeTo(300, 1);
    },

    OnKeyDown: function (e) {

        if (e.keyCode == 13 /*Enter*/) {

            if (!JP.CurrentUser.UserID)
                return;

            if (!JP.Config.RightPanelIsOpen)
                this.ToggleRightPanel();

            $('#ChatMessageInput').select();
        }

        if (e.keyCode == 27/*Esc*/) {

            if (!JP.CurrentUser.UserID)
                return;

            if (JP.Config.RightPanelIsOpen)
                this.ToggleRightPanel();
        }
    },

    OnChatMessageInputKeyDown: function (e) {

        if (e.keyCode == 13 /*Enter*/) {

            if (!JP.Config.IsChatAllowed) return;

            var text = $('#ChatMessageInput').val();
            if (!text) return;
            $('#ChatMessageInput').val('');

            JP.SendChatMessage(text);
        }
    },

    ToggleRightPanel: function () {
        $('#Jok').toggleClass('panel_open');

        JP.Config.RightPanelIsOpen = $('#Jok').hasClass('panel_open');
        JP.Config.Save();

        if (!JP.Config.RightPanelIsOpen)
            $('#RightPanel').css('z-index', -1);

        setTimeout(function () {
            $('#RightPanel').css('z-index', JP.Config.RightPanelIsOpen ? 1000 : -1);
        }, 300);
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
        if (userid == JP.CurrentUser.UserID) {

            //თუ ერთიდაიგივე მესიჯს აგზავნის ბოლო სამი წამის განმავლობაში, ვიკიდებთ.
            if (JP.Chat.lastMessageTime
                && (Date.now() - JP.Chat.lastMessageTime) < 3000
                && JP.Chat.lastMessage == msg) return;


            JP.Chat.lastMessageTime = Date.now();
            JP.Chat.lastMessage = msg;
        }

        msg = msg.replace(/(<([^>]+)>)/ig, ""); // Remove html tags
        msg = JP.Chat.ReplaceSmiles(msg);      // Convert images

        this._ShowPlayerBubble(userid, msg);
        this._AddChatLog(userid == JP.CurrentUser.UserID ? 3 : 1, userid, nick, msg, false);

        return true;
    },

    SetPlayer: function (selector, userid, cb) {
        if (!$(selector).length) return;

        $(selector).attr('data-userid', userid);

        JP.GetPlayer(userid, function (player) {
            if (!player) {
                $(selector).removeAttr('data-userid');
                return;
            }
            var uiPlayer = $(selector);


            uiPlayer.attr('data-userid', userid);

            if (!uiPlayer.hasClass('jok_player')) {
                uiPlayer.addClass('jok_player');
            }

            uiPlayer.show();


            !uiPlayer.find('.music_speakers').length && uiPlayer.append('<img class="music_speakers" src="//play.jok.io/images/speakers2.png" />');


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
            !uiPlayer.find('.chat_bubble').length && uiPlayer.append('<div class="chat_bubble"><div class="inner"></div></div>');
            !uiPlayer.find('.ready').length && uiPlayer.append('<div class="ready"><i class="fa fa-check-circle-o" /></div>');
            !uiPlayer.find('.music_player').length && uiPlayer.append('<div class="music_player">');
            !uiPlayer.find('.rate').length && uiPlayer.append('<div class="rate">');
            !uiPlayer.find('.playing_music_channel').length && uiPlayer.append('<div class="playing_music_channel">');

            if (JP.Config.PlayerIsActive && JP.CurrentUser.UserID == userid) {
                uiPlayer.find('.music_player').show();
            }

            cb && cb();
        });
    },

    ClearPlayer: function (selector) {
        var el = $(selector);
        if (!el.length) return;

        el.hide();
        el.removeAttr('data-userid');
    },

    PlayerProfile: function (userid) {

        JP.GetPlayer(userid, function (player) {

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
                        $('#ProfileModal button.send_friend_request').show();
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

        if (durationInSec) {
            bitting.animate({ right: bitting.width() }, durationInSec, 'swing', function () {
                bitting.css('right', 0);
                user.removeClass('active');
            });
        }
    },

    ClearActivate: function () {
        $('.jok_player .nick .bitting').css('right', 0);
        $('.jok_player').removeClass('active');
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

    ShowNotification: function (name, replaceCallback) {

        $('#Notification .item').hide();

        var nItem = $('#Notification .item.' + name);
        if (!nItem.length) return;

        replaceCallback && replaceCallback(nItem);
        nItem.show();
    },

    ShowNotificationMessage: function (message) {

        this.ShowNotification('message', function (item) {
            item.html(message);
        })
    },

    HideNotification: function () {
        $('#Notification .item').hide();
    },

    RefreshChatMessageInput: function (isEnabled) {

        JP.Config.IsChatAllowed = !!isEnabled

        if (JP.Config.IsChatAllowed) {
            $('#ChatMessageInput').removeAttr('disabled');
            $('#ChatMessageInput').attr('placeholder', JP.ML.ChatInputPlaceholder);
        } else {
            $('#ChatMessageInput').attr('disabled', 'disabled');
            $('#ChatMessageInput').attr('placeholder', JP.ML.ChatInputPlaceholderDisabled);
        }
    },

    ShowAds: function (force) {

        if (JP.CurrentUser.IsVIP && !force) return;

        JP.API('/ads/getnext', (function (data) {
            if (!data || !data.IsSuccess) return;


            $('#AdsModal .ads_image,#AdsModal .ads_title').attr('data-link', data.Link);

            $('#AdsModal .ads_image').attr('src', data.ImageUrl);
            $('#AdsModal .ads_title').html(data.Description);

            $('#AdsModal').modal({
                backdrop: 'static',
                keyboard: false
            });

        }).bind(this));
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

    _LauchFullScreen: function (element) {

        if (!element)
            element = document.documentElement;

        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    },

    _ExitFullScreen: function () {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    },
}



JP.Config = {

    ApiUrl: '//api.jok.io/',

    ExitUrl: '//jok.ge',

    JPUrl: '//play.jok.io/',

    ServerUrl: '',

    PlayUrl: '',

    GameID: 0,

    GameMode: 0,

    Channel: '',

    IsChatAllowed: false,

    AudioEffectsEnabled: true,
    PlayerIsActive: false,
    RightPanelIsOpen: false,

    Init: function () {
        this.AudioEffectsEnabled = localStorage['JP_AudioEffectsEnabled'] != 0;
        this.RightPanelIsOpen = localStorage['JP_RightPanelIsOpen'] == 1;

        var exitUrl = this.GetQueryVariable('ExitUrl');
        if (exitUrl)
            this.ExitUrl = exitUrl;

        if (!this.PlayUrl)
            this.PlayUrl = location.origin + location.pathname;
    },

    Load: function () {

        $('#ConfigButton').show();

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

        $('#RightPanel').css('z-index', this.RightPanelIsOpen ? 1000 : -1);
    },

    GetCookieDomain: function () {
        var host = window.location.hostname;

        var firstIndex = host.indexOf('.');
        var lastIndex = host.lastIndexOf('.');

        return (firstIndex != lastIndex) ? host.substring(firstIndex) : (lastIndex > -1 ? '.' + host : '');
    },

    GetQueryVariable: function (variable, length) {
        if (!variable) return;

        var query = window.location.search.substring(1);
        var vars = query.split('&');
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');
            var key = decodeURIComponent(pair[0]);
            var value = decodeURIComponent(pair[1]);

            if (length && value.length != length) continue;

            if (key && key.toLowerCase() == variable.toLowerCase()) {
                return value;
            }
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


JP.Init = function (opts) { //gameid, channel, serverUrl, exitUrl) {

    JP.Config.GameID = opts.GameID;
    JP.Config.Channel = opts.Channel;
    JP.Config.ServerUrl = opts.ServerUrl;
    JP.Config.ServerUrl = opts.ServerUrl;

    if (opts.ExitUrl)
        JP.Config.ExitUrl = opts.ExitUrl;

    if (opts.GameMode)
        JP.Config.GameMode = opts.GameMode;


    JP.UI.Init();
}
