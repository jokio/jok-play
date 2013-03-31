
jok.chat = {

    socket: undefined,

    channels: [],

    activeBubles: {},

    lastSentMessage: '',
    lastSentMessageCount: 0,
    lastSentMessageSentDate: undefined,

    isAllowed: true,

    init: function () {
        this.socket = io.connect(jok.config.pusherUrl, { query: 'gameid=' + jok.config.gameid + '&sid=' + $.cookie('sid'), 'sync disconnect on unload': true });
        this.socket.on('ChatReceiveMessage', this.messageReceived.bind(this));

        this.check(null);

        var number = 0;

        $('#SmilesBox .smiles_container').empty();
        $('#SmilesBox .vip_smiles_container').empty();
        for (var name in jok.chat.smiles) {
            if (name == 'surprised') continue;

            number++;
            $(number <= 24 ? '#SmilesBox .smiles_container' : '#SmilesBox .vip_smiles_container').append(['<div class="item" data-name="', name, '" title="(', name, ')"><span class="emotion ', name, '" /></div>'].join(''));
        }

        $('#SmilesBox div.more').on(clickEvent, function () {
            $(this).hide();
            $('#SmilesBox div.vip_smiles').css('display', 'block');
            $('#SmilesBox div.vip_smiles').fadeTo(0, 1);
            $('#ChatBox').css('top', '590px');
        });
        $('#SmilesBox div.less').on(clickEvent, function () {
            $('#SmilesBox div.vip_smiles').fadeTo(0, 0, function () {
                $('#SmilesBox div.vip_smiles').hide();
                $('#SmilesBox div.more').show();
                $('#ChatBox').css('top', '230px');
            });
        });


        $('#SmilesBox div.item').on(clickEvent, function () {
            var text = $(this).attr('data-name');
            if (!text || text == '') return;

            if (!jok.config.isVIP && $(this).parent().hasClass('disabled')) return;

            jok.chat.send('(' + text + ')');
        });

        $(window).keydown(function (e) {

            if (e.which == 13/*Enter*/) {
                jok.openDockRight();
                if (jok.chat.isAllowed)
                    $('#ChatBox input.user_text').select();
            }

            if (e.which == 27/*Esc*/ && $('#RightDoc:visible').length == 1) {
                jok.closeDockRight();
            }
        });

        $('#ChatBox input.user_text').keydown(function (e) {
            if (e.which != 13/*Enter*/) return;

            if (!jok.chat.isAllowed) return;

            var msg = $(this).val();

            jok.chat.send(msg);

            $(this).val('');
        });
    },

    check: function (user) {

        var chatAllowed = true;

        if (jok.config.channel == '' || jok.config.channel.toLowerCase() == 'tournament') {

            chatAllowed = (user != null && user.friendStatus == 1 /*Friends*/);
        }

        if (!chatAllowed) {
            $('#ChatBox input.user_text').attr('class', 'user_text disabled');
            $('#ChatBox input.user_text').attr('readonly', 'readonly');
            $('#ChatBox input.user_text').val(jok.config.chatLimitationText);
        }
        else {
            $('#ChatBox input.user_text').attr('class', 'user_text');
            $('#ChatBox input.user_text').removeAttr('readonly');
            $('#ChatBox input.user_text').val('');
        }

        jok.chat.isAllowed = chatAllowed;
    },

    join: function (channel) {
        if (this.channels.indexOf(channel) > -1) return;

        this.channels.push(channel);

        this.socket.emit('ChatJoin', channel);
    },

    leave: function (channel) {
        var index = this.channels.indexOf(channel);
        if (index == -1) return;

        this.socket.emit('ChatLeave', channel);

        this.channels.splice(index, 1);
    },

    send: function (message, channel) {
        if (message == '') return;

        if (jok.currentUserID) {
            var msg = this._replaceSmiles(message);
            this._showBubble(jok.currentUserID, msg);
            this._addChatLog(jok.currentUserID, msg);
        }

        var currentDate = new Date();

        this.lastSentMessageCount = this.lastSentMessage == message ? this.lastSentMessageCount + 1 : 1;
        if (this.lastSentMessageCount > 1 && (currentDate - this.lastSentMessageSentDate < 5000 /*5 second*/)) return;

        this.lastSentMessage = message;
        this.lastSentMessageSentDate = currentDate;

        this.sendInternal(message, channel);
    },

    sendInternal: function (message, channel) {

        if (this.channels.length == 0) return;

        if (channel == undefined && this.channels.length >= 1) {
            channel = this.channels[0];
        }

        this.socket.emit('ChatMessage', channel, message);
    },

    messageReceived: function (cid, userid, msg) {

        if (userid == jok.currentUserID) return;

        // როდესაც მეგობრობის შემოთავაზება მოვა ოპონენტისგან
        if (msg == jok.config.sendFriendRequestText) {
            this.sendInternal(jok.config.checkFriendText);

            jok.setPlayer(2, userid);
        }

        // მეგობრობის გადამოწმება
        if (msg == jok.config.checkFriendText) {
            jok.setPlayer(2, userid);
            return;
        }

        if (msg == jok.config.buzzText) {
            jok.buzz();
            return;
        }


        msg = this._replaceSmiles(msg);

        this._showBubble.call(this, userid, msg);
        this._addChatLog.call(this, userid, msg);
    },

    _showBubble: function (userid, msg) {

        var playerChatBubble = $('.player[data-userid=' + userid + '] > .chat_bubble');
        if (playerChatBubble.length == 0) return;

        playerChatBubble.find('div.msg').html(msg);
        playerChatBubble.show('fast');

        var _this = this;

        if (this.activeBubles[userid]) {
            clearTimeout(this.activeBubles[userid]);

            this.activeBubles[userid] = setTimeout(function () { _this._hideBubble(_this, playerChatBubble, userid) }, 5000);
            return;
        }

        this.activeBubles[userid] = setTimeout(function () { _this._hideBubble(_this, playerChatBubble, userid) }, 5000);
    },

    _addChatLog: function (userid, msg) {

        var chatContainer = $('#ChatBox .container');
        if (!chatContainer) return;

        try {
            var length1 = chatContainer.children().length - 1;
            for (var i = length1; i >= 0; i--) {
                if ($(chatContainer.children()[i]).find('span.nick').length > 0) {
                    var lastNick = $(chatContainer.children()[i]).find('span.nick').html();
                    break;
                }
            }
        } catch (err) {
        }

        var nick = jok.players[userid] ? jok.players[userid].nick : ('User (' + userid + ')');
        var isMe = jok.currentUserID == userid;

        if (lastNick != nick) {
            chatContainer.append('<div class="chat_item ' + (isMe ? 'reverse2' : '') + '"><span class="nick ' + (isMe ? 'me' : '') + '">' + nick + '</span></div>');
        }

        chatContainer.append('<div class="chat_item text ' + (isMe ? 'reverse' : '') + '">' + msg + '</div>');


        // scrollToBottom
        var height = 1000;
        try {
            height = Math.max(chatContainer[0].scrollHeight, chatContainer[0].clientHeight);
        }
        catch (err) {
        }

        chatContainer.scrollTop(height);
    },


    _hideBubble: function (_this, playerChatBubble, userid) {

        playerChatBubble.hide('fast');

        if (userid in _this.activeBubles)
            delete _this.activeBubles[userid];
    },

    _replaceSmiles: function (msg) {

        for (var name in jok.chat.smiles) {
            var from = ['\\(', name, '\\)'].join('');
            var to = ['<img src="', jok.config.smilesLocation, name, '.gif" alt="', name, '" />'].join('');

            msg = msg.replace(new RegExp(from, 'g'), to);

            if (jok.chat.smiles[name].length > 0) {
                for (var i = 0; i < jok.chat.smiles[name].length; i++) {
                    from = jok.chat.smiles[name][i];

                    msg = msg.replace(new RegExp(from, 'g'), to);
                }
            }
        }

        return msg;
    }
}

