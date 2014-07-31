

JP.Audio = {

    Effects: {},

    Init: function () {

        var root = 'http://localhost:55956'

        this.Register({
            Name: 'PlayerLogin',
            Sources: [
                { Type: 'audio/mpeg', Src: root + '/Content/Audios/PlayerLogin.mp3' },
                { Type: 'audio/ogg', Src: root + '/Content/Audios/PlayerLogin.ogg' },
            ]
        });

        this.Register({
            Name: 'Warning',
            Sources: [
                { Type: 'audio/mpeg', Src: root + '/Content/Audios/Warning.mp3' },
                { Type: 'audio/ogg', Src: root + '/Content/Audios/Warning.ogg' },
            ]
        });

        this.Register({
            Name: 'Loser',
            Sources: [
                { Type: 'audio/mpeg', Src: root + '/Content/Audios/Loser.mp3' },
                { Type: 'audio/ogg', Src: root + '/Content/Audios/Loser.ogg' },
            ]
        });

        this.Register({
            Name: 'Tick',
            Sources: [
                { Type: 'audio/mpeg', Src: root + '/Content/Audios/Tick.mp3' },
                { Type: 'audio/ogg', Src: root + '/Content/Audios/Tick.ogg' },
            ]
        });

        this.Register({
            Name: 'Victory',
            Sources: [
                { Type: 'audio/mpeg', Src: root + '/Content/Audios/Victory.mp3' },
                { Type: 'audio/ogg', Src: root + '/Content/Audios/Victory.ogg' },
            ]
        });

        this.Register({
            Name: 'GameStart',
            Sources: [
                { Type: 'audio/mpeg', Src: root + '/Content/Audios/GameStart.mp3' },
                { Type: 'audio/ogg', Src: root + '/Content/Audios/GameStart.ogg' },
            ]
        });

        this.Register({
            Name: 'Challenge',
            Sources: [
                { Type: 'audio/mpeg', Src: root + '/Content/Audios/Challenge.mp3' },
                { Type: 'audio/ogg', Src: root + '/Content/Audios/Challenge.ogg' },
            ]
        });

        this.Register({
            Name: 'Buzz',
            Sources: [
                { Type: 'audio/mpeg', Src: root + '/Content/Audios/Buzz.mp3' },
                { Type: 'audio/ogg', Src: root + '/Content/Audios/Buzz.ogg' },
            ]
        });

        this.Register({
            Name: 'AnswerSelect',
            Sources: [
                { Type: 'audio/mpeg', Src: root + '/Content/Audios/AnswerSelect.mp3' },
                { Type: 'audio/ogg', Src: root + '/Content/Audios/AnswerSelect.ogg' },
            ]
        });

        this.Register({
            Name: 'AnswerWrong',
            Sources: [
                { Type: 'audio/mpeg', Src: root + '/Content/Audios/AnswerWrong.mp3' },
                { Type: 'audio/ogg', Src: root + '/Content/Audios/AnswerWrong.ogg' },
            ]
        });

        this.Register({
            Name: 'AnswerCorrect',
            Sources: [
                { Type: 'audio/mpeg', Src: root + '/Content/Audios/AnswerCorrect.mp3' },
                { Type: 'audio/ogg', Src: root + '/Content/Audios/AnswerCorrect.ogg' },
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