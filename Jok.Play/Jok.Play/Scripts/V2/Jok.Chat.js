Jok.Chat = {

    smilesLocation: 'http://jok.io/content/images/skype/',

    init: function() {
        var number = 0;
        $('#SmilesBox .smiles_container').empty();
        $('#SmilesBox .vip_smiles_container').empty();
        for (var name in Jok.Chat.smiles) {
            if (name == 'surprised') continue;

            number++;
            var title = (number > 24 && !Jok.Config.IsVIPMember) ? 'VIP Only' : name;

            $(number <= 24 ? '#SmilesBox .smiles_container' : '#SmilesBox .vip_smiles_container').append(['<div class="item" data-name="', name, '" title="(', title, ')"><span class="emotion ', name, '" /></div>'].join(''));
        }
    },

    replaceSmiles: function (msg) {

        for (var name in Jok.Chat.smiles) {
            var from = ['\\(', name, '\\)'].join('');
            var to = ['<img src="', this.smilesLocation, name, '.gif" alt="', name, '" />'].join('');

            msg = msg.replace(new RegExp(from, 'g'), to);

            if (Jok.Chat.smiles[name].length > 0) {
                for (var i = 0; i < Jok.Chat.smiles[name].length; i++) {
                    from = Jok.Chat.smiles[name][i];

                    msg = msg.replace(new RegExp(from, 'g'), to);
                }
            }
        }

        return msg;
    },

    smiles: {
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
        'sleepy': [],
        'music': [],
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
        'dull': ['\\|:\\('],
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
}