jok.chat.smiles = {
    // normal
    'hi': ['\\(wave\\)'],
    'smile': [':\\)'],
    'bigsmile': [':D', ':d', ':დ'],
    'itwasntme': ['\\(wasntme\\)'],
    'angel': [],
    'kiss': [':\\*'],
    'tongueout': [':P', ':p', ':პ'],
    'wait': [],
    'punch': [],
    'angry': [],
    'crying': [';\\('],
    'sadsmile': ['\\:\\('],
    'headbang': [],
    'heart': [],
    'inlove': [],
    'cool': ['8-\\)'],
    'dull': ['\\|:\\('],
    'sleepy': [],
    'bear': ['\\(hug\\)'],
    'phone': [],
    'coffee': [],
    'handshake': [],
    'yes': ['\\(y\\)'],
    'no': ['\\(n\\)'],

    // vip
    'bandit': [],
    'beer': [],
    'blush': [],
    'bow': [],
    'brokenheart': [],
    'bug': [],
    'cake': ['\\(^\\)'],
    'call': [],
    'cash': ['\\($\\)'],
    'clapping': [],
    'dance': [],
    'devil': [],
    'doh': [],
    'drink': ['\\(d\\)'],
    'drunk': [],
    'emo': [],
    'envy': [],
    'evilgrin': ['\\]:\\)'],
    'flower': ['\\(f\\)'],
    'fubar': [],
    'giggle': [],
    'happy': [],
    'heidy': [],
    'lipssealed': [':X', ':x', ':ხ'],
    'mail': [],
    'makeup': [],
    'middlefinger': [],
    'mmm': ['\\(mm\\)'],
    'mooning': [],
    'movie': [],
    'muscle': ['\\(flex\\)'],
    'music': [],
    'nerd': [],
    'ninja': [],
    'nod': [],
    'party': [],
    'pizza': ['\\(pi\\)'],
    'poolparty': [],
    'puke': [],
    'rain': [],
    'rock': [],
    'rofl': [],
    'shake': [],
    'smirk': [],
    'smoke': [],
    'speechless': [':\\|'],
    'star': ['\\(\\*\\)'],
    'sun': [],
    'surprised': [':O'],
    'swear': [],
    'sweating': ['\\(:\\|'],
    'talking': ['\\(talk\\)'],
    'thinking': ['\\(think\\)'],
    'time': [],
    'tmi': [],
    'toivo': [],
    'whew': [],
    'wink': [';\\)'],
    'wondering': [':^\\)'],
    'worried': [':s', ':ს', ':შ'],
    'yawn': [':o'],
}