# YoutubeLiveChatHelper

## 概要

Youtube LiveChat を、視聴者側で応援するためのヘルパースクリプト郡です。

[Tampermonkey • Home](https://www.tampermonkey.net/) と一緒に使います。

## スクリプトの用途

### youtube_livechat_emitter

[youtube_livechat_emitter.user.js](./youtube_livechat_emitter.user.js)

- Youtube ライブ視聴者画面の LiveChat を DOM から抽出します。
- 通常チャットが追記されたタイミングで `livechat` Event を `document` オブジェクトへ放出します。
- LiveChat を視聴画面からデタッチしている場合は多分反応しません。
- 将来的に Youtube 側の仕様が変更された場合は、反応しなくなる可能性があります。

Event リッスン例:

```js
document.addEventListener("livechat", (e) => console.info(e.data));

// e.data.timestamp : "8:38 AM", "1:59:48"
// e.data.message : "text :emoji: :_memberEmoji:"
// e.data.authorName : "handleName"
// e.data.authorType : "", "member", "moderator"
// e.data.getHtml(): "non-escaped plain message, <img> and so on"
// e.data.getAuthorImgSrc(): "https://yt4.ggpht.com/..."
```

### youtube_toaster

[youtube_toaster.user.js](./youtube_toaster.user.js)

- Youtube 動画視聴者画面の下部にトースト通知できる機能を追加します。
- `document` オブジェクトへ発行された `toaster` Event に反応します。

Event 発行例:

```js
    const evt = new Event("toaster", { "bubbles": false, "cancelable": false });
    evt.data = { message: "動作✅", isHTML: true };
    document.dispatchEvent(evt);
```

![2021-03-02_13h58_52](https://user-images.githubusercontent.com/5955540/109599925-7fbaf300-7b5f-11eb-97de-8fcaad9dc511.png)

### youtube_livechat_router

[youtube_livechat_router.user.js](./youtube_livechat_router.user.js)

- youtube_livechat_emitter によって放出される `livechat` Event のうち、`moderator` による通常チャットを youtube_toaster へ送り込みます。
