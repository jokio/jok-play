$(function () {
    var manifest = [];

    if (game.assets && game.assets.audios) {
        for (var i in game.assets.audios) {
            manifest.push({
                id: i,
                src: game.assets.audios[i][0][0],
                data: 3
            });
        }
    }

    if (game.assets && game.assets.images) {
        for (var i in game.assets.images) {
            manifest.push({
                id: i,
                src: game.assets.images[i]
            });
        }
    }

    var onProgress = function () {
        $('#Loader').find('span.percentage').html(preload.progress * 100 | 0);
    }

    var onComplete = function () {
        if (loadingInterval)
            clearInterval(loadingInterval);

        $('#Loader').fadeTo('normal', 0, function () {
            $('#Loader').hide();
            $('#Root').css('display', 'block');
            $('#Root').fadeTo('slow', 1);
        });

        jok.init();

        if (game.init)
            game.init();

        //$.get('http://localhost:9000/play/layout?game=billiard', function (data) {

        //    //console.log(data)
        //    $('body').prepend(data);

        //    jok.init();

        //    if (game.init)
        //        game.init();
        //});
    }


    if (manifest.length == 0) {
        onComplete();
        return;
    }

    preload = new createjs.PreloadJS();
    preload.onComplete = onComplete;
    preload.installPlugin(createjs.SoundJS);
    preload.loadManifest(manifest);

    var loadingInterval = setInterval(onProgress, 200);
});