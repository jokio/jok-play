

(function (jok) {

    var texts = jok.texts;

    var musicPlayerPlugin = $('<div class="jokfm_plugin"></div>');
    musicPlayerPlugin.append('<div class="item"><img class="next_button" src="' + jok.config.pluginUrl + '/images/FM/plugin/next.png" /></div>');
    musicPlayerPlugin.append('<div class="item"><img class="play_button" src="' + jok.config.pluginUrl + '/images/FM/plugin/play.png" /><div class="stop_button"></div></div>');
    musicPlayerPlugin.append('<div class="item"><img class="previous_button" src="' + jok.config.pluginUrl + '/images/FM/plugin/previous.png" /></div>');
    musicPlayerPlugin.append('<div class="active_channel title">' + texts.A006 + '</div>');

    var musicPlayer = $('<div class="music_player"></div>');
    musicPlayer.append('<div class="jokfm_plugin_volume"><div class="logo"></div><div class="volume_opener"><div class="volume-selector"></div></div></div>');
    musicPlayer.append(musicPlayerPlugin);

    var playerDetails = $('<div class="details"></div>');
    playerDetails.append('<div class="info"><img class="avatar" src="" alt="" /><div class="nick"></div></div>');
    playerDetails.append('<div class="stats"> <table cellpadding="0px" cellspacing="0px" class="stats-menu"> <tr class="vip"> <td class="description">' + texts.A001 + ': </td> <td style="color: Red;" class="value">VIP </td> </tr> <tr class="points"> <td class="description">' + texts.A002 + ': </td> <td style="color: orange;" class="value">0 </td> </tr> <tr class="fans"> <td class="description">' + texts.A003 + ': </td> <td style="color: #2AAA00;" class="value">0 </td> </tr> <tr class="friends"> <td class="description">' + texts.A004 + ': </td> <td style="color: #AC0909;" class="value">0 </td> </tr> </table> </div> <div class="actions"> <div class="friend_status"></div> <button class="button green sendFriendRequestButton">' + texts.A005 + '</button> </div> </div>');

    var player = $('<div class="player"></div>');
    player.append('<img src="' + jok.config.pluginUrl + '/images/speakers' + (jok.config.isVIPMember ? '2' : '') + '.png" class="music_speakers" />');
    player.append('<img class="avatar" src="" alt="" />');
    player.append('<div class="nick"></div>');
    player.append('<div class="progresbar"></div>');
    player.append('<div class="score"></div>');
    player.append('<div class="added_points">+<span>0</span> ' + texts.A007 + '</div>');
    player.append('<div class="wins"></div>');
    player.append('<div class="chat_bubble"><div class="msg"></div></div>');
    player.append('<div class="button red buzz">BUZZ!!!</div>');
    player.append('<div class="ready"><img src="' + jok.config.pluginUrl + '/Images/ready.png" /></div>');

    var player1 = player.clone(false);
    player1.attr('id', 'Player1');
    player1.append(musicPlayer);
    player1.find('.buzz').remove();

    var player2 = player.clone(false);
    player2.attr('id', 'Player2');
    player2.append(playerDetails);
    player2.find('.chat_bubble').attr('class', 'chat_bubble invert');

    var notifications = $('<div id="Notification"></div>');
    notifications.append('<div class="item connecting">' + texts.A008 + '<br /><br /><img src="' + jok.config.pluginUrl + '/images/loading_black.gif" alt="connecting" /></div>');
    notifications.append('<div class="item require_authorization">' + texts.A009 + '</div>');
    notifications.append('<div class="item waiting_opponent"><br />' + texts.A010 + '<br /><br /></div>');
    notifications.append('<div class="item share_friends">' + texts.A011 + '<br /><br /><input type="text" value="' + jok.config.playUrl + '" /><div class="info_msg"></div></div>');
    notifications.append('<div class="item quit">' + texts.A012 + '<br /><span>MESSAGE GOES HERE</span><br /><button class="button brown new_game">' + texts.A013 + '</button></div>');
    notifications.append('<div class="item table_leave_winner"><span style="font-size: 13px">' + texts.A014 + '</span><br /><br /><button class="button brown new_game">' + texts.A015 + '</button></div>');
    notifications.append('<div class="item table_finish_winner">' + texts.A016 + ' <span>WINNER NAME GOES HERE</span><br /><br /><button class="button brown play_again">' + texts.A017 + '</button></div>');
    notifications.append('<div class="item tournament_game_limit">' + texts.A028 + '<br /><br /><button class="button brown new_game">' + texts.A029 + '</button></div>');

    var rightDocOpener = $('<div id="RightDocOpener"><span>' + texts.A018 + '</span></div>');

    var rightDoc = $('<div id="RightDoc"></div>');
    rightDoc.append('<div id="RightDocClose"></div>');
    rightDoc.append('<div id="SmilesBox"> <div class="separator"> <span>' + texts.A019 + '</span> </div> <div class="smiles_container"> </div> <div class="more"> ' + texts.A020 + ' </div> <div class="vip_smiles"> <div class="separator"> <span>' + texts.A021 + '</span> </div> <div class="vip_smiles_container"> </div> <div class="less"> ' + texts.A022 + ' </div> </div> </div>');
    rightDoc.append('<div id="ChatBox"> <div class="container"> </div> <div class="separator"> <span>' + texts.A023 + '</span> </div> <input class="user_text" type="text" placeholder="' + texts.A024 + '" /> </div>');

    var audios = $('<div id="Audios"></div>');

    var info = $('<div id="Info"></div>')
    info.append(notifications);
    info.append(player1);
    info.append(player2);


    var background1 = $('<div id="BackgroundMaterial"></div>');
    var background2 = $('<div id="Background"></div>');
    var loader = $('<div id="Loader"><span class="percentage">0</span>%</div>');
    var root = $('<div id="Root"></div>');
    root.append(info);
    root.append(rightDocOpener);
    root.append(rightDoc);
    root.append(audios);
    var exit = $('<div id="ExitButton">' + texts.A025 + '</div>');
    var addins = $('<div id="Addins"><div class="item full_screen"></div></div>');

    var jokLayout = $('<div id="jok"></div>');
    jokLayout.append(background1);
    jokLayout.append(background2);
    jokLayout.append(loader);
    jokLayout.append(root);
    jokLayout.append(exit);
    jokLayout.append(addins);

    $('body').prepend(jokLayout);
})(jok);
