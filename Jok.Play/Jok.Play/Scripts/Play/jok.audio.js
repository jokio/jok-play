
jok.audio = {
    play: function (name) {

        var audio = $('#Audios audio.' + name)[0];
        if (!audio) return;

        try {
            audio.load();
            audio.play();
        }
        catch (err) {
            audio.play();
        }

        return audio;
    }
}
