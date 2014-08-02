

JP.Audio = {

    Effects: {},

    Init: function () {

        var root = JP.Config.JPUrl + 'Content/Audios/';

        this.Register({
            Name: 'PlayerLogin',
            Sources: [
                { Type: 'audio/mpeg', Src: root + 'PlayerLogin.mp3' },
                { Type: 'audio/ogg', Src: root + 'PlayerLogin.ogg' },
            ]
        });

        this.Register({
            Name: 'Warning',
            Sources: [
                { Type: 'audio/mpeg', Src: root + 'Warning.mp3' },
                { Type: 'audio/ogg', Src: root + 'Warning.ogg' },
            ]
        });

        this.Register({
            Name: 'Loser',
            Sources: [
                { Type: 'audio/mpeg', Src: root + 'Loser.mp3' },
                { Type: 'audio/ogg', Src: root + 'Loser.ogg' },
            ]
        });

        this.Register({
            Name: 'Tick',
            Sources: [
                { Type: 'audio/mpeg', Src: root + 'Tick.mp3' },
                { Type: 'audio/ogg', Src: root + 'Tick.ogg' },
            ]
        });

        this.Register({
            Name: 'Victory',
            Sources: [
                { Type: 'audio/mpeg', Src: root + 'Victory.mp3' },
                { Type: 'audio/ogg', Src: root + 'Victory.ogg' },
            ]
        });

        this.Register({
            Name: 'GameStart',
            Sources: [
                { Type: 'audio/mpeg', Src: root + 'GameStart.mp3' },
                { Type: 'audio/ogg', Src: root + 'GameStart.ogg' },
            ]
        });

        this.Register({
            Name: 'Challenge',
            Sources: [
                { Type: 'audio/mpeg', Src: root + 'Challenge.mp3' },
                { Type: 'audio/ogg', Src: root + 'Challenge.ogg' },
            ]
        });

        this.Register({
            Name: 'Buzz',
            Sources: [
                { Type: 'audio/mpeg', Src: root + 'Buzz.mp3' },
                { Type: 'audio/ogg', Src: root + 'Buzz.ogg' },
            ]
        });

        this.Register({
            Name: 'AnswerSelect',
            Sources: [
                { Type: 'audio/mpeg', Src: root + 'AnswerSelect.mp3' },
                { Type: 'audio/ogg', Src: root + 'AnswerSelect.ogg' },
            ]
        });

        this.Register({
            Name: 'AnswerWrong',
            Sources: [
                { Type: 'audio/mpeg', Src: root + 'AnswerWrong.mp3' },
                { Type: 'audio/ogg', Src: root + 'AnswerWrong.ogg' },
            ]
        });

        this.Register({
            Name: 'AnswerCorrect',
            Sources: [
                { Type: 'audio/mpeg', Src: root + 'AnswerCorrect.mp3' },
                { Type: 'audio/ogg', Src: root + 'AnswerCorrect.ogg' },
            ]
        });
    },

    Register: function (obj) {

        if (!obj.Name || !obj.Sources || !obj.Sources.length) return;

        for (var i = 0; i < obj.Sources.length; i++) {
            if (!obj.Sources[i].Type || !obj.Sources[i].Src) return;
        }

        this.Effects[obj.Name] = obj.Sources;
    },


    Play: function (name) {

        if (name != 'Warning' && !JP.Config.AudioEffectsEnabled) return;

        var sources = this.Effects[name];
        if (!sources) return;

        var audio = new Audio();

        for (var i = 0; i < sources.length; i++) {
            var source = sources[i];
            if (!source) continue;

            if (!audio.canPlayType(source.Type)) continue;

            audio.src = source.Src;
            audio.play();
            break;
        }
    },


    PlayPlayerLogin: function () {
        this.Play('PlayerLogin');
    },

    PlayWarning: function () {
        this.Play('Warning');
    },

    PlayBuzz: function () {
        this.Play('Buzz');
    },

    PlayLoser: function () {
        this.Play('Loser');
    },

    PlayVictory: function () {
        this.Play('Victory');
    },

    PlayGameStart: function () {
        this.Play('GameStart');
    },
}