Jok-Play
========
Plugin for realtime online games

--------

Features:

1. Users - don't worry about users system, it already exists for you. users system is connected to all social network
2. Chat - room chat, for room users
3. Online Music - users can listen 100+ online music chanels, while playing

--------

How to use:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Awesome Game</title>
    @Styles.Render("~/css/v1")
    <script>
        var jok = {};

        jok.config = {
            gameid: '0',
            channel: 'LYIhVZH1k0qgLFARiO99mQ',
            language: 'en_US',
            exitUrl: 'http://somewhere_to_exit.com',
        }

    </script>
</head>
<body>
    <div id="Game">
        ...Awesome game stuff here...
    </div>
    @Scripts.Render("~/js/v1")
</body>
</html>
```
