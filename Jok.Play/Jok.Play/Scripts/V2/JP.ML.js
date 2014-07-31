
JP.ML = {

    Init: function(lang) {
        if (!JP.ML[lang]) return;

        for (var i in JP.ML[lang]) {
            JP.ML[i] = JP.ML[lang][i];
        }

        JP.emit('TextsInitialized', lang);
    },


    en: {
        Exit: 'Exit',
        Chat: 'Chat',
        GameSettings: 'Game Settings',
        MusicPlayer: 'Music Player',
        LoginWithFacebook: 'Login using Facebook',
        LoginWithTwitter: 'Login using Twitter',
        LoginWithOdno: 'Login using Однокласники',
        LoginWithVK: 'Login using Вконтакте',
        LoginWithGoogle: 'Login using Google',
        CloseSettings: 'Close',
        DisableAudioEffects: 'Disable Audio Effects',
        EnableAudioEffects: 'Enable Audio Effects',
        ClearChat: 'Clear Chat',
        ChatInputPlaceholder: 'Press enter & type message',
        ChatInputPlaceholderDisabled: 'Only emotions allowed',
        SendEmotions: 'Send Emotions',
        CloseEmotions: 'Close',
        VIPEmotions: 'VIP Emotions',
        CloseProfile: 'Close',
        RealtionStatusYou: 'It\'s You',
        RealtionStatusFriend: 'Your Friend',
        RealtionStatusFriendRequestSent: 'Friend request sent...',
        RealtionStatusStranger: 'Send friend request'
    },
    ge: {
        Exit: 'გამოსვლა',
        Chat: 'ჩატი',
        GameSettings: 'კონფიგურაცია',
        MusicPlayer: 'მუსიკა',
        LoginWithFacebook: 'შესვლა Facebook-ით',
        LoginWithTwitter: 'შესვლა Twitter-ით',
        LoginWithOdno: 'შესვლა Однокласники-ით',
        LoginWithVK: 'შესვლა Вконтакте-ით',
        LoginWithGoogle: 'შესვლა Google-ით',
        CloseSettings: 'დახურვა',
        DisableAudioEffects: 'აუდიო ეფექტების გათიშვა',
        EnableAudioEffects: 'აუდიო ეფექტების ჩართვა',
        ClearChat: 'ჩატის გასუფთავება',
        ChatInputPlaceholder: 'დააჭირეთ enter & მისწერეთ',
        ChatInputPlaceholderDisabled: 'მხოლოდ ემოციების გაგზავნა',
        SendEmotions: 'გაუგზავნეთ ემოციები',
        CloseEmotions: 'დახურვა',
        VIPEmotions: 'VIP ემოციები',
        CloseProfile: 'დახურვა',
        RealtionStatusYou: 'თქვენ',
        RealtionStatusFriend: 'თქვენი მეგობარი',
        RealtionStatusFriendRequestSent: 'მეგობრობის თხოვნა გაგზავნილია...',
        RealtionStatusStranger: 'მეგობრობის შეთავაზება'
    },
    ru: {
        Exit: 'Exit',
        Chat: 'Chat',
        GameSettings: 'Game Settings',
        MusicPlayer: 'Music Player',
        LoginWithFacebook: 'Login using Facebook',
        LoginWithTwitter: 'Login using Twitter',
        LoginWithOdno: 'Login using Однокласники',
        LoginWithVK: 'Login using Вконтакте',
        LoginWithGoogle: 'Login using Google',
        CloseSettings: 'Close',
        DisableAudioEffects: 'Disable Audio Effects',
        EnableAudioEffects: 'Enable Audio Effects',
        ClearChat: 'Clear Chat',
        ChatInputPlaceholder: 'Press enter & type message',
        ChatInputPlaceholderDisabled: 'Only emotions allowed',
        SendEmotions: 'Send Emotions',
        CloseEmotions: 'Close',
        VIPEmotions: 'VIP Emotions',
        CloseProfile: 'Close',
        RealtionStatusYou: 'It\'s You',
        RealtionStatusFriend: 'Your Friend',
        RealtionStatusFriendRequestSent: 'Friend request sent...',
        RealtionStatusStranger: 'Send friend request'
    },
}