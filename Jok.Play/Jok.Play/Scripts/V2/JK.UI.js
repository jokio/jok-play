var JK;
(function (JK) {
    var UI = (function () {
        function UI() {
        }
        UI.init = function () {
            $(document).on('click', '#ExitButton', function () {
                document.location.assign(JK.Config.exitUrl);
            });

            $(document).on('click', '#RightPanelOpener', function () {
                if ($('#RightPanel').hasClass('pop_over'))
                    return;

                $('#RightPanel').addClass('pop_over');
            });

            //$(document).on('click', '#Jok', function () {
            //    if ($('#RightPanel .chat_messages .context_menu:visible').length) {
            //        $('#RightPanel .chat_messages .context_menu').hide();
            //    }
            //    $('#SmilesBox').hide();
            //    if (!$('#RightPanel').hasClass('pop_over')) return;
            //    $('#RightPanel').removeClass('pop_over');
            //});
            $(document).on('click', '#Notifications .item.waiting_friends input', function () {
                $(this).select();
            });

            $(document).on('click', '#ChatEnableAds,#ChatDisableAds', function () {
                //Game.toggleChatAds();
                //if (Game.chatAdsInterval) {
                //    $('#ChatEnableAds').hide();
                //    setTimeout(function () {
                //        $('#ChatDisableAds').show();
                //    }, 500);
                //}
                //else {
                //    $('#ChatDisableAds').hide();
                //    setTimeout(function () {
                //        $('#ChatEnableAds').show();
                //    }, 500);
                //    Game.removeChatLog(-2);
                //}
            });

            $(document).on('click', '.buble a.ads', function () {
                //Game.removeChatLog(-2);
            });

            $(document).on('click', '#ChatPrint', function () {
                //var h = $('<div>').append($(document).find('head').clone(false)).html();
                //var b = $('<div>').append($('#RightPanel .chat_messages .container').clone(false)).html();
                //var doc = '<html>' + h + '<body><div id="RightPanel"><div class="chat_messages">' + b + '</div></div></html>';
                //var mywindow = window.open('', 'Chat', 'height=600,width=400');
                //mywindow.document.write(doc);
                //mywindow.print();
                //mywindow.close();
                //$('#RightPanel .chat_messages .context_menu').hide();
            });

            $(document).on('click', '#ChatClear', function () {
                $('#RightPanel .chat_messages .container').empty();
                $('#RightPanel .chat_messages .context_menu').hide();
            });

            $(document).on('click', '#MusicPlayer .item', function () {
                //if (!Game.tableID) return;
                //if (Game.sendMusicChannelInfoTimeout)
                //    clearTimeout(Game.sendMusicChannelInfoTimeout);
                //Game.broadcastListeningMusic();
            });

            $(document).on('click', '#Game .player .playing_music_channel', function () {
                var channelid = parseInt($(this).attr('data-channelid'));
                if (!channelid)
                    return;

                JK.Radio.play(channelid);
            });

            $(document).on('click', '#SoundEffectsConfig', function () {
                $('#SoundEffectsConfig').toggleClass('disabled');

                JK.Config.isSoundEffectsAllowed = !$('#SoundEffectsConfig').hasClass('disabled');

                $.cookie('SoundEffectsEnabled', (JK.Config.isSoundEffectsAllowed ? 1 : 0), { expires: 30, path: '/', domain: JK.Config.getCookieDomain() });
            });

            //$(document).on('click', '#RightPanel .chat_input .smiles_opener', function (e) {
            //    $('#SmilesBox').toggle();
            //});
            //$(document).on('mouseleave', '#RightPanel', function (e) {
            //    $('#SmilesBox').hide();
            //});
            $(document).on('contextmenu', '#Jok', function (e) {
                $('#SmilesBox').toggle();

                return false;
            });

            $(document).on('click', '#PL1 .avatar', function (e) {
                $('#SmilesBox').toggle();
            });

            $(document).on('click', '#SmilesBox div:not(.disabled) .item', function () {
                $('#SmilesBox').hide();

                var text = $(this).attr('data-name');
                if (!text || text == '')
                    return;
                //Game.sendChatMessage('(' + text + ')', true)
            });

            $(document).on('contextmenu', '#RightPanel .chat_messages', function (e) {
                $(this).find('.context_menu').css('display', 'block');
                $(this).find('.context_menu').css('opacity', '0');
                $(this).find('.context_menu').fadeTo(200, 1);

                return false;
            });

            $(document).on('click', '#RightPanel .chat_messages .context_menu', function (e) {
                $(this).fadeTo(200, 0, function () {
                    $(this).css('display', 'none');
                });

                return false;
            });

            $(document).on('keydown', function (e) {
                if (e.keyCode != 13)
                    return;

                $('#ChatMessageInput').select();
            });

            if (!JK.Config.isSoundEffectsAllowed) {
                $('#SoundEffectsConfig').addClass('disabled');
            }
        };

        UI.setPlayer = function (userid, isOnline, position, virtualPosition) {
            var p = $('#PL' + virtualPosition);
            if (!p)
                return;

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

            JK.getPlayer(userid, function (player) {
                if (!player.IsSuccess)
                    return;

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
        };
        return UI;
    })();
    JK.UI = UI;
})(JK || (JK = {}));
//# sourceMappingURL=JK.UI.js.map
